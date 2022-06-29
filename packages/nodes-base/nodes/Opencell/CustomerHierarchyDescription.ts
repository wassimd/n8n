import {
	INodeProperties,
} from 'n8n-workflow';

type name = {
	title: string,
	firstName: string,
	lastName: string,
};

export const customerHierarchyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
			},
		},
		options: [
			{
				name: 'Create/Update',
				value: 'upsert',
				description: 'Create/Update a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all contacts',
			},
			{
				name: 'Get Recently Created/Updated',
				value: 'getRecentlyCreatedUpdated',
				description: 'Get recently created/updated contacts',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search contacts',
			},
		],
		default: 'upsert',
		description: 'The operation to perform.',
	},
];

export const customerHierarchyFields: INodeProperties[] = [
	{
		displayName: 'Account Type',
		name: 'crmAccountType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
		options: [
			{
				name: 'Seller',
				value: 'S',
			},
			{
				name: 'Cust 2 UA',
				value: 'C_UA',
				description: 'Creates Customer, Customer Account, Billing Account, User Account'
			},
			{
				name: 'S and  C',
				value: 'S_C',
				description: 'Creates Seller and Customer'
			},
			{
				name: 'Customer',
				value: 'C',
			},
			// to complete
		],
		default: 'C_UA',
		description: `Specify which form hierarchy would you create/update.`,
	},
	{
		displayName: 'Parent Code',
		name: 'crmParentCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
					'delete',
					'get'
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getTitles',
				},
				description: `Choose the title/civility of the customer.`,
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
		options: [
			{
				displayName: 'Address',
				name: 'address1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Zip Code',
				name: 'zipCode',
				type: 'number',
				default: '',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Contact Information',
		name: 'contactInformation',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
		options: [
			{
				displayName: 'E-mail',
				name: 'email',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Mobile',
				name: 'mobile',
				type: 'string',
				default: '',
			},
		],
	},

	{
		displayName: 'E-mail',
		name: 'email',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
	},
	{
		displayName: 'paymentMethod',
		name: 'paymentMethod',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
	},
	{
		displayName: 'Customer Category',
		name: 'customerCategory',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
	},
/*	{
		displayName: 'Metadata',
		name: 'metadataUi',
		placeholder: 'Add Metadata',
		type: 'fixedCollection',
		default: '',
		typeOptions: {
			multipleValues: true,
		},
		description: '',
		options: [
			{
				name: 'metadataValues',
				displayName: 'Metadata',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: 'Name of the metadata key to add.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value to set for the metadata key.',
					},
				],
			},
		],
	},
	{
		displayName: 'Address2',
		name: 'address2',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'options',
				options: [
					{
						name: 'Automated',
						value: 'automated',
					},
					{
						name: 'Past',
						value: 'past',
					},
					{
						name: 'Upcoming',
						value: 'upcoming',
					},
				],
				default: '',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: ''
			},

		],
	},*/
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'customerHierarchy',
				],
				operation: [
					'upsert',
				],
			},
		},
		options: [


			{
				displayName: 'Billing Cycle',
				name: 'billingCycle',
				type: 'string',
				default: '',
			},
			{
				displayName: 'VAT Number',
				name: 'vatNo',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Electronic Billing',
				name: 'electronicBilling',
				type: 'boolean',
				default: '',
			},
		],
	},
];
