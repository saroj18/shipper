import Docker from 'dockerode';

export const removeContainer = async (containerId: string): Promise<void> => {
  const docker = new Docker();
  try {
    const container = docker.getContainer(containerId);
    await container.stop();
    await container.remove();
    console.log(`Container ${containerId} removed successfully.`);
  } catch (error) {
    console.error(`Failed to remove container ${containerId}:`, error);
    throw error;
  }
};
