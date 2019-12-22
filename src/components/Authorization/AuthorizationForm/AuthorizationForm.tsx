import {
	Avatar,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Typography,
	Theme,
	createStyles,
	WithStyles
} from "@material-ui/core";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const AuthorizationFormStyles = (theme: Theme) =>
	createStyles({
		authorizationCard: {
			width: theme.spacing(50)
		},
		authorizationCardButtonContainer: {
			width: "100%",
			display: "flex",
			justifyContent: "space-between"
		},
		authorizationFormWrapper: {
			marginTop: theme.spacing(2),
			marginBottom: theme.spacing(3)
		},
		authorizationInputWrapper: {
			marginBottom: theme.spacing(1)
		}
	});

export interface AuthorizationFormProperties extends RouteComponentProps, WithStyles<typeof AuthorizationFormStyles> {
	navigationButtonText: string;
	handleNavigationChange: (source: AuthorizationForm<any>) => void;
}
export interface AuthorizationFormState {
	canConfirm: boolean;
	headerText: string;
	confirmButtonText: string;
}

export abstract class AuthorizationForm<T extends AuthorizationFormState> extends React.Component<
	AuthorizationFormProperties,
	T
> {
	constructor(props: AuthorizationFormProperties) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	protected abstract handleSubmit(): void;

	protected abstract getFormContent(): JSX.Element;

	render(): React.ReactNode {
		return (
			<Card className={this.props.classes.authorizationCard}>
				<CardHeader avatar={<Avatar>Y</Avatar>} title="YARB" subheader="Yet Another Retro Board" />
				<CardContent>
					<Typography variant="h5">{this.state.headerText}</Typography>
					<div className={this.props.classes.authorizationFormWrapper}>{this.getFormContent()}</div>
				</CardContent>
				<CardActions>
					<div className={this.props.classes.authorizationCardButtonContainer}>
						<Button variant="contained" color="primary" disabled={!this.state.canConfirm} onClick={this.handleSubmit}>
							{this.state.confirmButtonText}
						</Button>
						<Button
							variant="contained"
							onClick={() => {
								this.props.handleNavigationChange(this);
							}}
						>
							{this.props.navigationButtonText}
						</Button>
					</div>
				</CardActions>
			</Card>
		);
	}
}
