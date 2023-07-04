#ifndef EXTRACTOR_HEADER
#define EXTRACTOR_HEADER

#pragma once

#include "structs.h"


bool extractData(struct Reading readings[], unsigned long startTime, unsigned short sampleRate, int blocks_to_read);

bool operationStatus(SI_STATUS status) ;

unsigned short getSampleRateFromConfigBlock() ;

unsigned long getUnixStartTimeFromConfigBlock() ;

#endif