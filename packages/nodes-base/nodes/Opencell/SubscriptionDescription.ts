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
		description: 'Choose the the user account to subscribe. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
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
		description: 'Choose the subscription offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
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
				],
				default: 'RECURRING',
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
						default:'',
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
				],
			},
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
	/* {
		displayName: 'Custom Fields',
		name: 'customFieldsUI',
		placeholder: 'Add Custom Field',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			loadOptionsDependsOn: ['opencellOAuth2Api','opencellApi'],
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
		default: {},
		options: [
			{
				name: 'customFieldsValues',
				displayName: 'Custom Field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'code',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getCustomFields',
						},
						default: '',
						description: 'Name of the field. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
					},
					{
						//This is used to determine the type of the value field
						displayName:'Field Type',
						name:'fieldType',
						type:'hidden',
						default: `={{$parameter["&code"].split("|")[1]}}`,
						//default: `={{$parameter["customFieldsUI"]["customFieldsValues"][0]["field"].split("|")[1]}}`,
					},
					{
						displayName: 'List Value Name or ID',
						name:'value',
						type:'options',
						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
						default: '',
						typeOptions: {
							loadOptionsMethod: 'getCustomFieldListValues',
						},
						displayOptions: {
							show:{
								fieldType:['LIST'],
							},
						},
					},
					{
						displayName: 'Checkbox List Value Names or IDs',
						name:'value',
						type:'multiOptions',
						description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
						typeOptions: {
							loadOptionsMethod: 'getCustomFieldListValues',
						},
						displayOptions: {
							show:{
								fieldType:['CHECKBOX_LIST'],
							},
						},
						default: [],
					},
					{
						displayName: 'String',
						name: 'stringValue',
						type: 'string',
						default: '',
						description: 'Text value of the field',
						displayOptions: {
							show:{
								fieldType:['STRING'],
							},
						},
					},
					{
						displayName: 'Text Area',
						name: 'stringValue',
						type: 'string',
						default: '',
						description: 'Text value of the field',
						typeOptions: {
							alwaysOpenEditWindow:true,
						},
						displayOptions: {
							show:{
								fieldType:['TEXT_AREA'],
							},
						},
					},
					{
						displayName: 'Date',
						name: 'dateValue',
						type: 'dateTime',
						default: new Date().setHours(0,0,0,0),
						description: 'Date value of the field',
						displayOptions: {
							show:{
								fieldType:['DATE'],
							},
						},
					},
					{
						displayName: 'Boolean',
						name: 'booleanValue',
						type: 'boolean',
						default:false,
						description: 'Whether the custom field is true or not',
						displayOptions: {
							show:{
								fieldType:['BOOLEAN'],
							},
						},
					},
					{
						displayName: 'Number (Long)',
						name: 'longValue',
						type: 'number',
						default:0,
						description: 'Number value of the field',
						displayOptions: {
							show:{
								fieldType:['LONG'],
							},
						},
					},
					{
						displayName: 'Number (Double)',
						name: 'doubleValue',
						type: 'number',
						default:0,
						description: 'Number value of the field',
						displayOptions: {
							show:{
								fieldType:['DOUBLE'],
							},
						},
					},
				],
			},
		],
	}, */
];
