import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzRd implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz RD',
		name: 'ToolzzRd',
		icon: 'file:toolzzShowCourse.svg',
		group: ['transform'],
		version: 1,
		description: 'ToolzzRd',
		defaults: {
			name: 'ToolzzRd',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			{
				displayName: 'Local',
				name: 'url',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Chamada',
				name: 'body',
				type: 'string' as NodePropertyTypes,
				description: 'Corpo de envio',
				default: '',
			},
			{
				displayName: 'Method',
				type: 'string' as NodePropertyTypes,
				description: 'GET, PUT, POST, PATCH',
				name: 'method',
				default: '',
			},
			{
				displayName: 'Token RdStation',
				type: 'string' as NodePropertyTypes,
				description: 'GET, PUT, POST, PATCH',
				name: 'access_token',
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const url = this.getNodeParameter('url', 0) as string;
		const accessToken = this.getNodeParameter('access_token', 0) as string;
		const method = this.getNodeParameter('method', 0) as string;

		const body = this.getNodeParameter('body', 0) as string;

		const options: OptionsWithUri = {
			method,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body,
			uri: `https://api.rd.services/platform/${url.replace(/^[\/\\]/, '')}`,
			json: true,
		};

		responseData = await this.helpers.request(options);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
