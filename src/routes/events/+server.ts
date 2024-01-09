import type { RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request }) => {
	const data = await request.json();

	request.headers.forEach((value, key) => {
		console.log(key, value);
	});
	console.log('-----');
	console.log(data);

	return new Response(null, {});
};
