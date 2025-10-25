import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CrawlChatApi implements ICredentialType {
	name = 'crawlchatApi';

	displayName = 'CrawlChat API';
	icon = undefined;

	// Link to your community node's README
	documentationUrl = 'https://github.com/pskd73/n8n-nodes-crawlchat?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://wings.crawlchat.app',
			url: '/collection',
		},
	};
}
