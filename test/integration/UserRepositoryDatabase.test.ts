import PostgreSQLConnectionAdapter from "../../src/infra/database/PostgreSQLConnectionAdapter";
import Connection from "../../src/infra/database/Connection";
import UserRepositoryDatabase from "../../src/infra/repository/database/UserRepositoryDatabase";
import User from "../../src/domain/entity/User";

let connection: Connection;

beforeEach(function () {
	connection = new PostgreSQLConnectionAdapter();
});


test("Deve criar um usuário", async function () {
	const userRepository = new UserRepositoryDatabase(connection);
	
	const user = new User(1,1,"John Lennon","blackbirdflies.com.uk","singer and guitar player","", new Date(), undefined, undefined); 
	await userRepository.save(user);
	expect(1).toBe(1);
});

test("Deve obter um usuário por id usuário", async function () {
	const userRepository = new UserRepositoryDatabase(connection);
	const savedUser = await userRepository.getById(1);
	expect(savedUser.id_user).toBe(1);
});


afterEach(async function () {
	await connection.close();
});