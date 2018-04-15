import * as React from "react"
import * as Loadable from "react-loadable"
import { Loader, Message } from "semantic-ui-react"

import { ViewDefinition } from "../../types"

function load(func: () => Promise<React.ComponentType | { default: React.ComponentType }>): React.ComponentType {
	return Loadable({
		loader: func,
		loading: (props) => {
			if (props.error) {
				return (
					<Message negative={true}>
						<Message.Header>Apologies, there was an error!</Message.Header>
					</Message>
				)
			} else if (props.timedOut) {
				return <Loader size="big">This is taking a while...</Loader>
			} else if (props.pastDelay) {
				return <Loader size="big">Loading...</Loader>
			} else {
				return null
			}
		}
	})
}

const Dashboard = load(() => import("../../views/Dashboard"))
const Chat = load(() => import("../../views/Chat"))
const Commands = load(() => import("../../views/Commands"))
const Map = load(() => import("../../views/Map"))
const Worlds = load(() => import("../../views/Worlds"))
const Players = load(() => import("../../views/Players"))
const Entities = load(() => import("../../views/Entities"))
const TileEntities = load(() => import("../../views/TileEntities"))
const Permissions = load(() => import("../../views/Permissions"))
const BlockOperations = load(() => import("../../views/BlockOperations"))
const Plugins = load(() => import("../../views/Plugins"))
const ServerSettings = load(() => import("../../views/ServerSettings"))

const HuskyCratesCrates = load(() => import("../../views/Integrations/HuskyCrates/Crates"))
const MMCRestrictItems = load(() => import("../../views/Integrations/MMCRestrict/Items"))
const MMCTicketsTickets = load(() => import("../../views/Integrations/MMCTickets/Tickets"))
const NucleusJails = load(() => import("../../views/Integrations/Nucleus/Jails"))
const NucleusKits = load(() => import("../../views/Integrations/Nucleus/Kits"))
const UMItems = load(() => import("../../views/Integrations/UniversalMarket/Items"))
const WebBooksBooks = load(() => import("../../views/Integrations/WebBooks/Books"))

const views: Array<ViewDefinition> = [{
	title: "Dashboard",
	path: "/dashboard",
	icon: "dashboard",
	perms: null,
	component: Dashboard,
}, {
	title: "Chat",
	path: "/chat",
	icon: "chat",
	perms: ["history", "chat"],
	servlets: ["/history"],
	component: Chat,
}, {
	title: "Commands",
	path: "/commands",
	icon: "terminal",
	perms: ["history", "cmd"],
	servlets: ["/history", "/cmd"],
	component: Commands,
}, {
	title: "Map",
	path: "/map",
	icon: "map",
	perms: ["map"],
	servlets: ["/map"],
	component: Map,
}, {
	title: "Worlds",
	path: "/worlds",
	icon: "globe",
	perms: ["world", "list"],
	servlets: ["/world"],
	component: Worlds,
}, {
	title: "Players",
	path: "/players",
	icon: "users",
	perms: ["player", "list"],
	servlets: ["/player"],
	component: Players,
}, {
	title: "Permissions",
	path: "/permissions",
	icon: "lock",
	perms: ["permission", "collection", "list"],
	servlets: ["/permission"],
	component: Permissions,
}, {
	title: "Entities",
	path: "/entities",
	icon: "paw",
	perms: ["entity", "list"],
	servlets: ["/entity"],
	component: Entities,
}, {
	title: "TileEntities",
	path: "/tile-entities",
	icon: "puzzle",
	perms: ["tile-entity", "list"],
	servlets: ["/tile-entity"],
	component: TileEntities,
}, {
	title: "BlockOperations",
	path: "/block-operations",
	icon: "block layout",
	perms: ["block", "op", "list"],
	servlets: ["/block"],
	component: BlockOperations,
}, {
	title: "Plugins",
	path: "/plugins",
	icon: "plug",
	perms: ["plugin", "list"],
	servlets: ["/plugin"],
	component: Plugins,
}, {
	title: "ServerSettings",
	path: "/server-settings",
	icon: "cogs",
	perms: ["info", "properties"],
	servlets: ["/info"],
	component: ServerSettings,
},

{
	title: "HuskyCrates",
	path: "/husky-crates",
	perms: ["husky-crates"],
	servlets: ["/husky-crates"],
	views: [{
		title: "HuskyCratesCrates",
		path: "/husky-crates/crates",
		icon: "archive",
		perms: ["husky-crates", "crates", "list"],
		component: HuskyCratesCrates,
	}]
}, {
	title: "MMCRestrict",
	path: "/mmc-restrict",
	perms: ["mmc-restrict"],
	servlets: ["/mmc-restrict"],
	views: [{
		title: "MMCRestrictItems",
		path: "/mmc-restrict/items",
		icon: "ban",
		perms: ["mmc-restrict", "item"],
		component: MMCRestrictItems,
	}]
}, {
	title: "MMCTickets",
	path: "/mmc-tickets",
	perms: ["mmc-tickets"],
	servlets: ["/mmc-tickets"],
	views: [{
		title: "MMCTicketsTickets",
		path: "/mmc-tickets/tickets",
		icon: "ticket",
		perms: ["mmc-tickets", "ticket"],
		component: MMCTicketsTickets,
	}]
}, {
	title: "Nucleus",
	path: "/nucleus",
	perms: ["nucleus"],
	servlets: ["/nucleus"],
	views: [{
		title: "NucleusJails",
		path: "/nucleus/jails",
		icon: "bars",
		perms: ["nucleus", "jail"],
		component: NucleusJails,
	}, {
		title: "NucleusKits",
		path: "/nucleus/kits",
		icon: "wrench",
		perms: ["nucleus", "kit"],
		component: NucleusKits,
	}]
}, {
	title: "UniversalMarket",
	path: "/universal-market",
	perms: ["universal-market"],
	servlets: ["/universal-market"],
	views: [{
		title: "UniversalMarketItems",
		path: "/universal-market/items",
		icon: "shopping cart",
		perms: ["universal-market", "item"],
		component: UMItems,
	}]
}, {
	title: "WebBooks",
	path: "/web-books",
	perms: ["web-books"],
	servlets: ["/web-books"],
	views: [{
		title: "WebBooksBooks",
		path: "/web-books/books",
		icon: "book",
		perms: ["webbooks", "book"],
		component: WebBooksBooks,
	}]
}]
export default views
