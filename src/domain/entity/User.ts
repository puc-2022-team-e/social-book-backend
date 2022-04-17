export default class User {

	constructor (readonly id_user: number, readonly id_library: number, readonly name: string, readonly email: string, readonly bio: string, readonly profilePic: string,
		readonly registerDate: Date, readonly deactiveDate?: Date, readonly lastLogin?:Date) {
	}
}