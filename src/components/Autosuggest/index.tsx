import * as React from 'react';
import * as enhanceWithClickOutside from 'react-click-outside';

import { AutosuggestChangeData, AutosuggestItem } from '../../types';

export interface AppProps {
	id: string;
	name: string;
	placeholder: string;
	getSuggestions: (newValue: string) => Array<AutosuggestItem>;
	onChange: (
		event: React.SyntheticEvent<HTMLElement>,
		newValue: AutosuggestChangeData
	) => void;
	onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface AppState {
	value: string;
	suggestions: Array<AutosuggestItem>;
}

class Autosuggest extends React.Component<AppProps, AppState> {
	private input: HTMLInputElement;

	public constructor(props: AppProps) {
		super(props);

		this.state = {
			value: '',
			suggestions: []
		};
	}

	private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;

		this.setState({
			value: newValue,
			suggestions: this.props.getSuggestions(newValue)
		});
		this.props.onChange(event, {
			id: this.props.id,
			name: this.props.name,
			value: newValue
		});
	};

	private handleClick(
		event: React.MouseEvent<HTMLDivElement>,
		sugg: AutosuggestItem
	) {
		this.setState({ value: sugg.value, suggestions: [] }, () =>
			this.input.focus()
		);

		this.props.onChange(event, {
			id: this.props.id,
			name: this.props.name,
			value: sugg.value
		});
	}

	private handleFocus = () => {
		this.setState({
			suggestions: this.props.getSuggestions(this.state.value)
		});
	};

	public handleClickOutside() {
		this.setState({
			suggestions: []
		});
	}

	private setRef = (input: HTMLInputElement | null) => {
		if (input !== null) {
			this.input = input;
		}
	};

	public render() {
		return (
			<div style={{ width: '100%', position: 'relative' }}>
				<input
					type="text"
					placeholder={this.props.placeholder}
					value={this.state.value}
					style={{ width: '100%' }}
					ref={this.setRef}
					onFocus={this.handleFocus}
					onChange={this.handleChange}
					onKeyPress={this.props.onKeyPress}
				/>
				{this.renderSuggestions()}
			</div>
		);
	}

	private renderSuggestions() {
		if (!this.state.suggestions.length) {
			return null;
		}

		return (
			<div className="autosuggest-list">{this.renderSuggestionItems()}</div>
		);
	}

	private renderSuggestionItems() {
		return this.state.suggestions.map((sugg, index) => (
			// tslint:disable-next-line:jsx-no-lambda
			<div key={index} onClick={event => this.handleClick(event, sugg)}>
				{sugg.content}
			</div>
		));
	}
}

export default enhanceWithClickOutside(Autosuggest);
