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
		description: 'The operation to perform.',
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
					'update',
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
					'update',
				],
			},
		},
		description: `Choose the the user account to subscribe.`,
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
					'update',
				],
			},
		},
		required: true,
		description: `Choose the subscription offer.`,
	},
	// versionNumber
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
					'update',
				],
			},
		},
		description: `Choose the subscription Date.`,
	},

	//Termination
	{
		displayName: 'Subscription Code',
		name: 'subscriptionCode',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
				operation: [
					'terminate',
				]
			}
		},
		required: true,
	},
	{
		displayName: 'Subscription Validity Date',
		name: 'subscriptionValidityDate',
		type: 'dateTime',
		default: new Date().setHours(0,0,0,0),
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
				operation: [
					'terminate',
				]
			}
		},
	},
	{
		displayName: 'Termination Reason',
		name: 'terminationReason',
		type: 'options',
		default: 'TERM_REASON_1',
		options: [
			{
				name: 'Agreement Reimbursement Charge',
				value: 'TERM_REASON_1',
			},
			{
				name: 'Agreement',
				value: 'TERM_REASON_2',
			},
			{
				name: 'Charge',
				value: 'TERM_REASON_3',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
				operation: [
					'terminate',
				]
			}
		},
		required: true,
	},
	{
		displayName: 'Termination Date',
		name: 'terminationDate',
		type: 'dateTime',
		default: new Date().setHours(0,0,0,0),
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
				operation: [
					'terminate',
				]
			}
		},
		required: true,
	},

];
