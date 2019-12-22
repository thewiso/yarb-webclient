import { AxiosError } from "axios";


export enum YarbErrorType {
	NetworkError,
	InternalServerError,
	UnhandledError
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

	public handleRejectedResponse(rejectedResponse: AxiosError): any {
		let errorResult: YarbError | undefined;
		if (rejectedResponse.message === "Network Error") {
			errorResult = NetworkError;
		}
		if (rejectedResponse.response) {
			let status: number = rejectedResponse.response.status;
			if (status === 500) {
				let errorMessage = "The server had an internal error. "
				let internalErrorMessage = rejectedResponse.response.data;
				//check if this is a InternalErrorMessage
				if (internalErrorMessage.exceptionId) {
					errorMessage += "When reporting a bug, please provide this error id: " + internalErrorMessage.exceptionId;
				}
				errorResult = {
					type: YarbErrorType.InternalServerError,
					message: errorMessage
				}
			}
		}

		if (errorResult) {
			this.notifyListeners(errorResult);
			return rejectedResponse;
		} else {
			return Promise.reject(rejectedResponse);
		}
	}

	public handleUnexpectedError(error: AxiosError): void {
		this.notifyListeners({
			type: YarbErrorType.UnhandledError,
			message: "Unexpected error: " + JSON.stringify(error),
		})
	}

	private notifyListeners(error: YarbError): void {
		console.error(error);
		this.listeners.forEach(listener => {
			listener(error);
		});
	}

	public addErrorListener(listener: (error: YarbError) => void): void {
		this.listeners.push(listener);
	}
}
