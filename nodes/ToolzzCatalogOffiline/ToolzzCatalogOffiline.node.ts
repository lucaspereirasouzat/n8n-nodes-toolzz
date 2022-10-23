import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

import * as querystring from 'querystring';

export class ToolzzCatalogOffiline implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Catalog Offilne',
		name: 'ToolzzCatalogOffiline',
		icon: 'file:toolzzShowSchoolAndClasses.svg',
		group: ['transform'],
		version: 1,
		description: 'Get School and Classes of Toolzz API',
		defaults: {
			name: 'ToolzzCatalogOffiline',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			{
				displayName: 'Play Token',
				name: 'playToken',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Ambiente',
				name: 'url',
				type: 'options',
				options: [
					{
						name: 'Prod',
						value: 'https://kong.api.toolzz.com.br',
					},
					{
						name: 'Homol',
						value: 'http://homol.playapp.edulabzz.com.br:8000',
					},
					{
						name: 'Release',
						value: 'http://release.edulabzz.com.br:8000',
					},
				],
				default: 'https://kong.api.toolzz.com.br', // The initially selected option
				description: 'Selecione o ambiente',
			},
			{
				displayName: 'Pagina',
				name: 'page',
				type: 'number' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Instituição ID',
				name: 'institutionId',
				type: 'number' as NodePropertyTypes,
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const playToken = this.getNodeParameter('playToken', 0) as string;

		const uri = this.getNodeParameter('url', 0) as string;
		const page = this.getNodeParameter('page', 0) as string;
		const institutionId = this.getNodeParameter('institutionId', 0) as string;

		const query = querystring.stringify({
			catalog: page,
		});

		const options: OptionsWithUri = {
			method: 'GET',
			headers: {
				playToken,
				'Content-Type': 'application/json',
			},
			uri: `${uri}/playappapi/catalog/offline/${institutionId}?${query}`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
