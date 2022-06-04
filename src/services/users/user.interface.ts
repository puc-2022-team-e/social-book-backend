export default interface UserInterface {
	_id?:string,
	userName: string;
	email: string;
	linkProfileImage?: string;
	registerDate: Date;
	deactiveDate?: Date;
	role?: string;
	providerUserId:string,
	providerType:string;
}
