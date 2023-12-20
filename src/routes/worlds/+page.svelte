<script lang="ts">
	import { getShortId } from '$lib/util';
	import type { PageData } from './$types';

	export let data: PageData;

	$: worlds = data.worlds;
</script>

<h1>Worlds</h1>

<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Type</th>
			<th>Name</th>
			<th>Difficulty</th>
			<th>Seed</th>
		</tr>
	</thead>
	<tbody>
		{#each worlds as world}
			<tr>
				<td>{getShortId(world.uuid)}</td>
				<td>{world.type}</td>
				<td>{world.name ?? '---'}</td>
				<td>{world.difficulty}</td>
				<td>{world.seed}</td>
			</tr>
		{/each}
	</tbody>
</table>
