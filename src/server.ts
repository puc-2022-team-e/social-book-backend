import ExpressHttp from "./infra/http/expressHttp";
import Router from "./infra/http/router";

const http = new ExpressHttp();
const router = new Router(http);
router.init();
http.listen(8077);

