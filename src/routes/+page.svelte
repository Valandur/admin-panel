<script lang="ts">
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
	import { sub } from 'date-fns/sub';

	import type { PageData } from './$types';

	export let data: PageData;

	$: uptime = data.uptime;
</script>

<h1>Admin Panel</h1>

<table>
	<tbody>
		<tr>
			<td>Uptime</td>
			<td>{formatDistanceToNow(sub(new Date(), { seconds: uptime / 1000 }))}</td>
		</tr>
		<tr>
			<td>Message of the day</td>
			<td>{data.messageOfTheDay}</td>
		</tr>

		<tr>
			<td>Players</td>
			<td>{data.playerCount}/{data.maxPlayers}</td>
		</tr>
		<tr>
			<td>MC Version</td>
			<td>{data.minecraftVersion}</td>
		</tr>
		<tr>
			<td>Web-API Version</td>
			<td>{data.webapiVersion}</td>
		</tr>
	</tbody>
</table>
