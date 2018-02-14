import { PermissionTree } from "../Util"
import { IdFunction, DataViewRef, DataField, DataObject, DataFieldViewFunc } from "../../types"
import { SemanticICONS } from "semantic-ui-react"
import { Action } from "redux"

export interface OwnProps<T extends DataObject> {
	actions: (data: T, view: DataViewRef<T>) => JSX.Element
	title: string
	icon: SemanticICONS
	canEdit: boolean
	canDelete: boolean
	createTitle?: string
	createButton?: string
	filterTitle?: string
	filterButton?: string
	static: boolean
	fields: {
		[key: string]: DataField<T> | DataFieldViewFunc<T> | string
	}
	idFunc: (data: T) => string
	onCreate: (data: T, view: DataViewRef<T>) => void
	onEdit: (data: T | null, view: DataViewRef<T>) => void
	onSave: (data: T, newData: T | {}, view: DataViewRef<T>) => void
	onDelete: (data: T, view: DataViewRef<T>) => void
}

export interface StateProps<T extends DataObject> {
	creating: boolean
	list: T[]
	types: {}
	idFunc: IdFunction<T>
	perm: string[]
	perms: PermissionTree
	filter: {
		[x: string]: string | string[]
	}
}

export interface Props<T extends DataObject> extends OwnProps<T>, StateProps<T>,
	reactI18Next.InjectedTranslateProps {}

export interface DispatchProps<T extends DataObject> {
	requestList: () => Action
	requestCreate: (data: T) => Action
	requestDetails: (data: T) => Action
	requestChange: (data: T, newData: T | {}) => Action
	requestDelete: (data: T) => Action
	setFilter: (filter: string, value: string) => Action
	equals:  (o1: T | null, o2: T | null) => boolean
}

export interface FullProps<T  extends DataObject> extends Props<T>, DispatchProps<T> {}

export interface OwnState<T  extends DataObject> {
	page: 0
	data: T | null
}
