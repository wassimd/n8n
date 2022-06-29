import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	INodePropertyOptions,
	INodeCredentialTestResult,
	ICredentialDataDecryptedObject,
	JsonObject,
} from 'n8n-workflow';

import {
	opencellApi,
} from './GenericFunctions';

import {
	customerHierarchyFields,
	customerHierarchyOperations,

} from './CustomerHierarchyDescription'

import {
	genericApiFields,
	genericApiOperations,
} from './GenericApiComponent'
import { incidentNoteOperations } from '../PagerDuty/IncidentNoteDescription';
import { threadId } from 'worker_threads';

async function validateCredentials(this: ICredentialTestFunctions ,decryptedCredentials: ICredentialDataDecryptedObject): Promise<any> {

	const credentials = decryptedCredentials;
	const requestOptions: IHttpRequestOptions = {
		method: 'GET',
		headers: {Accept: 'application/json',},
		url: '',
		json: true,
	};

	if (credentials !== undefined) {
		requestOptions.auth = {
			username: credentials.username as string,
			password: credentials.password as string,
		};
		requestOptions.url = `${credentials.host}`; //`${credentials.host}:${credentials.port}`;
	} else {
		throw 'Les credentials ne sont pas définis'
	}

	requestOptions.url += '/opencell/api/rest/catalog/version';
	requestOptions.method = 'GET';

	return await this.helpers.request(requestOptions);
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
				displayOptions: {
					show: {
						authentication: [
							'basicAuth',
						],
					},
				},
			},
			{
				name: 'opencellOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'oAuth2',
						],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Basic Authentication',
						value: 'basicAuth',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'basicAuth',
				description: 'The method of authentication.',
			},
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
					{
						name: 'Generic API',
						value: 'genericApi',
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
			// GENERIC API
			...genericApiOperations,
			...genericApiFields,
		],
	};

	methods = {
		credentialTest: {
			async opencellApiTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult> {
				const endpoint = '/opencell/api/rest/catalog/version';
				try {
					await validateCredentials.call(this, credential.data as ICredentialDataDecryptedObject);
				} catch (error) {
					if(error.statusCode) {
						return {
							status: 'Error',
							message: `Username/password error. Error code : ${error.statusCode}`,
						};
					}
					else if (error.cause) {
						return {
							status: 'Error',
							message: `Host error. Error code : ${error.cause.code}`,
						};
					}
					else {
						return {
							status: 'Error',
							message: `Invalid credentials (unknown error)`,
						};
					}
				}
				return {
					status: 'OK', //OK
					message: 'Authentication successful',
				};
			},
		},

		loadOptions: {
			async getTitles(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/opencell/api/rest/v2/generic/all/title';
				const titles = await opencellApi.call(this, 'POST', endpoint, {});
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
			async getEntities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/opencell/api/rest/v2/generic/entities';
				const response = await opencellApi.call(this, 'GET', endpoint, {});
				for (const entity of response.entities) {
					//const contactName = `${contact.properties.firstname.value} ${contact.properties.lastname.value}`;
					returnData.push({
						name: entity,
						value: entity,
					});
				}

				return returnData.sort((a, b) => a < b ? 0 : 1);
			},
			async getNestedEntities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const entity = this.getNodeParameter('entity') as string;
				const endpoint = `/opencell/api/rest/v2/generic/entities/${entity}`;
				const response = await opencellApi.call(this, 'GET', endpoint, {});
				for (let key of Object.keys(response)) {
					let attribute = response[key];
					if(attribute.isEntity == "true"){
						returnData.push({
							 		name: key,//attribute.shortTypeName,
							 		value: key,
							});
					}
				}
				// for (const entity of response.entities) {
				// 	//const contactName = `${contact.properties.firstname.value} ${contact.properties.lastname.value}`;
				// 	returnData.push({
				// 		name: entity,
				// 		value: entity,
				// 	});
				// }
				return returnData.sort((a, b) => a < b ? 0 : 1);
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const items = this.getInputData();
		let responseData;
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			// Add credentials if any are set
			// here we use basic auth

			if (resource === 'contact') {
				if (operation === 'create') {

				}
			}
			else if (resource === 'customerHierarchy') {
				if (operation === 'upsert') {

					const url = `/opencell/api/rest/account/accountHierarchy/createOrUpdateCRMAccountHierarchy`;

					const crmAccountType = this.getNodeParameter('crmAccountType', i) as string;
					const crmParentCode = this.getNodeParameter('crmParentCode', i) as string;
					let body: any = {};
					body.crmAccountType = crmAccountType as string;
					body.crmParentCode = crmParentCode as string;
					body.code = this.getNodeParameter('code', i) as string;
					body.name = this.getNodeParameter('name', i);
					body.address = this.getNodeParameter('address', i);
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
					if (this.getNodeParameter('description', i)) {
						body.description= this.getNodeParameter('description', i);
					}
					if (this.getNodeParameter('externalRef1', i)) {
							body.externalRef1= this.getNodeParameter('externalRef1', i);
					}
					if (this.getNodeParameter('externalRef2', i)) {
							body.externalRef2= this.getNodeParameter('externalRef2', i);
					}
					if (this.getNodeParameter('jobTitle', i)) {
							body.jobTitle= this.getNodeParameter('jobTitle', i);
					}
					if (this.getNodeParameter('terminationReason', i)) {
							body.terminationReason= this.getNodeParameter('terminationReason', i);
					}
					if (this.getNodeParameter('subscriptionDate', i)) {
							body.subscriptionDate= this.getNodeParameter('subscriptionDate', i);
					}
					if (this.getNodeParameter('terminationDate', i)) {
							body.terminationDate= this.getNodeParameter('terminationDate', i);
					}
					if (this.getNodeParameter('customerBrand', i)) {
							body.customerBrand= this.getNodeParameter('customerBrand', i);
					}
					if (this.getNodeParameter('registrationNo', i)) {
							body.registrationNo= this.getNodeParameter('registrationNo', i);
					}
					if (this.getNodeParameter('vatNo', i)) {
							body.vatNo= this.getNodeParameter('vatNo', i);
					}
					if (this.getNodeParameter('seller', i)) {
							body.seller= this.getNodeParameter('seller', i);
					}
					if (this.getNodeParameter('mandateIdentification', i)) {
							body.mandateIdentification= this.getNodeParameter('mandateIdentification', i);
					}
					if (this.getNodeParameter('mandateDate', i)) {
							body.mandateDate= this.getNodeParameter('mandateDate', i);
					}
					if (this.getNodeParameter('caStatus', i)) {
							body.caStatus= this.getNodeParameter('caStatus', i);
					}
					if (this.getNodeParameter('creditCategory', i)) {
							body.creditCategory= this.getNodeParameter('creditCategory', i);
					}
					if (this.getNodeParameter('dateStatus', i)) {
							body.dateStatus= this.getNodeParameter('dateStatus', i);
					}
					if (this.getNodeParameter('dateDunningLevel', i)) {
							body.dateDunningLevel= this.getNodeParameter('dateDunningLevel', i);
					}
					if (this.getNodeParameter('dunningLevel', i)) {
							body.dunningLevel= this.getNodeParameter('dunningLevel', i);
					}
					if (this.getNodeParameter('paymentTerms', i)) {
							body.paymentTerms= this.getNodeParameter('paymentTerms', i);
					}
					if (this.getNodeParameter('billingCycle', i)) {
							body.billingCycle= this.getNodeParameter('billingCycle', i);
					}
					if (this.getNodeParameter('nextInvoiceDate', i)) {
							body.nextInvoiceDate= this.getNodeParameter('nextInvoiceDate', i);
					}
					if (this.getNodeParameter('electronicBilling', i)) {
							body.electronicBilling= this.getNodeParameter('electronicBilling', i);
					}
					if (this.getNodeParameter('baStatus', i)) {
							body.baStatus= this.getNodeParameter('baStatus', i);
					}
					if (this.getNodeParameter('invoicingThreshold', i)) {
							body.invoicingThreshold= this.getNodeParameter('invoicingThreshold', i);
					}
					if (this.getNodeParameter('uaStatus', i)) {
							body.uaStatus= this.getNodeParameter('uaStatus', i);
					}
					if (this.getNodeParameter('mailingType', i)) {
							body.mailingType= this.getNodeParameter('mailingType', i);
					}
					if (this.getNodeParameter('emailTemplate', i)) {
							body.emailTemplate= this.getNodeParameter('emailTemplate', i);
					}
					if (this.getNodeParameter('ccedEmails', i)) {
							body.ccedEmails= this.getNodeParameter('ccedEmails', i);
					}
					if (this.getNodeParameter('customerInvoicingThreshold', i)) {
							body.customerInvoicingThreshold= this.getNodeParameter('customerInvoicingThreshold', i);
					}
					if (this.getNodeParameter('customerAccountInvoicingThreshold', i)) {
							body.customerAccountInvoicingThreshold= this.getNodeParameter('customerAccountInvoicingThreshold', i);
					}
					if (this.getNodeParameter('checkThreshold', i)) {
							body.checkThreshold= this.getNodeParameter('checkThreshold', i);
					}
					if (this.getNodeParameter('customerAccountCheckThreshold', i)) {
							body.customerAccountCheckThreshold= this.getNodeParameter('customerAccountCheckThreshold', i);
					}
					if (this.getNodeParameter('customerCheckThreshold', i)) {
							body.customerCheckThreshold= this.getNodeParameter('customerCheckThreshold', i);
					}
					if (this.getNodeParameter('taxCategoryCode', i)) {
							body.taxCategoryCode= this.getNodeParameter('taxCategoryCode', i);
					}
					if (this.getNodeParameter('thresholdPerEntity', i)) {
							body.thresholdPerEntity= this.getNodeParameter('thresholdPerEntity', i);
					}
					if (this.getNodeParameter('customerAccountThresholdPerEntity', i)) {
							body.customerAccountThresholdPerEntity= this.getNodeParameter('customerAccountThresholdPerEntity', i);
					}
					if (this.getNodeParameter('customerThresholdPerEntity', i)) {
							body.customerThresholdPerEntity= this.getNodeParameter('customerThresholdPerEntity', i);
					}
					if (this.getNodeParameter('company', i)) {
							body.company= this.getNodeParameter('company', i);
					}
					responseData = await opencellApi.call(this, 'POST', url, body);
					returnData.push(responseData);
				}
			}

			else if(resource === 'genericApi'){
				if (operation === 'get') {
					const entity = this.getNodeParameter('entity', i) as string;
					const entiyId = this.getNodeParameter('id', i) as number;
					const url = `/opencell/api/rest/v2/generic/${entity}/${entiyId}`;

					// Update body if nested entities are set
					const nestedEntities = this.getNodeParameter('nestedEntities', i) as string[];
					const body : IDataObject = {};
					if(nestedEntities.length > 0){
						body.nestedEntities = nestedEntities;
					}
					responseData = await opencellApi.call(this, 'POST', url, body);
					returnData.push(responseData);
				}
			}
		}

		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
