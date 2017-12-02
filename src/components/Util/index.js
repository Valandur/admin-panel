
export function formatRange(current, max, a = 1) {
	const acc = Math.pow(10, a);
	return Math.round((current / max) * 100 * acc) / acc;
}

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
