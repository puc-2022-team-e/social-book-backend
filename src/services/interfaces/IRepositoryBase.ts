
export default interface IRepositoryBase {
    findAny(query:any, COLLECTION:any): Promise<any>;
    insertOne(queryObjectToBeInserted:any, COLLECTION:any): Promise<any>;
    deleteOne(queryObjectToBeDeleted:any, COLLECTION:any): Promise<any>;
    updateOne(queryObjectToBeDeleted:any,newValues:any, COLLECTION:any): Promise<any>;
    findOne(query:any, COLLECTION:any): Promise<any>;
    queryBuilder(id: any): Promise<any>;
}