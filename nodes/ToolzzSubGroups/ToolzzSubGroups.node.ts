import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzSubGroups implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz SubGroups',
		name: 'ToolzzSubGroups',
		icon: 'file:toolzzShowCourse.svg',
		group: ['transform'],
		version: 1,
		description: 'ToolzzSubGroups',
		defaults: {
			name: 'ToolzzSubGroups',
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
			{
				displayName: 'Grupos',
				name: 'groups',
				type: 'string' as NodePropertyTypes,
				default: 'Digite os ids grupos separados por virgula',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const url = this.getNodeParameter('url', 0) as string;
		const groups = this.getNodeParameter('groups', 0) as string;

		const uri = this.getNodeParameter('uri', 0) as string;

		const query = new URLSearchParams();

		if (groups) {
			query.append('groups', groups);
		}

		const options: OptionsWithUri = {
			method: 'GET',
			headers: {
				url,
				'Content-Type': 'application/json',
			},
			uri: `${uri}/search/filters/subgroups?${query.toString()}`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
