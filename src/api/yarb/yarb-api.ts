import Axios, { AxiosPromise } from "axios";
import JWT from "../../scripts/Cache/JWT";
import { AxiosDeserialization } from "../Utils/AxiosDeserialization";
import { YarbErrorHandler } from "../Utils/YarbErrorHandler";
import { DefaultApi } from "./gen";
import { CreateBoard, CreatedResponse, User, Board, LoginData } from "./gen/model";

const axios = Axios.create({
	transformResponse: [AxiosDeserialization]
});

class YarbApi extends DefaultApi {
	constructor() {
		const apiURL = process.env.REACT_APP_API_URL;
		console.info(`Using API URL: ${apiURL}`)
		super(undefined, apiURL, axios);
		this.axios.interceptors.response.use(
			response => response,
			rejectedResponse => {
				return YarbErrorHandler.getInstance().handleRejectedResponse(rejectedResponse);
			}
		);
	}

	public createBoard(createBoard: CreateBoard): AxiosPromise<CreatedResponse> {
		return super.createBoard(createBoard, YarbApi.createJWTOptions());
	}

	public getUser(): AxiosPromise<User> {
		return super.getUser(YarbApi.getUserId(), YarbApi.createJWTOptions());
	}

	public getBoardsByOwner(): AxiosPromise<Board[]> {
		return super.getBoardsByOwner(YarbApi.getUserId(), YarbApi.createJWTOptions());
	}

	public getBoard(id: number): AxiosPromise<Board> {
		return super.getBoard(id);
	}

	public refreshToken(): AxiosPromise<LoginData>{
		return super.refreshToken(YarbApi.createJWTOptions());
	}

	protected static getUserId(): number {
		let userId = JWT.getInstance().getUserId();
		if (userId == null) {
			throw new Error("No userId existing");
		}
		return userId;
	}

	protected static createJWTOptions(): any {
		return {
			headers: {
				Authorization: "Bearer " + JWT.getInstance().getJWTString()
			}
		};
	}
}

export default YarbApi;
