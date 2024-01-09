import { WorldApi } from '$lib/api';
import { getConfig } from '$lib/fetch';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = new WorldApi(getConfig(fetch));
	const worlds = await api.getWorlds();
	const constants = await api.getConstants();

	return {
		worlds,
		constants
	};
};
