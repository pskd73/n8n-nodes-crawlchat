import { type INodeType, type INodeTypeDescription, type ILoadOptionsFunctions } from 'n8n-workflow';

const baseURL = 'https://wings.crawlchat.app';

export class Crawlchat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CrawlChat',
		name: 'crawlchat',
		icon: { light: 'file:logo.svg', dark: 'file:logo-white.svg' },
		group: ['transform'],
		version: 1,
		description: 'Interact with the CrawlChat API',
		defaults: {
			name: 'CrawlChat',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'crawlchatApi', required: true }],
		requestDefaults: {
			baseURL,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Answer',
						value: 'answer',
					},
				],
				default: 'answer',
				routing: {
					request: {
						method: 'POST',
						
						body: {
							query: '={{$parameter.query}}',
						},
					},
				}
			},
			{
				displayName: 'Collection Name or ID',
				name: 'collection',
				type: 'options',
				required: true,
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getCollections',
				},
				routing: {
					request: {
						url: '=/answer/{{$parameter.collection}}',
					}
				},
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				description: 'The query to send to the CrawlChat API',
				displayOptions: {
					show: {
						operation: ['answer'],
					},
				},
				routing: {
					send: {
						type: 'body',
						property: 'query',
					},
				},
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				default: '',
				description: 'The prompt to send to the CrawlChat API',
				displayOptions: {
					show: {
						operation: ['answer'],
					},
				},
				routing: {
					send: {
						type: 'body',
						property: 'prompt',
					},
				},
			}
		],
	};

	methods = {
		loadOptions: {
			async getCollections(this: ILoadOptionsFunctions): Promise<Array<{ name: string; value: string }>> {
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'crawlchatApi', {
					method: 'GET',
					url: `${baseURL}/collection`,
				});

				return response.map((collection: { collectionName: string; collectionId: string }) => ({
					name: collection.collectionName,
					value: collection.collectionId,
				}))
			},
		},
	};
}
