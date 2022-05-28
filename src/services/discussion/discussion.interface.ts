export default interface DiscussionInterface {
	_id?:string,
	title:string,
	bookId:string,
	userId?:string,
	created?:string,
	updated?:string,
	deleted?:string,
	comments?: [
		{
			id?:string,
			order?:number,
			userId:string,
			created:string,
			updated?:string,
			deleted?:string,
			text:string,
		}
	]
}