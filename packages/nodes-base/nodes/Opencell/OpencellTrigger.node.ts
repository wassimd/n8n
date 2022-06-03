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
					{
						name: 'Customer',
						value: 'org.meveo.model.crm.Customer',
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
						value: 'UPDATED',
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
				const body: IDataObject = {
					genericFields: ["id", "code"],
					filters: {
						code: webhookData.code as string,
					},
				};
				//const { hooks: webhooks } = await opencellApi.call(this, 'GET', '/hooks');
				// A voir si cette partie est nécessaire ou pas
				const webhooks = await opencellApi.call(this, 'POST', '/opencell/api/rest/v2/generic/all/webhook', body);
				for (const webhook of webhooks) {
					/*if (webhook.target_url === webhookUrl && webhook.event === snakeCase(entity)) {
						webhookData.webhookId = webhook.hook_id;
						return true;
					}*/
					if (webhookData.code === webhook.code) {
						webhookData.id = webhook.id;
						return true;
					}
					else if (webhookData.id === webhook.id) {
						console.log(">>>> webhookData.id === webhook.id");
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
				let url;
				if (webhookUrl) {
					url = new URL(webhookUrl);
				}
				let port;
				if (url?.port.length === 0) {
					port = url.port;
				}
				else {
					if ('HTTP' === url?.protocol.toUpperCase().slice(0, -1)) {
						port = '80'
					}
					else if ('HTTPS' === url?.protocol.toUpperCase().slice(0, -1)) {
						port = '443'
					}
					else {
						console.log(`Unknown port number : ${url?.port} in url ${webhookUrl}.`);
					}
				}

				const body: IDataObject = {
					code: snakeCase(entity.substring(index) + eventType),
					classNameFilter: entity,
					host: url?.hostname,
					page: url?.pathname,
					httpMethod: "HTTP_POST",
					eventTypeFilter: eventType,
					bodyEl: `{
						"id":#{event.id},
						"code":"#{event.code}"
					}`,
					headers: {
						"Content-Type": "application/json"
					},
					httpProtocol: url ? url.protocol.toUpperCase().slice(0, -1) : 'HTTP',
					port: port,
				};
				const webhook = await opencellApi.call(this, 'POST', '/opencell/api/rest/notification/webhook/createOrUpdate', body);
				if (webhook.status != 'SUCCESS') {
					console.log("ERROR CREATING A WEBHOOK")
					return false;
				}
				webhookData.code = snakeCase(entity.substring(index) + eventType);
				// GET ID and Code
				const body2: IDataObject = {
					genericFields: ["id", "code"],
					filters: {
						code: webhookData.code as string,
					},
				};
				const webhooks = await opencellApi.call(this, 'POST', '/opencell/api/rest/v2/generic/all/webhook', body2);
				if (webhooks.length == 1) {
					console.log("webhooks.length == 1");
					webhookData.id = webhooks[0].id;
				}
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				try {
					await opencellApi.call(this, 'DELETE', `/opencell/api/rest/notification/webhook/${webhookData.code}`);
				} catch (error) {
					return false;
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		return {
			workflowData: [
				this.helpers.returnJsonArray(req.body),
			],
		};
	}
}

