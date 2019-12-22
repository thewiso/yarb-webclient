import { createStyles, Fab, Grid, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { YarbErrorHandler } from "../../../api/Utils/YarbErrorHandler";
import { Board } from "../../../api/yarb/gen/model/board";
import YarbApi from "../../../api/yarb/yarb-api";
import BoardCard from "../BoardCard/BoardCard";
import CreateBoardDialog from "../CreateBoardDialog/CreateBoardDialog";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) =>
	createStyles({
		addButton: {
			position: "absolute",
			bottom: theme.spacing(4),
			right: theme.spacing(4),
		},
		titleContainer: {
			marginBottom: theme.spacing(2)
		}
	});

interface BoardOverviewProperties extends WithStyles<typeof styles> {}
interface BoardOverviewState {
	boards: Board[];
	createBoardDialogOpen: boolean;
}

class BoardOverview extends React.Component<BoardOverviewProperties, BoardOverviewState> {
	constructor(props: BoardOverviewProperties) {
		super(props);
		this.state = {
			boards: [],
			createBoardDialogOpen: false
		};
	}

	handleCreateBoardButtonClick(): void {
		this.setState({ createBoardDialogOpen: true });
	}

	handleCreateBoardClose(reload: boolean): void {
		this.loadBoards();
		this.setState({ createBoardDialogOpen: false });
	}

	componentDidMount(): void {
		this.loadBoards();
	}

	private loadBoards(): void {
		new YarbApi()
			.getBoardsByOwner()
			.then(response => {
				this.setState({ boards: response.data });
			})
			.catch(error => {
				YarbErrorHandler.getInstance().handleUnexpectedError(error);
			});
	}

	render(): React.ReactNode {
		return (
			<div>
				<div className={this.props.classes.titleContainer}>
					<Typography variant="h4" display="inline">Boards</Typography>
				</div>
				<Fab
						color="primary"
						aria-label="add"
						size="small"
						className={this.props.classes.addButton}
						onClick={this.handleCreateBoardButtonClick.bind(this)}
					>
						<AddIcon />
					</Fab>

				<div>
					{this.state.boards.length === 0 && <div>
						Click on the plus icon on the right to create a new board!</div>}
					<Grid container spacing={2}>
						{this.state.boards.map((
							board
						) => (
							//https://material-ui.com/components/grid-list/
							<Grid item xs={3}>
								<BoardCard board={board} />
							</Grid>
						))}
					</Grid>
				</div>
				<CreateBoardDialog open={this.state.createBoardDialogOpen} onClose={this.handleCreateBoardClose.bind(this)} />
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(BoardOverview);
