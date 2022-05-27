export default class User {
	constructor (
        public userName: string | undefined, 
        public email: string | undefined, 
        public linkProfileImage: string | undefined, 
        public registerDate: Date = new Date(), 
        public deactiveDate: Date | undefined, 
        public perfil:string | undefined)
        {}
}
