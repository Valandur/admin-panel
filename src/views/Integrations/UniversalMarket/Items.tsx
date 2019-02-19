import * as moment from 'moment';
import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AppAction } from '../../../actions';
import DataViewFunc, { DataViewFields } from '../../../components/DataView';
import ItemStack from '../../../components/ItemStack';
import { UniversalMarketItem } from '../../../fetch';
import { AppState } from '../../../types';

// tslint:disable-next-line: variable-name
const DataView = DataViewFunc('universal-market/item', 'id');

interface Props extends WithTranslation {}

interface OwnState {}

class Items extends React.Component<Props, OwnState> {
	public render() {
		const { t } = this.props;

		const fields: DataViewFields<UniversalMarketItem> = {
			item: {
				label: t('Item'),
				filter: true,
				filterValue: (mi: UniversalMarketItem) =>
					mi.item.type.name + ' (' + mi.item.type.id + ')',
				view: (mi: UniversalMarketItem) => <ItemStack item={mi.item} />
			},
			price: t('Price'),
			expires: {
				label: t('Expires'),
				view: (mi: UniversalMarketItem) => moment.unix(mi.expires).calendar()
			},
			'owner.name': t('Seller')
		};

		return (
			<DataView
				icon="shopping cart"
				title={t('Items')}
				filterTitle={t('FilterItems')}
				fields={fields}
			/>
		);
	}
}

const mapStateToProps = (state: AppState) => {
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Integrations.UniversalMarket')(Items));
