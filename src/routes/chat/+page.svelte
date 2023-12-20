<script lang="ts">
	import { format } from 'date-fns/format';

	import type { PageData } from './$types';

	export let data: PageData;

	$: messages = data.messages;
</script>

<h1>Chat</h1>

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
