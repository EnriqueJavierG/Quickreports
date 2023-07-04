#ifndef STRUCTS_HEADER
#define STRUCTS_HEADER

enum ParameterName
{
    type = 0,
    command = 1,
    name = 2,
    startHr = 18,
    startMin=19,
    startSec=20,
    startDay=21,
    startMon=22,
    startYear=23,
    startTimeOffset=24,
    sampleRate=28,
    sampleCount=30,
    flagBits1=32,
    highAlarmLevel=34,
    lowAlarmLevel=35,
    calibrationMValue=36,
    calibrationCValue=40,
    rawInputReading=44,
    inputType=46,
    flagBits2=47,
    version=48,
    serialNumber=52,
    channel2highAlarm=56,
    channel2lowAlarm=57,
    rolloverCount=58,
    byte59=59,
    maxSamples=60,
    byte62=62
};

struct Parameter
{
    ParameterName name;
    int offset;

};

struct ConfigurationBlock
{
    
    BYTE configurationBlock[128];

    unsigned char type,
        command,
        startHr,
        startMin,
        startSec,
        startDay,
        startMon,
        startYear,
        highAlarmLevel,
        lowAlarmLevel,
        inputType,
        flagBits2,
        channel2highAlarm,
        channel2lowAlarm,
        rolloverCount;

    char* name;
    char* version;

    unsigned short sampleCount,
        sampleRate,
        flagBits1,
        rawInputReading,
        maximunSamples;

    unsigned long startTimeOffset,
        serialNumber;

    float calibrationMValue, CalibrationCValue;
};

struct Reading {
    float temp;
    float hum;
    unsigned long timestamp;
};

#endif