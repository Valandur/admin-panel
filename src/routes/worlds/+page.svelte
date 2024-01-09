<script lang="ts">
	import { WorldApi } from '$lib/api';
	import { getConfig } from '$lib/fetch';
	import { getShortId } from '$lib/util';
	import type { PageData } from './$types';

	export let data: PageData;

	$: worlds = data.worlds;
	$: constants = data.constants;

	let name = '';
	let type = '';
	let difficulty = '';

	$: create = async () => {
		const api = new WorldApi(getConfig(fetch));
		const world = await api.createWorld({
			createWorldData: { name, type, difficulty }
		});
		name = '';
		worlds = worlds.concat(world);
	};
	async function load(uuid: string) {
		const api = new WorldApi(getConfig(fetch));
	}
	async function unload(uuid: string) {
		const api = new WorldApi(getConfig(fetch));
	}
	async function del(uuid: string) {
		const api = new WorldApi(getConfig(fetch));
		await api.deleteWorld({ world: uuid });
		worlds = worlds.filter((w) => w.uuid !== uuid);
	}
</script>

<h1>Worlds</h1>

<input type="text" placeholder="Name" bind:value={name} />
<select bind:value={type}>
	{#each constants.types as type}
		<option value={type}>{type}</option>
	{/each}
</select>
<select bind:value={difficulty}>
	{#each constants.difficulties as diff}
		<option value={diff}>{diff}</option>
	{/each}
</select>
<button on:click={create}>Create</button>

<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Type</th>
			<th>Name</th>
			<th>Loaded</th>
			<th>Difficulty</th>
			<th>Seed</th>
			<th />
		</tr>
	</thead>
	<tbody>
		{#each worlds as world}
			<tr>
				<td>{getShortId(world.uuid)}</td>
				<td>{world.type}</td>
				<td>{world.name ?? '---'}</td>
				<td>{world.loaded ? 'Yes' : 'No'}</td>
				<td>{world.difficulty}</td>
				<td>{world.seed}</td>
				<td><button on:click={() => del(world.uuid)}>X</button></td>
			</tr>
		{/each}
	</tbody>
</table>
