
import { Validator } from 'fluentvalidation-ts';
const mapper = require('automapper-js');

export default class CommentaryValidator extends Validator<CommentaryModel> {
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
            .withMessage('Por favor, informar a identificação da discussão.')
    
    }
  }