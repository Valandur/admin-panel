import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Button, Dropdown, Form, Input, Label, Popup } from "semantic-ui-react"

import {
	AppAction,
	CatalogRequestAction,
	requestCatalog
} from "../../../actions"
import ItemStack from "../../../components/ItemStack"
import {
	handleChange,
	HandleChangeFunc,
	renderCatalogTypeOptions
} from "../../../components/Util"
import { CatalogType, NucleusKit } from "../../../fetch"
import { AppState, CatalogTypeKeys, DataViewRef } from "../../../types"

import DataViewFunc from "../../../components/DataView"
const DataView = DataViewFunc("nucleus/kit", "name")

interface Props extends reactI18Next.InjectedTranslateProps {
	itemTypes: CatalogType[]
	requestCatalog: (type: string) => CatalogRequestAction
}

interface OwnState {
	newKitCmd: string
	newItemType: string
	newItemAmount: number
}

class Kits extends React.Component<Props, OwnState> {
	handleChange: HandleChangeFunc

	constructor(props: Props) {
		super(props)

		this.state = {
			newKitCmd: "",
			newItemType: "",
			newItemAmount: 1
		}

		this.renderCommands = this.renderCommands.bind(this)
		this.renderStacks = this.renderStacks.bind(this)
		this.handleChange = handleChange.bind(this, null)
	}

	componentDidMount() {
		this.props.requestCatalog(CatalogTypeKeys.Item)
	}

	addCmd(view: DataViewRef<NucleusKit>, kit: NucleusKit) {
		let cmd = this.state.newKitCmd
		if (cmd.startsWith("/")) {
			cmd = cmd.substring(1)
		}

		view.save(kit, {
			commands: kit.commands.concat(cmd)
		})
	}

	removeCmd(view: DataViewRef<NucleusKit>, kit: NucleusKit, cmdIndex: number) {
		view.save(kit, {
			commands: kit.commands.filter((__, i) => i !== cmdIndex)
		})
	}

	addStack(view: DataViewRef<NucleusKit>, kit: NucleusKit) {
		view.save(kit, {
			stacks: kit.stacks.concat({
				type: {
					id: this.state.newItemType,
					name: ""
				},
				quantity: this.state.newItemAmount ? this.state.newItemAmount : 1
			})
		})
	}

	removeStack(view: DataViewRef<NucleusKit>, kit: NucleusKit, index: number) {
		view.save(kit, {
			stacks: kit.stacks.filter((__, i) => i !== index)
		})
	}

	render() {
		const _t = this.props.t

		return (
			<DataView
				canEdit
				canDelete
				icon="wrench"
				title={_t("Kits")}
				filterTitle={_t("FilterKits")}
				createTitle={_t("CreateKit")}
				fields={{
					name: {
						label: _t("Name"),
						create: true,
						filter: true,
						required: true
					},
					cost: {
						label: _t("Cost"),
						type: "number",
						edit: true,
						create: true,
						required: true
					},
					cooldown: {
						label: _t("Cooldown"),
						type: "number",
						edit: true,
						create: true,
						required: true
					},
					commands: {
						label: _t("Commands"),
						wide: true,
						view: this.renderCommands
					},
					stacks: {
						label: _t("Stacks"),
						wide: true,
						view: this.renderStacks
					}
				}}
			/>
		)
	}

	renderCommands(kit: NucleusKit, view: DataViewRef<NucleusKit>) {
		const _t = this.props.t

		return (
			<>
				{kit.commands.map((cmd, i) => (
					<Label
						key={i}
						color="blue"
						content={"/" + cmd}
						onRemove={e => this.removeCmd(view, kit, i)}
					/>
				))}
				<Popup
					on="click"
					position="top right"
					trigger={<Button positive icon="plus" size="mini" />}
					content={
						<Input
							name="newKitCmd"
							action={{
								color: "green",
								content: _t("Add"),
								onClick: () => this.addCmd(view, kit)
							}}
							placeholder="/say Hi"
							value={this.state.newKitCmd}
							onChange={this.handleChange}
						/>
					}
				/>
			</>
		)
	}

	renderStacks(kit: NucleusKit, view: DataViewRef<NucleusKit>) {
		const _t = this.props.t

		return (
			<>
				{kit.stacks.map((item, i) => (
					<ItemStack
						key={i}
						item={item}
						onRemove={e => this.removeStack(view, kit, i)}
					/>
				))}
				<Popup
					on="click"
					position="top right"
					trigger={<Button positive icon="plus" size="mini" />}
					content={
						<Form>
							<Form.Field
								required
								fluid
								selection
								search
								name="newItemType"
								control={Dropdown}
								placeholder={_t("Type")}
								onChange={this.handleChange}
								options={renderCatalogTypeOptions(this.props.itemTypes)}
							/>
							<Form.Input
								name="newItemAmount"
								type="number"
								placeholder={_t("Amount")}
								onChange={this.handleChange}
								action={{
									color: "green",
									content: _t("Add"),
									onClick: () => this.addStack(view, kit)
								}}
							/>
						</Form>
					}
				/>
			</>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		itemTypes: state.api.types[CatalogTypeKeys.Item]
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCatalog: (type: string) => dispatch(requestCatalog(type))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Integrations.Nucleus")(Kits)
)
