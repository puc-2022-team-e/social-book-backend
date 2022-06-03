import { Validator } from 'fluentvalidation-ts';
import DiscussionInterface from './discussion.interface';
export default class DiscussionValidator extends Validator<DiscussionInterface> {
	constructor() {
		super();
		this.ruleFor('title')
			.notNull()
			.withMessage('Por favor, informar um nome para o título.')
			.minLength(5)
			.maxLength(100);

		// identificação do livro
		this.ruleFor('bookId')
			.notNull()
			.withMessage('Por favor, informar a identificação do livro.');

		// identificação do usuário
		// this.ruleFor('userId')
		// .notNull()
		//     .withMessage('Por favor, informar a identificação do usuário.')
		// .must(userId => !isNaN(Number(userId)))
		//     .withMessage("A identificação do usuário precisa ser um número inteiro maior que zero.")
		// .greaterThanOrEqualTo(1)
		//     .withMessage("A identificação do usuário precisa ser um número inteiro maior que zero.");
	}
}
