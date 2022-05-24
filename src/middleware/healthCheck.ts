import { Response, Request } from 'express';
const healthCheck = async(req: Request, res: Response, next: any)=>{
	res.status(200).send({pong:true})
}
export default healthCheck;