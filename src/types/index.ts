import { SemanticICONS } from "semantic-ui-react"
import { HandleChangeFunc, PermissionTree } from "../components/Util"
import { MiddlewareAPI, Dispatch, Middleware } from "redux"
import { ApiState } from "../reducers/api"
import { CommandState } from "../reducers/command"
import { DataViewState } from "../reducers/dataview"
import { DashboardState } from "../reducers/dashboard"
import { PluginState } from "../reducers/plugin"
import { SettingsState } from "../reducers/settings"
import { RouterState } from "react-router-redux"

// Lang
export type Lang = "en" | "de" | "fr" | "ru"

// Reducers
export interface AppState {
	api: ApiState
	cmd: CommandState
	dashboard: DashboardState
	entity: DataViewState<Entity>
	player: DataViewState<Player>
	plugin: PluginState
	world: DataViewState<World>
	settings: SettingsState
	"tile-entity": DataViewState<any>
	router: RouterState
}

// Middleware
export interface ExtendedMiddleware<StateType> extends Middleware {
	<S extends StateType>(api: MiddlewareAPI<S>): (next: Dispatch<S>) => Dispatch<S>
}

// Data table
export type IdFunction<T> = (obj: T) => string

export interface DataObject {
	updating?: boolean
}

export interface DataTableRef {
	state: any
	setState: (changes: any) => void
	handleChange: HandleChangeFunc
	value?: string | string[]
}
export interface DataViewRef<T extends DataObject> extends DataTableRef {
	create: (data: any) => void
	details: (data: T) => void
	save: (data: T, newData: any) => void
	edit: (data: T | null) => void
	delete: (data: T) => void
}

export type DataFieldViewFunc<T extends DataObject> = (obj: T, view: DataTableRef) => JSX.Element | string | undefined
export type DataFieldFilterFunc = (view: DataTableRef) => JSX.Element
export type DataFieldCreateFunc = (view: DataTableRef) => JSX.Element
export type DataFieldEditFunc<T extends DataObject> = (obj: T, view: DataTableRef) => void
export interface DataField<T extends DataObject> {
	label?: string
	type?: string
	view?: DataFieldViewFunc<T> | boolean
	createName?: string
	create?: DataFieldCreateFunc | boolean
	filterName?: string
	filter?: DataFieldFilterFunc | boolean
	filterValue?: (val: T) => string
	edit?: DataFieldEditFunc<T> | boolean
	required?: boolean
	isGroup?: boolean
	options?: { value: string, text: string }[]
	wide?: boolean
}

export interface DataFieldRaw<T extends DataObject> extends DataField<T> {
	name: string
}

export interface DataFieldGroup<T extends DataObject> {
	first?: DataFieldRaw<T>
	second?: DataFieldRaw<T>
	only?: DataFieldRaw<T>
}

// Views
export interface ViewDefinition {
	title: string,
	path: string,
	icon?: SemanticICONS,
	perms: string[] | null,
	component?: React.ComponentType,
	views?: ViewDefinition[],
}

// Dashboard
export interface ServerStat {
	timestamp: number
	value: number
}

// Autosuggest
export interface AutosuggestItem {
	value: string
	content: string
}

export interface AutosuggestChangeData {
	id: string
	name: string
	value: string
}

// Models
export interface Server {
	name: string
	apiUrl: string
}

export class Error {
	status: number
	error: string
}

export interface InfoData {
	tps: number
	players: number
	maxPlayers: number
	onlineMode: boolean
	address: string
	uptimeTicks: number
	game: PluginContainer
	api: PluginContainer
	implementation: PluginContainer
}

export interface PluginContainer {
	id: string
	name: string
	version: string
}

export interface UserPermissions {
	key: string
	permissions: PermissionTree
	rateLimit: number
}

export interface CatalogType {
	id: string
	name: string
}

export interface ItemStack {
	type: CatalogType
	quantity: number
	data: ItemData
}

export interface ItemData {
	potionEffects?: ItemPotionEffect[]
	durability?: ItemDurability
	enchantments?: ItemEnchantment[]
	spawn?: CatalogType
	foodRestoration?: number
	burningFuel?: number
}

export interface ItemDurability {
	unbreakable: boolean
	durability: number
	useLimit: number
}

export interface ItemEnchantment extends CatalogType {
	level: number
}

export interface ItemPotionEffect extends CatalogType {
	amplifier: number
}

export interface Player extends DataObject {
	uuid: string
	name: string
}

export interface ServerProp extends DataObject {
	key: string
	value: string
	edit?: boolean
}

export interface World extends DataObject {
	uuid: string
	name: string
	dimensionType: CatalogType
}

export interface BlockState {

}

export enum BlockOpType {
	GET,
	CHANGE,
}
export enum BlockOpStatus {
	DONE,
	PAUSED,
	ERRORED,
	RUNNING,
}
export interface BlockOp extends DataObject {
	uuid: string
	type: BlockOpType
	status: BlockOpStatus
	estimatedSecondsRemaining: number
	progress: number
	error?: string
	blocks?: BlockState[][][]
}

export interface ChatMessage extends DataObject {
	timestamp: number
	message: string
	sender: Player
}

export interface Command extends DataObject {
	name: string
	description: string
	usage: string
}

export interface CommandCall extends DataObject {
	timestamp: number
	command: string
	args: string
	cause: Cause
}

export interface Cause {
	causes: any[]
	source: any
}

export interface Entity extends DataObject {
	uuid: string
	type: CatalogType
	location: Location
	health?: {
		current: number
		max: number
	}
	aiEnabled?: boolean
	age?: {
		adult: boolean
		age: number
	}
	breedable?: boolean
	career?: CatalogType
	flying: boolean
	glowing: boolean
	silent: boolean
	sneaking: boolean
	sprinting: boolean
}

export interface Vector3 {
	x: number
	y: number
	z: number
}

export interface Location {
	world: World
	position: Vector3
}
