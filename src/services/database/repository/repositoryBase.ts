import { DataBaseServices } from '../../../services/database.services';
import IRepositoryBase from '../../../services/interfaces/IRepositoryBase';

const dataBase = new DataBaseServices();

export default class RepositoryBase implements IRepositoryBase{
    
    async findAny(query:any, COLLECTION:any)
    {
        try {

            await dataBase.connect();
            var result = await dataBase.findAny(query, COLLECTION);
            return result;    
        } catch (error) {
            throw new Error(`Error while trying to get ${COLLECTION}`);
        } finally{
            await dataBase.disconnect();
        }
    }

    async insertOne(queryObjectToBeInserted:any, COLLECTION:any)
    {
        try {
            await dataBase.connect();
            var ret = await dataBase.insertOne(queryObjectToBeInserted, COLLECTION);
            return ret;    
        } catch (error) {
            throw new Error(`Error while trying to insert ${COLLECTION} ${queryObjectToBeInserted}`);
        } finally{
            await dataBase.disconnect();
        }
    }

    async deleteOne(queryObjectToBeDeleted:any, COLLECTION:any)
    {
        try {
            await dataBase.connect();
            var ret = await dataBase.deleteOne(queryObjectToBeDeleted, COLLECTION);
            return ret;    
        } catch (error) {
            throw new Error(`Error while trying to delete ${COLLECTION} ${queryObjectToBeDeleted}`);
        }
        finally{
            await dataBase.disconnect();
        }
    }

    async updateOne(queryObjectToBeDeleted:any,newValues:any, COLLECTION:any)
    {
        try {
            await dataBase.connect();
            var ret = await dataBase.updateOne(queryObjectToBeDeleted, newValues, COLLECTION);
            return ret;    
        } catch (error) {
            throw new Error(`Error while trying to update ${COLLECTION} ${newValues}`);
        }
        finally{
            await dataBase.disconnect();
        }
    }

    async findOne(query:any, COLLECTION:any): Promise<any> {
        try {
            await dataBase.connect();
            var books = await dataBase.findOne(query, COLLECTION);
            return books;    
        } catch (error) {
            throw new Error(`Error while trying to get ${COLLECTION}`);
        } finally{
            await dataBase.disconnect();
        }
    }

    async queryBuilder(id: any){
        var query = {};
        if(id){
            const mongoId = dataBase.mongoIDHandler(id);
            if (mongoId) {
                query = {
                    $or: [{ short: id }, { _id: mongoId }],
                };
            } else {
                query = {
                    short: id,
                };
            }
        }
        return query;
    } 
}