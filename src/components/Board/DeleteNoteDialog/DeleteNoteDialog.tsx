import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import React from "react";
import { BoardNote } from "../../../api/yarb/gen/model";
import YarbApi from "../../../api/yarb/yarb-api";
import { AxiosError } from "axios";
import { YarbErrorHandler } from "../../../api/Utils/YarbErrorHandler";

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

	handleConfirm(): void {
		if (this.props.note) {
			new YarbApi()
				.deleteNote(this.props.note.id)
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

	public componentDidUpdate(prevProps: DeleteNoteDialogProperties): void {
		if (this.props.open && !this.props.note) {
			throw new Error("No note is given");
		}
	}

	handleClose(): void {
		this.props.onClose(false);
	}

	render(): React.ReactNode {
		return (
			<Dialog open={this.props.open} onClose={this.handleClose.bind(this)}>
				<DialogTitle>Delete Note</DialogTitle>
				<DialogContent>
					<DialogContentText>Do you really want to delete this note?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button id="confirmCardDeletion" variant="contained" onClick={this.handleConfirm.bind(this)} color="primary">
						Yes
					</Button>
					<Button id="cancelCardDeletion" onClick={this.handleClose.bind(this)} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default DeleteNoteDialog;
