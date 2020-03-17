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
			<Card id={"boardCard-" + this.props.board.id}>
				<CardContent>
					<Typography color="textSecondary">{this.getFormattedDate()}</Typography>
					<Typography variant="h5">{this.props.board.name}</Typography>
					<Typography color="textSecondary">{this.props.board.columns.map(board => board.name).join(", ")}</Typography>
				</CardContent>
				<CardActions>
					<Button id={"openBoardButton-" + this.props.board.id} onClick={this.handleOpenClick.bind(this)}>
						Open
					</Button>
					<Button id={"inviteToBoardButton-" + this.props.board.id} href={this.getMailTo()}>
						Invite
					</Button>
				</CardActions>
			</Card>
		);
	}

	private getFormattedDate(): string {
		const date = this.props.board.creationDate;
		//use https://momentjs.com/ ?
		return date.toLocaleString();
	}

	handleOpenClick(): void {
		this.props.history.push(`/boards/${this.props.board.id}`);
	}

	private getMailTo(): string {
		const subject = encodeURIComponent(`Invitation for Retro Board "${this.props.board.name}"`);
		const boardUrl = `${window.location.protocol}//${window.location.host}/boards/${this.props.board.id}`;
		const body = encodeURIComponent(`Hi,\nplease join my YARB retro board: ${boardUrl}`);

		return `mailto:?to=&subject=${subject}&body=${body}`;
	}
}

export default withRouter(BoardCard);
