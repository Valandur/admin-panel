import React, { Component } from "react"
import { Button } from "semantic-ui-react"
import _ from "lodash"

class ConfigTree extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: {},
		};

		this.toggle = this.toggle.bind(this);
	}

	toggle(key) {
		this.setState({
			open: _.assign({}, this.state.open, {
				[key]: !this.state.open[key],
			})
		});
	}

	render() {
		let { conf, level } = this.props;
		if (!level) level = 0;

		return <div style={{ marginLeft: (level > 0 ? 1 : 0) + "em" }}>
			{_.map(conf, (val, key) =>
				<div>
					<Button
						size="mini"
						icon={_.isObject(val) ? (this.state.open[key] ? "minus" : "plus") : "mul"}
						color={_.isObject(val) ? (this.state.open[key] ? "red" : "green") : ""}
						onClick={() => this.toggle(key)}>
					</Button>
					<span>{_.isArray(conf) ? "" : key}</span>
					{ _.isObject(val) ? 
						this.state.open[key] && <ConfigTree conf={val} level={level + 1} />
					:
						<span>{": " + val} <Button size="mini" icon="edit" color="blue"></Button></span>
					}
				</div>
			)}
		</div>;
	}
}

export default ConfigTree
