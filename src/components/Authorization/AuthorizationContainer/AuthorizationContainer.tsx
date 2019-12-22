import React from "react";
import { AuthorizationForm } from "../AuthorizationForm/AuthorizationForm";
import Login from "../Login/Login";
import Register from "../Register/Register";
import { Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) =>
	createStyles({
		authorizationContainer: {
			width: "100vw",
			height: "100vh",
			display: "flex",
			justifyContent: "center",
			alignItems: "center"
		}
	});

interface AuthorizationContainerProperties extends WithStyles<typeof styles> {}
interface AuthorizationContainerState {
	selectedFormClass: any;
	navigationButtonText: string;
}

class AuthorizationContainer extends React.Component<AuthorizationContainerProperties, AuthorizationContainerState> {
	constructor(props: AuthorizationContainerProperties) {
		super(props);
		this.state = {
			selectedFormClass: Login,
			navigationButtonText: "Register"
		};

		this.handleNavigationChange = this.handleNavigationChange.bind(this);
	}

	handleNavigationChange(source: AuthorizationForm<any>): void {
		let newFormClass: any;

		if (source.constructor.name === "Login") {
			newFormClass = Register;
		} else if (source.constructor.name === "Register") {
			newFormClass = Login;
		}

		this.setState({
			selectedFormClass: newFormClass,
			navigationButtonText: newFormClass === Login ? "Register" : "Login"
		});
	}

	render(): React.ReactNode {
		return (
			<div className={this.props.classes.authorizationContainer}>
				{React.createElement(this.state.selectedFormClass, {
					navigationButtonText: this.state.navigationButtonText,
					handleNavigationChange: this.handleNavigationChange
				})}
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(AuthorizationContainer);
