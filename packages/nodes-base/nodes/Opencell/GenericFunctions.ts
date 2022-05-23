import {
	OptionsWithUri,
} from 'request';

import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject,
	IHookFunctions,
	IWebhookFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';

export async function TestApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, query: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	const credentials = await this.getCredentials('autofriendApi') as IDataObject;

	const apiKey = credentials.apiKey;

	const endpoint = 'https://api2.autopilothq.com/v1';

	const options: OptionsWithUri = {
			headers: {
					'Content-Type': 'application/json',
					autopilotapikey: apiKey,
			},
			method,
			body,
			qs: query,
			uri: uri || `${endpoint}${resource}`,
			json: true,
	};
	if (!Object.keys(body).length) {
			delete options.body;
	}
	if (!Object.keys(query).length) {
			delete options.qs;
	}

	try {
			return await this.helpers.request!(options);
	} catch (error) {
			if (error.response) {
					const errorMessage = error.response.body.message || error.response.body.description || error.message;
					throw new Error(`Autopilot error response [${error.statusCode}]: ${errorMessage}`);
			}
			throw error;
	}
}

export async function opencellGenericApi(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: any = {}, query: IDataObject = {}, uri?: string): Promise<any> { // tslint:disable-line:no-any
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
	if('POST' === method && Object.keys(responseData['data']).length){
		returnData.push.apply(returnData, responseData['data']);
		return returnData;
	}

	return responseData;

}

export async function opencellApi(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: any = {}, query: IDataObject = {}, uri?: string): Promise<any> { // tslint:disable-line:no-any
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

	// To return an array when it is a generic API get list
	if('POST' === method && responseData['data']){
		returnData.push.apply(returnData, responseData['data']);
		return returnData;
	}
	return responseData;

}
