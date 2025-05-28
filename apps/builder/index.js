import fs from 'node:fs';

export const checkShipperConfigJSONFile = (config) => {
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

fs.readFile('/home/app/output/shipper.config.json', (err, data) => {
  if (err) {
    console.log('please check your shipper.config.json file & try again');
    process.exit(0);
  }
  const shipperData = JSON.parse(data.toString());
  const isValidConfigFile = checkShipperConfigJSONFile(shipperData);

  if (!isValidConfigFile) {
    return;
  }
  console.log('enter');
  if (shipperData.client) {
    fs.writeFileSync(
      '/home/app/output/shipper.env',
      `CLIENT_BUILD_CMD="${shipperData.client.buildCommand}"
    CLIENT_INSTALL_CMD="${shipperData.client.installCommand}"
    CLIENT_START_CMD="${shipperData.client.startCommand}"
    CLIENT_OUTPUT_DIR="${shipperData.client.outputDirectory}"
    CLIENT_PATH="${shipperData.client.path.split('./').pop()}"\n`
    );
  }
  console.log('finish client');

  if (shipperData.server) {
    fs.appendFileSync(
      '/home/app/output/shipper.env',
      `SERVER_BUILD_CMD="${shipperData.server.buildCommand}"
    SERVER_INSTALL_CMD="${shipperData.server.installCommand}"
    SERVER_START_CMD="${shipperData.server.startCommand}"
    SERVER_OUTPUT_DIR="${shipperData.server.outputDirectory}"
    SERVER_PATH="${shipperData.server.path.split('./').pop()}"
    `
    );
  }
});
