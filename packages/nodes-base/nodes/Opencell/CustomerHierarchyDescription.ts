import {
	IDataObject,
	INodeProperties,
	INodePropertyOptions,
	INodePropertyCollection,
} from 'n8n-workflow';
import { threadId } from 'worker_threads';

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
		noDataExpression: true,
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
		required: true,
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
		required: true,
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
				default: 0,
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
		required: true,
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
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Mobile',
				name: 'mobile',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Fax',
				name: 'fax',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Contact Address',
				name:'address',
				type:'collection',
				default: {},
				options: [
					{
						displayName: 'Address',
						name: 'address1',
						type: 'string',
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
					{
						displayName: 'Zip Code',
						name: 'zipCode',
						type: 'number',
						default: 0,
					},
				],
			},
		],
	},

	{
		displayName: 'E-mail',
		name: 'email',
		type: 'string',
		required: true,
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
		required: true,
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
		required: true,
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
		required: true,
		type: 'options',
					options: [
						{
							name: 'Check',
							value: 'CHECK',
						},
						{
							name: 'Direct Debit',
							value: 'DIRECTDEBIT',
						},
						{
							name: 'Wire Transfer',
							value: 'WIRETRANSFER',
						},
						{
							name: 'Credit Card',
							value: 'CARD',
						},
						{
							name: 'PayPal',
							value: 'PAYPAL',
						},
						{
							name: 'Stripe',
							value: 'STRIPE',
						},
						{
							name: 'Cash',
							value: 'CASH',
						},
					],
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
	},
	{
		displayName: 'Customer Category',
		name: 'customerCategory',
		required: true,
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
		required: true,
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
			// Specific DTOs (auto-generated)
			{
				displayName: 'Bank Coordinates',
				name: 'bankCoordinates',
				type: 'collection',
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
						displayName: 'Account Number',
						name: 'accountNumber',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Bank Code',
						name: 'bankCode',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Branch Code',
						name: 'branchCode',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
					},
					{
						displayName: 'IBAN',
						name: 'iban',
						type: 'string',
						default: '',
					},
					{
						displayName: 'BIC',
						name: 'bic',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Account Owner',
						name: 'accountOwner',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Bank Name',
						name: 'bankName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Bank ID',
						name: 'bankId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Issuer Number',
						name: 'issuerNumber',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Issuer Name',
						name: 'issuerName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'ICS',
						name: 'ics',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Empty',
						name: 'empty',
						type: 'boolean',
						default: false,
					},
				],
			},
			{
				displayName: 'Minimum Amount',
				name: 'minimumAmountEl',
				type: 'collection',
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
						displayName: 'Customer Minimum Amount',
						name: 'customerMinimumAmountEl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Customer Minimum Label',
						name: 'customerMinimumLabelEl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Customer Minimum Target Account',
						name: 'customerMinimumTargetAccount',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Customer Account Minimum Amount',
						name: 'customerAccountMinimumAmountEl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Customer Account Minimum Label',
						name: 'customerAccountMinimumLabelEl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Customer Account Minimum Target Account',
						name: 'customerAccountMinimumTargetAccount',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Billing Account Minimum Amount',
						name: 'billingAccountMinimumAmountEl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Billing Account Minimum Label',
						name: 'billingAccountMinimumLabelEl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'User Account Minimum Amount',
						name: 'userAccountMinimumAmountEl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'User Account Minimum Label',
						name: 'userAccountMinimumLabelEl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Customer Minimum Charge Template',
						name: 'customerMinimumChargeTemplate',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Customer Account Minimum Charge Template',
						name: 'customerAccountMinimumChargeTemplate',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Billing Account Minimum Charge Template',
						name: 'billingAccountMinimumChargeTemplate',
						type: 'string',
						default: '',
					},
					{
						displayName: 'User Account Minimum Charge Template',
						name: 'userAccountMinimumChargeTemplate',
						type: 'string',
						default: '',
					},
				],
			},
			// Auto generated
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
					displayName: 'External Reference 1',
					name: 'externalRef1',
					type: 'string',
					default: '',
			},
			{
					displayName: 'External Reference 2',
					name: 'externalRef2',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Job Title',
					name: 'jobTitle',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Termination Reason',
					name: 'terminationReason',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Subscription Date',
					name: 'subscriptionDate',
					type: 'dateTime',
					default: '',
			},
			{
					displayName: 'Termination Date',
					name: 'terminationDate',
					type: 'dateTime',
					default: '',
			},
			{
					displayName: 'Customer Brand',
					name: 'customerBrand',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Registration Number',
					name: 'registrationNo',
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
					displayName: 'Seller',
					name: 'seller',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Mandate Identification',
					name: 'mandateIdentification',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Mandate Date',
					name: 'mandateDate',
					type: 'dateTime',
					default: '',
			},
			{
					displayName: 'CA Status',
					name: 'caStatus',
					type: 'options',
					options: [
						{
							name: 'Active',
							value: 'ACTIVE',
						},
						{
							name: 'Close',
							value: 'CLOSE',
						},
					],
					default: {},
			},
			{
					displayName: 'Credit Category',
					name: 'creditCategory',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Date Status',
					name: 'dateStatus',
					type: 'dateTime',
					default: '',
			},
			{
					displayName: 'Date Dunning Level',
					name: 'dateDunningLevel',
					type: 'dateTime',
					default: '',
			},
			{
					displayName: 'Dunning Level',
					name: 'dunningLevel',
					type: 'options',
					options: [
						{
							name: '0',
							value: 'R0',
						},
						{
							name: '1',
							value: 'R1',
						},
						{
							name: '2',
							value: 'R2',
						},
						{
							name: '3',
							value: 'R3',
						},
						{
							name: '4',
							value: 'R4',
						},
						{
							name: '5',
							value: 'R5',
						},
						{
							name: '6',
							value: 'R6',
						},
					],
					default: 'R0',
			},
			{
					displayName: 'Payment Terms',
					name: 'paymentTerms',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Billing Cycle',
					name: 'billingCycle',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Next Invoice Date',
					name: 'nextInvoiceDate',
					type: 'dateTime',
					default: '',
			},
			{
					displayName: 'Electronic Billing',
					name: 'electronicBilling',
					type: 'boolean',
					default: false,
			},
			{
					displayName: 'BA Status',
					name: 'baStatus',
					type: 'options',
					options: [
						{
							name:'Active',
							value:'ACTIVE',
						},
						{
							name:'Canceled',
							value:'CANCELED',
						},
						{
							name:'Terminated',
							value:'TERMINATED',
						},
						{
							name:'Closed',
							value:'CLOSED',
						},
					],
					default: 'ACTIVE',
			},
			{
					displayName: 'Invoicing Threshold',
					name: 'invoicingThreshold',
					type: 'number',
					default: 0,
			},
			{
					displayName: 'UA Status',
					name: 'uaStatus',
					type: 'options',
					options: [
						{
							name:'Active',
							value:'ACTIVE',
						},
						{
							name:'Canceled',
							value:'CANCELED',
						},
						{
							name:'Terminated',
							value:'TERMINATED',
						},
						{
							name:'Closed',
							value:'CLOSED',
						},
					],
					default: 'ACTIVE',
			},
			{
					displayName: 'Mailing Type',
					name: 'mailingType',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Email Template',
					name: 'emailTemplate',
					type: 'string',
					default: '',
			},
			{
					displayName: 'CCED Emails',
					name: 'ccedEmails',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Customer Invoicing Threshold',
					name: 'customerInvoicingThreshold',
					type: 'number',
					default: 0,
			},
			{
					displayName: 'Customer Account Invoicing Threshold',
					name: 'customerAccountInvoicingThreshold',
					type: 'number',
					default: 0,
			},
			{
					displayName: 'Check Threshold',
					name: 'checkThreshold',
					type: 'options',
					options: [
						{
							name:'Before Discount',
							value:'BEFORE_DISCOUNT',
						},
						{
							name:'After Discount',
							value:'AFTER_DISCOUNT',
						},
						{
							name:'Positive Rated Transaction',
							value:'POSITIVE_RT',
						},
						{
							name:'Positive Invoice Line',
							value:'POSITIVE_IL',
						},
					],
					default: 'BEFORE_DISCOUNT',
			},
			{
					displayName: 'Customer Account Check Threshold',
					name: 'customerAccountCheckThreshold',
					type: 'options',
					options: [
						{
							name:'Before Discount',
							value:'BEFORE_DISCOUNT',
						},
						{
							name:'After Discount',
							value:'AFTER_DISCOUNT',
						},
						{
							name:'Positive Rated Transaction',
							value:'POSITIVE_RT',
						},
						{
							name:'Positive Invoice Line',
							value:'POSITIVE_IL',
						},
					],
					default: 'BEFORE_DISCOUNT',
			},
			{
					displayName: 'Customer Check Threshold',
					name: 'customerCheckThreshold',
					type: 'options',
					options: [
						{
							name:'Before Discount',
							value:'BEFORE_DISCOUNT',
						},
						{
							name:'After Discount',
							value:'AFTER_DISCOUNT',
						},
						{
							name:'Positive Rated Transaction',
							value:'POSITIVE_RT',
						},
						{
							name:'Positive Invoice Line',
							value:'POSITIVE_IL',
						},
					],
					default: 'BEFORE_DISCOUNT',
			},
			{
					displayName: 'Tax Category Code',
					name: 'taxCategoryCode',
					type: 'string',
					default: '',
			},
			{
					displayName: 'Threshold Per Entity',
					name: 'thresholdPerEntity',
					type: 'boolean',
					default: false,
			},
			{
					displayName: 'Customer Account Threshold Per Entity',
					name: 'customerAccountThresholdPerEntity',
					type: 'boolean',
					default: false,
			},
			{
					displayName: 'Customer Threshold Per Entity',
					name: 'customerThresholdPerEntity',
					type: 'boolean',
					default: false,
			},
			{
					displayName: 'Company',
					name: 'company',
					type: 'boolean',
					default: false,
			},
		// End of auto generated fields
		],
	},
];
