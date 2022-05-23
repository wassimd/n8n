import {
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';


import {
	opencellGenericApi,
	opencellApi,
} from './GenericFunctions';

import {
	 snakeCase,
} from 'change-case';


export class OpencellTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Opencell Trigger',
		name: 'opencellTrigger',
		icon: 'file:opencell.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle Opencell events via webhooks',
		defaults: {
			name: 'Opencell Trigger',
			color: '#bf0000',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'opencellApi',
				required: true,
				testedBy: 'opencellApiTest',
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Entity',
				name: 'entity',
				type: 'options',
				required: true,
				default: '',
				options: [
					{
						name: 'Subscription',
						value: 'org.meveo.model.billing.Subscription',
					},
					{
						name: 'Invoice',
						value: 'org.meveo.model.billing.Invoice',
					},
					{
						name: 'Account Operation',
						value: 'org.meveo.model.payments.AccountOperation',
					},
				],
			},
			{
				displayName: 'Event',
				name: 'eventType',
				type: 'options',
				default: '',
				description: `Choose the event class.`,
				options: [
					{
						name: 'Create',
						value: 'CREATED',
					},
					{
						name: 'Update',
						value: 'Updated',
					},
				],
			},
		],
	};
	// @ts-ignore
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const entity = this.getNodeParameter('entity') as string;
				const eventType = this.getNodeParameter('eventType') as string;
				const { hooks: webhooks } = await opencellApi.call(this, 'GET', '/hooks');
				for (const webhook of webhooks) {
					if (webhook.target_url === webhookUrl && webhook.event === snakeCase(entity)) {
						webhookData.webhookId = webhook.hook_id;
						return true;
					}
				}
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const entity = this.getNodeParameter('entity') as string;
				const index = entity.lastIndexOf('.');
				const eventType = this.getNodeParameter('eventType') as string;
				const body: IDataObject = {
					code: snakeCase(entity.substring(index) + eventType),
					classnamefilter:entity,
					host:webhookUrl,
					page:"/",
					httpMethod:"HTTP_POST",
					"bodyEl":`{
						"id":#{event.id},
						"code":"#{event.code}"
					}`,
					headers: {
						"Content-Type": "application/json"
					},
					httpProtocol:"HTTP"
				};
				const webhook = await opencellApi.call(this, 'POST', '/opencell/api/rest/notification/webhook/createOrUpdate', body);
				if(webhook.status != 'SUCCESS'){
					console.log("ERROR CREATING A WEBHOOK")
					return false;
				}
				webhookData.code = snakeCase(entity.substring(index) + eventType);
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				try {
					await opencellApi.call(this, 'DELETE', `/hook/${webhookData.webhookId}`);
				} catch (error) {
					return false;
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return {
			workflowData: [],
		};
	}
}

