import { DataBaseServices } from '../database.services';
import Services from '../service.interface';
import BookValidator from '../book/book.validator'
import BooksInterface from './book.interface';

export class BooksServices extends Services {

	constructor(db: DataBaseServices) {
		super(db);
		this.collection = 'books';
		this.validator = new BookValidator();
	}
	
	castEntity(entity: object):BooksInterface {
		return <BooksInterface> entity
	}
}
