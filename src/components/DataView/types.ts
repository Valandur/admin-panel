import { SemanticICONS } from 'semantic-ui-react';

import { AppAction } from '../../actions';
import {
	DataField,
	DataFieldViewFunc,
	DataViewRef,
	IdFunction,
	PermissionTree
} from '../../types';

export interface OwnProps<T> {
	title?: string;
	icon?: SemanticICONS;
	canEdit?: boolean | ((data: T) => boolean);
	canDelete?: boolean | ((data: T) => boolean);
	createTitle?: string;
	createButton?: string;
	filterTitle?: string;
	filterButton?: string;
	static?: boolean;
	fields: {
		[key: string]: DataField<T> | DataFieldViewFunc<T> | string;
	};
	checkCreatePerm?: boolean;
	actions?: (data: T, view: DataViewRef<T>) => JSX.Element | undefined;
	onCreate?: (data: any, view: DataViewRef<T>) => void;
	onEdit?: (data: T | null, view: DataViewRef<T>) => void;
	onSave?: (data: T, newData: any, view: DataViewRef<T>) => void;
	onDelete?: (data: T, view: DataViewRef<T>) => void;
}

export interface StateProps<T> {
	creating: boolean;
	list: T[];
	types: {};
	idFunc: IdFunction<T>;
	perm: string[];
	perms: PermissionTree | undefined;
	filter: {
		[x: string]: string | string[];
	};
}

export interface Props<T>
	extends OwnProps<T>,
		StateProps<T>,
		reactI18Next.InjectedTranslateProps {}

export interface DispatchProps<T> {
	requestList: () => AppAction;
	requestCreate: (data: T) => AppAction;
	requestDetails: (data: T) => AppAction;
	requestChange: (data: T, newData: any) => AppAction;
	requestDelete: (data: T) => AppAction;
	setFilter: (filter: string, value: string) => AppAction;
	equals: (o1: T | null, o2: T | null) => boolean;
}

export interface FullProps<T> extends Props<T>, DispatchProps<T> {}

export interface OwnState<T> {
	page: 0;
	data: T | null;
}
