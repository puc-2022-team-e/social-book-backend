import { DataBaseServices } from "./database.services";
import { ApiResponse } from "./interface/api.response.interface";
import Services from "./interface/service.interface";

export class BooksServices implements Services{
	db:DataBaseServices;
	collection:string;

	constructor(db:DataBaseServices){
		this.db = db;
		this.collection = 'books';
	}
	
	async getBooks(bookId?:string):Promise<ApiResponse>{
		var query = {};
		var books;
		var mongoStatusCode = 200;
		try {
			if(bookId){
				query  = await this.db.queryBuilder(bookId);
			}

			books = await this.db.findAny(query, this.collection);
			if (!books){
				mongoStatusCode = 404
				books = []
			}
		}catch(e){
			console.error(e);
			mongoStatusCode = 500;
		}
		return { statusCode:mongoStatusCode, body:books||[]};
	}

	async updateBook(bookId:string,values:Object):Promise<ApiResponse>{
		var mongoStatusCode = 404;
		var responseBody = {};
		try{
			const newValues = { $set: values };
			const query = await this.db.queryBuilder(bookId);
			const ret = await this.db.updateOne(query, newValues, this.collection);
			
			if (ret?.modifiedCount && ret?.modifiedCount > 0){
				mongoStatusCode = 200,
				responseBody = {
					status:mongoStatusCode,
					message: `Document ${bookId} successfully updated`,
				}
			}
		}catch(e){
			console.error(e);
			mongoStatusCode = 500;
		}
		return {statusCode:mongoStatusCode,body:responseBody}
	}

	async postBook(book:Object):Promise<ApiResponse>{
		var mongoStatusCode = 500;
		var responseBody = {};
		
		try{
			const ret = await this.db.insertOne(book,this.collection);
			if (ret?.insertedId){
				mongoStatusCode = 201;
				responseBody = {
					status: 'success',
					id: ret?.insertedId,
				}
			}
		}catch(e){
			console.error(e);
		}
		
		return {statusCode:mongoStatusCode,body:responseBody}
	}

	async deleteBook(bookId:string):Promise<ApiResponse>{
		var mongoStatusCode = 404;
		var responseBody = {};
		var query = {};

		try {
			if(bookId){
				query  = await this.db.queryBuilder(bookId);
			}

			const deleted = await this.db.deleteOne(query, this.collection);
			if (deleted.deletedCount === 1 ){
				mongoStatusCode = 200;
				responseBody = {
					status: 200,
						message: `deleted: ${deleted?.deletedCount}`,
				}
			}

		}catch(e){
			console.error(e);
			mongoStatusCode = 500;
		}

		return {statusCode:mongoStatusCode,body:responseBody}
	}
}