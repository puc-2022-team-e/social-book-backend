

const mapper = require('automapper-js');

class ControllerBase {

	protected static applyValidationByEntityAndModel(entityValidator:any, entity:any, entityModel:any, body: any)
	{
		const user = mapper(entity, body);
		const erros = new entityValidator().validate(user as typeof entityModel)

		return [user,erros];
	}

	protected static applyValidationByEntity(entityValidator:any, entity:any)
	{
		return new entityValidator().validate(entity)
	}
}
export default ControllerBase;
