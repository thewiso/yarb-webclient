import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import React from "react";
import { BoardNote, CreateBoardNote, UpdateBoardNote } from "../../../api/yarb/gen/model";
import YarbApi from "../../../api/yarb/yarb-api";

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

	handleConfirm() {
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
					//TODO:
					console.error(error);
				});
		} else if (this.props.note) {
			const updateNote: UpdateBoardNote = {
				content: this.state.content
			};
			new YarbApi()
				.updateNote(this.props.note.id, updateNote)
				.then(() => {
					this.props.onClose(true);
				})
				.catch(error => {
					//TODO:
					console.error(error);
				});
		}
	}

	componentWillReceiveProps(nextProps: CreateOrEditNoteDialogProperties) {
		this.setState({
			content: nextProps.note ? nextProps.note.content : ""
		});
	  }

	handleClose() {
		this.props.onClose(false);
	}

	getTitle(): string {
		return (this.props.note ? "Edit " : "Create ") + "Note";
	}

	getDescription(): string {
		return "Here you can " + (this.props.note ? "edit the note." : "create a new note.");
	}

	handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		this.setState({ content: event.target.value });
	}

	render() {
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
