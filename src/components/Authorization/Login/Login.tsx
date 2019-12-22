import { AxiosError, AxiosResponse } from "axios";
import React, { KeyboardEvent, RefObject } from "react";
import { LoginData } from "../../../api/yarb/gen/model";
import { UserCredentials } from "../../../api/yarb/gen/model/user-credentials";
import YarbApi from "../../../api/yarb/yarb-api";
import JWT from "../../../scripts/Cache/JWT";
import TextFieldValidation from "../../../scripts/Validation/Validation";
import ValidationTextField from "../../Validation/ValidationTextField";
import { AuthorizationForm, AuthorizationFormProperties, AuthorizationFormState, AuthorizationFormStyles } from "../AuthorizationForm/AuthorizationForm";
import { withRouter } from "react-router-dom";
import { YarbErrorHandler } from "../../../api/Utils/YarbErrorHandler";
import { withStyles } from "@material-ui/core";

interface LoginProperties extends AuthorizationFormProperties   {}

interface LoginState extends AuthorizationFormState {
	usernameValidation: TextFieldValidation;
	passwordValidation: TextFieldValidation;
}

class Login extends AuthorizationForm<LoginState> {
	private passwordInputRef: RefObject<HTMLDivElement>;
	constructor(props: LoginProperties) {
		super(props);

		this.passwordInputRef = React.createRef();

		this.state = {
			canConfirm: true,
			confirmButtonText: "Login",
			headerText: "Login",
			usernameValidation: new TextFieldValidation(
				"",
				[],
				this.handleValidationChange.bind(this)
			),
			passwordValidation: new TextFieldValidation(
				"",
				[],
				this.handleValidationChange.bind(this)
			)
		};
	}

	handleValidationChange(validation: TextFieldValidation): void {
		let newState: LoginState = Object.assign({}, this.state);
		switch (validation.id) {
			case this.state.usernameValidation.id:
				newState.usernameValidation = validation;
				break;
			case this.state.passwordValidation.id:
				newState.passwordValidation = validation;
				break;
		}

		this.setState(newState);
	}

	handleKeyDown(event: KeyboardEvent): void{
		if(event.key === "Enter"){
			this.handleSubmit();
		}
	}

	protected getFormContent(): JSX.Element {
		return (
			<div>
				<div className={this.props.classes.authorizationInputWrapper}>
					<ValidationTextField
						placeholder="Enter your Username"
						label="Username"
						validation={this.state.usernameValidation}
						fullWidth
						autoFocus
					/>
				</div>

				<div className={this.props.classes.authorizationInputWrapper}>
					<ValidationTextField
						type="password"
						placeholder="Enter your Password"
						label="Password"
						validation={this.state.passwordValidation}
						inputRef={this.passwordInputRef}
						onKeyDown={this.handleKeyDown.bind(this)}
						fullWidth
					/>
				</div>
			</div>
		);
	}

	protected handleSubmit(): void {
		if (this.state.canConfirm) {
			let credentials: UserCredentials = {
				username: this.state.usernameValidation.value.toLowerCase(),
				password: this.state.passwordValidation.value
			};

			let api: YarbApi = new YarbApi();
			api
				.login(credentials)
				.then((value: AxiosResponse<LoginData>) => {
					JWT.getInstance().setJWTString(value.data.token);
					this.props.history.push("/user");
				})
				.catch((error: AxiosError) => {
					if (error.response && (error.response.status === 401 || error.response.status === 400)) {
						let passwordValidation = this.state.passwordValidation;
						passwordValidation.errorMessage = "Username or password is wrong";
						passwordValidation.error = true;
						passwordValidation.value = "";

						this.handleValidationChange(passwordValidation);
						if (this.passwordInputRef.current) {
							this.passwordInputRef.current.focus();
						}
					}else{
						YarbErrorHandler.getInstance().handleUnexpectedError(error);
					}
				});
		}
	}
}
export default withStyles(AuthorizationFormStyles, { withTheme: true })(withRouter(Login));
