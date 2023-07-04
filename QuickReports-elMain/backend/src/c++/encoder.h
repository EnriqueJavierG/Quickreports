#ifndef ENCODER_HEADER
#define ENCODER_HEADER
#pragma once
#include <string>

void getBytesFromLong(unsigned long val, BYTE bufDataOut[4]);
void getBytesFromShort(unsigned short val, BYTE bufDataOut[2]);
void getByteFromChar(char c, BYTE bufDataOut[1]);
void getBytesFromString(char* s, BYTE bufDataOut[16]) ;
void getBytesFromStringVersion(char* s, BYTE bufDataOut[4]);
void getBytesFromFloat(float f, BYTE bufDataOut[4]) ;
unsigned char getRawValuesForTempAlarms(int alarm) ;
unsigned char getRawValuesForRHAlarms(int alarm) ;

#endif