import * as moment from 'moment';
import * as React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AppAction } from '../../../actions';
import ItemStack from '../../../components/ItemStack';
import { UniversalMarketItem } from '../../../fetch';
import { AppState } from '../../../types';

import DataViewFunc from '../../../components/DataView';
const DataView = DataViewFunc('universal-market/item', 'id');

interface Props extends reactI18Next.InjectedTranslateProps {}

interface OwnState {}

class Items extends React.Component<Props, OwnState> {
	render() {
		const _t = this.props.t;

		return (
			<DataView
				icon="shopping cart"
				title={_t('Items')}
				filterTitle={_t('FilterItems')}
				fields={{
					item: {
						label: _t('Item'),
						filter: true,
						filterValue: (mi: UniversalMarketItem) =>
							mi.item.type.name + ' (' + mi.item.type.id + ')',
						view: (mi: UniversalMarketItem) => <ItemStack item={mi.item} />
					},
					price: _t('Price'),
					expires: {
						label: _t('Expires'),
						view: (mi: UniversalMarketItem) =>
							moment.unix(mi.expires).calendar()
					},
					'owner.name': _t('Seller')
				}}
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
)(translate('Integrations.UniversalMarket')(Items));
