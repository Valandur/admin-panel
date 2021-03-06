import * as React from 'react';
import * as Loadable from 'react-loadable';
import { Loader, Message } from 'semantic-ui-react';

import { ViewDefinition } from '../../types';

export function load(
	func: () => Promise<React.ComponentType | { default: React.ComponentType }>
): React.ComponentType {
	return Loadable({
		loader: func,
		loading: props => {
			if (props.error) {
				return (
					<Message negative={true}>
						<Message.Header>Apologies, there was an error!</Message.Header>
					</Message>
				);
			} else if (props.timedOut) {
				return <Loader size="big">This is taking a while...</Loader>;
			} else if (props.pastDelay) {
				return <Loader size="big">Loading...</Loader>;
			} else {
				return null;
			}
		}
	});
}

// tslint:disable:variable-name
const Dashboard = load(() => import('../../views/Dashboard'));
const Chat = load(() => import('../../views/Chat'));
const Commands = load(() => import('../../views/Commands'));
const Worlds = load(() => import('../../views/Worlds'));
const Players = load(() => import('../../views/Players'));
const Permissions = load(() => import('../../views/Permissions'));
const BlockOperations = load(() => import('../../views/BlockOperations'));
const Plugins = load(() => import('../../views/Plugins'));
const ServerSettings = load(() => import('../../views/ServerSettings'));
const Users = load(() => import('../../views/Users'));

const CmdScheduler = load(() =>
	import('../../views/Integrations/CmdScheduler')
);
const MMCRestrictItems = load(() =>
	import('../../views/Integrations/MMCRestrict/Items')
);
const MMCTicketsTickets = load(() =>
	import('../../views/Integrations/MMCTickets/Tickets')
);
const NucleusJails = load(() =>
	import('../../views/Integrations/Nucleus/Jails')
);
const NucleusKits = load(() => import('../../views/Integrations/Nucleus/Kits'));
const UMItems = load(() =>
	import('../../views/Integrations/UniversalMarket/Items')
);
const WebBooksBooks = load(() =>
	import('../../views/Integrations/WebBooks/Books')
);
const VShopsShops = load(() =>
	import('../../views/Integrations/VillagerShops/Shops')
);

export const views: Array<ViewDefinition> = [
	{
		title: 'Dashboard',
		path: '/dashboard',
		icon: 'dashboard',
		perms: null,
		component: Dashboard
	},
	{
		title: 'Chat',
		path: '/chat',
		icon: 'chat',
		perms: ['history', 'message'],
		servlets: ['/history'],
		component: Chat
	},
	{
		title: 'Commands',
		path: '/commands',
		icon: 'terminal',
		perms: [['history', 'cmd'], ['cmd', 'list']],
		servlets: [['/history'], ['/cmd']],
		component: Commands
	},
	{
		title: 'Worlds',
		path: '/worlds',
		icon: 'globe',
		perms: ['world', 'list'],
		servlets: ['/world'],
		component: Worlds
	},
	{
		title: 'Players',
		path: '/players',
		icon: 'users',
		perms: ['player', 'list'],
		servlets: ['/player'],
		component: Players
	},
	{
		title: 'Permissions',
		path: '/permissions',
		icon: 'lock',
		perms: ['permission', 'collection', 'list'],
		servlets: ['/permission'],
		component: Permissions
	},
	{
		title: 'BlockOperations',
		path: '/block-operations',
		icon: 'block layout',
		perms: ['block', 'op', 'list'],
		servlets: ['/block'],
		component: BlockOperations
	},
	{
		title: 'Plugins',
		path: '/plugins',
		icon: 'plug',
		perms: ['plugin', 'list'],
		servlets: ['/plugin'],
		component: Plugins
	},
	{
		title: 'ServerSettings',
		path: '/server-settings',
		icon: 'cogs',
		perms: ['info', 'properties'],
		servlets: ['/info'],
		component: ServerSettings
	},
	{
		title: 'Users',
		path: '/users',
		icon: 'users',
		perms: ['user', 'list'],
		servlets: ['/user'],
		component: Users
	},

	// ----------------
	//   Integrations
	// ----------------
	{
		title: 'CmdScheduler',
		path: '/cmd-scheduler',
		perms: ['cmd-scheduler'],
		servlets: ['/cmd-scheduler'],
		views: [
			{
				title: 'Commands',
				path: '/cmd-scheduler',
				icon: 'calendar',
				perms: ['cmd-scheduler', 'list'],
				component: CmdScheduler
			}
		]
	},
	{
		title: 'MMCRestrict',
		path: '/mmc-restrict',
		perms: ['mmc-restrict'],
		servlets: ['/mmc-restrict'],
		views: [
			{
				title: 'MMCRestrictItems',
				path: '/mmc-restrict/items',
				icon: 'ban',
				perms: ['mmc-restrict', 'item'],
				component: MMCRestrictItems
			}
		]
	},
	{
		title: 'MMCTickets',
		path: '/mmc-tickets',
		perms: ['mmc-tickets'],
		servlets: ['/mmc-tickets'],
		views: [
			{
				title: 'MMCTicketsTickets',
				path: '/mmc-tickets/tickets',
				icon: 'ticket',
				perms: ['mmc-tickets', 'ticket'],
				component: MMCTicketsTickets
			}
		]
	},
	{
		title: 'Nucleus',
		path: '/nucleus',
		perms: ['nucleus'],
		servlets: ['/nucleus'],
		views: [
			{
				title: 'NucleusJails',
				path: '/nucleus/jails',
				icon: 'bars',
				perms: ['nucleus', 'jail'],
				component: NucleusJails
			},
			{
				title: 'NucleusKits',
				path: '/nucleus/kits',
				icon: 'wrench',
				perms: ['nucleus', 'kit'],
				component: NucleusKits
			}
		]
	},
	{
		title: 'UniversalMarket',
		path: '/universal-market',
		perms: ['universal-market'],
		servlets: ['/universal-market'],
		views: [
			{
				title: 'UniversalMarketItems',
				path: '/universal-market/items',
				icon: 'shopping cart',
				perms: ['universal-market', 'item'],
				component: UMItems
			}
		]
	},
	{
		title: 'VShops',
		path: '/vshop',
		perms: ['vshop'],
		servlets: ['/vshop'],
		views: [
			{
				title: 'VShopShops',
				path: '/vshop/shop',
				icon: 'shop',
				perms: ['vshop', 'shop'],
				component: VShopsShops
			}
		]
	},
	{
		title: 'WebBooks',
		path: '/web-books',
		perms: ['web-books'],
		servlets: ['/web-books'],
		views: [
			{
				title: 'WebBooksBooks',
				path: '/web-books/books',
				icon: 'book',
				perms: ['webbooks', 'book'],
				component: WebBooksBooks
			}
		]
	}
];
