import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IHttpRequestMethods,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	INodePropertyOptions,
	INodeCredentialTestResult,
	ICredentialDataDecryptedObject,
	JsonObject,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

import {
	customerHierarchyFields,
	customerHierarchyOperations,

} from './CustomerHierarchyDescription'


async function opencellApiRequest(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, requestOptions: IHttpRequestOptions, method: IHttpRequestMethods, endpoint: string, body: any = {}, query: IDataObject = {}, uri?: string): Promise<any> { // tslint:disable-line:no-any
	//let authenticationMethod = this.getNodeParameter('authentication', 0);

	const options = requestOptions;

	if (endpoint != '') {
		options.url += endpoint;
	}
	options.method = method;
	options.body = body;
	if (query) {
		options.qs = query;
	}
	/*
		if (authenticationMethod === 'opencellApi'){
			const credentials = await this.getCredentials('hubspotApi');
			options.headers!['Authorization'] = `Basic ${credentials!.username}:${credentials!.password}`;
			options.uri = credentials!.host + ':' + credentials!.port+'/opencell';

		}
	*/
	return await this.helpers.httpRequest(options);

}

async function opencellApiGetAllItems(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: any = {}, query: IDataObject = {}, uri?: string): Promise<any> { // tslint:disable-line:no-any
	//let authenticationMethod = this.getNodeParameter('authentication', 0);
	const returnData: IDataObject[] = [];
	const httpBasicAuth = await this.getCredentials('opencellApi');
	const requestOptions: IHttpRequestOptions = {
		headers: {
			'Accept': 'application/json',
		},
		url: '',
		encoding: 'json',
		json: true,
	};

	if (httpBasicAuth !== undefined) {
		requestOptions.auth = {
			username: httpBasicAuth.username as string,
			password: httpBasicAuth.password as string,
		};
		requestOptions.url = `${httpBasicAuth.host}:${httpBasicAuth.port}`;
	}

	if (endpoint != '') {
		requestOptions.url += endpoint;
	}
	requestOptions.method = method;
	//if (body && body.length > 0) {
	requestOptions.body = body;
	//}
	if (query) {
		requestOptions.qs = query;
	}
	let responseData = await this.helpers.httpRequest(requestOptions);
	returnData.push.apply(returnData, responseData['data']);
	return returnData;
}

async function validateCredentials(this: ICredentialTestFunctions, decryptedCredentials: ICredentialDataDecryptedObject): Promise<any> { // tslint:disable-line:no-any
	const credentials = decryptedCredentials;
	const requestOptions: IHttpRequestOptions = {
		headers: {
			'Accept': 'application/json',
		},
		url: '',
		encoding: 'json',
		json: true,
	};

	if (credentials !== undefined) {
		requestOptions.auth = {
			username: credentials.username as string,
			password: credentials.password as string,
		};
		requestOptions.url = `${credentials.host}:${credentials.port}`;
	}


	requestOptions.url += '/opencell/api/rest/catalog/version';

	requestOptions.method = 'GET';
	//if (body && body.length > 0) {
	//requestOptions.body = body;
	//}

	let responseData = await this.helpers.httpRequest(requestOptions);
	return responseData;
}
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
				testedBy: 'opencellApiTest',
				/*
				displayOptions: {
					show: {
						authentication: [
							'basicAuth',
						],
					},
				},
				*/
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
					{
						name: 'Customer Hierarchy',
						value: 'customerHierarchy',
					},
				],
				default: 'customerHierarchy',
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
				default: '',
				description: 'Primary email for the contact',
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
			// CUSTOMER HIERARCHY
			...customerHierarchyOperations,
			...customerHierarchyFields,
		],
	};

	methods = {
		credentialTest: {
			async opencellApiTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult> {
				const endpoint = '/opencell/api/rest/catalog/version';
				try {
					await validateCredentials.call(this, credential.data as ICredentialDataDecryptedObject);
				} catch (error) {
					const err = error as JsonObject;
					if (err.statusCode === 401) {
						return {
							status: 'Error',
							message: `Invalid credentials`,
						};
					}
				}
				return {
					status: 'OK',
					message: 'Authentication successful',
				};
			},
		},

		loadOptions: {
			async getTitles(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/opencell/api/rest/v2/generic/all/title';
				const titles = await opencellApiGetAllItems.call(this, 'POST', endpoint, {});
				for (const title of titles) {
					//const contactName = `${contact.properties.firstname.value} ${contact.properties.lastname.value}`;
					const titleId = title.id;
					returnData.push({
						name: title.description,
						value: title.code,
					});
				}
				return returnData.sort((a, b) => a.name < b.name ? 0 : 1);
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let responseData;
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		//Get credentials the user provided for this node
		const httpBasicAuth = await this.getCredentials('opencellApi');

		let url: string;
		let requestOptions: IHttpRequestOptions;

		requestOptions = {
			headers: {
				'Accept': 'application/json',
			},
			url: '',
			encoding: 'json',
			json: true,
		};

		if (httpBasicAuth !== undefined) {
			requestOptions.auth = {
				username: httpBasicAuth.user as string,
				password: httpBasicAuth.password as string,
			};
		}


		for (let i = 0; i < items.length; i++) {
			// Add credentials if any are set
			// here we use basic auth

			if (resource === 'contact') {
				if (operation === 'create') {
					// get email input
					const email = this.getNodeParameter('email', i) as string;

					// get additional fields input
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					const data: IDataObject = {
						email,
					};

					Object.assign(data, additionalFields);

					let options = requestOptions;
					options.method = 'PUT';
					options.body = {
						contacts: [
							data,
						],
					};
					options.url = `https://webhook.site/319a03d1-5b87-4b28-bbe4-50a568458d32`;

					responseData = await this.helpers.httpRequest(options);
					returnData.push(responseData);
				}
			}
			else if (resource === 'customerHierarchy') {
				if (operation === 'upsert') {

					const url = `https://webhook.site/319a03d1-5b87-4b28-bbe4-50a568458d32`;

					const crmAccountType = this.getNodeParameter('crmAccountType', i) as string;
					const crmParentCode = this.getNodeParameter('crmParentCode', i) as string;
					const code = this.getNodeParameter('code', i) as string;
					let body: any = {};
					body.crmAccountType = crmAccountType as string;
					body.crmParentCode = crmParentCode as string;
					body.name = this.getNodeParameter('name', i);
					body.address = this.getNodeParameter('address', i);
					body.contactInformation = this.getNodeParameter('contactInformation', i);
					body.contactInformation = this.getNodeParameter('contactInformation', i);
					if (this.getNodeParameter('email', i)) {
						body.email = this.getNodeParameter('email', i);
					}
					if (this.getNodeParameter('language', i)) {
						body.language = this.getNodeParameter('language', i);
					}
					if (this.getNodeParameter('country', i)) {
						body.country = this.getNodeParameter('country', i);
					}
					if (this.getNodeParameter('paymentMethod', i)) {
						body.paymentMethod = this.getNodeParameter('paymentMethod', i);
					}
					if (this.getNodeParameter('customerCategory', i)) {
						body.customerCategory = this.getNodeParameter('customerCategory', i);
					}
					if (this.getNodeParameter('currency', i)) {
						body.currency = this.getNodeParameter('currency', i);
					}
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					if (additionalFields.billingCycle) {
						body.billingCycle = additionalFields.billingCycle;
					}
					if (additionalFields.vatNo) {
						body.vatNo = additionalFields.vatNo;
					}
					if (additionalFields.electronicBilling) {
						body.electronicBilling = additionalFields.electronicBilling;
					}

					responseData = await opencellApiRequest.call(this, requestOptions, 'POST', url, body);
				}
			}
		}

		console.log(returnData);
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
