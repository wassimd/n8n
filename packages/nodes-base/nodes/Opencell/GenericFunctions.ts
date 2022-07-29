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
	IHttpRequestMethods,
	IHttpRequestOptions,
	IWebhookFunctions,
	NodeApiError
} from 'n8n-workflow';

export async function opencellApi(this: IHookFunctions | IWebhookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: any = {}, query: IDataObject = {}, uri?: string): Promise<any> { // tslint:disable-line:no-any

	const returnData: IDataObject[] = [];

	const requestOptions: OptionsWithUri = {
		method,
		headers: {},
		uri : '',
		body,
		json: true,
	};
	
	if (query) {
		requestOptions.qs = query;
	}

	try {
		const authenticationMethod = this.getNodeParameter('authentication', 0);
		let responseData: any;//@ts-ignore:no-any

		if(authenticationMethod === 'basicAuth') {
			const httpBasicAuth = await this.getCredentials('opencellApi');
			requestOptions.auth = {
				username: httpBasicAuth.username as string,
				password: httpBasicAuth.password as string,
			};
			requestOptions.uri = `${httpBasicAuth.host}:${httpBasicAuth.port}${endpoint}`;
			responseData = await this.helpers.request!(requestOptions);
		}
		else if (authenticationMethod === 'oAuth2') {
			const credentials = await this.getCredentials('opencellOAuth2Api');
			requestOptions.uri = `${credentials.host}:${credentials.port}${endpoint}`;
			responseData = await this.helpers.requestOAuth2!.call(this, 'opencellOAuth2Api', requestOptions, { tokenType: 'Bearer', includeCredentialsOnRefreshOnBody: true });
		}

		// To return an array when it is a generic API get list
		if ('POST' === method && responseData['data'] && responseData['data'].length != null) {
			returnData.push.apply(returnData, responseData['data']);
			return returnData;
		}
		return responseData;
	} catch (error) {
		if (error.response) {
			const errorMessage = error.response.data.message || error.response.data.errorCode || error.response.data.status;
			throw new NodeApiError(this.getNode(), {error : `Opencell error response [${error.response.status}]: ${errorMessage}`});
		}
		throw error;
	}


}
