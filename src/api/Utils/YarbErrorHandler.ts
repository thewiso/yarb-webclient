import { InternalErrorMessage } from "../yarb/gen/model";


export enum YarbErrorType {
	NetworkError,
	InternalServerError,
	AuthenticationError,
	AuthorisationError
}

export interface YarbError {
	type: YarbErrorType;
	message: string;
}

const NetworkError: YarbError = {
	type: YarbErrorType.NetworkError,
	message: "Could not reach backend. Try again later."
}

export class YarbErrorHandler {
	private constructor() {
		this.listeners = [];
	}
	private static instance: YarbErrorHandler;

	private listeners: ((error: YarbError) => void)[];

	public static getInstance(): YarbErrorHandler {
		if (!YarbErrorHandler.instance) {
			YarbErrorHandler.instance = new YarbErrorHandler();
		}
		return YarbErrorHandler.instance;
	}

	public handleRejectedResponse(rejectedResponse: any): void {//TODO: log error
		let errorResult: YarbError | undefined;
		if (rejectedResponse instanceof Error) {
			if (rejectedResponse.message === "Network Error") {
				errorResult = NetworkError;
			}
		}
		if(rejectedResponse.response){
			let status: number = rejectedResponse.response.status;
			if(status === 500){
				let errorMessage = "The server had an internal error. "
				let internalErrorMessage = rejectedResponse.response.data;
				//check if this is a InternalErrorMessage
				if(internalErrorMessage.exceptionId){
					errorMessage += "When reporting a bug, please provide this error id: " + internalErrorMessage.exceptionId;
				}
				errorResult = {
					type: YarbErrorType.InternalServerError,
					message: errorMessage
				}
			}
		}
		

		// console.log(rejectedResponse.response.status);
		// rejectedResponse.
		if(errorResult){
			this.notifyListeners(errorResult);
		}
	}

	private notifyListeners(error: YarbError) {
		this.listeners.forEach(listener => {
			listener(error);
		});
	}

	public addErrorListener(listener: (error: YarbError) => void){
		this.listeners.push(listener);
	}
}
