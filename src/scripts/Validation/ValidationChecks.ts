import { ValidationCheck } from "./Validation";

export const NotEmpty: ValidationCheck = {
	isValid: (value: string) => {
		return value.length > 0;
	},
	errorMessage: "Must not be empty"
};

const NoSpacesRegex: RegExp = new RegExp("^[^s]*$");
export const NoSpaces: ValidationCheck = {
	isValid: (value: string) => {
		return NoSpacesRegex.test(value);
	},
	errorMessage: "Must not contain spaces"
};

const AlphabeticRegex: RegExp = new RegExp("^[A-Za-z]*$");
export const Alphabetic: ValidationCheck = {
	isValid: (value: string) => {
		return AlphabeticRegex.test(value);
	},
	errorMessage: "Must only contain alphabetic characters"
};

export function MinLength(minLength: number): ValidationCheck {
	let retVal: ValidationCheck = {
		isValid: (value: string) => {
			return value.length >= minLength;
		},
		errorMessage: `Must contain at least ${minLength} characters`
	};
	return retVal;
}

export function MaxLength(maxLength: number): ValidationCheck {
	let retVal: ValidationCheck = {
		isValid: (value: string) => {
			return value.length <= maxLength;
		},
		errorMessage: `Must contain at most ${maxLength} characters`
	};
	return retVal;
}
