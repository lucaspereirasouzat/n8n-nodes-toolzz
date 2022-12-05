import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzCreateUserv3 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Create User v3',
		name: 'ToolzzCreateUserv3',
		icon: 'file:toolzzCreateUser.svg',
		group: ['transform'],
		version: 2,
		description: 'Create User Toolzz API',
		defaults: {
			name: 'ToolzzCreateUserv3',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
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
				displayName: 'AccessToken',
				name: 'accessToken',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Nome',
				name: 'name',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Escola ID',
				name: 'escola_id',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Cpf',
				name: 'cpf',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;

		const name = this.getNodeParameter('name', 0) as string;
		const email = this.getNodeParameter('email', 0) as string;
		const schools = this.getNodeParameter('schools', 0) as string;

		const accessToken = this.getNodeParameter('accessToken', 0) as string;
		const uri = this.getNodeParameter('url', 0) as string;

		const data: IDataObject = {
			name,
			email,
			escola_id: schools.split(','),
		};

		const options: OptionsWithUri = {
			method: 'POST',
			body: data,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			uri: `${uri}/api/users`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
