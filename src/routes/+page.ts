import { InfoApi } from '$lib/api';
import { getConfig } from '$lib/fetch';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = new InfoApi(getConfig(fetch));
	const info = await api.getInfo();
	return info;
};
