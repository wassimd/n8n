import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OpencellApi implements ICredentialType {
	name = 'opencellApi';
	displayName = 'Opencell API';
	documentationUrl = 'opencell';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			required: true,
			type: 'string',
			default: '',
			placeholder: 'localhost',
		},
		{
			displayName: 'Port',
			name: 'port',
			required: true,
			type: 'number',
			default: 80,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
