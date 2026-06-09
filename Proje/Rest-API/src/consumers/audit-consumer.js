const amqp = require("amqplib");
const { EXCHANGE } = require("../configs/rabbitmq");

const QUEUE = "tour.audit";

async function startAuditConsumer() {
  const url = process.env.RABBITMQ_URL;
  if (!url) {
    console.warn("[AuditConsumer] RABBITMQ_URL not set — consumer not started");
    return;
  }

  try {
    const connection = await amqp.connect(url);
    const ch = await connection.createChannel();

    await ch.assertExchange(EXCHANGE, "topic", { durable: true });
    await ch.assertQueue(QUEUE, { durable: true });
    await ch.bindQueue(QUEUE, EXCHANGE, "tour.created");
    await ch.bindQueue(QUEUE, EXCHANGE, "tour.deleted");

    ch.consume(QUEUE, (msg) => {
      if (!msg) return;
      try {
        const event = JSON.parse(msg.content.toString());
        const timestamp = new Date().toISOString();
        console.log(
          `[AuditLog] ${timestamp} | eventType=${event.eventType} | tourId=${event.tourId} | companyId=${event.companyId} | tourName=${event.tourName}`,
        );
        ch.ack(msg);
      } catch (err) {
        console.error("[AuditConsumer] Failed to process message:", err.message);
        ch.nack(msg, false, false);
      }
    });

    console.log(`[AuditConsumer] Listening on queue: ${QUEUE}`);

    connection.on("error", (err) => console.error("[AuditConsumer] Connection error:", err.message));
    connection.on("close", () => console.warn("[AuditConsumer] Connection closed"));
  } catch (err) {
    console.error("[AuditConsumer] Failed to start:", err.message);
  }
}

module.exports = { startAuditConsumer };
