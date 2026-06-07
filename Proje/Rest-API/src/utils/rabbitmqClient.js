const amqp = require("amqplib");

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    console.log("RabbitMQ Connected");

    // Ensure queues exist
    await channel.assertQueue("guide_registration_queue", { durable: true });
    await channel.assertQueue("company_notification_queue", { durable: true });
    await channel.assertQueue("guide_deletion_queue", { durable: true });
    await channel.assertQueue("tour_deletion_queue", { durable: true });

    return { connection, channel };
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
    // Retry connection logic could be added here
  }
};

const publishToQueue = async (queueName, data) => {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }
    if (channel) {
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
        persistent: true,
      });
      console.log(`Message sent to queue: ${queueName}`);
    }
  } catch (error) {
    console.error(`Error publishing to queue ${queueName}:`, error);
  }
};

const getChannel = () => channel;

module.exports = {
  connectRabbitMQ,
  publishToQueue,
  getChannel,
};
