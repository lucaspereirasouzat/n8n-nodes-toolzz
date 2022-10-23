import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzSpecialities implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Search',
		name: 'ToolzzSpecialities',
		icon: 'file:toolzzShowCourse.svg',
		group: ['transform'],
		version: 1,
		description: 'ToolzzSpecialities',
		defaults: {
			name: 'ToolzzSpecialities',
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
				displayName: 'SubGrupos',
				name: 'subgroups',
				type: 'string' as NodePropertyTypes,
				default: 'Digite os ids dos subgroupos separados por virgula',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const url = this.getNodeParameter('url', 0) as string;
		const subGroups = this.getNodeParameter('subgroups', 0) as string;

		const uri = this.getNodeParameter('uri', 0) as string;

		const query = new URLSearchParams();

		if (subGroups) {
			query.append('subGroups', subGroups);
		}

		const options: OptionsWithUri = {
			method: 'GET',
			headers: {
				url,
				'Content-Type': 'application/json',
			},
			uri: `${uri}/search/filters/specialties?${query.toString()}`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
