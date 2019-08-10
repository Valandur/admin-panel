// React JSON Editor wrapper
// JSON Editor by Jos de Jong - https://github.com/josdejong/jsoneditor
// Based on post by Hassan Khan - https://github.com/josdejong/jsoneditor/issues/274#issuecomment-263986071
// Wrapper By Ian Grossberg - https://gist.github.com/yoiang/6f82874f4fd8fc1a37631dc9cad27172
// Wrapped into TypeScript definitions By Aleksey Musakhanov
import JSONEditor, { Node } from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';
import * as _ from 'lodash';
import * as React from 'react';

// Ref: https://github.com/josdejong/jsoneditor/blob/master/docs/api.md
// TODO: ace
// TODO: ajv
// TODO: modes
// TODO: onChange, onEditable, onError
export enum JSON_EDITOR_MODE {
	tree = 'tree',
	view = 'view',
	form = 'form',
	code = 'code',
	text = 'text'
}

interface Props {
	className?: string;
	json: any[] | object;
	height?: number | string;
	width?: number | string;
	onChange?: (value: string) => void;
	onEditable?: (node: Node) => boolean | { field: boolean; value: boolean };
	onError?: () => void;
	onModeChange?: () => void;
	escapeUnicode?: boolean;
	sortObjectKeys?: boolean;
	history?: boolean;
	mode?: JSON_EDITOR_MODE;
	name?: string;
	schema?: object;
	search?: boolean;
	indentation?: number;
	theme?: string;
}

interface State {
	json: string;
	editorCreated: boolean;
}

export class ReactJSONEditor extends React.Component<Props, State> {
	public static defaultProps: Props = {
		json: {},
		escapeUnicode: false,
		sortObjectKeys: false,
		history: false,
		mode: JSON_EDITOR_MODE.form,
		search: true,
		indentation: 2
	};

	private editor: any;
	private editorRef: HTMLElement | null;

	public constructor(props: Props, ...args: any[]) {
		super(props, ...args);
		const { json } = this.props;
		this.state = {
			json: JSON.parse(JSON.stringify(json)),
			editorCreated: false
		};
		this.editor = undefined;
	}

	public get json() {
		return this.state.json;
	}

	public componentDidMount() {
		if (this.editorRef) {
			this.createJSONEditorComponent(this.editorRef);
		}
	}

	public componentWillReceiveProps(nextProps: Props) {
		const json = this.json;
		if (!_.isEqual(json, nextProps.json)) {
			this.setState({
				json: JSON.parse(JSON.stringify(nextProps.json))
			});
		}
	}

	public componentDidUpdate(prevProps: Props, prevState: State) {
		if (!_.isEqual(prevState.json, this.json)) {
			this.editor.set(this.json);
		}
	}

	public componentWillUnmount() {
		const { editorCreated } = this.state;
		if (editorCreated) {
			this.editor.destroy();
			this.setState({
				editorCreated: false
			});
		}
	}

	public render() {
		const { className, height, width } = this.props;
		return <div id="jsonEditor" className={className} ref={this.getEditorRef} style={{ height, width }} />;
	}

	private getEditorRef = (node: any): void => {
		this.editorRef = node;
	};

	private createJSONEditorComponent(container: any) {
		if (!container) {
			return;
		}
		const { editorCreated } = this.state;
		if (editorCreated) {
			return;
		}
		const { onChange, onEditable, onError, onModeChange } = this.props;
		const { escapeUnicode, sortObjectKeys, history } = this.props;
		const { mode } = this.props;
		const { name, schema, search, indentation, theme } = this.props;

		let onChangeWrapper;
		if (onChange) {
			onChangeWrapper = () => {
				const editorValue = this.editor.get();
				onChange(editorValue);
			};
		}
		this.editor = new JSONEditor(container, {
			onChange: onChangeWrapper,
			onEditable,
			onError,
			onModeChange,
			escapeUnicode,
			sortObjectKeys,
			history,
			modes: [JSON_EDITOR_MODE.code, JSON_EDITOR_MODE.tree],
			mode,
			name,
			schema,
			search,
			indentation,
			theme
		});
		this.editor.set(this.json);
		this.setState({
			editorCreated: true
		});
	}
}
