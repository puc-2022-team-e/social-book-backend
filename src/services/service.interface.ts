import { ApiResponse } from './api.response.interface';
import { DataBaseServices } from './database.services';

export default class Services {
	db: DataBaseServices;
	collection: string;
	validator?: any;
	apiResponse?: ApiResponse;

	constructor(db: DataBaseServices) {
		this.db = db;
		this.collection = '';
	}

	updateResponse(newStatusCode: number, newBody: any): ApiResponse {
		this.apiResponse = {
			statusCode: newStatusCode,
			body: newBody,
		};
		return this.apiResponse;
	}

	async getEntity(id?: string): Promise<ApiResponse> {
		var query = {};
		var responseBody;
		var mongoStatusCode = 200;
		try {
			if (id) {
				query = this.db.queryBuilder(id);
			}

			responseBody = await this.db.findAny(query, this.collection);
			if (id && responseBody.length === 0) {
				mongoStatusCode = 404;
			}
		} catch (e) {
			// console.error(e);
			mongoStatusCode = 500;
			responseBody = [
				{ statusCode: mongoStatusCode, error: 'Internal Server Error' },
			];
		}
		return this.updateResponse(mongoStatusCode, responseBody);
	}

	async getSingleEntity(query: Object): Promise<ApiResponse> {
		var responseBody;
		var mongoStatusCode = 200;
		
		console.log(JSON.stringify(query));

		try {
			responseBody = await this.db.findOne(query, this.collection);
		} catch (e) {
			mongoStatusCode = 500;
			responseBody = {
				statusCode: mongoStatusCode,
				error: 'Internal Server Error',
			};
		}
		return this.updateResponse(mongoStatusCode, responseBody);
	}

	async updateEntity(id: string, values: Object): Promise<ApiResponse> {
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
				message: 'internal server Error',
			};
		}
		return this.updateResponse(mongoStatusCode, responseBody);
	}

	async newEntity(entity: Object): Promise<ApiResponse> {
		var mongoStatusCode = 404;
		var responseBody = {};
		try {
			//try to cast the post object as a Book Object
			var validEntity = this.castEntity(entity);
			var hasProblems = this.validator.validate(validEntity);
			if (Object.keys(hasProblems).length === 0) {
				const ret = await this.db.insertOne(validEntity, this.collection);
				if (ret?.insertedId) {
					mongoStatusCode = 201;
					responseBody = {
						status: 'success',
						id: ret?.insertedId,
					};
				}
			} else {
				mongoStatusCode = 500;
				responseBody = hasProblems;
			}
		} catch (e) {
			//console.error(e);
			mongoStatusCode = 500;
		}

		return this.updateResponse(mongoStatusCode, responseBody);
	}

	async deleteEntity(id: string, noShortId:boolean=false): Promise<ApiResponse> {
		var mongoStatusCode = 404;
		var responseBody = {};
		var query = {};

		try {
			if (id) {
				if(!noShortId){
					query = this.db.queryBuilder(id);
				}else{
					query = this.db.queryByIdBuilder(id)
				}
				
			}
			console.log(JSON.stringify(query));
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

		return this.updateResponse(mongoStatusCode, responseBody);
	}

	castEntity(entity: object): any {}
}
