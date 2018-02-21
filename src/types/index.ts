import { RouterState } from "react-router-redux"
import { Dispatch, Middleware, MiddlewareAPI } from "redux"
import { SemanticICONS } from "semantic-ui-react"

import { HandleChangeFunc } from "../components/Util"
import { Entity, PlayerFull, ServerProperty, TileEntity, WorldFull } from "../fetch"
import { ApiState } from "../reducers/api"
import { CommandState } from "../reducers/command"
import { DashboardState } from "../reducers/dashboard"
import { DataViewState } from "../reducers/dataview"
import { PermissionState } from "../reducers/permission"
import { PluginState } from "../reducers/plugin"
import { SettingsState } from "../reducers/settings"

// Lang
export type Lang = "en" | "de" | "fr" | "ru"

// Reducers
export interface AppState {
	api: ApiState
	dashboard: DashboardState
	cmd: CommandState
	entity: DataViewState<Entity>
	permission: PermissionState
	player: DataViewState<PlayerFull>
	plugin: PluginState
	world: DataViewState<WorldFull>
	tileentity: DataViewState<TileEntity>
	info_properties: SettingsState
	router: RouterState
}

// Middleware
export interface ExtendedMiddleware<StateType> extends Middleware {
	<S extends StateType>(api: MiddlewareAPI<S>): (next: Dispatch<S>) => Dispatch<S>
}

// Data table
export type IdFunction<T> = (obj: T) => string

export interface DataTableRef {
	state: any
	setState: (changes: any) => void
	handleChange: HandleChangeFunc
	value?: string | string[]
}
export interface DataViewRef<T> extends DataTableRef {
	create: (data: any) => void
	details: (data: T) => void
	save: (data: T, newData: any) => void
	edit: (data: T | null) => void
	delete: (data: T) => void
}

export type DataFieldViewFunc<T> = (obj: T, view: DataTableRef) => JSX.Element | string | undefined
export type DataFieldEditFunc<T> = (obj: T, view: DataTableRef) => JSX.Element | string | undefined
export type DataFieldFilterFunc = (view: DataTableRef) => JSX.Element | undefined
export type DataFieldCreateFunc = (view: DataTableRef) => JSX.Element | undefined
export interface DataField<T> {
	label?: string
	type?: string
	view?: DataFieldViewFunc<T> | boolean
	edit?: DataFieldEditFunc<T> | boolean
	createName?: string
	create?: DataFieldCreateFunc | boolean
	filterName?: string
	filter?: DataFieldFilterFunc | boolean
	filterValue?: (val: T) => string
	required?: boolean
	isGroup?: boolean
	options?: { value: string, text: string }[]
	wide?: boolean
}

export interface DataFieldRaw<T> extends DataField<T> {
	name: string
}

export interface DataFieldGroup<T> {
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

export interface EServerProperty extends ServerProperty {
	edit?: boolean
}

/*
export interface PluginContainer {
	id: string
	name: string
	version: string
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
*/
