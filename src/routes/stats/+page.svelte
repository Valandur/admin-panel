<script lang="ts">
	import * as Pancake from '@sveltejs/pancake';
	import { format } from 'date-fns/format';

	import type { PageData } from './$types';

	export let data: PageData;

	let closest: any;

	$: stats = data.stats;

	$: cpuPoints = stats.map((s) => ({
		name: 'CPU',
		x: s.timestamp.getTime(),
		y: s.cpuLoad * 100,
		data: [] as any[]
	}));
	$: cpuPoints.forEach((p) => (p.data = cpuPoints));
	$: memPoints = stats.map((s) => ({
		name: 'Memory',
		x: s.timestamp.getTime(),
		y: s.memLoad * 100,
		data: [] as any[]
	}));
	$: memPoints.forEach((p) => (p.data = memPoints));
	$: diskPoints = stats.map((s) => ({
		name: 'Disk',
		x: s.timestamp.getTime(),
		y: s.diskUsage * 100,
		data: [] as any[]
	}));
	$: diskPoints.forEach((p) => (p.data = diskPoints));
	$: points = cpuPoints.concat(memPoints, diskPoints);

	$: xMin = points.reduce((curr, p) => Math.min(curr, p.x), Number.MAX_SAFE_INTEGER);
	$: xMax = points.reduce((curr, p) => Math.max(curr, p.x), Number.MIN_SAFE_INTEGER);

	function pct(value: number) {
		return (value * 100).toFixed(1);
	}
</script>

<h1>Stats</h1>

<div class="h-[600px] p-8 ps-10 bg-gray-100">
	<Pancake.Chart x1={xMin} x2={xMax} y1={0} y2={100}>
		<Pancake.Grid horizontal count={5} let:value>
			<div class="grid-line horizontal"><span>{value}</span></div>
		</Pancake.Grid>

		<Pancake.Grid vertical count={8} let:value>
			<span class="x-label">{format(value, 'dd.MM.yyyy hh:mm')}</span>
		</Pancake.Grid>

		<Pancake.Svg>
			<Pancake.SvgLine data={cpuPoints} let:d>
				<path class="stroke-blue-800 fill-none" {d} />
			</Pancake.SvgLine>
			<Pancake.SvgLine data={memPoints} let:d>
				<path class="stroke-red-600 fill-none" {d} />
			</Pancake.SvgLine>
			<Pancake.SvgLine data={diskPoints} let:d>
				<path class="stroke-green-800 fill-none" {d} />
			</Pancake.SvgLine>

			{#if closest}
				<Pancake.SvgLine data={closest.data} let:d>
					<path class="stroke-yellow-400 stroke-2 fill-none" {d} />
				</Pancake.SvgLine>
			{/if}
		</Pancake.Svg>

		{#if closest}
			<Pancake.Point x={closest.x} y={closest.y}>
				<span class="annotation-point" />
				<div
					class="absolute bg-black text-white p-1 whitespace-nowrap"
					style="transform: translate(-{100 * ((closest.x - xMin) / (xMax - xMin))}%,0)"
				>
					<div>{closest.name}</div>
					<div>{format(new Date(closest.x), 'dd.MM.yyyy hh:mm:ss')}: {closest.y.toFixed(2)}%</div>
				</div>
			</Pancake.Point>
		{/if}

		<Pancake.Quadtree data={points} bind:closest />
	</Pancake.Chart>
</div>

<style>
	.grid-line {
		position: relative;
		display: block;
	}

	.grid-line.horizontal {
		width: calc(100% + 2em);
		left: -2em;
		border-bottom: 1px dashed #ccc;
	}

	.grid-line span {
		position: absolute;
		left: 0;
		bottom: 2px;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
	}

	.x-label {
		position: absolute;
		width: 4em;
		left: -2em;
		bottom: -22px;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
		text-align: center;
	}

	.annotation-point {
		position: absolute;
		width: 10px;
		height: 10px;
		background-color: #ff3e00;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}
</style>
