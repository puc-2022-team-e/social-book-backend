import { DataBaseServices } from "./database.services";

export default interface Services {
	db:DataBaseServices,
	collection:string
}