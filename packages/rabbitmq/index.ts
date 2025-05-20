import amqp from "amqplib";

export class MessageQueue {
  private static instance: MessageQueue;
  private connection: amqp.ChannelModel | null = null;

  private constructor() {}

  public static async getInstance(): Promise<MessageQueue> {
    if (!MessageQueue.instance) {
      MessageQueue.instance = new MessageQueue();
      await MessageQueue.instance.init();
    }
    return MessageQueue.instance;
  }

  private async init() {
    try {
      this.connection = await amqp.connect("amqp://guest:guest@localhost:5672");
      console.log("RabbitMQ Connected");
    } catch (error) {
      console.error("RabbitMQ Connection Error:", error);
    }
  }

  public async pushOnQueue(queue: string, message: string) {
    if (!this.connection) {
      throw new Error("No RabbitMQ connection available");
    }
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`[x] Sent: ${message}`);
  }

  public async receiveFromQueue(
    queue: string,
    callback: (msg: amqp.Message | null) => void
  ) {
    if (!this.connection) {
      throw new Error("No RabbitMQ connection available");
    }
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log("[*] Waiting for messages...");
    channel.consume(queue, (msg) => {
      if (msg) {
        callback(msg);
        channel.ack(msg);
      }
    });
  }
}
