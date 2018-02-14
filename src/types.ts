import * as Loadable from "react-loadable"
import { SemanticICONS } from "semantic-ui-react"
import { HandleChangeFunc, PermissionTree } from "./components/Util"

// Reducers
export interface AppStore {
	api: ApiStore
	dashboard: DashboardStore
}

export interface ApiStore {
	server: Server
	servers: Server[]
	servlets: {}
	types: {}
	lang: string
	permissions: PermissionTree
}

export interface Server {
	name: string
	apiUrl: string
}

export interface DataViewStore<T> {
	creating: boolean
	filter: {
		[x: string]: string | string[]
	}
	list: T[]
}

export interface DashboardStore {
	tps: ServerStat[]
	players: ServerStat[]
	cpu: ServerStat[]
	memory: ServerStat[]
	disk: ServerStat[]
}

// Data table
export type IdFunction<T> = (obj: T) => string

export interface DataObject {
	updating?: boolean
}

export interface DataTableRef<T extends DataObject> {
	state?: T | {}
	handleChange?: HandleChangeFunc
	setState?: (changes: object) => void
	value?: string | string[]
}
export interface DataViewRef<T extends DataObject> extends DataTableRef<T> {
	create: Function
	details: Function
	save: Function
	edit: Function
	delete: Function
}

export type DataFieldViewFunc<T extends DataObject> = (obj: T, view: DataTableRef<T>) => JSX.Element
export type DataFieldFilterFunc<T extends DataObject> = (view: DataTableRef<T>) => JSX.Element
export type DataFieldCreateFunc<T extends DataObject> = (view: DataTableRef<T>) => JSX.Element
export type DataFieldEditFunc<T extends DataObject> = (obj: T, view: DataTableRef<T>) => void
export interface DataField<T extends DataObject> {
	label?: string
	type?: string
	view?: DataFieldViewFunc<T> | boolean
	createName?: string
	create?: DataFieldCreateFunc<T> | boolean
	filterName?: string
	filter?: DataFieldFilterFunc<T> | boolean
	filterValue?: (val: T) => string
	edit?: DataFieldEditFunc<T> | boolean
	required?: boolean
	isGroup?: boolean
	options?: object[]
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
	component?: Loadable.LoadableComponent,
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
