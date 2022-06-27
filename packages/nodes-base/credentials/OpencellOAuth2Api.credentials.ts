import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class OpencellOAuth2Api implements ICredentialType {
	name = 'opencellOAuth2Api';
	extends = [
		'oAuth2Api',
	];
	displayName = 'Opencell OAuth2 API';
	documentationUrl = 'opencell';
	properties: INodeProperties[] = [
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://wda.d2.opencell.work/auth/realms/opencell/protocol/openid-connect/auth',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://wda.d2.opencell.work/auth/realms/opencell/protocol/openid-connect/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'openid',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}
