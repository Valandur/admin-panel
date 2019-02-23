import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
	AppAction,
	CatalogRequestAction,
	requestCatalog
} from '../../../actions';
import DataViewFunc, { DataViewFields } from '../../../components/DataView';
import { renderCatalogTypeOptions } from '../../../components/Util';
import { CatalogType, MMCRestrictItem } from '../../../fetch';
import { AppState, CatalogTypeKeys } from '../../../types';

import Edit from './Edit';
import Icon from './Icon';

// tslint:disable-next-line: variable-name
const DataView = DataViewFunc('mmc-restrict/item', 'item.id');

interface Props extends WithTranslation {
	itemTypes: CatalogType[];
	requestCatalog: (type: string) => CatalogRequestAction;
}

interface OwnState {}

class Items extends React.Component<Props, OwnState> {
	public componentDidMount() {
		this.props.requestCatalog(CatalogTypeKeys.Item);
	}

	public render() {
		const { t } = this.props;

		const fields: DataViewFields<MMCRestrictItem> = {
			'item.name': {
				create: true,
				createName: 'item.id',
				label: t('Item'),
				required: true,
				options: renderCatalogTypeOptions(this.props.itemTypes)
			},
			banReason: {
				label: t('Reason'),
				create: true,
				edit: true
			},
			usageBanned: {
				label: t('Usage'),
				view: ban => <Icon ban={ban.usageBanned} />,
				edit: (ban, view) => <Edit view={view} name="usageBanned" />
			},
			breakingBanned: {
				label: t('Breaking'),
				view: ban => <Icon ban={ban.breakingBanned} />,
				edit: (ban, view) => <Edit view={view} name="breakingBanned" />
			},
			placingBanned: {
				label: t('Placing'),
				view: ban => <Icon ban={ban.placingBanned} />,
				edit: (ban, view) => <Edit view={view} name="placingBanned" />
			},
			ownershipBanned: {
				label: t('Ownership'),
				view: ban => <Icon ban={ban.ownershipBanned} />,
				edit: (ban, view) => <Edit view={view} name="ownershipBanned" />
			},
			dropBanned: {
				label: t('Drop'),
				view: ban => <Icon ban={ban.dropBanned} />,
				edit: (ban, view) => <Edit view={view} name="dropBanned" />
			},
			craftBanned: {
				label: t('Craft'),
				view: ban => <Icon ban={ban.craftBanned} />,
				edit: (ban, view) => <Edit view={view} name="craftBanned" />
			},
			worldBanned: {
				label: t('World'),
				view: ban => <Icon ban={ban.worldBanned} />,
				edit: (ban, view) => <Edit view={view} name="worldBanned" />
			}
		};

		return (
			<DataView
				canEdit
				canDelete
				icon="ban"
				title={t('RestrictedItems')}
				createTitle={t('CreateRestrictedItem')}
				fields={fields}
			/>
		);
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		itemTypes: state.api.types[CatalogTypeKeys.Item]
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCatalog: (type: string) => dispatch(requestCatalog(type))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Integrations.MMCRestrict')(Items));
