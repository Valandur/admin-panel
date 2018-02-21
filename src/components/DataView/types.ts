import { SemanticICONS } from "semantic-ui-react"

import { ChangeRequestAction, CreateRequestAction, DeleteRequestAction, DetailsRequestAction,
	ListRequestAction, SetFilterAction } from "../../actions/dataview"
import { DataField, DataFieldViewFunc, DataViewRef, IdFunction } from "../../types"
import { PermissionTree } from "../Util"

export interface OwnProps<T> {
	title?: string
	icon?: SemanticICONS
	canEdit?: boolean
	canDelete?: boolean
	createTitle?: string
	createButton?: string
	filterTitle?: string
	filterButton?: string
	static?: boolean
	fields: {
		[key: string]: DataField<T> | DataFieldViewFunc<T> | string
	}
	actions?: (data: T, view: DataViewRef<T>) => JSX.Element
	onCreate?: (data: any, view: DataViewRef<T>) => void
	onEdit?: (data: T | null, view: DataViewRef<T>) => void
	onSave?: (data: T, newData: any, view: DataViewRef<T>) => void
	onDelete?: (data: T, view: DataViewRef<T>) => void
}

export interface StateProps<T> {
	creating: boolean
	list: T[]
	types: {}
	idFunc: IdFunction<T>
	perm: string[]
	perms?: PermissionTree
	filter: {
		[x: string]: string | string[]
	}
}

export interface Props<T> extends OwnProps<T>, StateProps<T>,
	reactI18Next.InjectedTranslateProps {}

export interface DispatchProps<T> {
	requestList: () => ListRequestAction
	requestCreate: (data: T) => CreateRequestAction<T>
	requestDetails: (data: T) => DetailsRequestAction<T>
	requestChange: (data: T, newData: any) => ChangeRequestAction<T>
	requestDelete: (data: T) => DeleteRequestAction<T>
	setFilter: (filter: string, value: string) => SetFilterAction
	equals:  (o1: T | null, o2: T | null) => boolean
}

export interface FullProps<T> extends Props<T>, DispatchProps<T> {}

export interface OwnState<T> {
	page: 0
	data: T | null
}
