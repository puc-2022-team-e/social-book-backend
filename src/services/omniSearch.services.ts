import Services from './service.interface';
import { DataBaseServices } from './database.services';
import { ApiResponse } from './api.response.interface';

export class OmniSearch extends Services {
	constructor(db: DataBaseServices) {
		super(db);
		this.collection = 'discussions';
	}

	async search(pattern:any):Promise<ApiResponse> {
		var responseBody = {}
		var mongoStatusCode = 200;
		console.log(`pattern ${pattern}`)
		if (pattern) {
			const query = { $text: { $search: pattern } };
			
			const books = await this.db.findAny(query, 'books');
			console.log(JSON.stringify(books))
			responseBody = books;
		} else {
			mongoStatusCode = 404;
		}
		return this.updateResponse(mongoStatusCode,responseBody)
	}
}
