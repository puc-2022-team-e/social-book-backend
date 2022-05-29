
import { ApiResponse } from "./api.response.interface";
import { DataBaseServices } from "./database.services";

export default class Services {
	db:DataBaseServices;
	collection:string;
	validator?:any;
	constructor(db:DataBaseServices){
		this.db = db;
		this.collection = '';
	}
	async getEntity(id?:string):Promise<ApiResponse>{
		var query = {};
		var responseBody;
		var mongoStatusCode = 200;
		try {
			if (id) {
				query = await this.db.queryBuilder(id);
			}

			responseBody = await this.db.findAny(query, this.collection);
			if (id && responseBody.length === 0) {
				mongoStatusCode = 404;
			}
		} catch (e) {
			// console.error(e);
			mongoStatusCode = 500;
			responseBody = [{statusCode: mongoStatusCode, error:"Internal Server Error"}]
		}
		return { statusCode: mongoStatusCode, body: responseBody || [] };
	}

	async updateEntity(id:string,values:Object):Promise<ApiResponse>{
		var mongoStatusCode = 404;
		var responseBody = {};
		try {
			const newValues = { $set: values };
			const query = await this.db.queryBuilder(id);
			const ret = await this.db.updateOne(query, newValues, this.collection);

			if (ret?.modifiedCount && ret?.modifiedCount > 0) {
				(mongoStatusCode = 200),
					(responseBody = {
						status: mongoStatusCode,
						message: `Document ${id} successfully updated`,
					});
			}
		} catch (e) {
			//console.error(e);
			mongoStatusCode = 500;
			responseBody = {
				status: mongoStatusCode,
				message: "internal server Error"
			}
		}
		return { statusCode: mongoStatusCode, body: responseBody };
	}

	async newEntity(entity:Object):Promise<ApiResponse>{
		var mongoStatusCode = 404;
		var responseBody = {};
		try {
			//try to cast the post object as a Book Object
			var validEntity = this.castEntity(entity);
			var hasProblems = this.validator.validate(validEntity)
			if (Object.keys(hasProblems).length === 0){
				const ret = await this.db.insertOne(validEntity, this.collection);
				if (ret?.insertedId) {
					mongoStatusCode = 201;
					responseBody = {
						status: 'success',
						id: ret?.insertedId,
					};
				}
			}else{
				mongoStatusCode = 500;
				responseBody = hasProblems;
			}
		} catch (e) {
			//console.error(e);
			mongoStatusCode = 500
		}

		return { statusCode: mongoStatusCode, body: responseBody };
	}

	async deleteEntity(id:string):Promise<ApiResponse>{
		var mongoStatusCode = 404;
		var responseBody = {};
		var query = {};

		try {
			if (id) {
				query = await this.db.queryBuilder(id);
			}

			const deleted = await this.db.deleteOne(query, this.collection);
			if (deleted.deletedCount === 1) {
				mongoStatusCode = 200;
				responseBody = {
					status: 200,
					message: `deleted: ${deleted?.deletedCount}`,
				};
			}
		} catch (e) {
			//console.error(e);
			mongoStatusCode = 500;
		}

		return { statusCode: mongoStatusCode, body: responseBody };
	}

	castEntity(entity:object):any{}
}