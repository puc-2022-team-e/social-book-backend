export default class Discussion {

	constructor (
        public title: string | undefined, 
        public registerDate: Date = new Date(), 
        public deactiveDate: Date | undefined, 
        public userId:number | undefined,
        public bookId:number | undefined,
        public userName: string | undefined,
        public bookAuthor: string | undefined,
        public bookShort: string | undefined,
        public bookTitle: string | undefined)
        {}

}
