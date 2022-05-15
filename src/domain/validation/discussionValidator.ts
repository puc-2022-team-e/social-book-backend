

import Discussion from "../entity/discussion";
import IValidator from "../interfaces/IValidator";

var validator = require('fluent-validator');

export default class DiscussionValidator implements IValidator<Discussion> {

    async validate(discussion: Discussion): Promise<String> {
        return "sapeca a validação aqui com o fluent-validator";
    }
}



