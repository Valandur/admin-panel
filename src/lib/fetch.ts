import { env } from '$env/dynamic/public';

import { Configuration } from './api';

type FetchType = typeof fetch;

export function getConfig(fetch: FetchType) {
	return new Configuration({
		basePath: env.PUBLIC_API_URL,
		fetchApi: fetch,
		headers: {
			Authorization: env.PUBLIC_API_KEY
		}
	});
}
