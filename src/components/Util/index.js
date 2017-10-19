
export function handleChange(event, data) {
	let value = null;
	let name = null;

	if (data) {
		name = data.name ? data.name : data.id;
		value = data.value;
	} else {
		const target = event.target;
		value = target.type === "checkbox" ? target.checked : target.value;
		if (target.type === "number") {
			const floatVal = parseFloat(value);
			value = isNaN(floatVal) ? "" : floatVal;
		}
		name = target.name ? target.name : target.id;
	}

	this.setState({
		[name]: value
	});
};
