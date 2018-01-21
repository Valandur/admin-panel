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
		Dashboard: "Übersicht",
		Chat: "Chat",
		Commands: "Befehle",
		Map: "Karte",
		Worlds: "Welten",
		Players: "Spieler",
		Entities: "Entities",
		TileEntities: "Tile Entities",
		BlockOperations: "Block Operationen",
		Plugins: "Plugins",
		ServerSettings: "Server Einstellungen",
		Settings: "Einstellungen",
		Logout: "Ausloggen",
		APILink: "API",
		SpongeLink: "Sponge",
		DocsLink: "Docs",
		IssuesLink: "Fehler",

		HuskyCrates: "Husky Crates",
		Crates: "Crates",

		MMCTickets: "MMCTickets",
		Tickets: "Tickets",

		Nucleus: "Nucleus",
		Kits: "Kits",
		Jails: "Jails",

		WebBooks: "Web Books",
		Books: "Books",
	},
	DataTable: {
		Actions: "Aktionen",
		Save: "Speichern",
		Cancel: "Abbrechen",
		Edit: "Bearbeiten",
		Remove: "Entfernen",
	},
	CreateForm: {
		Create: "Erstellen",
	},
	Inventory: {
		EmptyInventory: "Leeres Inventory",
		ShowInventory: "Inventory anzeigen",
		HideInventory: "Inventory verbergen",
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
