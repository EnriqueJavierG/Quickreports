// TestingDLLConnection.cpp : This file contains the 'main' function. Program execution begins and ends there.
//
#include <stdio.h>
#include <windows.h>
#include <iostream>
#include "SiUSBXp.h"

// encode data to write into DL
// type to byte

// encode unsigned long into byte array
void getBytesFromLong(unsigned long val, BYTE bufDataOut[4]) {
    bufDataOut[3] = val & 0xFF; // MSB
    bufDataOut[2] = (val >> 8) & 0xFF;
    bufDataOut[1] = (val >> 16) & 0xFF;
    bufDataOut[0] = (val >> 24) & 0xFF;
}


// encode unsigned short into byte array
void getBytesFromShort(unsigned short val, BYTE bufDataOut[2]) { 
    bufDataOut[0] = val & 0xFF; // MSB
    bufDataOut[1] = (val >> 8) & 0xFF;
}


// encode char to byte
void getByteFromChar(char c, BYTE bufDataOut[1]) {
    bufDataOut[0] = static_cast<BYTE>(c);
}


// encode string to byte array (the string must have a maximum of 15 characters
void getBytesFromString(char* s, BYTE bufDataOut[16]) {
    int sz = 0;
    int j = 0;
    while ((j < 15)) { // & (s[j] != '\0')
        bufDataOut[j] = s[j];
        j++;
    }
    while (j <= 15) {
        bufDataOut[j] = '\0';
        j++;
    }
}

void getBytesFromStringVersion(char* s, BYTE bufDataOut[4]){
    int sz=0;
    int j=0;
    while (j<4){
        bufDataOut[j] = s[j];
        j++;
    }
}

void getBytesFromFloat(float f, BYTE bufDataOut[4]) {
    memcpy(bufDataOut, &f, sizeof f);
    // changing from little endian to big endian
    BYTE temp1 = bufDataOut[0];
    BYTE temp2 = bufDataOut[1];
    BYTE temp3 = bufDataOut[2];
    BYTE temp4 = bufDataOut[3];
    bufDataOut[0] = temp4;
    bufDataOut[1] = temp3;
    bufDataOut[2] = temp2;
    bufDataOut[3] = temp1;
}

unsigned char checkOverflow(int val) {
    if (val > 255) {
        return (unsigned char)255;
    }
    else {
        return (unsigned char)val;
    }
}

unsigned char getRawValuesForTempAlarms(int alarm) {
    int val = alarm + 40.0;
    return checkOverflow(val);
}

unsigned char getRawValuesForRHAlarms(int alarm) {
    int val = alarm * 2.0;
    return checkOverflow(val);
}
