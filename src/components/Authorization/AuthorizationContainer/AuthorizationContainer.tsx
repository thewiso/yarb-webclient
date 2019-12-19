import React from "react";
import { AuthorizationForm } from "../AuthorizationForm/AuthorizationForm";
import Login from "../Login/Login";
import Register from "../Register/Register";
import "./AuthorizationContainer.css";

interface AuthorizationContainerProperties {

}
interface AuthorizationContainerState {
	selectedFormClass: any; //TODO:
}

class AuthorizationContainer extends React.Component<AuthorizationContainerProperties, AuthorizationContainerState> {
	constructor(props: AuthorizationContainerProperties) {
		super(props);
		this.state = {
			selectedFormClass: Login
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

		this.setState({ selectedFormClass: newFormClass });
	}

	render() {
		return (
			<div className="authorizationContainer">
				{React.createElement(this.state.selectedFormClass, {
					navigationButtonText: "Register",//TODO: has to change
					handleNavigationChange: this.handleNavigationChange,
				})}
			</div>
		);
	}
}

export default AuthorizationContainer;
