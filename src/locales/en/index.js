import Menu from "./menu"
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
		ErrorHeader: "Apologies, there was an error!",
		FixHeader: "Help fix this error!",
		FixText: "It would be amazing if you could help fix this error by clicking the button down below and saying a little bit about what happend.",
		SubmitIssue: "Submit Issue",
	},
	Menu: Menu,
	
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
}
