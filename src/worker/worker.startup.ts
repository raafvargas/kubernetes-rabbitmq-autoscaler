import { Env } from '../infrastructure/env';
import { KubeService } from '../core/kubernetes/kube.service';
import { RabbitService } from '../core/rabbitmq/rabbitmq.service';
import { IStartup } from '../infrastructure/initializable.interface';

export class WorkerStartup implements IStartup {
    kubeService: KubeService;
    rabbitService: RabbitService;
    name = 'rabbitmq-autoscaler';

    constructor() {
        this.rabbitService = new RabbitService(Env.messageBrokerAddress);
    }

    Run(): Promise<any> {
        return new Promise((reject, resolve) => {
            setInterval(async () => await this.Process(), 5000)
        });
    }

    async Process(): Promise<any> {
        const pods = await this.kubeService.getPods();
        for (const index in pods) {
            const pod = pods[index];

            const queueSize = await this.rabbitService.queueSize(pod.name);
            const consumerCount = await this.rabbitService.consumersCount(pod.name);

            const queueSizePerConsumer = queueSize / (consumerCount == 0 ? 1 : consumerCount);
            const queueSizeToscaleOut = Math.round(queueSize * 0.7);

            if (queueSizePerConsumer > Env.queueLimit) {
                if (consumerCount < Env.consumersLimit) {
                    this.kubeService.scaleUp(pod);
                }
            } else if (consumerCount > 1 && queueSizeToscaleOut) {
                this.kubeService.scaleOut(pod);
            }
        }
    }
}
