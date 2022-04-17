import User from "../../../domain/entity/User";
import UserRepository from "../../../domain/repository/UserRepository";
import Connection from "../../database/Connection";

export default class UserRepositoryDatabase implements UserRepository {

	constructor (readonly connection: Connection) {
	}

	async save(user: User): Promise<void> {
		const [userData] = await this.connection.query("insert into sb.user (id_library,name,email,bio,profilePic,registerDate,deactiveDate,lastLogin) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *", [user.id_library, user.name, user.email, user.bio, user.profilePic, user.registerDate, user.deactiveDate?.getDate, user.lastLogin?.getDate]);
	}
    
    async getById(id: number): Promise<User> {
		const [userData] = await this.connection.query("select * from sb.user where id_user = $1", [id]);
		if (!userData) throw new Error("User not found");
		const user = new User(userData.id_user,userData.id_library, userData.name, userData.email, userData.bio, userData.profilePic,
            userData.registerDate, userData.deactiveDate, userData.lastLogin);

		return user;
	}
}
