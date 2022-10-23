import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzLogin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Login',
		name: 'toolzzLogin',
		icon: 'file:toolzzLogin.svg',
		group: ['transform'],
		version: 1,
		description: 'Make login Toolzz API',
		defaults: {
			name: 'ToolzzLogin',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Password',
				name: 'password',
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;

		const email = this.getNodeParameter('email', 0) as string;
		const password = this.getNodeParameter('password', 0) as string;
		const uri = this.getNodeParameter('url', 0) as string;

		const data: IDataObject = {
			email,
			password,
		};

		const options: OptionsWithUri = {
			method: 'POST',
			body: data,
			headers: {
				'Content-Type': 'application/json',
			},
			uri: `${uri}/api/auth/login`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
