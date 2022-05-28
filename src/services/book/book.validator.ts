import { Validator } from 'fluentvalidation-ts';
import BooksInterface from './book.interface';
export default class BookValidator extends Validator<BooksInterface> {
	constructor() {
		super();
		this.ruleFor('short')
		.notNull()
		.withMessage('Short id is required')
		.minLength(5)
		.maxLength(16)
	}
	
}
