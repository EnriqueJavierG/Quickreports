#include <windows.h>
#include "encoder.h"
#include "decoder.h"
#include "ConfigurationBlock.h"
#include "structs.h"
#include "SiUSBXp.h"
#include "extractor.h"

#define NAME_BYTE_SIZE 15
#define VERSION_BYTE_SIZE 4
#define STOP_DL 65026


char* getStringFromBytes(BYTE * buffer, int byte_size) {
    char* arr = new char[byte_size];
    // unsigned char arr[byte_size];
    int k = 0;
    for (int i = 0; i < byte_size; i++) {
        arr[k++] = buffer[i];

    }
    return arr;
}


ConfigurationBlock getStructuredConfigurationBlock(){
  HANDLE handle;
  BYTE w_buf[128];
  BYTE r_buf[128];
  DWORD index = 0;
  DWORD NumByteToWrite = 3;
  DWORD NumBytesWritten;
  DWORD NumBytesReturned;
  LPVOID w_buffer = &w_buf; 
  LPVOID r_buffer = &r_buf;

   DWORD readTimeout = 0x4E20;
   DWORD writeTimeout = 0x2710;
   SI_SetTimeouts(readTimeout, writeTimeout);

  int status = SI_Open(0 , &handle);
  operationStatus(status);
  w_buf[0] = 0x00;
  w_buf[1] = 0xFF;
  w_buf[2] = 0xFF;

  status = SI_Write(handle , w_buffer , NumByteToWrite , &NumBytesWritten , NULL);
  operationStatus(status);
  status = SI_Read(handle , r_buffer , 128 , &NumBytesReturned , NULL);
  operationStatus(status);
  status = SI_Read(handle , r_buffer , 128 , &NumBytesReturned , NULL );
  operationStatus(status);

  struct ConfigurationBlock block = createBlockObject(r_buf);
  status = SI_Close(handle);
//   operationStatus(status);
  return block;
}


/*
*TODO
*/
boolean stopDatalogger(){
    struct ConfigurationBlock block = getStructuredConfigurationBlock(); 
    while(block.type!=3 && block.type!=12 && block.type!=13 ){
        block = getStructuredConfigurationBlock();  
    }
    block.flagBits1 = STOP_DL;
    block.startTimeOffset = 0;
    return programDatalogger(block);
}


unsigned short bytesToShort1(BYTE b1, BYTE b2) {
    BYTE buf[2];
    buf[0] = b1;
    buf[1] = b2;
    unsigned short val;
    std::memcpy(&val, buf, sizeof(unsigned short));
    return val;
}

/*
Initiate the configuration block 
*/
struct ConfigurationBlock createBlockObject(BYTE confBlock[]){
    
    // use decoders to convert from bytes to C++ type

    // Unsigined Chars are identical to bytes
    struct ConfigurationBlock block;
    block.type = confBlock[type];
    block.command = confBlock[command];
    block.startHr = confBlock[startHr];
    block.startMin = confBlock[startMin];
    block.startSec = confBlock[startSec];
    block.startDay = confBlock[startDay];
    block.startMon = confBlock[startMon];
    block.startYear = confBlock[startYear];
    block.highAlarmLevel = int(confBlock[highAlarmLevel])-40;
    block.lowAlarmLevel = int(confBlock[lowAlarmLevel])-40;
    block.inputType = confBlock[inputType];
    block.flagBits2 = confBlock[flagBits2];
    block.channel2highAlarm  = int(confBlock[channel2highAlarm])*0.5;
    block.channel2lowAlarm = int(confBlock[channel2lowAlarm])*0.5;
    block.rolloverCount = confBlock[rolloverCount];
    
    // strings 
    block.name = getStringFromBytes(&confBlock[name], NAME_BYTE_SIZE);
    block.version = getStringFromBytes(&confBlock[version], VERSION_BYTE_SIZE);

    //unsigned shorts
    block.sampleCount = bytesToShort1(confBlock[sampleCount], confBlock[sampleCount+1]);
    block.flagBits1 = bytesToShort1(confBlock[flagBits1], confBlock[flagBits1+1]);
    block.rawInputReading = bytesToShort1(confBlock[rawInputReading], confBlock[rawInputReading+1]);
    block.maximunSamples = bytesToShort1(confBlock[maxSamples], confBlock[maxSamples+1]);
    block.sampleRate = bytesToShort1(confBlock[sampleRate], confBlock[sampleRate+1]);

    // unsigned longs
    block.startTimeOffset = getLongFromBytes(&confBlock[startTimeOffset]);
    block.serialNumber = getLongFromBytes(&confBlock[serialNumber]);

    for (int i = 0; i < 128; i++){
        block.configurationBlock[i] = confBlock[i];
    }

    return block;
}



/**
 * create byte array from structure with C types
 * 
 */ 
BYTE* encodeConfigBlock(ConfigurationBlock  *block) {

    // Unsigined Chars are identical to bytes
    block->configurationBlock[type] = block->type; 

    block->configurationBlock[command] = block->command;

    getBytesFromString(block->name,  &(block->configurationBlock[name]));


    block->configurationBlock[startHr] = block->startHr; 

    block->configurationBlock[startMin] = block->startMin; 

    block->configurationBlock[startSec] = block->startSec; 

    block->configurationBlock[startDay] = block->startDay; 

    block->configurationBlock[startMon] = block->startMon; 

    block->configurationBlock[startYear] = block->startYear; 

    getBytesFromLong(block->startTimeOffset, &(block->configurationBlock[startTimeOffset])) ;

    getBytesFromShort(block->sampleRate, &(block->configurationBlock[sampleRate]));

    getBytesFromShort(block->sampleCount, &block->configurationBlock[sampleCount]);

    getBytesFromShort(block->flagBits1, &(block->configurationBlock[flagBits1]));

    block->configurationBlock[highAlarmLevel] = int(block->highAlarmLevel)+40; 

    block->configurationBlock[lowAlarmLevel] = int(block->lowAlarmLevel)+40; 
    
    getBytesFromShort(block->rawInputReading, &(block->configurationBlock[rawInputReading]));

    block->configurationBlock[inputType] = block->inputType; 

    block->configurationBlock[flagBits2] = block->flagBits2; 

    getBytesFromStringVersion(block->version, &block->configurationBlock[version]);

    getBytesFromLong(block->serialNumber, &(block->configurationBlock[serialNumber]));

    block->configurationBlock[channel2highAlarm] = int(block->channel2highAlarm)*2;

    block->configurationBlock[channel2lowAlarm] = int(block->channel2lowAlarm)*2; 

    block->configurationBlock[rolloverCount] = block->rolloverCount;

    block->configurationBlock[byte59] = 0;

    getBytesFromShort(block->maximunSamples, &block->configurationBlock[maxSamples]);

    block->configurationBlock[byte62] = 0;

    return block->configurationBlock;

}

Napi::Object getJSObjFromConfigBlock(ConfigurationBlock block , Napi::Env env){

    Napi::Object exports = Napi::Object::New(env);
    exports.Set(Napi::String::New(env , "type"), block.type);
    exports.Set(Napi::String::New(env , "serial_number") , block.serialNumber);
    exports.Set(Napi::String::New(env , "startHr"), block.startHr);
    exports.Set(Napi::String::New(env , "startMin"), block.startMin);
    exports.Set(Napi::String::New(env , "startSec"), block.startSec);
    exports.Set(Napi::String::New(env , "startDay"), block.startDay);
    exports.Set(Napi::String::New(env , "startMon"), block.startMon);
    exports.Set(Napi::String::New(env , "startYear"), (block.startYear));
    exports.Set(Napi::String::New(env , "highAlarmLevel"), block.highAlarmLevel);
    exports.Set(Napi::String::New(env , "lowAlarmLevel"), block.lowAlarmLevel);
    exports.Set(Napi::String::New(env , "inputType"), block.inputType);
    exports.Set(Napi::String::New(env , "flagBits2"), block.flagBits2);
    exports.Set(Napi::String::New(env , "channel2highAlarm"), block.channel2highAlarm);
    exports.Set(Napi::String::New(env , "channel2lowAlarm"), block.channel2lowAlarm);
    exports.Set(Napi::String::New(env , "rolloverCount"), block.rolloverCount);
    std::string elnombre;
    elnombre.assign(block.name, 16);
    exports.Set(Napi::String::New(env , "name"), elnombre);
    std::string laversion;
    laversion.assign(block.version, 4);
    exports.Set(Napi::String::New(env , "version"),laversion);
    exports.Set(Napi::String::New(env , "sampleCount"), block.sampleCount);
    exports.Set(Napi::String::New(env , "flagBits1"), block.flagBits1);
    exports.Set(Napi::String::New(env , "rawInputReading"), block.rawInputReading);
    exports.Set(Napi::String::New(env , "maximunSamples"), block.maximunSamples);
    exports.Set(Napi::String::New(env , "startTimeOffset"), long(block.startTimeOffset));
    exports.Set(Napi::String::New(env , "sampleRate"), block.sampleRate);

    return exports;

}
BYTE * updateConfigBlockWithJSObj(ConfigurationBlock* block , Napi::Object configurations){
    std::string s = (configurations.Get("name").IsUndefined()) ?  block->name : configurations.Get("name").As<Napi::String>().Utf8Value();
    block->name = const_cast<char *>(s.c_str());
    block->startHr = (configurations.Get("startHr").IsUndefined()) ?  block->startHr : configurations.Get("startHr").As<Napi::Number>().Int32Value();
    block->startMin =(configurations.Get("startMin").IsUndefined()) ?  block->startMin :  configurations.Get("startMin").As<Napi::Number>().Int32Value();
    block->startSec =(configurations.Get("startSec").IsUndefined()) ?  block->startSec :  configurations.Get("startSec").As<Napi::Number>().Int32Value();
    block->startDay = (configurations.Get("startDay").IsUndefined()) ?  block->startDay : configurations.Get("startDay").As<Napi::Number>().Int32Value();
    block->startMon = (configurations.Get("startMon").IsUndefined()) ?  block->startMon : configurations.Get("startMon").As<Napi::Number>().Int32Value();
    block->startYear =(configurations.Get("startYear").IsUndefined()) ?  block->startYear :  configurations.Get("startYear").As<Napi::Number>().Int32Value();
    block->startTimeOffset =(configurations.Get("startTimeOffset").IsUndefined()) ?  block->startTimeOffset :  configurations.Get("startTimeOffset").As<Napi::Number>().Int64Value(); //TODO check if this does not cause problems will work for prototype
    block->sampleRate =(configurations.Get("sampleRate").IsUndefined()) ?  block->sampleRate :  configurations.Get("sampleRate").As<Napi::Number>().Int32Value();
    block->highAlarmLevel = (configurations.Get("highAlarmLevel").IsUndefined()) ?  block->highAlarmLevel : configurations.Get("highAlarmLevel").As<Napi::Number>().Int32Value();
    block->lowAlarmLevel = (configurations.Get("lowAlarmLevel").IsUndefined()) ?  block->lowAlarmLevel : configurations.Get("lowAlarmLevel").As<Napi::Number>().Int32Value();
    block->channel2highAlarm = (configurations.Get("channel2highAlarm").IsUndefined()) ?  block->channel2highAlarm : configurations.Get("channel2highAlarm").As<Napi::Number>().DoubleValue();
    block->channel2lowAlarm = (configurations.Get("channel2lowAlarm").IsUndefined()) ?  block->channel2lowAlarm : configurations.Get("channel2lowAlarm").As<Napi::Number>().DoubleValue();   
    block->flagBits1 = (configurations.Get("flagBits1").IsUndefined()) ?  block->flagBits1 : configurations.Get("flagBits1").As<Napi::Number>().Int32Value();   
    block->inputType = (configurations.Get("inputType").IsUndefined()) ?  block->inputType : configurations.Get("inputType").As<Napi::Number>().Int32Value();   

    return encodeConfigBlock(block);
}

boolean programDatalogger(ConfigurationBlock block){
    HANDLE handle;
    LPVOID conf_buff = (block.configurationBlock);
    int status = SI_Open(0, &handle);
    if(!operationStatus(status))return false;

    BYTE w_buf[128];
    BYTE r_buf[128];
    DWORD index = 0;
    LPVOID w_buffer = &w_buf;
    LPVOID r_buffer = &r_buf;
    DWORD numBytesWritten;
    DWORD numBytesReturned;
    // Command to write config Block
    w_buf[0] = 0x01;
    w_buf[1] = 0x00;
    w_buf[2] = 0x80;
    status = SI_Write(handle, w_buffer, 3, &numBytesWritten, NULL);
    if(!operationStatus(status))return false;
    // Send Config Block
    status = SI_Write(handle, conf_buff, 128, &numBytesWritten, NULL);
    if(!operationStatus(status))return false;
    // Wait for ACK
    status = SI_Read(handle, r_buffer, 1, &numBytesReturned, NULL);
    if(!operationStatus(status))return false;
    SI_Close(handle);
    // Read ACK
    if (r_buf[0] == 0xFF){
       return true;
    }
    if(status != SI_SUCCESS){
        return false;
    }
    else {
       return false;
    }
}