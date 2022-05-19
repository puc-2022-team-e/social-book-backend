export default class Discussion {

	constructor (
        public title: string | undefined, 
        public registerDate: Date = new Date(), 
        public deactiveDate: Date | undefined, 
        public userId:number | undefined,
        public bookId:number | undefined)
        {}

}
