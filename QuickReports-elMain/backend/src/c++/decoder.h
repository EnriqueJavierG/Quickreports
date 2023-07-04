#ifndef DECODER_HEADER
#define DECODER_HEADER
// #include "decoder.cc"
// #include "ConfigurationBlock.cc"
#include <iostream>
#include "structs.h"
#pragma once

#define NAME_BYTE_SIZE 14
#define VERSION_BYTE_SIZE 4

unsigned short getShortFromBytes(BYTE buffer[2], bool isBigEndian);
unsigned long getLongFromBytes(BYTE buffer[4]);
// unsigned char* getStringFromBytes(BYTE * buffer, int byte_size);

#endif