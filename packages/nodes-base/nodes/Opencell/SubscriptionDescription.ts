import { now } from 'moment';
import {
	INodeProperties,
} from 'n8n-workflow';

type name = {
	title: string,
	firstName: string,
	lastName: string,
};

export const subscriptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
			},
		},
		options: [
			{
				name: 'Create & Instanciate',
				value: 'create',
				description: 'Create subscription & Instanciate products',
			},
			{
				name: 'Terminate',
				value: 'terminate',
				description: 'Terminate a subscription',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a subscription',
			},
			// {
			// 	name: 'Get All',
			// 	value: 'getAll',
			// 	description: 'Get all contacts',
			// },
			// {
			// 	name: 'Get Recently Created/Updated',
			// 	value: 'getRecentlyCreatedUpdated',
			// 	description: 'Get recently created/updated contacts',
			// },
			// {
			// 	name: 'Search',
			// 	value: 'search',
			// 	description: 'Search contacts',
			// },
		],
		default: 'create',
		description: 'The operation to perform on the Subscription',
	},
];

export const subscriptionFields: INodeProperties[] = [
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
				operation: [
					'create',
					'delete',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'User Account',
		name: 'userAccount',
		type: 'options',
		default: '',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getUserAccounts',
		},
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
				operation: [
					'create',
					'delete',
				],
			},
		},
		description: 'Choose the the user account to subscribe',
	},
	{
		displayName: 'Offer Template',
		name: 'offerTemplate',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getOfferTemplates',
		},
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
				operation: [
					'create',
					'delete',
				],
			},
		},
		required: true,
		description: 'Choose the subscription offer',
	},
	{
		displayName: 'Subscription Date',
		name: 'subscriptionDate',
		type: 'dateTime',
		default: new Date().setHours(0,0,0,0),
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
				operation: [
					'create',
					'delete',
				],
			},
		},
		description: 'Choose the subscription Date',
	},
	/*
	{
		displayName: 'Custom Fields',
		name: 'customFieldsUI',
		placeholder: 'Add Custom Field',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		options: [
			{
				name: 'customFieldsValues',
				displayName: 'Custom Fields',
				values: [
					{
						displayName: 'Field',
						name: 'field',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getCustomFields',
						},
						default: '',
						description: 'Name of the field',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the field',
					},
				],
			},
		],
	},
	*/
];
