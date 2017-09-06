import { Pod } from './pod';
import { Config, Core_v1Api, Core_v1ApiApiKeys } from '@kubernetes/typescript-node';

export class KubeService {
    private client: Core_v1Api;

    constructor() {
        this.client = Config.defaultClient();
        this.client.setApiKey(Core_v1ApiApiKeys.BearerToken, '');
    }

    async getPods(): Promise<Array<Pod>> {
        const pods = await this.client.listNamespacedPod('default');
        return [];
    }

    async scaleUp(pod: Pod): Promise<any> {
    }

    async scaleOut(pod: Pod): Promise<any> {
    }
}