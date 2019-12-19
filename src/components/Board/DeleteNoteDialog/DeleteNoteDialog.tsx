import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextareaAutosize,
	TextField,
	DialogContentText
} from "@material-ui/core";
import React from "react";
import { CreateBoardNote, BoardNote } from "../../../api/yarb/gen/model";
import YarbApi from "../../../api/yarb/yarb-api";

interface DeleteNoteDialogProperties {
	open: boolean;
	onClose: (reload: boolean) => void;
	note?: BoardNote;
}
interface DeleteNoteDialogState {}

class DeleteNoteDialog extends React.Component<DeleteNoteDialogProperties, DeleteNoteDialogState> {
	constructor(props: DeleteNoteDialogProperties) {
		super(props);
		this.state = {};
	}

	handleConfirm() {
		if (this.props.note) {
			new YarbApi()
				.deleteNote(this.props.note.id)
				.then(() => {
					this.props.onClose(true);
				})
				.catch(error => {
					//TODO:
					console.error(error);
				});
		} else {
			throw new Error("TODO:");
		}
	}

	handleClose() {
		this.props.onClose(false);
	}

	render() {
		return (
			<Dialog open={this.props.open} onClose={this.handleClose.bind(this)}>
				<DialogTitle>Delete Note</DialogTitle>
				<DialogContent>
					<DialogContentText>Do you really want to delete this note?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={this.handleConfirm.bind(this)} color="primary">
						Yes
					</Button>
					<Button onClick={this.handleClose.bind(this)} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default DeleteNoteDialog;
