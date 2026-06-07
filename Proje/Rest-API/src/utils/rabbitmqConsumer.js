const { getChannel } = require("./rabbitmqClient");

const initConsumers = async () => {
  const channel = getChannel();
  if (!channel) {
    console.warn("RabbitMQ channel not available for consumers");
    return;
  }

  const processMessage = (queueName, msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());

      // Profesyonel Gecikme: 6 saniye bekletip sonra işle ve onayla (ack)
      setTimeout(() => {
        console.log("------------------------------------------------------------------");
        console.log(`KUYRUK TESTİ BAŞARILI: [${queueName}] işlendi -`, JSON.stringify(data));
        console.log("------------------------------------------------------------------");

        channel.ack(msg);
      }, 60000);
    }
  };

  // Kuyrukları dinlemeye başla
  const queues = [
    "guide_registration_queue",
    "company_notification_queue",
    "guide_deletion_queue",
    "tour_deletion_queue"
  ];

  queues.forEach(queue => {
    channel.consume(queue, (msg) => processMessage(queue, msg), { noAck: false });
  });

  console.log("RabbitMQ Consumers initialized (with 3s delay for demo)");
};

module.exports = { initConsumers };
