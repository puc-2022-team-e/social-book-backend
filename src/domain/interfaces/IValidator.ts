

export default interface IValidator<TEntity> {
	validate(entity:TEntity): Promise<String>;
}