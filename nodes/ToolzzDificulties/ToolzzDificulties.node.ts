import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzDificulties implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Dificulties',
		name: 'ToolzzDificulties',
		icon: 'file:toolzzShowCourse.svg',
		group: ['transform'],
		version: 1,
		description: 'ToolzzDificulties',
		defaults: {
			name: 'ToolzzDificulties',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			{
				displayName: 'Url of Institution',
				name: 'url',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Ambiente',
				name: 'uri',
				type: 'options',
				options: [
					{
						name: 'Prod',
						value: 'https://gateway.api.toolzz.com.br',
					},
				],
				default: 'https://gateway.api.toolzz.com.br', // The initially selected option
				description: 'Selecione o ambiente',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const url = this.getNodeParameter('url', 0) as string;

		const uri = this.getNodeParameter('uri', 0) as string;

		const options: OptionsWithUri = {
			method: 'GET',
			headers: {
				url,
				'Content-Type': 'application/json',
			},
			uri: `${uri}/search/filters/dificulties`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
