const fs = require('fs');
const checkShipperConfigJSONFile = (config) => {
  if (
    typeof config === 'object' &&
    config !== null &&
    typeof config.client === 'object' &&
    typeof config.server === 'object' &&
    typeof config.client.path === 'string' &&
    typeof config.client.installCommand === 'string' &&
    typeof config.client.buildCommand === 'string' &&
    typeof config.client.startCommand === 'string' &&
    typeof config.client.outputDirectory === 'string' &&
    typeof config.server.path === 'string' &&
    typeof config.server.installCommand === 'string' &&
    typeof config.server.buildCommand === 'string' &&
    typeof config.server.startCommand === 'string' &&
    typeof config.server.outputDirectory === 'string'
  ) {
    return true;
  } else {
    console.error('Invalid shipper config JSON file format');
    process.exit(0);
  }
};

fs.readFile('./shipper.config.json', (err, data) => {
  if (err) {
    console.log('please check your shipper.config.json file & try again');
    process.exit(0);
  }
  const shipperData = JSON.parse(data.toString());
  console.log('parsedData', shipperData);
  const isValidConfigFile = checkShipperConfigJSONFile(shipperData);
  console.log('isValidConfigFile', isValidConfigFile);
  if (!isValidConfigFile) {
    return;
  }

  if (shipperData.client) {
    fs.writeFileSync(
      './shipper.env',
      `CLIENT_BUILD_CMD=${shipperData.client.buildCommand}
    CLIENT_INSTALL_CMD=${shipperData.client.installCommand}
    CLIENT_START_CMD=${shipperData.client.startCommand}
    CLIENT_OUTPUT_DIR=${shipperData.client.outputDirectory}
    CLIENT_PATH=${shipperData.client.path} \n`
    );
  }

  if (shipperData.server) {
    fs.appendFileSync(
      './shipper.env',
      `SERVER_BUILD_CMD=${shipperData.server.buildCommand}
    SERVER_INSTALL_CMD=${shipperData.server.installCommand}
    SERVER_START_CMD=${shipperData.server.startCommand}
    SERVER_OUTPUT_DIR=${shipperData.server.outputDirectory}
    SERVER_PATH=${shipperData.server.path}`
    );
  }
});
// 'cfdb32f15086bd7ecc2f2255df9cf7d3db50aada39158c8a4693c8d586058225';
// containerId: f03b7fcedd48fb20180723bd43a67d7369d5b64dfd843f87910a58d4c831eece;