import { IExecuteFunctions } from 'n8n-core';

import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzGetUserInfoByEmailOrUserId implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Get User Info By Email Or UserId',
		name: 'ToolzzGetUserInfoByEmailOrUserId',
		icon: 'file:toolzzShowSchoolAndClasses.svg',
		group: ['transform'],
		version: 1,
		description: 'Get User Info of Toolzz API',
		defaults: {
			name: 'ToolzzGetUserInfoByEmailOrUserId',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			{
				displayName: 'AccessToken',
				name: 'accessToken',
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
				displayName: 'Filtrar por',
				name: 'url',
				type: 'options',
				options: [
					{
						name: 'Email',
						value: 'email',
					},
					{
						name: 'User ID',
						value: 'id',
					},
				],
				default: 'email', // The initially selected option
				description: 'Selecione o ambiente',
			},
			{
				displayName: 'Valor Para Fitrar',
				name: 'value_param',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const accessToken = this.getNodeParameter('accessToken', 0) as string;

		const uri = this.getNodeParameter('url', 0) as string;
		const typeParam = this.getNodeParameter('type_param', 0) as string;
		const valueParam = this.getNodeParameter('value_param', 0) as string;

		const options: OptionsWithUri = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			uri: `${uri}/playappapi/user?by=${typeParam}&value=${valueParam}`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
