export default interface BooksInterface {
	_id?: string;
	short: string;
	bookInfo: {
		title: string;
		subtile?: string;
		authors: [string];
		publisher: string;
		publishedDate: string;
		pageCount: number;
		mainCategory: string;
		categories: [string];
		imageLinks?: {
			thumbnail?: string;
			mainImage?: string;
		};
	};
	selfLink?: string;
	averageRating: number;
	ratingCount: number;
	userInfo?: {
		userReview?: string;
		userRate?: number;
		isPurchased?: boolean;
	};
}
