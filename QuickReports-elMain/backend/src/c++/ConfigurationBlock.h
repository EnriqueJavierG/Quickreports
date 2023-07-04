#ifndef CONFIG_BLOCK_HEADER
#define CONFIG_BLOCK_HEADER
#include <windows.h>
#include <napi.h>
#pragma once
#define NAME_BYTE_SIZE 14
#define VERSION_BYTE_SIZE 4
#include "structs.h"



struct ConfigurationBlock createBlockObject(BYTE confBlock[]);
ConfigurationBlock getStructuredConfigurationBlock();
BYTE* encodeConfigBlock(ConfigurationBlock  *block);
Napi::Object getJSObjFromConfigBlock(ConfigurationBlock block , Napi::Env env);
BYTE* updateConfigBlockWithJSObj(ConfigurationBlock* block , Napi::Object configurations);
boolean programDatalogger(ConfigurationBlock block);
boolean stopDatalogger();


#endif