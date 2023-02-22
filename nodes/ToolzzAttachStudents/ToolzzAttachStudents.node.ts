import { IExecuteFunctions } from 'n8n-core';

import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';
import { ToolzzEnvironments } from '../../config/toolzz-environments';

export class ToolzzAttachStudents implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Attach Students',
		name: 'toolzzAttachStudents',
		icon: 'file:toolzzShowCourse.svg',
		group: ['transform'],
		version: [1, 2],
		description: 'Attach Students Toolzz API',
		defaults: {
			name: 'ToolzzAttachStudents',
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
				displayOptions: {
					show: {
						'@version': [1],
					},
				},
				name: 'url',
				type: 'options',
				options: [
					{
						name: 'Prod',
						value: ToolzzEnvironments.legacy.prod,
					},
					{
						name: 'Homol',
						value: ToolzzEnvironments.legacy.homol,
					},
					{
						name: 'Release',
						value: ToolzzEnvironments.legacy.release,
					},
				],
				default: `${ToolzzEnvironments.legacy.prod}`, // The initially selected option
				description: 'Selecione o ambiente',
			},
			{
				displayName: 'Ambiente',
				displayOptions: {
					show: {
						'@version': [2],
					},
				},
				name: 'url',
				type: 'options' as NodePropertyTypes,
				default: `${ToolzzEnvironments.api.prod}`,
				options: [
					{
						name: 'Prod',
						value: ToolzzEnvironments.api.prod,
					},
					{
						name: 'Homol',
						value: ToolzzEnvironments.api.homol,
					},
				],
				description: 'Selecione o ambiente',
			},
			{
				displayName: 'ID Da Turma',
				name: 'class_id',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'IDs Dos Alunos',
				name: 'users_ids',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const accessToken = this.getNodeParameter('accessToken', 0) as string;

		const uri = this.getNodeParameter('url', 0) as string;
		const classId = this.getNodeParameter('class_id', 0) as string;
		const usersIds = this.getNodeParameter('users_ids', 0) as string;

		const data = {
			users: usersIds.split(','),
		};

		const options: OptionsWithUri = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: data,
			uri: `${uri}/api/classes/${classId}/attach`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
