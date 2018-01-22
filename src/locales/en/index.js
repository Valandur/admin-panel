import Login from "./login"
import Dashboard from "./dashboard"
import Chat from "./chat"
import Commands from "./commands"
import Entities from "./entities"
import TileEntities from "./tile-entities"
import BlockOperations from "./block-ops"
import Plugins from "./plugins"
import Players from "./players"
import Worlds from "./worlds"
import ServerSettings from "./server-settings"

import HuskyCrates from "./integrations/huskycrates"
import MMCRestrict from "./integrations/mmcrestrict"
import MMCTickets from "./integrations/mmctickets"
import Nucleus from "./integrations/nucleus"
import UniversalMarket from "./integrations/universalmarket"
import WebBooks from "./integrations/webbooks"

export default {
	Main: {
		CPU: "CPU",
		Memory: "Memory",
		Disk: "Disk",

		Dashboard: "Dashboard",
		Chat: "Chat",
		Commands: "Commands",
		Map: "Map",
		Worlds: "Worlds",
		Players: "Players",
		Entities: "Entities",
		TileEntities: "Tile Entities",
		BlockOperations: "Block Operations",
		Plugins: "Plugins",
		ServerSettings: "Server Settings",
		Settings: "Settings",
		Logout: "Logout",
		APILink: "API",
		SpongeLink: "Sponge",
		DocsLink: "Docs",
		IssuesLink: "Issues",

		HuskyCrates: "Husky Crates",
		HuskyCratesCrates: "Crates",

		MMCRestrict: "MMCRestrict",
		MMCRestrictRestrictedItems: "Restricted Items",

		MMCTickets: "MMCTickets",
		MMCTicketsTickets: "Tickets",

		Nucleus: "Nucleus",
		NucleusKits: "Kits",
		NucleusJails: "Jails",

		WebBooks: "Web Books",
		WebBooksBooks: "Books",

		UniversalMarket: "UniversalMarket",
		UniversalMarketItems: "Items",
	},
	DataTable: {
		Actions: "Actions",
		Save: "Save",
		Cancel: "Cancel",
		Edit: "Edit",
		Remove: "Remove",
	},
	CreateForm: {
		Create: "Create",
	},
	Inventory: {
		EmptyInventory: "Empty Inventory",
		ShowInventory: "Show Inventory",
		HideInventory: "Hide Inventory",
	},
	
	Login: Login,
	Dashboard: Dashboard,
	Chat: Chat,
	Commands: Commands,
	Entities: Entities,
	TileEntities: TileEntities,
	BlockOperations: BlockOperations,
	Plugins: Plugins,
	Players: Players,
	Worlds: Worlds,
	ServerSettings: ServerSettings,

	"Integrations.HuskyCrates": HuskyCrates,
	"Integrations.MMCRestrict": MMCRestrict,
	"Integrations.MMCTickets": MMCTickets,
	"Integrations.Nucleus": Nucleus,
	"Integrations.UniversalMarket": UniversalMarket,
	"Integrations.WebBooks": WebBooks,
}
