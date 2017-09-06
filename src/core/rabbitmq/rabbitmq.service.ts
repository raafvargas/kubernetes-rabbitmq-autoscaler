import * as amqp from 'amqplib';

export class RabbitService {
    constructor(private rabbitAddress: string) {
    }

    async queueSize(queue: string): Promise<number> {
        const connection = await amqp.connect(this.rabbitAddress);
        const channel = await connection.createChannel();
        const assert = await channel.checkQueue(queue);

        return assert.messageCount;
    }

    async consumersCount(queue: string): Promise<number> {
        const connection = await amqp.connect(this.rabbitAddress);
        const channel = await connection.createChannel();
        const assert = await channel.checkQueue(queue);

        return assert.consumerCount;
    }
}