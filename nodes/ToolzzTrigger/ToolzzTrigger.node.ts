import { IExecuteFunctions, IHookFunctions, IWebhookFunctions } from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodePropertyTypes,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class ToolzzTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toolzz Trigger',
		name: 'ToolzzTrigger',
		icon: 'file:toolzzShowCourse.svg',
		group: ['transform'],
		version: 1,
		description: 'ToolzzTags',
		defaults: {
			name: 'ToolzzTags',
		},
		inputs: [],
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
				name: 'uri',
				type: 'options',
				options: [
					{
						name: 'Prod',
						value: 'https://gateway.api.toolzz.com.br/admin',
					},
				],
				default: 'https://gateway.api.toolzz.com.br/admin', // The initially selected option
				description: 'Selecione o ambiente',
			},
			{
				displayName: 'Trigger On Name or ID',
				name: 'triggerOn',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getFunctions',
				},
				displayOptions: {
					show: {
						operation: [
							'invoke',
						],
					},
				},
				default: 'fileComment',
				options: [
					{
						name: 'File Commented',
						value: 'fileComment',
						description: 'Triggers when someone comments on a file',
					},
					{
						name: 'File Deleted',
						value: 'fileDelete',
						description:
							'Triggers whenever a file has been deleted. Does not trigger on all files within a folder, if the folder is deleted.',
					},
					{
						name: 'File Updated',
						value: 'fileUpdate',
						description:
							'Triggers whenever a file saves or is deleted. This occurs whenever a file is closed or within 30 seconds after changes have been made.',
					},
					{
						name: 'File Version Updated',
						value: 'fileVersionUpdate',
						description:
							'Triggers whenever a named version is created in the version history of a file',
					},
					{
						name: 'Library Publish',
						value: 'libraryPublish',
						description: 'Triggers whenever a library file is published',
					},
				],
				required: true,
			}
		],
	};

	methods = {
		loadOptions: {
			async getFunctions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				let data;
				try {
							const options = {
					method: 'GET',

					uri: `https://gateway.api.toolzz.com.br/admin/webhook/getActions`,
					json: true,
				};
				  data = await this.helpers.request!(options);
				} catch (err) {
					// eslint-disable-next-line n8n-nodes-base/node-execute-block-wrong-error-thrown
					throw new Error(`AWS Error: ${err}`);
				}

				for (const func of data.data!) {
					returnData.push({
						name: func.name as string,
						value: func.slug as string,
					});
				}
				return returnData;
			}
		},
	};



		// @ts-ignore (because of request)
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				let responseData;
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const accessToken = this.getNodeParameter('accessToken') as string;
				const triggerOn = this.getNodeParameter('triggerOn') as string;
				const uri = this.getNodeParameter('uri', 0) as string;

				const options = {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					uri: `${uri}/webhook`,
					json: true,
				};

				responseData = await this.helpers.request(options);
				const webhooks = responseData.data.data

				for (const webhook of webhooks) {
					if (
						webhook.webhook_url === webhookUrl &&
						webhook.webhook_institutions_event_actions.some((item: { webhook_events_actions: { slug: string; }; }) => item.webhook_events_actions.slug === triggerOn) &&
						webhook.status === 'enabled'
					) {
						webhookData.webhookId = webhook.id as string;
						return true;
					}
				}
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				let responseData;
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const accessToken = this.getNodeParameter('accessToken') as string;
				const triggerOn = this.getNodeParameter('triggerOn') as string;
				const uri = this.getNodeParameter('uri', 0) as string;

				const data = {
					webhook_url: webhookUrl,
					"status": "enabled",
					events: [
						triggerOn
					]
				}

				const options = {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					uri: `${uri}/webhook`,
					json: true,
					data
				};

				responseData = await this.helpers.request(options);

				if (responseData.id === undefined) {
					// Required data is missing so was not successful
					return false;
				}

				webhookData.webhookId = responseData.id as string;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const accessToken = this.getNodeParameter('accessToken') as string;
				const uri = this.getNodeParameter('uri', 0) as string;
				if (webhookData.webhookId !== undefined) {
								const data = {
					"status": "disabled",
				}
					try {
								const options = {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					uri: `${uri}/webhook`,
					json: true,
					data
				};
						await this.helpers.request(options);
					} catch (error) {
						return false;
					}
					// Remove from the static workflow data so that it is clear
					// that no webhooks are registred anymore
					delete webhookData.webhookId;
				}
				return true;
			},
		},
	};

	// async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
	// 	const bodyData = this.getBodyData();

	// 	if (bodyData.event_type === 'PING') {
	// 		const res = this.getResponseObject();
	// 		res.status(200).end();
	// 		return {
	// 			noWebhookResponse: true,
	// 		};
	// 	}

	// 	return {
	// 		workflowData: [this.helpers.returnJsonArray(bodyData)],
	// 	};
	// }

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		if (bodyData.event_type === 'PING') {
			const res = this.getResponseObject();
			res.status(200).end();
			return {
				noWebhookResponse: true,
			};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)]
		};
	}
}
