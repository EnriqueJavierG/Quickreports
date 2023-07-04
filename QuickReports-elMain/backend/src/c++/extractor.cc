// This file contains the function for extracting the data from a datalogger
#include <stdio.h>
#include <windows.h>
#include <iostream>
#include "SiUSBXp.h"
#include <fstream>
#include <synchapi.h>
#include "extractor.h"
#include "ConfigurationBlock.h"


using namespace std;

// control functions for when datalogger connection or communication is not successful
bool operationStatus(SI_STATUS status) {
    switch (status) {
    case (SI_SUCCESS):
        // std::cout << " \n Operation Success \n ";
        return true;
    case (SI_DEVICE_NOT_FOUND):
        std::cout << " \n Device not found, try reconnecting the datalogger. \n ";
        throw status;
        return false;

    case (SI_INVALID_PARAMETER):
        std::cout << " \n Invalid function parameters. \n ";
        throw status;
        return false;

    case (SI_GLOBAL_DATA_ERROR):
        std::cout << " \n Thread global data cannot be retrieved. Unload and reload the DLL. \n ";
        throw status;
        return false;

    case (SI_SYSTEM_ERROR_CODE):
        std::cout << " \n Windows System Error \n ";
        throw status;
        return false;

    case (SI_INVALID_HANDLE):
        std::cout << " \n Invalid handle. Verify if the device is connected correctly. \n ";
        throw status;
        return false;
        
    case (SI_READ_ERROR):
        std::cout << " \n The read operation failed. The device may have been removed. \n ";
        throw status;
        return false;

    case (SI_READ_TIMED_OUT):
        std::cout << " \n Read took too long :( Try again. \n ";
        // throw status;
        return false;

    case (SI_IO_PENDING):
        std::cout << " \n IO is pending. \n ";
        // SI_Close(handle);
        // return false;
        return true;

    case (SI_INVALID_REQUEST_LENGTH):
        std::cout << " \n Invalid request length. See USBXpress documentation. \n ";
        return false;

    case (SI_DEVICE_IO_FAILED):
        std::cout << " \n Operation failed. The device may have been removed. \n ";
        throw status;
        return false;

    case (SI_WRITE_ERROR):
        std::cout << " \n Write operation failed. The device may have been removed. \n ";
        return false;

    case (SI_WRITE_TIMED_OUT):
        std::cout << " \n Write took too long :( Try again.  \n ";
        return false;
        
    default:
        return false;
    }
    

}



float getRealTemperatureValues(int raw) {
    // assuming all readings are in Fahrenheit
    // y = mx+c
    // datalogger returns values in x (raw format)
    return (raw * 1.0) - 40.0;
}

float getRealRelativeHumidityValues(int raw) {
    
    return raw * 0.5;
}


boolean deviceConnected() {
    DWORD numDevices = 0;
    int status;
    status = SI_GetNumDevices(&numDevices);
    return numDevices > 0;
}


/*
* returns the UNIX timestamp for the local time (Bolovia Time)
* hr [0-23]
* min [0-59]
* sec [0-59]
* day [1-31]
* mon [1-12]
* yr [00-99] -> (2000, 2099)
*/
unsigned long getLocalStartTime(int hr, int min, int sec, int day, int mon, int yr) {
    // time_t rawtime;
    time_t x;
    struct tm timeinfo;
    // time( &rawtime );

    timeinfo.tm_year = (2000+yr)-1900;
    timeinfo.tm_mon = mon - 1;
    timeinfo.tm_mday = day;
    timeinfo.tm_hour = hr;
    timeinfo.tm_min = min;
    timeinfo.tm_sec = sec;
    x = mktime(&timeinfo);
    unsigned long x1 = (unsigned long)x;
    return x1;
}

unsigned short bytesToShort(BYTE b1, BYTE b2) {
    BYTE buf[2];
    buf[0] = b1;
    buf[1] = b2;
    unsigned short val;
    std::memcpy(&val, buf, sizeof(unsigned short));
    return val;
}


unsigned long getUnixStartTimeFromConfigBlock() {
    struct ConfigurationBlock block = getStructuredConfigurationBlock();
    while((block.configurationBlock[0]!=3) & (block.configurationBlock[0]!=12) & (block.configurationBlock[0]!=13)){
        block = getStructuredConfigurationBlock();
    }

    BYTE hr =  block.configurationBlock[18];
    BYTE min =  block.configurationBlock[19];
    BYTE sec =  block.configurationBlock[20];
    BYTE day =  block.configurationBlock[21];
    BYTE mon =  block.configurationBlock[22];
    BYTE yr =  block.configurationBlock[23];

    return getLocalStartTime(int(hr), int(min), int(sec), int(day), int(mon), int(yr));
}

// get the sample rate from the configuration block
unsigned short getSampleRateFromConfigBlock() {
    struct ConfigurationBlock block = getStructuredConfigurationBlock();
    while(block.configurationBlock[0]!=3 & block.configurationBlock[0]!=12 & block.configurationBlock[0]!=13 ){
        block = getStructuredConfigurationBlock();
    }

    BYTE sampleRate28 = block.configurationBlock[28];
    BYTE sampleRate29 = block.configurationBlock[29];

    // convertir de bytes a short
    short elRes = bytesToShort(sampleRate28, sampleRate29);
    return elRes;
}

void wait(int status , OVERLAPPED timeout){
    DWORD mili = 1000;
    // WaitForSingleObject(handle , mili);
    
    // if(status == SI_IO_PENDING){
    //     Sleep(500);
    // }
    // long long r = 300000;
    // while(status == SI_IO_PENDING || r == 0 ){
    //     r--;
    //     if(r%10000 == 0)printf("\n timeout at %lld" , r);
    //     if(r == 0)return;
    // }
}

// this function assumes that the datalogger has been previoulsy stopped logging data
bool extractData(struct Reading readings[], unsigned long startTime, unsigned short sampleRate , int blocks_to_read) {

    std::cout << blocks_to_read << '\n';

    DWORD readTimeout = 0x4E20;
    DWORD writeTimeout = 0x2710;
    SI_SetTimeouts(readTimeout, writeTimeout);

    // verify at least one datalogger is connected into the system
    if (!deviceConnected()) {
        std::cout << "NO DEVICES CONNECTED \n ";
        return false;
    }
    
    // variables needed to establish communication with the Datalogger
    OVERLAPPED timeout;
    HANDLE handle;
    BYTE w_buf[128];
    BYTE r_buf[128];
    DWORD index = 0;
    LPVOID w_buffer = &w_buf;
    LPVOID r_buffer = &r_buf;
    BYTE readings_buf[64][512];
    DWORD numBytesWritten;
    DWORD numBytesReturned;
    DWORD one_sec = 5000;
    LPVOID readings_buffer;

    // initiating communication with the datalogger
    int status = SI_Open(0, &handle);
    operationStatus(status);

    // command to request logged data from dataloggers
    w_buf[0] = 0x03;
    w_buf[1] = 0xFF;
    w_buf[2] = 0xFF;
    status = SI_Write(handle, w_buffer, 3, &numBytesWritten, NULL);
    operationStatus(status);

    // ACK message from datalogger indicating memory size
    status = SI_Read(handle, r_buffer, 128, &numBytesReturned, NULL);
    //WaitForSingleObject(handle, one_sec);
    if(!operationStatus(status)){
        SI_Close(handle);
        return false;
    }
    std::cout << "Read ack okay " << '\n';

    // get readings from DL
    for (int j = 0; j < blocks_to_read; j++) { // 64
        readings_buffer = &readings_buf[j];
        std::cout << "Reading Block " << j << "\n";
        status = SI_Read(handle, readings_buffer, 512, &numBytesReturned, NULL);
        // WaitForSingleObject(handle , one_sec);

        std::cout << "READ BLOCK " << j << '\n';
        if(!operationStatus(status)){
            SI_Close(handle);
            return false;
        }
    }
    SI_Close(handle);
    
    
    // organize the extracted data by data point, including temperature and relative humidity measurement 
    int r_index = 0;
    float curr_temp;
    float curr_hum;
    unsigned long curr_ts = startTime;
    for(int i = 0; i < blocks_to_read; i++) { // 64
        for (int k = 0; k < 512; k++) {
            if (k % 2 == 0) {
                curr_temp = getRealTemperatureValues((int)readings_buf[i][k]);
            }
            else {  
                curr_hum = getRealRelativeHumidityValues((int)readings_buf[i][k]); 
                curr_ts = curr_ts;
            }
            curr_ts = curr_ts + sampleRate;
            if(r_index < 16384) readings[r_index++] = {curr_temp , curr_hum, curr_ts};
        }
    }
    return true;
}
