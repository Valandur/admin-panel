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
		Dashboard: "Панель управления",
		Chat: "Чат",
		Commands: "Команды",
		Map: "Карта",
		Worlds: "Миры",
		Players: "Игроки",
		Entities: "Сущности",
		TileEntities: "Блоки сущности",
		BlockOperations: "Операции с блоками",
		Plugins: "Плагины",
		ServerSettings: "Настройки сервера",
		Settings: "Настройки",
		Logout: "Выход",
		APILink: "API",
		SpongeLink: "Sponge",
		DocsLink: "Docs",
		IssuesLink: "Issues",

		HuskyCrates: "Husky Crates",
		Crates: "Crates",

		MMCTickets: "MMCTickets",
		Tickets: "Tickets",

		Nucleus: "Nucleus",
		Kits: "Kits",
		Jails: "Jails",

		WebBooks: "Web Книги",
		Books: "Книги",
	},
	DataTable: {
		Actions: "Действия",
		Save: "Сохранить",
		Cancel: "Отмена",
		Edit: "Редактировать",
		Remove: "Удалить",
	},
	CreateForm: {
		Create: "Создать",
	},
	Inventory: {
		EmptyInventory: "Пустой инвентарь",
		ShowInventory: "Показать инвентарь",
		HideInventory: "Скрыть инвентарь",
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
