import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzShowPercentageUsersSchool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Show Percentage School',
		name: 'ToolzzShowPercentageUsersSchool',
		icon: 'file:toolzzShowCourse.svg',
		group: ['transform'],
		version: 1,
		description: 'Get Percentage the School of Toolzz API',
		defaults: {
			name: 'ToolzzShowPercentageUsersSchool',
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
				displayName: 'ID Da Escola',
				name: 'school_id',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;

		const accessToken = this.getNodeParameter('accessToken', 0) as string;

		const uri = this.getNodeParameter('url', 0) as string;
		const schoolId = this.getNodeParameter('school_id', 0) as string;

		const options: OptionsWithUri = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			uri: `${uri}/api/reports/school/${schoolId}/percentage`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
