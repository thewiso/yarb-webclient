import TextField, { StandardTextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import TextFieldValidation from "../../scripts/Validation/Validation";
import "./ValidationTextField.css";

interface ValidationTextFieldProperties extends StandardTextFieldProps {
	validation: TextFieldValidation;
}
interface ValidationTextFieldState {}

class ValidationTextField extends React.Component<ValidationTextFieldProperties, ValidationTextFieldState> {
	render(): React.ReactNode {
		return (
			<TextField
				placeholder={this.props.placeholder}
				label={this.props.label}
				onChange={event => this.props.validation.handleChange(event)}
				onBlur={event => this.props.validation.handleBlur(event)}
				value={this.props.validation.value}
				error={this.props.validation.error}
				helperText={this.props.validation.errorMessage}
				className={"validationTextField " + this.props.className}
				inputRef={this.props.inputRef}
				type={this.props.type}
				onKeyDown={this.props.onKeyDown}
				fullWidth={this.props.fullWidth}
				autoFocus={this.props.autoFocus}
				InputProps={this.props.InputProps}
				// {...this.props}
			/>
		);
	}
}

export default ValidationTextField;
