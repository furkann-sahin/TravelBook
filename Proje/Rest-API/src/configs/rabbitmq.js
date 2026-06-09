const amqp = require("amqplib");

const EXCHANGE = "tour.events";

let channel = null;

async function connectRabbitMQ() {
  const url = process.env.RABBITMQ_URL;
  if (!url) {
    console.warn("[RabbitMQ] RABBITMQ_URL not set — events disabled");
    return;
  }

  try {
    const connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, "topic", { durable: true });
    console.log("[RabbitMQ] Connected");

    connection.on("error", (err) => console.error("[RabbitMQ] Connection error:", err.message));
    connection.on("close", () => console.warn("[RabbitMQ] Connection closed"));
  } catch (err) {
    console.error("[RabbitMQ] Failed to connect:", err.message);
  }
}

function getChannel() {
  return channel;
}

async function publishTourEvent(routingKey, payload) {
  if (!channel) return;
  try {
    const message = Buffer.from(JSON.stringify(payload));
    channel.publish(EXCHANGE, routingKey, message, { persistent: true });
  } catch (err) {
    console.error("[RabbitMQ] Failed to publish event:", err.message);
  }
}

module.exports = { connectRabbitMQ, getChannel, publishTourEvent, EXCHANGE };
