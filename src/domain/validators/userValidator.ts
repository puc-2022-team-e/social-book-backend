
import { Validator } from 'fluentvalidation-ts';
const mapper = require('automapper-js');

export default class UserValidator extends Validator<UserModel>  {
    constructor() {
      super();
    
      // nome do usuário
      this.ruleFor('userName')
        .notNull()
        .withMessage('Por favor, informar o nome de usuário.')
        .minLength(1)
        .maxLength(100);

        // email
        this.ruleFor('email').emailAddress()
        .withMessage('Por favor, informar um e-mail válido.');
    }
  }