import {
	Card,
	CardActions,
	CardContent,
	createStyles,
	Fab,
	Theme,
	Typography,
	WithStyles,
	withStyles
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import React from "react";
import { BoardNote } from "../../../api/yarb/gen/model";
import YarbApi from "../../../api/yarb/yarb-api";
import { yellow, red } from "@material-ui/core/colors";

const styles = (theme: Theme) =>
	createStyles({
		voteButton: {
			marginRight: "auto"
		},
		cardText: {
			wordWrap: "break-word"
		},
		noteCard: {
			backgroundColor: yellow[400]
		},
		noteActionButton: {
			backgroundColor: yellow[800]
		}
	});

interface NoteCardProperties extends WithStyles<typeof styles> {
	note: BoardNote;
	onChange: (boardNote: BoardNote) => void;
	onEdit: (boardNote: BoardNote) => void;
	onDelete: (boardNote: BoardNote) => void;
}
interface NoteCardState {
	voted: boolean;
}

class NoteCard extends React.Component<NoteCardProperties, NoteCardState> {
	constructor(props: NoteCardProperties) {
		super(props);
		this.state = {
			voted: false
		};
	}

	private handleVoteButtonClick(): void {
		if (!this.state.voted) {
			new YarbApi()
				.postVote(this.props.note.id)
				.then(result => {
					this.setState({ voted: true });
					this.props.onChange(this.props.note);
				})
				.catch //TODO:
				();
		} else {
			new YarbApi()
				.deleteVote(this.props.note.id)
				.then(result => {
					this.setState({ voted: false });
					this.props.onChange(this.props.note);
				})
				.catch //TODO:
				();
		}
	}

	render() {
		return (
			<Card className={this.props.classes.noteCard}>
				<CardContent>
					<Typography className={this.props.classes.cardText}>
						{this.props.note.content}
					</Typography>
					<Typography align="right" color="textSecondary" variant="body2">
						{this.props.note.votes} Votes
					</Typography>
				</CardContent>
				<CardActions>
					<Fab
						className={`${this.props.classes.voteButton} 
						${this.state.voted ? "" : this.props.classes.noteActionButton}`}
						color={this.state.voted ? "secondary" : "default"}
						size="small"
						onClick={this.handleVoteButtonClick.bind(this)}
					>
						{this.state.voted ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
					</Fab>
					<Fab
						className={this.props.classes.noteActionButton}
						size="small"
						onClick={() => this.props.onEdit(this.props.note)}
					>
						<EditIcon fontSize="small" />
					</Fab>
					<Fab
						className={this.props.classes.noteActionButton}
						size="small"
						onClick={() => this.props.onDelete(this.props.note)}
					>
						<DeleteIcon fontSize="small" />
					</Fab>
				</CardActions>
			</Card>
		);
	}
}

export default withStyles(styles, { withTheme: true })(NoteCard);
