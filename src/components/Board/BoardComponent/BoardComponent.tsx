import {
	AppBar,
	Divider,
	Fab,
	Grid,
	Paper,
	Theme,
	Toolbar,
	Typography,
	withStyles,
	WithStyles
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { createStyles } from "@material-ui/styles";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Board, BoardNote } from "../../../api/yarb/gen/model";
import YarbApi from "../../../api/yarb/yarb-api";
import NoteCard from "../NoteCard/NoteCard";
import CreateOrEditNoteDialog from "../CreateOrEditNoteDialog/CreateOrEditNoteDialog";
import DeleteNoteDialog from "../DeleteNoteDialog/DeleteNoteDialog";

const styles = (theme: Theme) =>
	createStyles({
		column: {
			flexGrow: 1,
			flexBasis: "0",
			padding: theme.spacing(2),
			paddingBottom: theme.spacing(8),
			position: "relative"
		},
		container: {
			height: "100%",
			minHeight: "100vh",
			display: "flex",
			flexDirection: "column"
		},
		columnContainer: {
			margin: "20px",
			flexGrow: 1,
			display: "flex",
			justifyContent: "space-between",
		},
		divider: {
			flexGrow: 0,
			flexShrink: 0,
			flexBasis: "auto",
			height: "unset"
		},
		addButton: {
			position: "absolute",
			bottom: theme.spacing(2),
			right: theme.spacing(2),
		},
		columnTitle: {
			marginBottom: theme.spacing(4),
		},
		boardTitle: {
			marginTop: theme.spacing(2)
		}
	});

interface MatchParams {//TODO: alle px werte mit theme spacing ersetzen
	id: string;
}

interface BoardComponentProperties extends RouteComponentProps<MatchParams>, WithStyles<typeof styles> {}
interface BoardComponentState {
	board?: Board;
	boardId: number;
	deleteDialogOpen: boolean;
	noteDialogOpen: boolean;
	selectedColumnId?: number;
	selectedNote?: BoardNote; //the note is currently edited/deleted, depending on the currently opened dialog
}

class BoardComponent extends React.Component<BoardComponentProperties, BoardComponentState> {
	constructor(props: BoardComponentProperties) {
		super(props);
		//TODO: errorhandling
		const boardId = Number.parseInt(this.props.match.params.id);

		this.state = {
			boardId: boardId,
			deleteDialogOpen: false,
			noteDialogOpen: false
		};
	}

	private loadBoard(): void {
		new YarbApi()
			.getBoard(this.state.boardId)
			.then(response => {
				this.setState({ board: response.data });
			})
			.catch(error => {
				//TODO: 404=redirect
				console.error(error);
				//TODO:!
			});
	}

	componentWillMount() {
		this.loadBoard();
	}

	private createBoardColumns(): JSX.Element[] {
		const retVal: JSX.Element[] = [];

		if (this.state.board) {
			let i;
			for (i = 0; i < this.state.board.columns.length; i++) {
				const column = this.state.board.columns[i];
				retVal.push(
					<div className={this.props.classes.column}>
						<Typography variant="h5" align="center" className={this.props.classes.columnTitle}>
							{column.name}
						</Typography>
						<Grid container spacing={1}>
							{column.notes.map(note => (
								<Grid item xs={6}>
									<NoteCard
										note={note}
										onChange={this.loadBoard.bind(this)}
										onEdit={this.handleCardEdit.bind(this)}
										onDelete={this.handleCardDelete.bind(this)}
									/>
								</Grid>
							))}
						</Grid>
						<Fab
							color="primary"
							aria-label="add"
							size="small"
							className={this.props.classes.addButton}
							onClick={(() => {
								this.handleAddButtonClick(column.id);
							}).bind(this)}
						>
							<AddIcon />
						</Fab>
					</div>
				);

				if (i < this.state.board.columns.length - 1) {
					retVal.push(<Divider orientation="vertical" className={this.props.classes.divider} />);
				}
			}
		}

		return retVal;
	}

	handleAddButtonClick(columnId: number) {
		this.setState({
			selectedColumnId: columnId,
			noteDialogOpen: true
		});
	}

	handleCreateOrEditNoteDialogClose(reload: boolean) {
		this.setState({
			selectedColumnId: undefined,
			selectedNote: undefined,
			noteDialogOpen: false
		});
		if (reload) {
			this.loadBoard();
		}
	}

	handleCardDelete(boardNote: BoardNote) {
		this.setState({
			selectedNote: boardNote,
			deleteDialogOpen: true
		});
	}

	handleDeleteNoteDialogClose(reload: boolean) {
		this.setState({
			selectedNote: undefined,
			deleteDialogOpen: false
		});
		if (reload) {
			this.loadBoard();
		}
	}

	handleCardEdit(boardNote: BoardNote) {
		this.setState({
			selectedNote: boardNote,
			noteDialogOpen: true
		});
	}

	render() {
		if (this.state.board) {
			return (
				<div className={this.props.classes.container}>
					<AppBar position="static">
						<Toolbar>
							<Typography variant="h6" className="appBarTitle">
								YARB
							</Typography>
						</Toolbar>
					</AppBar>
					<div>
						<Typography variant="h5" align="center" color="textSecondary" className={this.props.classes.boardTitle}>{this.state.board.name}</Typography>
					</div>
					<Paper className={this.props.classes.columnContainer} elevation={24}>
						{this.createBoardColumns()}
					</Paper>

					<CreateOrEditNoteDialog
						open={this.state.noteDialogOpen}
						onClose={this.handleCreateOrEditNoteDialogClose.bind(this)}
						columnId={this.state.selectedColumnId}
						note={this.state.selectedNote}
					/>
					<DeleteNoteDialog
						open={this.state.deleteDialogOpen}
						onClose={this.handleDeleteNoteDialogClose.bind(this)}
						note={this.state.selectedNote}
					/>
				</div>
			);
		} else {
			return <div>TODO:</div>;
		}
	}
}

export default withStyles(styles, { withTheme: true })(withRouter(BoardComponent));