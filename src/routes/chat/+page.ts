import { ChatApi } from '$lib/api';
import { getConfig } from '$lib/fetch';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = new ChatApi(getConfig(fetch));
	const messages = await api.getMessages();
	return {
		messages
	};
};
