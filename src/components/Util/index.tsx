import { CheckboxProps, InputProps } from "semantic-ui-react"

import { CatalogType, WorldFull } from "../../fetch"
import { PermissionTree } from "../../types"

// Format a number to a certain accuracy as a ratio
export function formatRange(
	current: number,
	max: number,
	a: number = 1
): number {
	if (max === 0) {
		return 0
	}

	const acc = Math.pow(10, a)
	return Math.round(current / max * 100 * acc) / acc
}

// Handle input change of various components
export type HandleChangeFunc = (
	event: React.SyntheticEvent<HTMLElement>,
	data?: InputProps | CheckboxProps
) => void
export function handleChange(
	this: { setState: (o: object) => void },
	setState: (key: string, value: string) => void,
	event: React.SyntheticEvent<HTMLElement>,
	data?: InputProps | CheckboxProps
): void {
	let value = null
	let name = null

	if (data) {
		name = data.name ? data.name : data.id
		value = data.type === "checkbox" ? data.checked : data.value
		if (data.type === "number") {
			const floatVal = parseFloat(value)
			value = isNaN(floatVal) ? "" : floatVal
		}
	} else {
		const target = event.target as HTMLInputElement
		value = target.type === "checkbox" ? target.checked : target.value
		if (target.type === "number") {
			const floatVal = parseFloat(value as string)
			value = isNaN(floatVal) ? "" : floatVal
		}
		name = target.name ? target.name : target.id
	}

	if (!setState) {
		this.setState({
			[name]: value
		})
	} else {
		setState(name, value)
	}
}

// Returns true if the permissions specified allow access to the specified path
export function checkPermissions(
	_perms: PermissionTree | boolean | undefined,
	path: string[][] | string[] | null
): boolean {
	if (!path || path.length === 0) {
		return true
	}
	if (!_perms) {
		return false
	}

	// If we have an array of arrays, then OR the outer arrays
	if (typeof path[0] === "object") {
		return (path as string[][]).some(p => checkPermissions(_perms, p))
	}

	// Start at the root
	let perms = _perms

	for (let i = 0; i < path.length; i++) {
		const p = path[i] as string

		// Get the specific permission node for this level, if we have one
		if (typeof perms[p] !== "undefined") {
			perms = perms[p]
			continue
		}

		// If we don't have a specific permission for this level, check if there is a "*" permission
		return perms["*"] ? true : false
	}

	// If we get here then that means we have an exact permission for this path
	return perms === true || perms["*"] === true || perms["."] === true
}

export function checkServlets(
	servlets: { [x: string]: string },
	reqs: string[][] | string[] | null
): boolean {
	if (!reqs || reqs.length === 0) {
		return true
	}
	if (!servlets) {
		return false
	}

	// If we have an array of arrays, then OR the outer arrays
	if (typeof reqs[0] === "object") {
		return (reqs as string[][]).some(r => checkServlets(servlets, r))
	}

	return (reqs as string[]).every(req => !!servlets[req])
}

// Render catalog types as dropdown options
export function renderCatalogTypeOptions(
	types: CatalogType[] | undefined
): { value: string; text: string }[] {
	if (!types) {
		return []
	}
	return types.map(type => ({
		value: type.id,
		text: type.name + " (" + type.id + ")"
	}))
}

// Render worlds as dropdown options
export function renderWorldOptions(
	worlds: WorldFull[] | undefined
): { value: string; text: string }[] {
	if (!worlds) {
		return []
	}

	return worlds.map(w => ({
		value: w.uuid,
		text: w.name + " (" + w.dimensionType.name + ")"
	}))
}

// Get a property according to a path
export const get = (o: any, path: string) =>
	path.split(".").reduce((obj: any = {}, key) => obj[key], o)

// Format source
export const formatSource = (source: any): string => {
	if (!source) {
		return ""
	} else if (source === "valandur.webapi.command.CommandSource") {
		return "Web-API"
	} else if (source === "net.minecraft.server.dedicated.DedicatedServer") {
		return "Console"
	} else if (typeof source === "string") {
		return source
	} else {
		return source.name
	}
}
