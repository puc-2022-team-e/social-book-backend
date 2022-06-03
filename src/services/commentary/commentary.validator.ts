import { Validator } from 'fluentvalidation-ts';
import CommentaryInterface from './commentary.interface';

export default class CommentaryValidator extends Validator<CommentaryInterface> {
	constructor() {
		super();
		// comentário
		this.ruleFor('commentary')
			.notNull()
			.withMessage('Por favor, informar a descrição do comentário.')
			.minLength(5)
			.maxLength(100);

		// identificação da discussão
		this.ruleFor('discussionId')
			.notNull()
			.withMessage('Por favor, informar a identificação da discussão.');
	}
}
