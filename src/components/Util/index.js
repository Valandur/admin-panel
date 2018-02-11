import _ from "lodash"

// Format a number to a certain accuracy as a ratio
export function formatRange(current, max, a = 1) {
	const acc = Math.pow(10, a);
	return Math.round((current / max) * 100 * acc) / acc;
}

// Handle input change of various components
export function handleChange(setState, event, data) {
	let value = null;
	let name = null;

	if (data) {
		name = data.name ? data.name : data.id;
		value = data.type === "checkbox" ? data.checked : data.value;
		if (data.type === "number") {
			const floatVal = parseFloat(value);
			value = isNaN(floatVal) ? "" : floatVal;
		}
	} else {
		const target = event.target;
		value = target.type === "checkbox" ? target.checked : target.value;
		if (target.type === "number") {
			const floatVal = parseFloat(value);
			value = isNaN(floatVal) ? "" : floatVal;
		}
		name = target.name ? target.name : target.id;
	}

	if (!setState) {
		this.setState({
			[name]: value
		})
	} else {
		setState(name, value)
	}
};

// Returns true if the permissions specified allow access to the specified path
export function checkPermissions(_perms, path) {
	if (!path || path.length === 0) return true;
	if (!_perms) return false;
	
	let perms = _.cloneDeep(_perms);

	for (let i = 0; i < path.length; i++) {
		// Get the specific permission node for this level, if we have one
		if (perms[path[i]]) {
			perms = perms[path[i]];
			continue;
		}
		
		// If we don't have a specific permission for this level, check if there is a "*" permission
		return perms["*"] ? true : false;
	}

	// If we get here then that means we have an exact permission for this path
	return perms === true || perms["*"] === true;
}
