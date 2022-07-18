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
		noDataExpression: true,
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
				name: 'Create & Instantiate',
				value: 'create',
				description: 'Create subscription & Instantiate products',
				action: 'Create & Instantiate a subscription',
			},
			{
				name: 'Terminate',
				value: 'terminate',
				description: 'Terminate a subscription',
				action: 'Terminate a subscription',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a subscription',
				action: 'Update a subscription',
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
	},
];

export const subscriptionFields: INodeProperties[] = [
	//Create and instantiate
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
		displayName: 'User Account Name or ID',
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
		description: 'Choose the the user account to subscribe. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Offer Template Name or ID',
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
		description: 'Choose the subscription offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Renewal Rule',
		name:'renewalRule',
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
		type:'collection',
		options:[
			{
				displayName: 'Initially Active For Unit',
				name: 'initialyActiveForUnit',
				type:'options',
				options: [
					{
						name: 'Month',
						value: 'MONTH',
					},
					{
						name: 'Day',
						value: 'DAY',
					},
				],
				default: 'DAY',
			},
			{
				displayName: 'Auto Renew',
				name:'autoRenew',
				type: 'boolean',
				default:false,
			},
			{
				displayName: 'Extend Agreement Period to Subscribed Till Date',
				name: 'extendAgreementPeriodToSubscribedTillDate',
				type: 'boolean',
				default: false,
			},
			{
				displayName:'End Of Term Action',
				name:'endOfTermAction',
				type:'options',
				options: [
					{
						name: 'Suspend',
						value: 'SUSPEND',
					},
					{
						name: 'Terminate',
						value: 'TERMINATE',
					},
				],
				default: 'SUSPEND',
			},
			{
				displayName:'Renewal Term Type',
				name:'renewalTermType',
				type:'options',
				options: [
					{
						name: 'Recurring',
						value: 'RECURRING',
					},
					{
						name: 'Calendar',
						value: 'CALENDAR',
					},
					{
						name: 'Fixed',
						value: 'FIXED',
					},
				],
				default: 'FIXED',
			},
			{
				displayName: 'Renew For Unit',
				name: 'renewForUnit',
				type:'options',
				options: [
					{
						name: 'Day',
						value: 'DAY',
					},
					{
						name: 'Month',
						value: 'MONTH',
					},
				],
				default: 'DAY',
			},
		],
		default:{},
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
					'update',
				],
			},
		},
		description: 'Choose the subscription Date',
		required: true,
	},
	{
		displayName: 'Product to Instantiate',
		name: 'productToInstantiateDto',
		type: 'fixedCollection',
		required:true,
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
				operation: [
					'create',
				],
			},
		},
		placeholder: 'Add Product',
		options: [
			{
				name: 'product',
				displayName: 'Product',
				values: [
					{
						displayName: 'Product Code',
						name: 'productCode',
						required: true,
						type: 'string',
						default:"",
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default:1,
					},
					{
						displayName: 'Delivery Date',
						name: 'deliveryDate',
						type: 'dateTime',
						default:new Date().setHours(0,0,0,0),
					},
				]
			}
			/// TODO : attribute Instances (gros DTO)
		],
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
				],
			},
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
				],
			},
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
				],
			},
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
				],
			},
		},
		required: true,
	},

];
