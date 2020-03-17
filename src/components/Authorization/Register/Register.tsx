import React, { RefObject, KeyboardEvent } from "react";
import TextFieldValidation from "../../../scripts/Validation/Validation";
import * as ValidationChecks from "../../../scripts/Validation/ValidationChecks";
import ValidationTextField from "../../Validation/ValidationTextField";
import {
	AuthorizationForm,
	AuthorizationFormProperties,
	AuthorizationFormState,
	AuthorizationFormStyles
} from "../AuthorizationForm/AuthorizationForm";
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { UserCredentials } from "../../../api/yarb/gen/model";
import YarbApi from "../../../api/yarb/yarb-api";
import JWT from "../../../scripts/Cache/JWT";
import { AxiosError } from "axios";
import { YarbErrorHandler } from "../../../api/Utils/YarbErrorHandler";

interface RegisterProperties extends AuthorizationFormProperties {}

interface RegisterState extends AuthorizationFormState {
	usernameValidation: TextFieldValidation;
	passwordValidation: TextFieldValidation;
	passwordRepetitionValidation: TextFieldValidation;
}

//https://stackoverflow.com/questions/37949981/call-child-method-from-parent

class Register extends AuthorizationForm<RegisterState> {
	private usernameInputRef: RefObject<HTMLDivElement>;

	constructor(props: RegisterProperties) {
		super(props);

		this.usernameInputRef = React.createRef();

		this.state = {
			canConfirm: false,
			confirmButtonText: "Register",
			headerText: "Register",
			usernameValidation: new TextFieldValidation(
				"",
				[ValidationChecks.Alphabetic, ValidationChecks.MinLength(4), ValidationChecks.MaxLength(20)],
				this.handleValidationChange.bind(this)
			),
			passwordValidation: new TextFieldValidation(
				"",
				[ValidationChecks.MinLength(6), ValidationChecks.MaxLength(20)],
				this.handleValidationChange.bind(this)
			),
			passwordRepetitionValidation: new TextFieldValidation(
				"",
				[
					{
						isValid: (value: string) => {
							return value === this.state.passwordValidation.value;
						},
						errorMessage: `Must be the same as password`
					}
				],
				this.handleValidationChange.bind(this)
			)
		};
	}

	private handleValidationChange(validation: TextFieldValidation): void {
		let newState: RegisterState = Object.assign({}, this.state);
		switch (validation.id) {
			case this.state.usernameValidation.id:
				newState.usernameValidation = validation;
				break;
			case this.state.passwordValidation.id:
				newState.passwordValidation = validation;
				this.state.passwordRepetitionValidation.reValidate();
				break;
			case this.state.passwordRepetitionValidation.id:
				newState.passwordRepetitionValidation = validation;
				break;
		}
		newState.canConfirm =
			this.state.usernameValidation.isValid() &&
			this.state.passwordValidation.isValid() &&
			this.state.passwordRepetitionValidation.isValid();

		this.setState(newState);
	}

	protected getFormContent(): JSX.Element {
		return (
			<div>
				<div className={this.props.classes.authorizationInputWrapper}>
					<ValidationTextField
						id="registerUsername"
						placeholder="Enter your Username"
						validation={this.state.usernameValidation}
						label="Username"
						fullWidth
						autoFocus
						inputRef={this.usernameInputRef}
					/>
				</div>

				<div className={this.props.classes.authorizationInputWrapper}>
					<ValidationTextField
						id="registerPassword"
						type="password"
						placeholder="Enter your Password"
						label="Password"
						validation={this.state.passwordValidation}
						fullWidth
					/>
				</div>

				<div className={this.props.classes.authorizationInputWrapper}>
					<ValidationTextField
						id="registerPasswordRepetition"
						type="password"
						placeholder="Repeat your Password"
						label="Password"
						validation={this.state.passwordRepetitionValidation}
						fullWidth
						onKeyDown={this.handlePasswordRepititionKeyDown.bind(this)}
					/>
				</div>
			</div>
		);
	}

	private handlePasswordRepititionKeyDown(event: KeyboardEvent): void{
		if(event.key === "Enter"){
			this.handleSubmit();
		}
	}

	protected handleSubmit(): void {
		if (this.state.canConfirm) {
			const credentials: UserCredentials = {
				username: this.state.usernameValidation.value.toLowerCase(),
				password: this.state.passwordValidation.value
			};

			const api: YarbApi = new YarbApi();
			api
				.createUser(credentials)
				.then(() => {
					api
						.login(credentials)
						.then(value => {
							JWT.getInstance().setJWTString(value.data.token);
							this.props.history.push("/user");
						})
						.catch(error => {
							YarbErrorHandler.getInstance().handleUnexpectedError(error);
						});
				})
				.catch((error: AxiosError) => {
					if (error.response && error.response.status === 409) {
						let usernameValidation = this.state.usernameValidation;
						usernameValidation.errorMessage = "Username is already taken";
						usernameValidation.error = true;
						usernameValidation.value = "";
						this.state.passwordRepetitionValidation.value = "";
						this.state.passwordValidation.value = "";

						this.handleValidationChange(usernameValidation);
						if (this.usernameInputRef.current) {
							this.usernameInputRef.current.focus();
						}
					} else {
						YarbErrorHandler.getInstance().handleUnexpectedError(error);
					}
				});
		}
	}
}
export default withStyles(AuthorizationFormStyles, { withTheme: true })(withRouter(Register));
