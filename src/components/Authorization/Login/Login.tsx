import { AxiosError, AxiosResponse } from "axios";
import React, { KeyboardEvent, RefObject } from "react";
import { LoginData } from "../../../api/yarb/gen/model";
import { UserCredentials } from "../../../api/yarb/gen/model/user-credentials";
import YarbApi from "../../../api/yarb/yarb-api";
import JWT from "../../../scripts/Cache/JWT";
import TextFieldValidation from "../../../scripts/Validation/Validation";
import * as ValidationChecks from "../../../scripts/Validation/ValidationChecks";
import ValidationTextField from "../../Validation/ValidationTextField";
import { AuthorizationForm, AuthorizationFormProperties, AuthorizationFormState } from "../AuthorizationForm/AuthorizationForm";
import { withRouter } from "react-router-dom";

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
			canConfirm: false,
			confirmButtonText: "Login",
			headerText: "Login",
			usernameValidation: new TextFieldValidation(
				"",
				[ValidationChecks.Alphabetic, ValidationChecks.MinLength(4), ValidationChecks.MaxLength(20)],
				this.handleValidationChange.bind(this)
			),
			passwordValidation: new TextFieldValidation(
				"",
				[ValidationChecks.MinLength(6), ValidationChecks.MaxLength(20)],
				this.handleValidationChange.bind(this)
			)
		};
	}

	handleValidationChange(validation: TextFieldValidation) {
		let newState: LoginState = Object.assign({}, this.state);
		let canConfirm = this.state.usernameValidation.isValid() && this.state.passwordValidation.isValid();
		newState.canConfirm = canConfirm;
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

	handleKeyDown(event: KeyboardEvent){
		if(event.key === "Enter"){
			this.handleSubmit();
		}
	}

	protected getFormContent(): JSX.Element {
		return (
			<div>
				<div className="authorizationInputWrapper">
					<ValidationTextField
						placeholder="Enter your Username"
						label="Username"
						validation={this.state.usernameValidation}
						className="authorizationInput"
						fullWidth
					/>
				</div>

				<div className="authorizationInputWrapper">
					<ValidationTextField
						type="password"
						placeholder="Enter your Password"
						label="Password"
						validation={this.state.passwordValidation}
						className="authorizationInput"
						inputRef={this.passwordInputRef}
						onKeyDown={this.handleKeyDown.bind(this)}
						fullWidth
					/>
				</div>
			</div>
		);
	}

	//TODO: https://openapi-generator.tech/docs/generators/typescript-axios withInterfaces for JWT?
	protected handleSubmit(): void {
		if (this.state.canConfirm) {
			let credentials: UserCredentials = {
				username: this.state.usernameValidation.value,
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
					if (error.response && error.response.status === 401) {
						let passwordValidation = this.state.passwordValidation;
						passwordValidation.errorMessage = "Username or password is wrong";
						passwordValidation.error = true;
						passwordValidation.value = "";

						this.handleValidationChange(passwordValidation);
						if (this.passwordInputRef.current) {
							this.passwordInputRef.current.focus();
						}
					}
					//TODO: else
				});
		}
	}
}
export default withRouter(Login);
