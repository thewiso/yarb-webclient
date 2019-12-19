import { Button, Typography, Grid } from "@material-ui/core";
import React from "react";
import YarbApi from "../../../api/yarb/yarb-api";
import CreateBoardDialog from "../CreateBoardDialog/CreateBoardDialog";
import BoardCard from "../BoardCard/BoardCard";
import { Board } from "../../../api/yarb/gen/model/board";

interface BoardOverviewProperties {}
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

	handleCreateBoardButtonClick() {
		this.setState({ createBoardDialogOpen: true });
	}

	handleCreateBoardClose(reload: boolean) {
		this.loadBoards();
		this.setState({ createBoardDialogOpen: false });
	}

	componentDidMount() {
		this.loadBoards();
	}

	private loadBoards(): void {
		new YarbApi()
			.getBoardsByOwner()
			.then(response => {
				this.setState({ boards: response.data });
			})
			.catch(error => {
				console.error(error);
				//TODO:!
			});
	}

	render() {
		return (
			<div>
				<div>
					<Typography variant="h3">Boards</Typography>
				</div>
				<div>
					<div>
						<Button variant="contained" color="primary" onClick={this.handleCreateBoardButtonClick.bind(this)}>
							Create//TODO: as floating action button?
						</Button>
						<CreateBoardDialog
							open={this.state.createBoardDialogOpen}
							onClose={this.handleCreateBoardClose.bind(this)}
						/>
					</div>
					{this.state.boards.length === 0 && <div>Oh wow, such empty</div>}
					<Grid container spacing={3}>
						{this.state.boards.map((
							board //TODO: formatting margins etc.
						) => (
							//https://material-ui.com/components/grid-list/
							<Grid item xs={3}>
								<BoardCard board={board}/>
							</Grid>
						))}
					</Grid>
				</div>
			</div>
		);
	}
}

export default BoardOverview;
