import axios from "axios";
import User from "../../src/domain/entity/User";
import RepositoryFactory from "../../src/domain/factory/RepositoryFactory";
import Connection from "../../src/infra/database/Connection";
import PostgreSQLConnectionAdapter from "../../src/infra/database/PostgreSQLConnectionAdapter";
import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";

let connection: Connection;
let repositoryFactory: RepositoryFactory;

beforeEach(async function () {
	connection = new PostgreSQLConnectionAdapter();
	repositoryFactory = new DatabaseRepositoryFactory(connection);
	const userRepository = repositoryFactory.createUserRepository();
});


test("Deve testar a API /user", async function () {
	const response = await axios({
		url: "http://localhost:3000/user",
		method: "get"
	});
	const items = response.data;
	expect(items).toBe('dd');
});


afterEach(async function () {
	await connection.close();
});