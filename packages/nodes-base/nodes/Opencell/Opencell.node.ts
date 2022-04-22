import {
    IExecuteFunctions,
} from 'n8n-core';

import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import {
    OptionsWithUri,
} from 'request';

export class Opencell implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Opencell',
        name: 'opencell',
        icon: 'file:opencell.svg',
        group: ['transform'],
        version: 1,
        description: 'Consume Opencell API',
        defaults: {
            name: 'Opencell',
            color: '#bf0000',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
					{
						name: 'opencellApi',
						required: true,
					},
        ],
        properties: [
					{
						displayName: 'Resource',
						name: 'resource',
						type: 'options',
						options: [
							{
								name: 'Contact',
								value: 'contact',
							},
						],
						default: 'contact',
						required: true,
						description: 'Resource to consume',
					},
					{
						displayName: 'Operation',
						name: 'operation',
						type: 'options',
						displayOptions: {
							show: {
								resource: [
									'contact',
								],
							},
						},
						options: [
							{
								name: 'Create',
								value: 'create',
								description: 'Create a contact',
							},
						],
						default: 'create',
						description: 'The operation to perform.',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						required: true,
						displayOptions: {
							show: {
								operation: [
									'create',
								],
								resource: [
									'contact',
								],
							},
						},
						default:'',
						description:'Primary email for the contact',
					},
					{
						displayName: 'Additional Fields',
						name: 'additionalFields',
						type: 'collection',
						placeholder: 'Add Field',
						default: {},
						displayOptions: {
							show: {
								resource: [
									'contact',
								],
								operation: [
									'create',
								],
							},
						},
						options: [
							{
								displayName: 'First Name',
								name: 'firstName',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Last Name',
								name: 'lastName',
								type: 'string',
								default: '',
							},
						],
					},
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			const items = this.getInputData();
			let responseData;
			const returnData = [];
			const resource = this.getNodeParameter('resource', 0) as string;
			const operation = this.getNodeParameter('operation', 0) as string;
			//Get credentials the user provided for this node
			const credentials = await this.getCredentials('opencellApi') as IDataObject;

			let url : string ;
			for (let i = 0; i < items.length; i++) {
										// Add credentials if any are set
						// here we use basic auth
			if (credentials !== undefined) {
				requestOptions.auth = {
					user: credentials.user as string,
					pass: credentials.password as string,
				};
				url = credentials.host + ':' + credentials.port;
			}

				if (resource === 'contact') {
					if (operation === 'create') {
						// get email input
						const email = this.getNodeParameter('email', i) as string;

						// i = 1 returns ricardo@n8n.io
						// i = 2 returns hello@n8n.io

						// get additional fields input
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const data: IDataObject = {
							email,
						};

						Object.assign(data, additionalFields);


						//Make http request according to <https://sendgrid.com/docs/api-reference/>
						const options: OptionsWithUri = {
							headers: {
								'Accept': 'application/json',
								'Authorization': `Bearer ${credentials.username}`,
							},
							method: 'PUT',
							body: {
								contacts: [
									data,
								],
							},
							uri: `https://webhook.site/5dad15c6-d075-4144-bac6-6e234ef7481c`,
							json: true,
						};

						responseData = await this.helpers.request(options);
						returnData.push(responseData);
					}
				}
			}

			console.log(returnData);
			// Map data to n8n data structure
			return [this.helpers.returnJsonArray(returnData)];
		}
}
