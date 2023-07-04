#include <napi.h>
#include "SiUSBXp.h"
#include "ConfigurationBlock.h"
#include "structs.h"
#include <iostream>
#include "extractor.h"


DWORD conn_dev;
std::string whichError(SI_STATUS status);
// return config block object from datalogger that is connected into the system
Napi::Object getConfigurationBlock(const Napi::CallbackInfo& info ){
  Napi::Env env = info.Env();
  struct ConfigurationBlock block;
  try{
    block = getStructuredConfigurationBlock();
  }
  catch(int s){
    Napi::Error::New(env , whichError(s)).ThrowAsJavaScriptException();
  }

  return getJSObjFromConfigBlock(block , env);
}

Napi::Array getReadings(const Napi::CallbackInfo& info){
  Napi::Env env = info.Env();
  const int blocks_to_read = info[0].As<Napi::Number>().Int32Value();
  const int noReadings = blocks_to_read * 256;
  struct Reading readings[16384]; // array de la data
  unsigned long unixStartTime = getUnixStartTimeFromConfigBlock();
  unsigned short sampleRate = getSampleRateFromConfigBlock();

  //bool r = !extractData(readings , unixStartTime , sampleRate);
  // while(r){
  //   r = !extractData(readings , unixStartTime , sampleRate);
  // }

  try{
    extractData(readings , unixStartTime , sampleRate , blocks_to_read);
  }catch(int e){
    Napi::Error::New(env , whichError(e)).ThrowAsJavaScriptException();
  }


  Napi::Array readings_obj = Napi::Array::New(env);

  for(int i = 0 ; i < blocks_to_read*256 ; i++){
    Napi::Object reading = Napi::Object::New(env);
    reading.Set(Napi::String::New(env , "temp") , readings[i].temp);
    reading.Set(Napi::String::New(env , "rh") , readings[i].hum);
    reading.Set(Napi::String::New(env , "ts") , readings[i].timestamp);
    readings_obj.Set(i , reading);
  }

  return readings_obj;

}

Napi::Boolean program(const Napi::CallbackInfo& info)
  {
    Napi::Env env = info.Env();
    Napi::Object configurations = info[0].As<Napi::Object>();// get conf block obj from args
    struct ConfigurationBlock block = getStructuredConfigurationBlock(); // get the block for the connected datalogger
    updateConfigBlockWithJSObj(&block , configurations); // put in the data passed from block
    return Napi::Boolean::New(env,programDatalogger(block));// return true false on writting 
  }

Napi::Object encodeDecodeReturn(const Napi::CallbackInfo& info){
  Napi::Env env = info.Env();
  Napi::Object configurations = info[0].As<Napi::Object>();// get conf block obj from args
  struct ConfigurationBlock block = getStructuredConfigurationBlock(); // get the block for the connected datalogger
  updateConfigBlockWithJSObj(&block , configurations);
  return getJSObjFromConfigBlock(block , env);
}

// Napi::Object test2(const Napi::CallbackInfo& info){
//   Napi::Env env = info.Env();


// }

Napi::Object Init(Napi::Env env, Napi::Object exports) {


  exports.Set(Napi::String::New(env , "getConfigurationBlock"),
              Napi::Function::New(env , getConfigurationBlock));

  
  exports.Set(Napi::String::New(env , "getReadings"),
              Napi::Function::New(env , getReadings));

  exports.Set(Napi::String::New(env , "program"),
              Napi::Function::New(env , program));

  exports.Set(Napi::String::New(env, "encodeDecodeReturn"),
              Napi::Function::New(env, encodeDecodeReturn));


    
  return exports;
}

std::string whichError(SI_STATUS status) {
    switch (status) {
    case (SI_DEVICE_NOT_FOUND):
        return  "  Device not found, try reconnecting the datalogger.  ";

    case (SI_INVALID_PARAMETER):
        return "  Invalid function parameters.";

    case (SI_GLOBAL_DATA_ERROR):
      return " Thread global data cannot be retrieved. Unload and reload the DLL.";

    case (SI_SYSTEM_ERROR_CODE):
        return  " Windows System Error ";
        

    case (SI_INVALID_HANDLE):
      return "Invalid handle. Verify if the device is connected correctly. ";
        
    case (SI_READ_ERROR):
        return "  The read operation failed. The device may have been removed.";

    case (SI_READ_TIMED_OUT):
        return "Read took too long :( Try again. ";

    case (SI_IO_PENDING):
        return " IO is pending. ";
        
    default:
        return "Unknown error";
    }
    

}


NODE_API_MODULE(confblock, Init)
