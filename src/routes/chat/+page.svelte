<script lang="ts">
	import { format } from 'date-fns/format';

	import { ChatApi } from '$lib/api';
	import { getConfig } from '$lib/fetch';

	import type { PageData } from './$types';

	export let data: PageData;

	let message = '';

	$: messages = data.messages;

	$: sendMessage = async () => {
		const api = new ChatApi(getConfig(fetch));
		await api.sendChatMessage({ body: message });
		message = '';
	};
</script>

<h1>Chat</h1>

<form on:submit={sendMessage}>
	<input type="text" placeholder="Message" bind:value={message} />
	<button type="submit" disabled={!message}>Send</button>
</form>

<table>
	<thead>
		<tr>
			<th>Timestamp</th>
			<th>Message</th>
			<th>Source</th>
		</tr>
	</thead>
	<tbody>
		{#each messages as msg}
			<tr>
				<td>{format(msg.timestamp, 'dd.MM.yyyy hh:mm:ss')}</td>
				<td>{msg.message}</td>
				<td>{msg.source.command ?? msg.source.playerId}</td>
			</tr>
		{/each}
	</tbody>
</table>
