import { Button, Card, CardActions, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { Board } from "../../../api/yarb/gen/model";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface BoardCardProperties extends RouteComponentProps {
	board: Board;
}
interface BoardCardState {}

class BoardCard extends React.Component<BoardCardProperties, BoardCardState> {
	constructor(props: BoardCardProperties) {
		super(props);
		this.state = {};
	}

	render(): React.ReactNode {
		return (
			<Card>
				<CardContent>
					<Typography color="textSecondary">
						{this.getFormattedDate()}
					</Typography>
					<Typography variant="h5">{this.props.board.name}</Typography>
					<Typography color="textSecondary">{this.props.board.columns.map(board => board.name).join(", ")}</Typography>
				</CardContent>
				<CardActions>
					<Button onClick={this.handleOpenClick.bind(this)}>Open</Button>
					<Button>Invite</Button>
				</CardActions>
			</Card>
		);
	}

	private getFormattedDate(): string{
		const date = this.props.board.creationDate;
		//use https://momentjs.com/ ?
		return date.toLocaleString();
	}

	handleOpenClick(): void{
		this.props.history.push(`/boards/${this.props.board.id}`);
	}
}

export default withRouter(BoardCard);
