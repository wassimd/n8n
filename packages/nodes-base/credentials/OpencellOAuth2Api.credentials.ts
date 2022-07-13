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
			displayName: 'Host',
			name: 'host',
			type:'string',
			default:'https://wda.d2.opencell.work',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: `{{$self["opencellAuthUrl"]}}/auth/realms/opencell/protocol/openid-connect/auth`,
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: '{{$self["opencellAuthUrl"]}}/auth/realms/opencell/protocol/openid-connect/token',
			required: true,
		},
		{
			displayName: 'Port',
			name:'port',
			type:'number',
			default:'80',
			required: false,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'openid',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'string',
			default: 'body',
		},
	];
}
