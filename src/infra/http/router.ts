import DiscussionsController from "../../controllers/discussionsController";
import DiscussionValidator from "../../domain/validation/discussionValidator";
import Http from "./http";

export default class Router {
    constructor (readonly http: Http) {
	}

    init () {

        this.http.route("get","/api/v1/d", async (params: any, body: any) => {
            const discussionValidator = new DiscussionValidator();
			const output = new DiscussionsController(discussionValidator).getAllDiscussions();
            return output;
		});
    }
}
module.exports = Router;