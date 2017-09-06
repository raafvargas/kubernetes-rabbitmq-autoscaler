export const Env = {
    messageBrokerAddress: process.env['RABBITMQ_ADDRESS'] || 'amqp://guest:guest@localhost:5672',
    consumersLimit: process.env['CONSUMERS_LIMIT'] ? parseInt(process.env['CONSUMERS_LIMIT']) : 20,
    queueLimit: process.env['QUEUE_LIMIT'] ? parseInt(process.env['QUEUE_LIMIT']) : 1000
}
