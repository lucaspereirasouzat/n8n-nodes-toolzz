import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzSSO implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz SSO',
		name: 'ToolzzSSO',
		icon: 'file:toolzzShowCourse.svg',
		group: ['transform'],
		version: 1,
		description: 'ToolzzSSO',
		defaults: {
			name: 'ToolzzTags',
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
				displayName: 'Email',
				name: 'email',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Subdomain',
				name: 'subdomain',
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

		const email = this.getNodeParameter('email', 0) as string;
		const institutionCode = this.getNodeParameter('institution_code', 0) as string;

		const data = {
			email,
			institution_code:institutionCode,
		};


		const options: OptionsWithUri = {
			method: 'POST',
			headers: {
				url,
				'Content-Type': 'application/json',
			},
			uri: `${uri}/api/auth/sso/redirect`,
			json: true,
			body: data,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
