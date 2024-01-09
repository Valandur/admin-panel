<script lang="ts">
	import { WorldApi } from '$lib/api';
	import { getConfig } from '$lib/fetch';

	import type { PageData } from './$types';

	export let data: PageData;

	const api = new WorldApi(getConfig(fetch));

	$: worlds = data.worlds;
	$: constants = data.constants;

	let name = '';
	let type = '';
	let difficulty = '';

	$: create = async () => {
		const world = await api.createWorld({
			createWorldData: { name, type, difficulty }
		});
		name = '';
		worlds = worlds.concat(world);
	};
	async function load(name: string) {
		await api.updateWorld({ world: name, loaded: true });
		worlds = worlds.map((w) => (w.name === name ? { ...w, loaded: true } : w));
	}
	async function unload(name: string) {
		await api.updateWorld({ world: name, loaded: false });
		worlds = worlds.map((w) => (w.name === name ? { ...w, loaded: false } : w));
	}
	async function del(name: string) {
		await api.deleteWorld({ world: name });
		worlds = worlds.filter((w) => w.name !== name);
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
			<th>Name</th>
			<th>Type</th>
			<th>Loaded</th>
			<th>Difficulty</th>
			<th>Seed</th>
			<th />
		</tr>
	</thead>
	<tbody>
		{#each worlds as world}
			<tr>
				<td>{world.name}</td>
				<td>{world.type}</td>
				<td>{world.loaded ? 'Yes' : 'No'}</td>
				<td>{world.difficulty}</td>
				<td>{world.seed}</td>
				<td>
					<button on:click={() => load(world.name)}>↑</button>
					<button on:click={() => unload(world.name)}>↓</button>
					<button on:click={() => del(world.name)}>X</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
