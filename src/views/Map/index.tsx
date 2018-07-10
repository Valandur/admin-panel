import * as _ from 'lodash';
import Slider from 'rc-slider';
import * as React from 'react';
import { Circle, Image, Layer, Line, Stage } from 'react-konva';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
	Button,
	Dropdown,
	DropdownProps,
	Header,
	Progress,
	Segment
} from 'semantic-ui-react';

import { AppAction } from '../../actions';
import { requestDelete, requestList } from '../../actions/dataview';
import Inventory from '../../components/Inventory';
import { formatRange, renderWorldOptions } from '../../components/Util';
import { Entity, Player, TileEntity, World } from '../../fetch';
import { AppState } from '../../types';

const TILE_SIZE = 512;
const HALF_TILE = TILE_SIZE / 2;
// const ZOOM_SPEED = 0.01
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 16.0;

const totalOffset = (element: HTMLElement) => {
	let top = 0;
	let left = 0;

	do {
		top += element.offsetTop || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent as HTMLElement;
	} while (element);

	return {
		top: top,
		left: left
	};
};

const marks = {
	0.4: <strong>MIN</strong>,
	0.707: '0.25x',
	0.841: '0.5x',
	1: '-',
	1.189: '2x',
	1.414: '4x',
	1.682: '8x',
	2: <strong>MAX</strong>
};

interface OwnProps {
	entities: Entity[];
	worlds: World[];
	players: Player[];
	tileEntities: TileEntity[];
	apiKey?: string;
	apiUrl: string;
}
interface DispatchProps {
	requestWorlds: () => AppAction;
	requestPlayers: () => AppAction;
	requestEntities: (query: { [x: string]: string }) => AppAction;
	requestTileEntities: (query: { [x: string]: string }) => AppAction;
	requestDeleteEntity: (entity: Entity) => AppAction;
}
interface Props
	extends OwnProps,
		DispatchProps,
		reactI18Next.InjectedTranslateProps {}

interface OwnState {
	biomes: { x: number; z: number; image: any }[];
	top: number;
	left: number;
	width: number;
	height: number;
	display: string;
	content?: JSX.Element;
	center: { x: number; z: number };
	zoom: number;
	dragging: boolean;
	worldId?: string;
}

class Map extends React.Component<Props, OwnState> {
	wrapper: HTMLDivElement;
	timeouts: NodeJS.Timer[];

	x: number = 0;
	y: number = 0;

	objClicked: boolean = false;

	playerInterval: NodeJS.Timer;

	constructor(props: Props) {
		super(props);

		this.state = {
			biomes: [],
			top: 0,
			left: 0,
			width: 0,
			height: 0,
			display: 'none',
			center: {
				x: 0,
				z: 0
			},
			zoom: 1,
			dragging: false
		};

		this.timeouts = [];

		this.handleObjMouseDown = this.handleObjMouseDown.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseOutUp = this.handleMouseOutUp.bind(this);
		// this.handleWheel = this.handleWheel.bind(this)
		this.handleWorldChange = this.handleWorldChange.bind(this);

		this.updateDimensions = _.debounce(this.updateDimensions.bind(this), 500);
		this.getAllBiomes = _.debounce(this.getAllBiomes.bind(this), 500);
		this.worldToScreen = this.worldToScreen.bind(this);
		this.screenToWorld = this.screenToWorld.bind(this);
		this.center = this.center.bind(this);
	}

	componentDidMount() {
		this.props.requestPlayers();
		this.props.requestWorlds();
		this.playerInterval = setInterval(() => this.props.requestPlayers(), 10000);

		window.addEventListener('resize', this.updateDimensions);
		this.updateDimensions();
	}

	componentWillUnmount() {
		clearInterval(this.playerInterval);
		window.removeEventListener('resize', this.updateDimensions);
	}

	updateDimensions() {
		if (!this.wrapper) {
			return;
		}

		this.setState(
			{
				width: this.wrapper.offsetWidth,
				height: window.innerHeight - totalOffset(this.wrapper).top - 30
			},
			() => this.getAllBiomes()
		);
	}

	getAllBiomes() {
		// If we didn't select a world yet do nothing
		if (!this.state.worldId) {
			return;
		}

		// z is inverse here because it's in screen coordinates
		const min = this.screenToWorld({ x: 0, z: this.state.height });
		const max = this.screenToWorld({ x: this.state.width, z: 0 });

		this.timeouts.forEach(timeout => clearTimeout(timeout));

		this.setState(
			{
				biomes: _.uniqBy(
					this.state.biomes.filter(
						biome =>
							biome.x + HALF_TILE >= min.x &&
							biome.x - HALF_TILE <= max.x &&
							biome.z + HALF_TILE >= min.z &&
							biome.z - HALF_TILE <= max.z
					),
					b => b.x + '+' + b.z
				)
			},
			() => {
				min.x = min.x - (min.x % TILE_SIZE) - TILE_SIZE;
				min.z = min.z - (min.z % TILE_SIZE) - TILE_SIZE;

				max.x = max.x - (max.x % TILE_SIZE) + TILE_SIZE;
				max.z = max.z - (max.z % TILE_SIZE) + TILE_SIZE;

				let index = 0;
				this.timeouts = [];
				for (let x = min.x; x <= max.x; x += TILE_SIZE) {
					for (let z = min.z; z <= max.z; z += TILE_SIZE) {
						if (this.state.biomes.find(b => b.x === x && b.z === z)) {
							continue;
						}

						this.timeouts.push(
							setTimeout(() => this.getBiome(x, z), index * 100)
						);
						index++;
					}
				}
			}
		);
	}

	getBiome(x: number, z: number) {
		const image = document.createElement('img');
		image.src =
			this.props.apiUrl +
			'/api/v5/map/' +
			this.state.worldId +
			'/' +
			x / TILE_SIZE +
			'/' +
			z / TILE_SIZE +
			'?key=' +
			this.props.apiKey;
		image.onload = () => {
			this.setState({
				biomes: [...this.state.biomes, { x: x, z: z, image }]
			});
		};
	}

	handleWorldChange(
		event: React.SyntheticEvent<HTMLElement>,
		data: DropdownProps
	) {
		this.setState(
			{
				biomes: [],
				worldId: data.value as string
			},
			() => this.getAllBiomes()
		);
	}

	handleObjMouseDown(
		{ evt }: { evt: React.MouseEvent<HTMLElement> },
		type: 'player' | 'entity' | 'tile-entity',
		obj: Entity | Player | TileEntity
	) {
		this.objClicked = true;
		const loc = this.worldToScreen(obj.location.position);

		let content;
		if (type === 'player') {
			content = this.renderPlayerInfo(obj as Player);
		} else if (type === 'entity') {
			content = this.renderEntityInfo(obj as Entity);
		} else if (type === 'tile-entity') {
			content = this.renderTileEntityInfo(obj as TileEntity);
		}

		this.setState({
			left: loc.x,
			top: loc.z,
			display: 'block',
			content: content
		});
	}

	renderPlayerInfo(player: Player) {
		return (
			<Segment>
				<Header>{player.name}</Header>
				{player.inventory && <Inventory inventory={player.inventory} />}
				{player.health && (
					<Progress
						progress
						color="red"
						percent={formatRange(player.health.current, player.health.max)}
					/>
				)}
				{player.food && (
					<Progress
						progress
						color="green"
						percent={formatRange(player.food.foodLevel, 20)}
					/>
				)}
			</Segment>
		);
	}

	renderEntityInfo(entity: Entity) {
		return (
			<Segment>
				<Header>
					{entity.type ? entity.type.name : entity.uuid ? entity.uuid : null}
				</Header>
				<Button negative onClick={() => this.deleteEntity(entity)}>
					Destroy
				</Button>
			</Segment>
		);
	}

	renderTileEntityInfo(te: TileEntity) {
		return (
			<Segment>
				<Header>{te.type ? te.type.name : null}</Header>
			</Segment>
		);
	}

	handleMouseDown({ evt }: { evt: React.MouseEvent<HTMLElement> }) {
		if (this.objClicked) {
			this.objClicked = false;
			return;
		}

		this.setState({
			dragging: true,
			display: 'none'
		});
	}

	handleMouseMove({ evt }: { evt: React.MouseEvent<HTMLElement> }) {
		if (!this.state.dragging) {
			this.x = evt.screenX;
			this.y = evt.screenY;
			return;
		}

		this.setState(
			{
				center: {
					x: this.state.center.x - (this.x - evt.screenX) / this.state.zoom,
					z: this.state.center.z + (this.y - evt.screenY) / this.state.zoom
				}
			},
			() => this.getAllBiomes()
		);

		this.x = evt.screenX;
		this.y = evt.screenY;
	}

	handleMouseOutUp(event: React.MouseEvent<HTMLElement>) {
		this.setState({
			dragging: false
		});
	}

	/* waiting for event to be added to typescript
	handleWheel(event: React.WheelEvent<HTMLElement>) {
		const d = event.nativeEvent.deltaY
		const diff = Math.abs(d * ZOOM_SPEED)
		const newValue = d > 0 ? this.state.zoom / diff : this.state.zoom * diff

		this.setState({
			zoom: Math.min(Math.max(newValue, MIN_ZOOM), MAX_ZOOM),
		}, () => this.getAllBiomes())
	}*/

	handleZoomChange(value: number) {
		this.setState(
			{
				zoom: Math.min(Math.max(Math.pow(value, 4), MIN_ZOOM), MAX_ZOOM)
			},
			() => this.getAllBiomes()
		);
	}

	deleteEntity(entity: Entity) {
		this.props.requestDeleteEntity(entity);
		this.setState({
			display: 'none',
			content: undefined
		});
	}

	center() {
		return {
			x:
				Math.floor(this.state.width / 2) +
				this.state.center.x * this.state.zoom,
			z:
				Math.floor(this.state.height / 2) -
				this.state.center.z * this.state.zoom
		};
	}

	worldToScreen({ x, z }: { x: number; z: number }) {
		const center = this.center();
		return {
			x: center.x + x * this.state.zoom,
			z: center.z - z * this.state.zoom
		};
	}

	screenToWorld({ x, z }: { x: number; z: number }) {
		const center = this.center();
		return {
			x: (x - center.x) / this.state.zoom,
			z: (center.z - z) / this.state.zoom
		};
	}

	loadEntities() {
		if (!this.state.worldId) {
			return;
		}

		const min = this.screenToWorld({ x: 0, z: this.state.height });
		const max = this.screenToWorld({ x: this.state.width, z: 0 });

		const minStr = min.x.toFixed(0) + '|0|' + min.z.toFixed(0);
		const maxStr = max.x.toFixed(0) + '|255|' + max.z.toFixed(0);

		this.props.requestEntities({
			world: this.state.worldId,
			min: minStr,
			max: maxStr
		});
		this.props.requestTileEntities({
			world: this.state.worldId,
			min: minStr,
			max: maxStr
		});
	}

	render() {
		const center = this.center();
		const cX = center.x;
		const cZ = center.z;

		return (
			<Segment basic style={{ position: 'relative' }}>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%'
					}}
					ref={w => {
						if (w != null) {
							this.wrapper = w;
						}
					}}
				>
					<Stage
						width={this.state.width}
						height={this.state.height}
						onContentMouseDown={e => this.handleMouseDown(e)}
						onContentMouseUp={e => this.handleMouseOutUp(e)}
						onContentMouseOut={e => this.handleMouseOutUp(e)}
						onContentMouseMove={e => this.handleMouseMove(e)}
						/*onContentWheel={e => this.handleWheel(e)}*/
					>
						<Layer>
							{this.state.biomes.map(biome => {
								const pos = this.worldToScreen(biome);

								return (
									<Image
										key={biome.x + '+' + biome.z}
										x={pos.x - HALF_TILE * this.state.zoom}
										y={pos.z - HALF_TILE * this.state.zoom}
										image={biome.image}
										width={TILE_SIZE * this.state.zoom}
										height={TILE_SIZE * this.state.zoom}
									/>
								);
							})}
						</Layer>
						<Layer>
							<Line points={[0, cZ, 2000, cZ]} stroke="Black" strokeWidth={1} />
							<Line points={[cX, 0, cX, 2000]} stroke="Black" strokeWidth={1} />
						</Layer>
						<Layer>
							{this.props.entities
								.filter(e => e.location.world.uuid === this.state.worldId)
								.map(ent => {
									const pos = this.worldToScreen(ent.location.position);

									return (
										<Circle
											key={ent.uuid}
											radius={4}
											x={pos.x - 4}
											y={pos.z - 4}
											width={8}
											height={8}
											fill={'Red'}
											onMouseDown={e =>
												this.handleObjMouseDown(e, 'entity', ent)
											}
										/>
									);
								})}
							{this.props.players
								.filter(p => p.location.world.uuid === this.state.worldId)
								.map(player => {
									const pos = this.worldToScreen(player.location.position);

									return (
										<Circle
											key={player.uuid}
											radius={4}
											x={pos.x - 4}
											y={pos.z - 4}
											width={8}
											height={8}
											fill={'Gold'}
											onMouseDown={e =>
												this.handleObjMouseDown(e, 'player', player)
											}
										/>
									);
								})}
							{this.props.tileEntities
								.filter(te => te.location.world.uuid === this.state.worldId)
								.map(te => {
									const pos = this.worldToScreen(te.location.position);

									return (
										<Circle
											key={
												'te-' +
												te.location.position.x +
												'-' +
												te.location.position.z
											}
											radius={4}
											x={pos.x - 4}
											y={pos.z - 4}
											width={8}
											height={8}
											fill={'Green'}
											onMouseDown={e =>
												this.handleObjMouseDown(e, 'tile-entity', te)
											}
										/>
									);
								})}
						</Layer>
					</Stage>
					<div
						style={{
							display: this.state.display,
							zIndex: 1000,
							position: 'absolute',
							top: this.state.top,
							left: this.state.left
						}}
					>
						{this.state.content}
					</div>
				</div>
				<Segment style={{ position: 'absolute', top: 0, left: 10 }}>
					<Dropdown
						id="world"
						placeholder="Select world..."
						value={this.state.worldId}
						onChange={this.handleWorldChange}
						options={renderWorldOptions(this.props.worlds)}
					/>
				</Segment>
				<Segment
					style={{
						position: 'absolute',
						top: 60,
						left: 10,
						height: '25vh',
						width: 80
					}}
				>
					<Slider
						vertical
						marks={marks}
						min={0.4}
						max={2}
						step={0.001}
						value={Math.pow(this.state.zoom, 1 / 4)}
						onChange={(v: number) => this.handleZoomChange(v)}
						trackStyle={{ backgroundColor: 'blue' }}
						handleStyle={{ borderColor: 'blue' }}
					/>
				</Segment>
				<Segment style={{ position: 'absolute', top: 0, right: 10 }}>
					<Button
						primary
						content="Refresh entities"
						onClick={() => this.loadEntities()}
						disabled={!this.state.worldId}
					/>
				</Segment>
			</Segment>
		);
	}
}

const mapStateToProps = (state: AppState): OwnProps => {
	return {
		entities: state.entity.list,
		worlds: state.world.list,
		players: state.player.list,
		tileEntities: state.tileentity.list,
		apiKey: state.api.key,
		apiUrl: state.api.server.apiUrl
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>): DispatchProps => {
	return {
		requestWorlds: () => dispatch(requestList('world', true)),
		requestPlayers: () => dispatch(requestList('player', true)),
		requestEntities: query => dispatch(requestList('entity', false, query)),
		requestTileEntities: query =>
			dispatch(requestList('tile-entity', false, query)),
		requestDeleteEntity: (entity: Entity) =>
			dispatch(requestDelete('entity', ent => ent.uuid, entity))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Map);
