import amqp from 'amqplib';

export class MessageQueue {
  private static instance: amqp.ChannelModel;

  private constructor() {}

  public static async getInstance(): Promise<amqp.ChannelModel> {
    if (!MessageQueue.instance) {
      console.log('Creating a new instance of MessageQueue');
      this.instance = await amqp.connect('amqp://guest:guest@localhost:5672');
    }
    return this.instance;
  }

  public static async pushOnQueue(queue: string, message: string) {
    if (!(await this.getInstance())) {
      throw new Error('No RabbitMQ connection available');
    }
    const channel = (await this.getInstance()).createChannel();
    (await channel).assertQueue(queue, { durable: true });
    (await channel).sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`[x] Sent: ${message}`);
  }

  public static async receiveFromQueue(
    queue: string,
    callback: (msg: amqp.Message | null) => void
  ) {
    if (!(await this.getInstance())) {
      throw new Error('No RabbitMQ connection available');
    }
    const channel = (await this.getInstance()).createChannel();
    (await channel).assertQueue(queue, { durable: true });
    console.log('[*] Waiting for messages...');
    (await channel).consume(queue, async (msg) => {
      if (msg) {
        callback(msg);
        (await channel).ack(msg);
      }
    });
  }
}
