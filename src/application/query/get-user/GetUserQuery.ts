import Connection from "../../../infra/database/Connection";
import GetUserOutput from "../../usecase/get-user/GetUserOutput";
import GetUserQueryPresenter from "./GetUserQueryPresenter";


export default class GetUserQuery {

	constructor (readonly connection: Connection, readonly presenter: GetUserQueryPresenter) {
	}

	async execute (): Promise<void> {
		const userData = await this.connection.query("select * from sb.user", []);
		const getUserOutput = new GetUserOutput(userData.name, userData.bio);
		this.presenter.present(getUserOutput);
	}
}
