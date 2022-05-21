export default class Commentary {

	constructor (
		public discussionId: number | undefined,
		public commentary: string,
		public registerDate: Date = new Date(),
		public deactiveDate: Date |undefined,
		public userId: number | undefined,
		public score: number) 
		{}
}
