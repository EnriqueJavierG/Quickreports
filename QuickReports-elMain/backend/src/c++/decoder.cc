#include "ConfigurationBlock.h"
using namespace std;

// decode data when reading from DL
// from BYTE[] to type

unsigned short getShortFromBytes(BYTE buffer[2], bool isBigEndian) {
   if (isBigEndian) {
       return (buffer[1] << 8) | buffer[0];
   }
   else {
       return (buffer[0] << 8) | buffer[1];
   }

}

unsigned long getLongFromBytes(BYTE buffer[4]) {
   unsigned long tbr;
   memcpy(&tbr, buffer, 4);
   return tbr;
}



