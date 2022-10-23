import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzSearch implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Search',
		name: 'ToolzzSearch',
		icon: 'file:toolzzShowCourse.svg',
		group: ['transform'],
		version: 1,
		description: 'ToolzzSearch',
		defaults: {
			name: 'ToolzzSearch',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			{
				displayName: 'Url',
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
				displayName: 'Pesquisar',
				name: 'search',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Grupos',
				name: 'groups',
				type: 'string' as NodePropertyTypes,
				default: 'Digite os ids grupos separados por virgula',
			},
			{
				displayName: 'Sub Grupos',
				name: 'subgroups',
				type: 'string' as NodePropertyTypes,
				default: 'Digite os ids sub grupos separados por virgula',
			},
			{
				displayName: 'Especialidades',
				name: 'especialities',
				type: 'string' as NodePropertyTypes,
				default: 'Digite os ids especialidades separados por virgula',
			},
			{
				displayName: 'Tipos De Conteudos',
				name: 'contentType',
				type: 'string' as NodePropertyTypes,
				default: 'Digite os ids tipos de conteudos separados por virgula',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string' as NodePropertyTypes,
				default: 'Digite as tags separados por virgula',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const url = this.getNodeParameter('url', 0) as string;

		const uri = this.getNodeParameter('uri', 0) as string;

		const query = new URLSearchParams();

		const search = this.getNodeParameter('search', 0) as string;

		if (search) {
			query.append('search', search);
		}
		const groups = this.getNodeParameter('groups', 0) as string;

		if (groups) {
			query.append('groups', groups);
		}
		const subgroups = this.getNodeParameter('subgroups', 0) as string;

		if (subgroups) {
			query.append('subgroups', subgroups);
		}
		const especialities = this.getNodeParameter('especialities', 0) as string;

		if (especialities) {
			query.append('especialities', especialities);
		}
		const contentType = this.getNodeParameter('contentType', 0) as string;

		if (contentType) {
			query.append('contentType', contentType);
		}
		const tags = this.getNodeParameter('tags', 0) as string;

		if (tags) {
			query.append('tags', tags);
		}

		const options: OptionsWithUri = {
			method: 'GET',
			headers: {
				url,
				'Content-Type': 'application/json',
			},
			uri: `${uri}/search/search?${query.toString()}`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
