export default interface DiscussionInterface {
	_id?: string;
	title: string;
	bookId: string;
	userId?: string;
	created: Date;
	updated?: Date;
	deleted?: Date;
	bookInfo?: {
		bookId: string;
		bookShort: string;
		userName: string;
		bookAuthor: [string];
		bookTitle: string;
	};
	comments?: [
		{
			id?: string;
			order?: number;
			userId: string;
			created: string;
			updated?: string;
			deleted?: string;
			text: string;
		}
	];
}
