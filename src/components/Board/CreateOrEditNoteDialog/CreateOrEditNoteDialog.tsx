import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField
} from "@material-ui/core";
import React from "react";
import { BoardNote, CreateBoardNote, UpdateBoardNote } from "../../../api/yarb/gen/model";
import YarbApi from "../../../api/yarb/yarb-api";
import { YarbErrorHandler } from "../../../api/Utils/YarbErrorHandler";
import { AxiosError } from "axios";

interface CreateOrEditNoteDialogProperties {
	open: boolean;
	onClose: (reload: boolean) => void;
	note?: BoardNote;
	columnId?: number;
}
interface CreateOrEditNoteDialogState {
	content: string;
}

class CreateOrEditNoteDialog extends React.Component<CreateOrEditNoteDialogProperties, CreateOrEditNoteDialogState> {
	constructor(props: CreateOrEditNoteDialogProperties) {
		super(props);

		this.state = {
			content: this.props.note ? this.props.note.content : ""
		};
	}

	handleConfirm(): void {
		if (this.props.columnId) {
			const createNote: CreateBoardNote = {
				boardColumnId: this.props.columnId,
				content: this.state.content
			};
			new YarbApi()
				.createNote(createNote)
				.then(() => {
					this.props.onClose(true);
				})
				.catch(error => {
					YarbErrorHandler.getInstance().handleUnexpectedError(error);
					this.props.onClose(false);
				});
		} else if (this.props.note) {
			const updateNote: UpdateBoardNote = {
				content: this.state.content
			};
			new YarbApi()
				.updateNote(this.props.note.id, updateNote)
				.then(() => {})
				.catch((error: AxiosError) => {
					if (error.response && error.response.status !== 404) {
						YarbErrorHandler.getInstance().handleUnexpectedError(error);
					}
				})
				.finally(() => {
					this.props.onClose(true);
				});
		}
	}

	componentWillReceiveProps(nextProps: CreateOrEditNoteDialogProperties): void {
		if (nextProps.open && !nextProps.note && !nextProps.columnId) {
			throw new Error("Neither a note nor a columnId is given");
		}
		if (!this.props.open && nextProps.open) {
			this.setState({
				content: nextProps.note ? nextProps.note.content : ""
			});
		}
	}

	handleClose(): void {
		this.props.onClose(false);
	}

	getTitle(): string {
		return (this.props.note ? "Edit " : "Create ") + "Note";
	}

	getDescription(): string {
		return "Here you can " + (this.props.note ? "edit the note." : "create a new note.");
	}

	handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
		this.setState({ content: event.target.value });
	}

	render(): React.ReactNode {
		return (
			<Dialog open={this.props.open} onClose={this.handleClose.bind(this)}>
				<DialogTitle>{this.getTitle()}</DialogTitle>
				<DialogContent>
					<DialogContentText>{this.getDescription()}</DialogContentText>
					<TextField
						multiline={true}
						placeholder="Write your content here"
						value={this.state.content}
						onChange={this.handleContentChange.bind(this)}
						fullWidth
						autoFocus
					/>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={this.handleConfirm.bind(this)} color="primary">
						OK
					</Button>
					<Button onClick={this.handleClose.bind(this)} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default CreateOrEditNoteDialog;
