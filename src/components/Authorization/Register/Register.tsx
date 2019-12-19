import React from "react";
import TextFieldValidation from "../../../scripts/Validation/Validation";
import * as ValidationChecks from "../../../scripts/Validation/ValidationChecks";
import ValidationTextField from "../../Validation/ValidationTextField";
import { AuthorizationForm, AuthorizationFormProperties, AuthorizationFormState } from "../AuthorizationForm/AuthorizationForm";

interface RegisterProperties extends AuthorizationFormProperties {}

interface RegisterState extends AuthorizationFormState {
	usernameValidation: TextFieldValidation;
	passwordValidation: TextFieldValidation;
	passwordRepetitionValidation: TextFieldValidation;
}

//https://stackoverflow.com/questions/37949981/call-child-method-from-parent

class Register extends AuthorizationForm<RegisterState> {
	constructor(props: RegisterProperties) {
		super(props);

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
	}//TODO: change first passwordInput after secondInput is valid
	
	private handleValidationChange(validation: TextFieldValidation) {
		let newState: RegisterState = Object.assign({}, this.state);
		let canConfirm = this.state.usernameValidation.isValid() && this.state.passwordValidation.isValid();
		newState.canConfirm = canConfirm;
		switch (validation.id) {
			case this.state.usernameValidation.id:
				newState.usernameValidation = validation;
				break;
			case this.state.passwordValidation.id:
				newState.passwordValidation = validation;
				break;
			case this.state.passwordRepetitionValidation.id:
				newState.passwordRepetitionValidation = validation;
				break;
		}

		this.setState(newState);
	}

	protected getFormContent(): JSX.Element {
		return (
			<div>
				<div className="authorizationInputWrapper">
					<ValidationTextField
						placeholder="Enter your Username"
						validation={this.state.usernameValidation}
						label="Username"
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
						fullWidth
					/>
				</div>

				<div className="authorizationInputWrapper">
					<ValidationTextField
						type="password"
						placeholder="Repeat your Password"
						label="Password"
						validation={this.state.passwordRepetitionValidation}
						className="authorizationInput"
						fullWidth
					/>
				</div>
			</div>
		);
	}

	protected handleSubmit(): void {
		console.log("SUBMIT");
	}
}
export default Register;
