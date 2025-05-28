import net from 'net';

export const checkPort = (port: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use, check the next port
        resolve(checkPort(port + 1));
      } else {
        reject(err);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(port); // Port is available
    });

    server.listen(port);
  });
};
