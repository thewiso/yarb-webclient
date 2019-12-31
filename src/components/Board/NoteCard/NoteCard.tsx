import {
	Card,
	CardActions,
	CardContent,
	createStyles,
	Fab,
	Theme,
	Typography,
	WithStyles,
	withStyles,
	Badge
} from "@material-ui/core";
import { yellow } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import React from "react";
import { BoardNote } from "../../../api/yarb/gen/model";
import YarbApi from "../../../api/yarb/yarb-api";
import { AxiosError } from "axios";
import { YarbErrorHandler } from "../../../api/Utils/YarbErrorHandler";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
		},
		voteBadge: {
			top: theme.spacing(0.5),
			right: theme.spacing(0.5)
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
				})
				.catch((error: AxiosError) => {
					if (error.response && error.response.status !== 404) {
						YarbErrorHandler.getInstance().handleUnexpectedError(error);
					}
				})
				.finally(() => {
					this.props.onChange(this.props.note);
				});
		} else {
			new YarbApi()
				.deleteVote(this.props.note.id)
				.then(result => {
					this.setState({ voted: false });
				})
				.catch((error: AxiosError) => {
					if (error.response && error.response.status !== 404) {
						YarbErrorHandler.getInstance().handleUnexpectedError(error);
					}
				})
				.finally(() => {
					this.props.onChange(this.props.note);
				});
		}
	}

	render(): React.ReactNode {
		return (
			<Card className={this.props.classes.noteCard}>
				<CardContent>
					<Typography className={this.props.classes.cardText}>{this.props.note.content}</Typography>
				</CardContent>
				<CardActions>
					<Badge
						badgeContent={this.props.note.votes}
						color="primary"
						classes={{ anchorOriginTopRightRectangle: this.props.classes.voteBadge }}
					>
						<Fab
							className={`${this.props.classes.voteButton} 
						${this.state.voted ? "" : this.props.classes.noteActionButton}`}
							color={this.state.voted ? "secondary" : "default"}
							size="small"
							onClick={this.handleVoteButtonClick.bind(this)}
						>
							{this.state.voted ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
						</Fab>
					</Badge>
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
