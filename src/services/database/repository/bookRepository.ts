import { DataBaseServices } from '../../../services/database.services';
import RepositoryBase from './repositoryBase';

const dataBase = new DataBaseServices();

export default class BookRepository extends RepositoryBase{}