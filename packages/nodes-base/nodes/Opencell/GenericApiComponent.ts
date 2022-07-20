import {
	INodeProperties,
} from 'n8n-workflow';

type name = {
	title: string,
	firstName: string,
	lastName: string,
};

export const genericApiOperations: INodeProperties[] = [
	{
		displayName: 'Entity Name or ID',
		name: 'entity',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'genericApi',
				],
			},
		},
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getEntities',
		},
		description: 'Choose the Entity. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'genericApi',
				],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact',
				action: 'Get a contact',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all contacts',
				action: 'Get all contacts',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search contacts',
				action: 'Search contacts',
			},
		],
		default: 'get',
	},
];


export const genericApiFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'genericApi',
				],
				operation: [
					'get',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Nested Entity Names or IDs',
		name: 'nestedEntities',
		type: 'multiOptions',
		description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
		displayOptions: {
			show: {
				resource: [
					'genericApi',
				],
				operation: [
					'get',
					'search',
				],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getNestedEntities',
			loadOptionsDependsOn: ['entity'],
		},
		default: [],
	},
	{
		displayName: 'Filters',
		name: 'filters',
		placeholder: 'Add Filter',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: [
					'genericApi',
				],
				operation: [
					'search',
				],
			},
		},
		options: [
			{
				name: 'filterValues',
				displayName: 'Filter',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Key of the filter to add',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value to set for the filter key',
					},
				],
			},
		],
	},
];
