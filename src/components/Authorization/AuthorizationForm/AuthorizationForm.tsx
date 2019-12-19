import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Typography } from "@material-ui/core";
import React from "react";
import "./AuthorizationForm.css";
import { RouteComponentProps } from "react-router-dom";

export interface AuthorizationFormProperties extends RouteComponentProps {
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

	render(): JSX.Element {
		return (
			<Card className="authorizationCard">
				<CardHeader
					avatar={<Avatar>Y</Avatar>} //TODO:
					title="YARB"
					subheader="Yet Another Retro Board"
				/>
				<CardContent>
					<Typography variant="h5">{this.state.headerText}</Typography>
					<div className="authorizationFormWrapper">{this.getFormContent()}</div>
				</CardContent>
				<CardActions>
					<div className="authorizationCardButtonContainer">
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
