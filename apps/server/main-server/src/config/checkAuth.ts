import { ECRClient, GetAuthorizationTokenCommand } from '@aws-sdk/client-ecr';

import { exec } from 'child_process';

const ecr = new ECRClient({ region: 'ap-south-1' });

export const getEcrAuth = async () => {
  const { authorizationData } = await ecr.send(new GetAuthorizationTokenCommand({}));
  if (!authorizationData || authorizationData.length === 0) {
    throw new Error('No authorization data received from ECR');
  }

  const auth = authorizationData[0];
  if (!auth.authorizationToken || !auth.proxyEndpoint) {
    throw new Error('Invalid authorization data received from ECR');
  }

  const token = Buffer.from(auth.authorizationToken, 'base64').toString('utf-8');
  const [username, password] = token.split(':');
  const loginCommand = `echo ${password} | docker login --username ${username} --password-stdin ${auth.proxyEndpoint}`;

  exec(loginCommand, (err, stdout, stderr) => {
    if (err) {
      console.error(`Docker login failed: ${stderr}`);
    } else {
      console.log(`Docker login successful: ${stdout}`);
    }
  });
  return { username, password, serveraddress: auth.proxyEndpoint };
};
