import UserInterface from './user.interface';
import { Validator } from 'fluentvalidation-ts';
export default class UserValidator extends Validator<UserInterface>{
	constructor(){
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

        // perfil 
        this.ruleFor('role')
        .notNull()
        .must(role => role == 'admin' || role == 'literato')
        .withMessage('Por favor, informar um perfil válido. [admin, literato]');
	}
}