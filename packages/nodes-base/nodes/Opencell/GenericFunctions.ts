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

export async function opencellApi(this: IHookFunctions | IWebhookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: any = {}, query: IDataObject = {}, uri?: string): Promise<any> { // tslint:disable-line:no-any
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
	try {
		let responseData = await this.helpers.httpRequest(requestOptions);
		console.log(responseData);

		// To return an array when it is a generic API get list
		if ('POST' === method && responseData['data'] && responseData['data'].length != null) {
			returnData.push.apply(returnData, responseData['data']);
			return returnData;
		}
		return responseData;
	} catch (error) {
		console.log(error);
		if (error.response) {
			const errorMessage = error.response.data.message || error.response.data.errorCode || error.response.data.status;
			throw new Error(`Opencell error response [${error.response.status}]: ${errorMessage}`);
		}
		throw error;
	}


}
