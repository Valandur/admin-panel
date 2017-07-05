import React, { Component } from 'react'
import { connect } from "react-redux"
import { Stage, Layer, Image, Circle, Line } from "react-konva"
import { Button, Badge, Progress, Card, CardHeader, CardBlock, CardFooter } from "reactstrap"
import _ from 'lodash'

import { requestEntities } from "../../actions/entity"
import { requestPlayers } from "../../actions/player"
import { requestTileEntities } from "../../actions/tile-entity"

const TILE_SIZE = 512;
const ZOOM_SPEED = 0.01;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 16.0;

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
		}

		this.timeouts = []

		this.handleObjMouseDown = this.handleObjMouseDown.bind(this)
		this.handleMouseDown = this.handleMouseDown.bind(this)
		this.handleMouseMove = this.handleMouseMove.bind(this)
		this.handleMouseOutUp = this.handleMouseOutUp.bind(this)
		this.handleWheel = this.handleWheel.bind(this)

		this.getAllBiomes = _.debounce(this.getAllBiomes.bind(this), 500)
		this.worldToScreen = this.worldToScreen.bind(this)
		this.screenToWorld = this.screenToWorld.bind(this)
		this.center = this.center.bind(this)
	}

	componentDidMount() {
		this.props.requestEntities();
		this.props.requestPlayers();
		this.props.requestTileEntities();
		this.getAllBiomes();

		this.setState({
			width: this.wrapper.offsetWidth,
			height: window.innerHeight - this.wrapper.offsetTop - 30,
		})
	}

	getAllBiomes() {
		// z is inverse here because it's in screen coordinates
		const min = this.screenToWorld({ x: 0, z: 550 })
		const max = this.screenToWorld({ x: 1200, z: 0 })

		_.each(this.timeouts, timeout => clearTimeout(timeout))

		this.setState({
			biomes: _.filter(this.state.biomes, biome => 
				biome.x >= min.x && biome.x <= max.x && 
				biome.z >= min.z && biome.z <= max.z)
		}, () => {
			min.x = min.x - min.x % TILE_SIZE - TILE_SIZE
			min.z = min.z - min.z % TILE_SIZE - TILE_SIZE

			max.x = max.x - max.x % TILE_SIZE + TILE_SIZE
			max.z = max.z - max.z % TILE_SIZE + TILE_SIZE

			this.timeouts = [];
			for (let x = min.x; x <= max.x; x += TILE_SIZE) {
				for (let z = min.z; z <= max.z; z += TILE_SIZE) {
					if (_.find(this.state.biomes, { x: x, z: z }))
						continue;

					this.timeouts.push(
						setTimeout(() => this.getBiome(x, z), this.timeouts.length * 100)
					)
				}
			}
		})
	}

	getBiome(x, z) {
		const image = new window.Image();
    image.src = "http://localhost:8080/api/world/0af19d77-f8fc-4837-aae8-facbd7c54de9/map/" + 
    	(x / TILE_SIZE) + "/" + (z / TILE_SIZE);
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

	handleObjMouseDown(event, obj) {
		event.evt.cancelBubble = true;

		const loc = this.worldToScreen(obj.location.position)

		this.setState({
			left: loc.x,
			top: loc.z,
			display: "block",
			content: <Card>
					<CardHeader>
						{obj.name ? obj.name : obj.type ? obj.type : obj.uuid ? obj.uuid : null}
					</CardHeader>
					<CardBlock>
						{obj.inventory ?
							_.map(obj.inventory.items, item =>
								[<Badge color="primary" pill>
									{ item.quantity > 1 ? item.quantity + "x " : "" } {item.name}
								</Badge>," "]
							)
						: null }
						{obj.health ?
							<Progress
								className="my-1" color="success"
								value={(obj.health.current/obj.health.max)*100}
							/>
						: null}
					</CardBlock>
					<CardFooter>
						<Button type="button" color="danger" onClick={() => this.deleteEntity(obj)}>
							Destroy
						</Button>
					</CardFooter>
				</Card>,
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

	deleteEntity(entity) {

	}

	center() {
		return {
			x: Math.floor(this.state.width / 2) + this.state.center.x * this.state.zoom,
			z: 275 - this.state.center.z * this.state.zoom,
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
			<div className="animated fadeIn">
				<div style={{ position: "relative", width: "100%", height: "100%" }} ref={w => this.wrapper = w}>
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
									x={pos.x}
									y={pos.z}
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
							{ _.map(this.props.entities, ent => {
								const pos = this.worldToScreen(ent.location.position)

								return <Circle
									key={ent.uuid}
									x={pos.x}
									y={pos.z}
									width={8}
									height={8}
									fill={"Red"}
									perfectDrawEnabled={false}
									onMouseDown={e => this.handleObjMouseDown(e, ent)}
								/>
							})}
							{ _.map(this.props.players, player => {
								const pos = this.worldToScreen(player.location.position)

								return <Circle
									key={player.uuid}
									x={pos.x}
									y={pos.z}
									width={8}
									height={8}
									fill={"Gold"}
									perfectDrawEnabled={false}
									onMouseDown={e => this.handleObjMouseDown(e, player)}
								/>
							})}
							{ _.map(this.props.tileEntities, te => {
								const pos = this.worldToScreen(te.location.position)

								return <Circle
									key={"te-" + te.location.position.x + "-" + te.location.position.z}
									x={pos.x}
									y={pos.z}
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
			</div>
		)
	}
}

const mapStateToProps = (_state) => {
	return {
		entities: _state.entity.entities,
		//players: _state.player.players,
		tileEntities: _state.tileEntity.tileEntities,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestEntities: () => dispatch(requestEntities(true)),
		requestPlayers: () => dispatch(requestPlayers(true)),
		requestTileEntities: () => dispatch(requestTileEntities(true)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);


/*
{ _.map(this.state.biomes, (xBiomes, x) => {
								return _.map(xBiomes, (biome, z) => {
									return <Rect
										key={x + "-" + z}
										x={x * 8}
										y={z * 8}
										width={8}
										height={8}
										fill={biomeColorMap[biome] ? biomeColorMap[biome] : "Black"}
									/>
								})
							})}
							*/