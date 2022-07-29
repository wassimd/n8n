import { INodeProperties } from "n8n-workflow";

export const customFields: INodeProperties[] = [ {
    displayName: 'Custom Fields',
    name: 'customFieldsUI',
    placeholder: 'Add Custom Field',
    type: 'fixedCollection',
    typeOptions: {
        multipleValues: true,
        loadOptionsDependsOn: ['opencellOAuth2Api','opencellApi','resource'],
    },
    displayOptions: {
        show: {
            resource: [
                'customerHierarchy',
                'subscription',
            ],
            operation: [
                'create',
                'update',
                'upsert',
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
                        loadOptionsDependsOn: ['resource'],
                    },
                    default: '',
                    description: 'Name of the field. . Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
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
}]