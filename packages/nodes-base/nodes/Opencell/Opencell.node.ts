import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	ICredentialDataDecryptedObject,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INode,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
} from 'n8n-workflow';

import {
	opencellApi,
} from './GenericFunctions';

import {
	customerHierarchyFields,
	customerHierarchyOperations,
} from './CustomerHierarchyDescription';

import {
	subscriptionFields,
	subscriptionOperations,
} from './SubscriptionDescription';

import {
	genericApiFields,
	genericApiOperations,
} from './GenericApiComponent';

import {
	customFields
} from './CustomFieldsDescription';

async function validateCredentials(this: ICredentialTestFunctions ,decryptedCredentials: ICredentialDataDecryptedObject): Promise<INodeCredentialTestResult> {

	const credentials = decryptedCredentials;
	const requestOptions: IHttpRequestOptions = {
		method: 'GET',
		headers: {Accept: 'application/json',},
		url: '',
		json: true,
	};

	requestOptions.auth = {
		username: credentials.username as string,
		password: credentials.password as string,
	};
	requestOptions.url = `${credentials.host}:${credentials.port}`;
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
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
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
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
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
					{
						name: 'Subscription',
						value: 'subscription',
					},
				],
				default: 'customerHierarchy',
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				noDataExpression: true,
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
						action: 'Create a contact',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
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
			// SUBSCRIPTION
			...subscriptionOperations,
			...subscriptionFields,
			// CUSTOM FIELDS
			...customFields,
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

			async getProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData:INodePropertyOptions[] = [];
				const endpoint = '/opencell/api/rest/v2/generic/all/product';
				const body : IDataObject = {};
				body.limit = 100;
				const apiResponse = await opencellApi.call(this, 'POST', endpoint, body);
					for(const product of apiResponse) {
						returnData.push({
							name: `${product.description}`,
							value: `${product.code}`,
						});
					}
				return returnData.sort((a, b) => a.name < b.name ? 0 : 1);
			},

			async getCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {

				let endpoint:string;
				const returnData: INodePropertyOptions[] = [];

				switch(this.getNode().parameters.resource as string) {
					case 'subscription':
						endpoint = '/opencell/api/rest/entityCustomization/customize/org.meveo.model.billing.Subscription';
						break;
					case 'customerHierarchy':
						endpoint = '/opencell/api/rest/entityCustomization/customize/org.meveo.model.crm.Customer'
						break;
					default:
						throw new NodeApiError(this.getNode(), {error:'This resource doesn\'t support custom fields'});
				}

				const customFields = await opencellApi.call(this, 'GET', endpoint, {});

				if (customFields.entityCustomization.field) {
					for (const cf of customFields.entityCustomization.field) {
						//Generate the list of possible values if relevant (list, checkbox-list, map...)
						let listValues = '';
						if (cf.listValues) {
							listValues = '|';
							for (const key in cf.listValues) {
								if(key) {
									listValues += key + ',';
								}
							}
							listValues = listValues.slice(0,-1); //remove last ','
						}
						returnData.push({
							name: `${cf.description}`,
							value: `${cf.code}|${cf.fieldType}${listValues}`,
						});
					}
					return returnData.sort((a, b) => a.name < b.name ? 0 : 1);
				}
				else {
					throw new NodeApiError(this.getNode(),{error:'Unable to get custom fields.\nServer response:'+customFields});
				}
			},

			async getCustomFieldListValues(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//Get the customFields that have already been fetched, and return the listValues corresponding to the newest item
				//TODO : check consistency. js objects are not ordered : getting the last object in the array might not always return the newest item.
				const returnData: INodePropertyOptions[] = [];
				const customFieldsUI = this.getNodeParameter('customFieldsUI') as IDataObject;
				if (customFieldsUI.customFieldsValues) {
					//Get custom fields as an array
					const customFieldsArray = Object.entries(customFieldsUI.customFieldsValues);
					//Convert the keys from strings to numbers, in order to be able to get the last element
					const customFieldsArrayWithNumericKeys = customFieldsArray.map(([key,value])=>[+key,value]);
					//Get the last element.
					const lastCustomFieldEntry = customFieldsArrayWithNumericKeys.slice(-1)[0][1];
					//The `code` holds data in the following pattern : CODE|TYPE(|LISTVALUES), with the listValues being comma-separated
					const listValues = lastCustomFieldEntry.code.split('|')[2].split(',') as string;

					for (const value of listValues) {
						returnData.push({
							name: `${value}`,
							value: `${value}`,
						});
					}
					return returnData.sort((a, b) => a.name < b.name ? 0 : 1);
				}
				else {
					throw new NodeApiError(this.getNode(),{error:'Custom fields have not been fetched yet.'});
				}
			},

			async getTitles(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/opencell/api/rest/v2/generic/all/title';
				const body : IDataObject = {};
				body.limit = 100;
				const titles = await opencellApi.call(this, 'POST', endpoint, body);
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
				return returnData.sort((a, b) => a.name < b.name ? 0 : 1);
			},
			async getNestedEntities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const entity = this.getNodeParameter('entity') as string;
				const endpoint = `/opencell/api/rest/v2/generic/entities/${entity}`;
				const response = await opencellApi.call(this, 'GET', endpoint, {});
				for (const key of Object.keys(response)) {
					const attribute = response[key];
					if (attribute.isEntity === 'true') {
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
			async getUserAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/opencell/api/rest/v2/generic/all/userAccount';
				const userAccounts = await opencellApi.call(this, 'POST', endpoint, {'genericFields': ['code']});
				for (const userAccount of userAccounts) {
					//const contactName = `${contact.properties.firstname.value} ${contact.properties.lastname.value}`;
					const userAccountId = userAccount.id;
					returnData.push({
						name: userAccount.code,
						value: userAccount.code,
					});
				}
				return returnData.sort((a, b) => a.name < b.name ? 0 : 1);
			},
			async getOfferTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = '/opencell/api/rest/v2/generic/all/offerTemplate';
				const offerTemplates = await opencellApi.call(this, 'POST', endpoint, {'genericFields': ['code']});
				for (const offerTemplate of offerTemplates) {
					//const contactName = `${contact.properties.firstname.value} ${contact.properties.lastname.value}`;
					const userAccountId = offerTemplate.id;
					returnData.push({
						name: offerTemplate.code,
						value: offerTemplate.code,
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

		// type filters = {
		// 	[key: string]: string
		// }

		for (let i = 0; i < items.length; i++) {
			try {
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
						const body: IDataObject = {};
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
						if (additionalFields.description) {
							body.description = additionalFields.description;
						}
						if (additionalFields.externalRef1) {
								body.externalRef1 = additionalFields.externalRef1;
						}
						if (additionalFields.externalRef2) {
								body.externalRef2 = additionalFields.externalRef2;
						}
						if (additionalFields.jobTitle) {
								body.jobTitle = additionalFields.jobTitle;
						}
						if (additionalFields.terminationReason) {
								body.terminationReason = additionalFields.terminationReason;
						}
						if (additionalFields.subscriptionDate) {
								body.subscriptionDate = additionalFields.subscriptionDate;
						}
						if (additionalFields.terminationDate) {
								body.terminationDate = additionalFields.terminationDate;
						}
						if (additionalFields.customerBrand) {
								body.customerBrand = additionalFields.customerBrand;
						}
						if (additionalFields.registrationNo) {
								body.registrationNo = additionalFields.registrationNo;
						}
						if (additionalFields.vatNo) {
								body.vatNo = additionalFields.vatNo;
						}
						if (additionalFields.seller) {
								body.seller = additionalFields.seller;
						}
						if (additionalFields.mandateIdentification) {
								body.mandateIdentification = additionalFields.mandateIdentification;
						}
						if (additionalFields.mandateDate) {
								body.mandateDate = additionalFields.mandateDate;
						}
						if (additionalFields.caStatus) {
								body.caStatus = additionalFields.caStatus;
						}
						if (additionalFields.creditCategory) {
								body.creditCategory = additionalFields.creditCategory;
						}
						if (additionalFields.dateStatus) {
								body.dateStatus = additionalFields.dateStatus;
						}
						if (additionalFields.dateDunningLevel) {
								body.dateDunningLevel = additionalFields.dateDunningLevel;
						}
						if (additionalFields.dunningLevel) {
								body.dunningLevel = additionalFields.dunningLevel;
						}
						if (additionalFields.paymentTerms) {
								body.paymentTerms = additionalFields.paymentTerms;
						}
						if (additionalFields.billingCycle) {
								body.billingCycle = additionalFields.billingCycle;
						}
						if (additionalFields.nextInvoiceDate) {
								body.nextInvoiceDate = additionalFields.nextInvoiceDate;
						}
						if (additionalFields.electronicBilling) {
								body.electronicBilling = additionalFields.electronicBilling;
						}
						if (additionalFields.baStatus) {
								body.baStatus = additionalFields.baStatus;
						}
						if (additionalFields.invoicingThreshold) {
								body.invoicingThreshold = additionalFields.invoicingThreshold;
						}
						if (additionalFields.uaStatus) {
								body.uaStatus = additionalFields.uaStatus;
						}
						if (additionalFields.mailingType) {
								body.mailingType = additionalFields.mailingType;
						}
						if (additionalFields.emailTemplate) {
								body.emailTemplate = additionalFields.emailTemplate;
						}
						if (additionalFields.ccedEmails) {
								body.ccedEmails = additionalFields.ccedEmails;
						}
						if (additionalFields.customerInvoicingThreshold) {
								body.customerInvoicingThreshold = additionalFields.customerInvoicingThreshold;
						}
						if (additionalFields.customerAccountInvoicingThreshold) {
								body.customerAccountInvoicingThreshold = additionalFields.customerAccountInvoicingThreshold;
						}
						if (additionalFields.checkThreshold) {
								body.checkThreshold = additionalFields.checkThreshold;
						}
						if (additionalFields.customerAccountCheckThreshold) {
								body.customerAccountCheckThreshold = additionalFields.customerAccountCheckThreshold;
						}
						if (additionalFields.customerCheckThreshold) {
								body.customerCheckThreshold = additionalFields.customerCheckThreshold;
						}
						if (additionalFields.taxCategoryCode) {
								body.taxCategoryCode = additionalFields.taxCategoryCode;
						}
						if (additionalFields.thresholdPerEntity) {
								body.thresholdPerEntity = additionalFields.thresholdPerEntity;
						}
						if (additionalFields.customerAccountThresholdPerEntity) {
								body.customerAccountThresholdPerEntity = additionalFields.customerAccountThresholdPerEntity;
						}
						if (additionalFields.customerThresholdPerEntity) {
								body.customerThresholdPerEntity = additionalFields.customerThresholdPerEntity;
						}
						if (additionalFields.company) {
								body.company = additionalFields.company;
						}
						responseData = await opencellApi.call(this, 'POST', url, body);
						returnData.push(responseData);
					}
				}
				else if (resource === 'subscription') {
					let url:string;
					let verb:IHttpRequestMethods;
					const body: IDataObject = {};

					if (operation === 'create') {
						verb = 'POST';
						url = `/opencell/api/rest/billing/subscription/subscribeAndInstantiateProducts`;

						body.code = this.getNodeParameter('code', i) as string;
						body.userAccount = this.getNodeParameter('userAccount', i) as string;
						body.offerTemplate = this.getNodeParameter('offerTemplate', i) as string;
						body.renewalRule = this.getNodeParameter('renewalRule',i);
						body.subscriptionDate = this.getNodeParameter('subscriptionDate', i);
						const productToInstantiateDto = this.getNodeParameter('productToInstantiateDto',i) as IDataObject;
						if (productToInstantiateDto) {
							body.productToInstantiateDto = productToInstantiateDto['product'];
						}
					}

					else if (operation === 'update') {
						verb = 'PUT';
						url = `/opencell/api/rest/billing/subscription`;

						body.code = this.getNodeParameter('code', i) as string;
						body.userAccount = this.getNodeParameter('userAccount', i) as string;
						body.offerTemplate = this.getNodeParameter('offerTemplate', i) as string;
						body.renewalRule = this.getNodeParameter('renewalRule',i);
						body.subscriptionDate = this.getNodeParameter('subscriptionDate', i);
					}

					else { // Operation : terminate
						verb = 'POST';
						url = `/opencell/api/rest/billing/subscription/terminate`;

						body.subscriptionCode = this.getNodeParameter('subscriptionCode', i) as string;
						body.terminationReason = this.getNodeParameter('terminationReason', i) as string;
						body.terminationDate = this.getNodeParameter('terminationDate', i) as string;
						if (this.getNodeParameter('subscriptionValidityDate', i)) {
							body.subscriptionValidityDate = this.getNodeParameter('subscriptionValidityDate', i);
						}
					}

					//Parse custom fields if operation is create or update
					if (['create','update'].includes(operation) && this.getNodeParameter('customFieldsUI',i)){
						const customFields = this.getNodeParameter('customFieldsUI',i) as IDataObject;
						const customFieldsValues = customFields.customFieldsValues as IDataObject[];

						//Not all fields should be sent to the api. Only the relevant ones.
						let customFieldsToSend:IDataObject[] = [];

						if(customFieldsValues) {
							for(const cf of customFieldsValues) {

								let currentCf:IDataObject = {
									code:cf.code,
									fieldType: cf.fieldType,
								}

								switch(String(cf.fieldType)) {

									case 'LIST':
									case 'CHECKBOX_LIST':
										//convert list values to the format expected by the api aka "value":[{"value":"VAL1"},{"value":"VAL2"}]
										const valueField = cf.value as string[];
										if(valueField && valueField.toString() !== '') {
											//Multiple values case
											if(Array.isArray(valueField)) {
												const valueList:IDataObject[] = [];
												for(const value of valueField) {
													valueList.push({
														'value':value,
													});
												}
												currentCf.value = valueList;
											}
											//Single values case
											else {
												let value = cf.value
												currentCf.value = [{
													'value':value,
												}];
											}
										}
										break;

									case 'STRING':
									case 'TEXT_AREA':
										currentCf.stringValue = cf.stringValue;
										break;
									case 'DATE':
										currentCf.dateValue = cf.dateValue;
										break;
									case 'BOOLEAN':
										currentCf.booleanValue = cf.booleanValue;
										break;
									case 'LONG':
										currentCf.longValue = cf.longValue;
										break;
									case 'DOUBLE':
										currentCf.doubleValue = cf.doubleValue;
										break;
									default:
										throw new NodeApiError(this.getNode(), {error: `Custom field type unsupported: ${cf.type}`});
								}

								if(cf.code) {
									//Remove everything after | in 'code'
									currentCf.code = String(cf.code).split('|')[0];
								}

								customFieldsToSend.push(currentCf);

							}
						}

						body.customFields = {
							'customField':customFieldsToSend,
						};
					}

					responseData = await opencellApi.call(this, verb, url, body);
					returnData.push(responseData);

					if(['create','update'].includes(operation) && this.getNodeParameter('activate',i)){
						const activateVerb = 'PUT';
						const activateUrl = '/opencell/api/rest/billing/subscription/activate';
						const activateBody = {
							'subscriptionCode':this.getNodeParameter('code', i)
						}
						const activateResponseData = await opencellApi.call(this, activateVerb, activateUrl, activateBody);
						returnData.push(activateResponseData);
						
					}
				}
				// GENERIC API
				else if (resource === 'genericApi') {
					if (operation === 'get') {
						const entity = this.getNodeParameter('entity', i) as string;
						const entiyId = this.getNodeParameter('id', i) as number;
						const url = `/opencell/api/rest/v2/generic/${entity}/${entiyId}`;

						// Update body if nested entities are set
						const nestedEntities = this.getNodeParameter('nestedEntities', i) as string[];
						const body: IDataObject = {};
						body.limit = 100;
						if (nestedEntities.length > 0) {
							body.nestedEntities = nestedEntities;
						}
						responseData = await opencellApi.call(this, 'POST', url, body);
						returnData.push(responseData);
					}
					else if (operation === 'search') {
						const entity = this.getNodeParameter('entity', i) as string;
						const url = `/opencell/api/rest/v2/generic/all/${entity}`;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const body: IDataObject = {};
						if (filters) {
							const filterValues = (filters as IDataObject).filterValues as IDataObject[];
							if (filterValues) {
								const bodyFilters = {} as IDataObject;
								//console.log(filterValues);
								for (const filterValue of filterValues) {
									if (filterValue.key) {
										//console.log(filterValue);
										const key: string = filterValue.key as string;
										bodyFilters[key] = filterValue.value;
									}
								}
								body.filters = bodyFilters;
							}
						}
						responseData = await opencellApi.call(this, 'POST', url, body);
						returnData.push(responseData);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
