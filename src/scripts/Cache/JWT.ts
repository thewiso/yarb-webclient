import YarbApi from "../../api/yarb/yarb-api";

const LOCALSTORAGE_JWT = "yarb.jwt";

interface JWTPayload {
	exp: number;
	sub: number;
}

class JWT {
	private static instance: JWT;
	public static getInstance() {
		if (!JWT.instance) {
			JWT.instance = new JWT();
		}
		return JWT.instance;
	}

	private jwtString: string | null = null;
	private userId: number | null = null;

	private constructor() {
		const jwtString = localStorage.getItem(LOCALSTORAGE_JWT);
		this.setJWTString(jwtString);
	}

	private static isValid(jwtPayload: JWTPayload | null): boolean {
		if (jwtPayload != null) {
			const expirationMillis = jwtPayload.exp * 1000;
			const expirationDate: Date = new Date(expirationMillis);
			console.info(
				`JWT expires at: ${expirationDate.getHours()}:${expirationDate.getMinutes()}:${expirationDate.getSeconds()}} `
			);
			return Date.now() < expirationMillis;
		}
		return false;
	}

	private static getJWTPayload(jwtString: string | null): JWTPayload | null {
		if (jwtString != null) {
			//1st part: header, 2nd part: payload, 3rd part: signature
			const payloadBase64Url = jwtString.split(".")[1];
			// //https://en.wikipedia.org/wiki/Base64#URL_applications
			const payloadBase64 = payloadBase64Url.replace("-", "+").replace("_", "/");
			// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob
			const payloadString = window.atob(payloadBase64);
			return JSON.parse(payloadString);
		}
		return null;
	}

	public getJWTString(): string | null {
		return this.jwtString;
	}

	public setJWTString(jwtString: string | null) {
		//TODO: automatic refresh
		const jwtPayload = JWT.getJWTPayload(jwtString);
		if (jwtString != null && jwtPayload != null && JWT.isValid(jwtPayload)) {
			this.jwtString = jwtString;
			this.userId = jwtPayload.sub;
			localStorage.setItem(LOCALSTORAGE_JWT, jwtString);
		} else {
			this.remove();
		}
	}

	public remove(): void {
		this.userId = null;
		this.jwtString = null;
		localStorage.removeItem(LOCALSTORAGE_JWT);
	}

	public isPresent(): boolean {
		return this.jwtString != null;
	}

	public getUserId(): number | null {
		return this.userId;
	}
}

export default JWT;
