const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
  serverUrl: 'https://codequality.ymslilabs.com:8443',
  options: {
    'sonar.sources': '.',
    'sonar.exclusions': 'node_modules/**,Logs/**,Server/Common/Utils/Enums/macResultsFieldsPosEnums.js,Server/Common/Utils/Parsers/ReportPacketParser-AOI.js,Server/Common/Utils/Parsers/ReportPacketParser-Printer-Mounter.js,Common/Logger/serverlogger.js,Common/Logger/communicationLogger.js',
  }
}, () => {});