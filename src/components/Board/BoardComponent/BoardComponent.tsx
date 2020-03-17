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
	WithStyles,
	CircularProgress
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
import { YarbErrorHandler } from "../../../api/Utils/YarbErrorHandler";
import { AxiosError } from "axios";
import YarbIcon from "../../YarbIcon/YarbIcon";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
			justifyContent: "space-between"
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
			right: theme.spacing(2)
		},
		columnTitle: {
			marginBottom: theme.spacing(4)
		},
		boardTitle: {
			marginTop: theme.spacing(2)
		},
		loadingCircle: {
			position: "fixed",
			top: "50%",
			left: "50%"
		},
		appBarTitle: {
			marginLeft: theme.spacing(2)
		}
	});

interface MatchParams {
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

const POLLING_INTERVAL = 1000 * 5;

class BoardComponent extends React.Component<BoardComponentProperties, BoardComponentState> {
	private pollingTimeoutId: number | null = null;

	constructor(props: BoardComponentProperties) {
		super(props);

		this.state = {
			boardId: NaN,
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
			.catch((error: AxiosError) => {
				if (error.response && error.response.status === 404) {
					this.redirectToHome();
				} else {
					YarbErrorHandler.getInstance().handleUnexpectedError(error);
				}
			})
			.finally(() => {
				if (this.pollingTimeoutId) {
					window.clearTimeout(this.pollingTimeoutId);
				}
				this.pollingTimeoutId = window.setTimeout(this.loadBoard.bind(this), POLLING_INTERVAL);
			});
	}

	componentDidMount(): void {
		this.setState({ boardId: Number.parseInt(this.props.match.params.id) }, () => {
			if (isNaN(this.state.boardId)) {
				this.redirectToHome();
			} else {
				this.loadBoard();
			}
		});
	}

	private redirectToHome(): void {
		this.props.history.push("/");
	}

	private createBoardColumns(): JSX.Element[] {
		const retVal: JSX.Element[] = [];

		if (this.state.board) {
			let i;
			for (i = 0; i < this.state.board.columns.length; i++) {
				const column = this.state.board.columns[i];
				retVal.push(
					<div className={this.props.classes.column} key={column.id}>
						<Typography variant="h5" align="center" className={this.props.classes.columnTitle}>
							{column.name}
						</Typography>
						<Grid container spacing={1}>
							{column.notes.map(note => (
								<Grid item xs={6} key={note.id}>
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
							id={"addButton-" + column.id}
							color="primary"
							aria-label="add"
							size="small"
							className={this.props.classes.addButton}
							onClick={() => {
								this.handleAddButtonClick(column.id);
							}}
						>
							<AddIcon />
						</Fab>
					</div>
				);

				if (i < this.state.board.columns.length - 1) {
					retVal.push(<Divider orientation="vertical" className={this.props.classes.divider} key={"divider" + i} />);
				}
			}
		}

		return retVal;
	}

	handleAddButtonClick(columnId: number): void {
		this.setState({
			selectedColumnId: columnId,
			noteDialogOpen: true
		});
	}

	handleCreateOrEditNoteDialogClose(reload: boolean): void {
		this.setState({
			selectedColumnId: undefined,
			selectedNote: undefined,
			noteDialogOpen: false
		});
		if (reload) {
			this.loadBoard();
		}
	}

	handleCardDelete(boardNote: BoardNote): void {
		this.setState({
			selectedNote: boardNote,
			deleteDialogOpen: true
		});
	}

	handleDeleteNoteDialogClose(reload: boolean): void {
		this.setState({
			selectedNote: undefined,
			deleteDialogOpen: false
		});
		if (reload) {
			this.loadBoard();
		}
	}

	handleCardEdit(boardNote: BoardNote): void {
		this.setState({
			selectedNote: boardNote,
			noteDialogOpen: true
		});
	}

	render(): React.ReactNode {
		if (this.state.board) {
			return (
				<div className={this.props.classes.container}>
					<AppBar position="static">
						<Toolbar>
							<YarbIcon />
							<Typography variant="h6" className={this.props.classes.appBarTitle}>
								YARB
							</Typography>
						</Toolbar>
					</AppBar>
					<div>
						<Typography variant="h5" align="center" color="textSecondary" className={this.props.classes.boardTitle}>
							{this.state.board.name}
						</Typography>
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
			return (
				<div>
					<CircularProgress className={this.props.classes.loadingCircle} />
				</div>
			);
		}
	}
}

export default withStyles(styles, { withTheme: true })(withRouter(BoardComponent));
