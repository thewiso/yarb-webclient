let validationId = 1;


export interface ValidationCheck {
	isValid: (value: string) => boolean;
	errorMessage: string;
}

export class TextFieldValidation {
	public readonly id: number;
	private firstVisit: boolean;
	public value: string;
	private readonly validationChecks: ValidationCheck[];
	public errorMessage: string;
	public error: boolean; 
	private readonly onChange: (validation: TextFieldValidation) => void;

	constructor(
		value: string,
		validationChecks: ValidationCheck[],
		onChange: (validation: TextFieldValidation) => void,
		validateAfterFirstVisit = true
	) {
		this.value = value;
		this.validationChecks = validationChecks;
		this.firstVisit = validateAfterFirstVisit;
		this.errorMessage = "";
		this.error = false; 
		this.onChange = onChange;
		this.id = ++validationId;

		if(!validateAfterFirstVisit){
			let validationCheck: ValidationCheck | null = this.checkValidations();
			if(validationCheck == null){
				this.error = false;
				this.errorMessage = "";
			}else{
				this.error = true;
				this.errorMessage = validationCheck.errorMessage;
			}
		}
	}

	public handleBlur(event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		if (this.firstVisit) {
			this.firstVisit = false;
			this.validate(event.target.value);
		}
	}

	public handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
		if (!this.firstVisit) {
			this.validate(event.target.value);
		} else {
			this.value = event.target.value;
			this.onChange(this);
		}
	}

	private validate(value: string): void {
		this.value = value;
		let validationCheck: ValidationCheck | null = this.checkValidations();

		if(validationCheck == null){
			this.error = false;
			this.errorMessage = "";
		}else{
			this.error = true;
			this.errorMessage = validationCheck.errorMessage;
		}

		this.onChange(this);
	}

	public reValidate(): void {
		this.firstVisit = false;
		this.validate(this.value);
	}

	private checkValidations(): ValidationCheck | null {
		let retVal: ValidationCheck | null = null;
		let i = 0;

		while (i < this.validationChecks.length && retVal == null) {
			let validationCheck = this.validationChecks[i];
			if (!validationCheck.isValid.call(this, this.value)) {
				retVal = validationCheck;
			}
			i++;
		}

		return retVal;
	}

	public isValid(): boolean {
		if(this.firstVisit){
			return this.checkValidations() == null;
		}else{
			return !this.error;
		}
	}
}
export default TextFieldValidation;