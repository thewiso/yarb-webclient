import YarbApi from "../../api/yarb/yarb-api";
import Login from "../../components/Authorization/Login/Login";

const LOCALSTORAGE_JWT = "yarb.jwt";
//Expiration time of the JWT - REFRESH_BUFFER_MILLIS = The point in time when the JWT is refreshed
const REFRESH_BUFFER_MILLIS = 1000 * 10;

interface JWTPayload {
	exp: number;
	sub: number;
}

class JWT {
	private static instance: JWT;
	public static getInstance(): JWT {
		if (!JWT.instance) {
			JWT.instance = new JWT();
		}
		return JWT.instance;
	}

	private jwtString: string | null = null;
	private jwtPayload: JWTPayload | null = null;
	private timeoutId: number | null = null;

	private constructor() {
		const jwtString = localStorage.getItem(LOCALSTORAGE_JWT);
		this.setJWTString(jwtString);
	}

	private static isValid(jwtPayload: JWTPayload | null): boolean {
		if (jwtPayload != null) {
			const expirationMillis = jwtPayload.exp * 1000;
			const expirationDate: Date = new Date(expirationMillis);
			console.info(
				`JWT expires at: ${expirationDate.getHours()}:${expirationDate.getMinutes()}:${expirationDate.getSeconds()} `
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

	public setJWTString(jwtString: string | null): void {
		const jwtPayload = JWT.getJWTPayload(jwtString);
		if (jwtString != null && jwtPayload != null && JWT.isValid(jwtPayload)) {
			this.jwtString = jwtString;
			this.jwtPayload = jwtPayload;
			localStorage.setItem(LOCALSTORAGE_JWT, jwtString);

			if (this.timeoutId) {
				window.clearTimeout(this.timeoutId);
			}
			const expirationMillis = this.jwtPayload.exp * 1000;
			const timeOut = expirationMillis - Date.now() - REFRESH_BUFFER_MILLIS;
			this.timeoutId = window.setTimeout(this.refreshToken.bind(this), timeOut);
		} else {
			this.remove();
		}
	}

	private refreshToken(): void {
		if (this.jwtString) {
			console.info("Refreshing JWT...")
			new YarbApi()
				.refreshToken()
				.then(response => {
					this.setJWTString(response.data.token);
				})
				.catch(error => {
					console.error(`Could not refresh JWT: ${this.jwtString}`)
					this.remove();
				});
		}
	}

	public remove(): void {
		this.jwtPayload = null;
		this.jwtString = null;
		localStorage.removeItem(LOCALSTORAGE_JWT);
	}

	public isPresent(): boolean {
		return this.jwtString != null;
	}

	public getUserId(): number | null {
		if (this.jwtPayload) {
			return this.jwtPayload.sub;
		}
		return null;
	}

	public getExpirationDate(): Date | null {
		if (this.jwtPayload) {
			return new Date(this.jwtPayload.exp * 1000);
		}
		return null;
	}
}

export default JWT;
