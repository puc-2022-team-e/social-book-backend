export default class Discussion {
	constructor (readonly title: string, readonly registerDate: Date, readonly deactiveDate: Date, readonly userId: number, readonly score: number) {
	}
}
