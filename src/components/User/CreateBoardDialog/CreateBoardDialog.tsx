import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Fab,
	IconButton,
	InputAdornment,
	Theme,
	createStyles,
	WithStyles,
	withStyles
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import TextFieldValidation from "../../../scripts/Validation/Validation";
import * as ValidationChecks from "../../../scripts/Validation/ValidationChecks";
import ValidationTextField from "../../Validation/ValidationTextField";
import YarbApi from "../../../api/yarb/yarb-api";
import { CreateBoard } from "../../../api/yarb/gen/model/create-board";
import { YarbErrorHandler } from "../../../api/Utils/YarbErrorHandler";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) =>
	createStyles({
		divider: {
			marginTop: theme.spacing(2),
			marginBottom: theme.spacing(2)
		}
	});

interface CreateBoardDialogProperties extends WithStyles<typeof styles> {
	open: boolean;
	onClose: (reload: boolean) => void;
}
interface CreateBoardDialogState {
	title: TextFieldValidation;
	columns: TextFieldValidation[];
	canConfirm: boolean;
}

const MIN_COLUMNS = 2;
const MAX_COLUMNS = 5;

class CreateBoardDialog extends React.Component<CreateBoardDialogProperties, CreateBoardDialogState> {
	constructor(props: CreateBoardDialogProperties) {
		super(props);
		this.state = this.getDefaultState();
	}

	public componentDidUpdate(prevProps: CreateBoardDialogProperties): void {
		if (!prevProps.open && this.props.open) {
			this.setState(this.getDefaultState());
		}
	}

	private getDefaultState(): CreateBoardDialogState {
		return {
			title: new TextFieldValidation(
				"",
				[ValidationChecks.MinLength(3)],
				this.handleTitleValidationChange.bind(this),
				false
			),
			columns: [
				this.createColumnNameValidation(0, "Glad"),
				this.createColumnNameValidation(1, "Sad"),
				this.createColumnNameValidation(2, "Mad"),
				this.createColumnNameValidation(3, "Action Points")
			],
			canConfirm: false,
		};
	}

	private createColumnNameValidation(index: number, value: string = ""): TextFieldValidation {
		return new TextFieldValidation(
			value,
			[ValidationChecks.NotEmpty],
			validation => this.handleColumnFieldValidationChange(validation, index),
			false
		);
	}

	handleColumnFieldValidationChange(validation: TextFieldValidation, index: number): void {
		const newColumns = [...this.state.columns];
		newColumns[index] = validation;
		const newCanConfirm = newColumns.findIndex(candidate => candidate.error) === -1;
		this.setState({ columns: newColumns, canConfirm: newCanConfirm });
	}

	handleColumnFieldDeletion(index: number): void {
		if (this.state.columns.length > MIN_COLUMNS) {
			let newColumns = [...this.state.columns];
			newColumns.splice(index, 1);
			this.setState({ columns: newColumns });
		}
	}

	handleColumnFieldAddition(): void {
		if (this.state.columns.length < MAX_COLUMNS) {
			let newColumns = [...this.state.columns, this.createColumnNameValidation(this.state.columns.length, "")];
			this.setState({ columns: newColumns });
		}
	}

	handleTitleValidationChange(validation: TextFieldValidation): void {
		this.setState({ title: validation, canConfirm: !validation.error });
	}

	handleConfirm(): void {
		const createBoard: CreateBoard = {
			name: this.state.title.value,
			columnNames: this.state.columns.map(validation => validation.value)
		};
		new YarbApi()
			.createBoard(createBoard)
			.then(() => {
				this.props.onClose(true);
			})
			.catch(error => {
				YarbErrorHandler.getInstance().handleUnexpectedError(error);
				this.props.onClose(false);
			});
	}

	handleClose(): void {
		this.props.onClose(false);
	}

	render(): React.ReactNode {
		return (
			<Dialog open={this.props.open} onClose={this.handleClose.bind(this)} maxWidth="sm" fullWidth>
				<DialogTitle>Create new board</DialogTitle>
				<DialogContent>
					<DialogContentText>Create a board with up to 5 columns</DialogContentText>
					<Divider className={this.props.classes.divider} />
					<ValidationTextField validation={this.state.title} autoFocus label="Board title" fullWidth />
					<Divider className={this.props.classes.divider} />
					{this.state.columns.map((value, index) => (
						<ValidationTextField
							validation={value}
							key={index}
							label={index + 1 + ". Column"}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										{this.state.columns.length > MIN_COLUMNS && (
											<IconButton onClick={() => this.handleColumnFieldDeletion(index)}>
												<DeleteIcon />
											</IconButton>
										)}
									</InputAdornment>
								)
							}}
							fullWidth
						/>
					))}
					{this.state.columns.length < MAX_COLUMNS && (
						<Fab color="primary" aria-label="add" onClick={this.handleColumnFieldAddition.bind(this)}>
							<AddIcon />
						</Fab>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						onClick={this.handleConfirm.bind(this)}
						color="primary"
						disabled={!this.state.canConfirm}
					>
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

export default withStyles(styles, { withTheme: true })(CreateBoardDialog);
