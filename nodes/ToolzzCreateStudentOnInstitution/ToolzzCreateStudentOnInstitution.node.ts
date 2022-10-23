import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzCreateStudentOnInstitution implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Create Studant on Institution',
		name: 'toolzzCreateStudentOnInstitution',
		icon: 'file:toolzzShowSchoolAndClasses.svg',
		group: ['transform'],
		version: 1,
		description: 'Get School and Classes of Toolzz API',
		defaults: {
			name: 'ToolzzCreateStudentOnInstitution',
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
				displayName: 'E-Mail',
				name: 'email',
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
				displayName: 'ID Da Escola',
				name: 'schoo_id',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const accessToken = this.getNodeParameter('accessToken', 0) as string;

		const uri = this.getNodeParameter('url', 0) as string;

		const name = this.getNodeParameter('name', 0) as string;
		const email = this.getNodeParameter('email', 0) as string;
		const birthDate = this.getNodeParameter('birth_date', 0) as string;
		const institutionCode = this.getNodeParameter('institutionCode', 0) as string;
		const passwordConfirmation = this.getNodeParameter('password_confirmation', 0) as string;
		const password = this.getNodeParameter('password', 0) as string;

		const data: IDataObject = {
			name,
			email,
			password,
			birth_date: birthDate,
			institutionCode,
			password_confirmation: passwordConfirmation,
		};

		const options: OptionsWithUri = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: data,
			uri: `${uri}/api/users`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
