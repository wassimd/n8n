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
		displayName: 'Entity',
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
		description: `Choose the Entity.`,
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
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
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all contacts',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search contacts',
			},
		],
		default: 'get',
		description: 'The operation to perform.',
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
		displayName: 'Nested Entities',
		name: 'nestedEntities',
		type: 'multiOptions',
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
		typeOptions: {
			loadOptionsMethod: 'getNestedEntities',
			loadOptionsDependsOn: ['entity'],
		},
		default: [],
	},
];
