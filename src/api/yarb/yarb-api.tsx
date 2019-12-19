import JWT from "../../scripts/Cache/JWT";
import { DefaultApi } from "./gen";
import { CreateBoard, CreateBoardNote } from "./gen/model";
import Axios, { AxiosInstance, AxiosTransformer } from "axios";
import { AxiosDeserialization } from "../Utils/AxiosDeserialization";
import { YarbErrorHandler } from "../Utils/YarbErrorHandler";

const axios = Axios.create({
	transformResponse: [AxiosDeserialization]
});

class YarbApi extends DefaultApi {
	constructor() {
		//TODO: in property file
		super(undefined, "http://localhost:8080/yarb", axios);
		this.axios.interceptors.response.use(
			response => response,
			rejectedResponse => {
				return YarbErrorHandler.getInstance().handleRejectedResponse(rejectedResponse);
			}
		);
	}

	public createBoard(createBoard: CreateBoard) {
		return super.createBoard(createBoard, YarbApi.createJWTOptions());
	}

	public getUser() {
		return super.getUser(YarbApi.getUserId(), YarbApi.createJWTOptions());
	}

	public getBoardsByOwner() {
		return super.getBoardsByOwner(YarbApi.getUserId(), YarbApi.createJWTOptions());
	}

	public getBoard(id: number) {
		return super.getBoard(id);
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
