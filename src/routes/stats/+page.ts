import { InfoApi } from '$lib/api';
import { getConfig } from '$lib/fetch';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = new InfoApi(getConfig(fetch));
	const stats = await api.getStats();
	return {
		stats
	};
};
