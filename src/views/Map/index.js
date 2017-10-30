import React, { Component } from 'react'
import { connect } from "react-redux"
import { Stage, Layer, Image, Circle, Line } from "react-konva"
import { Segment, Header, Button, Progress, Dropdown } from "semantic-ui-react"
import Slider from "rc-slider"
import _ from "lodash"

import Inventory from "../../components/Inventory"

import { requestWorlds } from "../../actions/world"
import { requestEntities } from "../../actions/entity"
import { requestPlayers } from "../../actions/player"
import { requestTileEntities } from "../../actions/tile-entity"

const TILE_SIZE = 512;
const HALF_TILE = TILE_SIZE / 2;
const ZOOM_SPEED = 0.01;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 16.0;

const totalOffset = (element) => {
		let top = 0;
		let left = 0;

		do {
				top += element.offsetTop  || 0;
				left += element.offsetLeft || 0;
				element = element.offsetParent;
		} while(element);

		return {
				top: top,
				left: left
		};
}

const marks = {
	0.400: <strong>MIN</strong>,
	0.707: "0.25x",
	0.841: "0.5x",
	1: "-",
	1.189: "2x",
	1.414: "4x",
	1.682: "8x",
	2: <strong>MAX</strong>,
}

class Map extends Component {

	constructor(props) {
		super(props);

		this.state = {
			biomes: [],
			top: 0,
			left: 0,
			width: 0,
			height: 0,
			display: "none",
			content: null,
			center: {
				x: 0,
				z: 0,
			},
			zoom: 1,
			dragging: false,
			worldId: null,
		}

		this.timeouts = []

		this.handleObjMouseDown = this.handleObjMouseDown.bind(this)
		this.handleMouseDown = this.handleMouseDown.bind(this)
		this.handleMouseMove = this.handleMouseMove.bind(this)
		this.handleMouseOutUp = this.handleMouseOutUp.bind(this)
		this.handleWheel = this.handleWheel.bind(this)
		this.handleWorldChange = this.handleWorldChange.bind(this)

		this.updateDimensions = _.debounce(this.updateDimensions.bind(this), 500)
		this.getAllBiomes = _.debounce(this.getAllBiomes.bind(this), 500)
		this.worldToScreen = this.worldToScreen.bind(this)
		this.screenToWorld = this.screenToWorld.bind(this)
		this.center = this.center.bind(this)
	}

	componentDidMount() {
		this.props.requestEntities();
		this.props.requestPlayers();
		this.props.requestTileEntities();
		this.props.requestWorlds();

		window.addEventListener("resize", this.updateDimensions);
		this.updateDimensions();
	}
	
	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}

	updateDimensions() {
		if (!this.wrapper) return;
		
		this.setState({
			width: this.wrapper.offsetWidth,
			height: window.innerHeight - totalOffset(this.wrapper).top - 30,
		}, () => this.getAllBiomes())
	}

	getAllBiomes() {
		// If we didn't select a world yet do nothing
		if (!this.state.worldId) return;

		// z is inverse here because it's in screen coordinates
		const min = this.screenToWorld({ x: 0, z: this.state.height })
		const max = this.screenToWorld({ x: this.state.width, z: 0 })

		_.each(this.timeouts, timeout => clearTimeout(timeout))

		this.setState({
			biomes: _.filter(this.state.biomes, biome => 
				biome.x + HALF_TILE >= min.x && biome.x - HALF_TILE <= max.x && 
				biome.z + HALF_TILE >= min.z && biome.z - HALF_TILE <= max.z)
		}, () => {
			min.x = min.x - min.x % TILE_SIZE - TILE_SIZE
			min.z = min.z - min.z % TILE_SIZE - TILE_SIZE

			max.x = max.x - max.x % TILE_SIZE + TILE_SIZE
			max.z = max.z - max.z % TILE_SIZE + TILE_SIZE

			let index = 0;
			this.timeouts = [];
			for (let x = min.x; x <= max.x; x += TILE_SIZE) {
				for (let z = min.z; z <= max.z; z += TILE_SIZE) {
					if (_.find(this.state.biomes, { x: x, z: z }))
						continue;

					this.timeouts.push(
						setTimeout(() => this.getBiome(x, z), index * 100)
					)
					index++;	
				}
			}
		})
	}

	getBiome(x, z) {
		const image = new window.Image();
		image.src = "/api/map/" + this.state.worldId + "/" + (x / TILE_SIZE) + "/" + (z / TILE_SIZE) + "?key=" + this.props.apiKey;
		image.onload = () => {
			this.setState({
				biomes: _.concat(this.state.biomes, {
					x: x,
					z: z,
					image,
				})
			})
		}
	}

	handleWorldChange(event, data) {
		this.setState({
			biomes: [],
			worldId: data.value,
		}, () => this.getAllBiomes())
	}

	handleObjMouseDown(event, obj) {
		event.evt.cancelBubble = true;

		const loc = this.worldToScreen(obj.location.position)

		this.setState({
			left: loc.x,
			top: loc.z,
			display: "block",
			content: <Segment>
					<Header>
						{obj.name ? obj.name : obj.type ? obj.type : obj.uuid ? obj.uuid : null}
					</Header>
					{obj.uuid}<br />
					{obj.inventory ?
						<Inventory items={obj.inventory.items} />
					: null }
					{obj.health ?
						<Progress color="green" percent={(obj.health.current/obj.health.max)*100} />
					: null}
					<Button color="red" onClick={() => this.deleteEntity(obj)}>
						Destroy
					</Button>
				</Segment>,
		})
	}

	handleMouseDown(event) {
		if (event.evt.cancelBubble) return;

		this.setState({
			dragging: true,
			display: "none",
		})
	}

	handleMouseMove(event) {
		if (!this.state.dragging) return;

		this.setState({
			center: {
				x: this.state.center.x + event.evt.movementX / this.state.zoom,
				z: this.state.center.z - event.evt.movementY / this.state.zoom,
			}
		}, () => this.getAllBiomes())
	}

	handleMouseOutUp(event) {
		if (event.evt.cancelBubble) return;

		this.setState({
			dragging: false,
		})
	}

	handleWheel(event) {
		const d = event.evt.deltaY
		const diff = Math.abs(d * ZOOM_SPEED)
		const newValue = d > 0 ? this.state.zoom / diff : this.state.zoom * diff

		this.setState({
			zoom: Math.min(Math.max(newValue, MIN_ZOOM), MAX_ZOOM),
		}, () => this.getAllBiomes())
	}

	handleZoomChange(value) {
		this.setState({
			zoom: Math.min(Math.max(Math.pow(value, 4), MIN_ZOOM), MAX_ZOOM),
		}, () => this.getAllBiomes())
	}

	deleteEntity(entity) {

	}

	center() {
		return {
			x: Math.floor(this.state.width / 2) + this.state.center.x * this.state.zoom,
			z: Math.floor(this.state.height / 2) - this.state.center.z * this.state.zoom,
		}
	}

	worldToScreen({ x, z }) {
		const center = this.center()
		return {
			x: center.x + x * this.state.zoom,
			z: center.z - z * this.state.zoom,
		}
	}

	screenToWorld({ x, z }) {
		const center = this.center()
		return {
			x: (x - center.x) / this.state.zoom,
			z: (center.z - z) / this.state.zoom,
		}
	}

	render() {
		const center = this.center()
		const cX = center.x
		const cZ = center.z

		return (
			<Segment basic style={{ position: "relative" }}>
				<div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} ref={w => this.wrapper = w}>
					<Stage width={this.state.width} height={this.state.height} ref={s => this.stage = s}
							onContentMouseDown={e => this.handleMouseDown(e)}
							onContentMouseUp={e => this.handleMouseOutUp(e)}
							onContentMouseOut={e => this.handleMouseOutUp(e)}
							onContentMouseMove={e => this.handleMouseMove(e)}
							onContentWheel={e => this.handleWheel(e)}>
						<Layer>
						{ _.map(this.state.biomes, biome => {
								const pos = this.worldToScreen(biome)

								return <Image
									key={biome.x + "+" + biome.z}
									x={pos.x - HALF_TILE * this.state.zoom}
									y={pos.z - HALF_TILE * this.state.zoom}
									image={biome.image}
									width={TILE_SIZE * this.state.zoom}
									height={TILE_SIZE * this.state.zoom}
								/>
						})}
						</Layer>
						<Layer>
							<Line points={[0, cZ, 2000, cZ]} stroke="Black" strokeWidth={1} />
							<Line points={[cX, 0, cX, 2000]} stroke="Black" strokeWidth={1} />
						</Layer>
						<Layer>
							{ _.map(_.filter(this.props.entities, e => e.location.world.uuid === this.state.worldId), ent => {
								const pos = this.worldToScreen(ent.location.position)

								return <Circle
									key={ent.uuid}
									x={pos.x - 4}
									y={pos.z - 4}
									width={8}
									height={8}
									fill={"Red"}
									perfectDrawEnabled={false}
									onMouseDown={e => this.handleObjMouseDown(e, ent)}
								/>
							})}
							{ _.map(_.filter(this.props.players, p => p.location.world.uuid === this.state.worldId), player => {
								const pos = this.worldToScreen(player.location.position)

								return <Circle
									key={player.uuid}
									x={pos.x - 4}
									y={pos.z - 4}
									width={8}
									height={8}
									fill={"Gold"}
									perfectDrawEnabled={false}
									onMouseDown={e => this.handleObjMouseDown(e, player)}
								/>
							})}
							{ _.map(_.filter(this.props.tileEntities, te => te.location.world.uuid === this.state.worldId), te => {
								const pos = this.worldToScreen(te.location.position)

								return <Circle
									key={"te-" + te.location.position.x + "-" + te.location.position.z}
									x={pos.x - 4}
									y={pos.z - 4}
									width={8}
									height={8}
									fill={"Green"}
									perfectDrawEnabled={false}
									onMouseDown={e => this.handleObjMouseDown(e, te)}
								/>
							})}
						</Layer>
					</Stage>
					<div style={{ display: this.state.display, zIndex: 1000, position: "absolute", top: this.state.top, left: this.state.left }}>
						{this.state.content}
					</div>
				</div>
				<Segment style={{ position: "absolute", "top": 0, "left": 10 }}>
					<Dropdown
						id="world" placeholder="Select world..."
						value={this.state.worldId} onChange={this.handleWorldChange}
						options={_.map(this.props.worlds, world => 
							({ value: world.uuid, text: world.name + " (" + world.dimensionType.name + ")" })
						)}
					/>
				</Segment>
				<Segment style={{ position: "absolute", "top": 60, "left": 10, height: "25vh", width: 80 }}>
					<Slider
						vertical marks={marks} min={0.400} max={2} step={0.001} value={Math.pow(this.state.zoom, 1/4)}
						onChange={v => this.handleZoomChange(v)}
						trackStyle={{ backgroundColor: 'blue' }}
						handleStyle={{ borderColor: 'blue' }}
					/>
				</Segment>
			</Segment>
		)
	}
}

const mapStateToProps = (_state) => {
	return {
		entities: _state.entity.entities,
		worlds: _state.world.worlds,
		players: _state.player.players,
		tileEntities: _state.tileEntity.tileEntities,
		apiKey: _state.api.key,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestWorlds: () => dispatch(requestWorlds(true)),
		requestEntities: () => dispatch(requestEntities(true)),
		requestPlayers: () => dispatch(requestPlayers(true)),
		requestTileEntities: () => dispatch(requestTileEntities(true)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
