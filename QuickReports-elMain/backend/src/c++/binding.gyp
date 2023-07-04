{
  "variables":{
    "ddl_files":"SiUSBXp.dll"
  },
  
  "targets": [
    {
      "default_configuration": "Release_x64",
      "configurations": {
        'Release_x64':{
          'inherit_from': ['Release'],
          'msvs_configuration_platform': 'x6',
        }
      },
      "target_name": "addon",
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
        'MACOSX_DEPLOYMENT_TARGET': '10.7',
      },
      'msvs_settings': {
      'VCCLCompilerTool': { 'ExceptionHandling': 1 },
      },
      "sources": [ "addon.cc" , "SiUSBXp.h" , "SiUSBXp.dll" , "ConfigurationBlock.cc" , "decoder.cc" , "encoder.cc" , "extractor.cc"],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "copies": [
        {
          "destination": "build/Release/",
          "files": [ "SiUSBXp.dll" ]
        },
        {
          "destination": "build/Release/",
          "files": [ "SiUSBXp.lib" ]
        }
      ],
      "libraries": ["Release/SiUSBXp.lib"],
    }
  ]
}
