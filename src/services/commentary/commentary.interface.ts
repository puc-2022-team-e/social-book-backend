export default interface CommentaryInterface {
	_id?: string;
	userId?: string;
	discussionId: string;
	commentary: string;
	registerDate: Date;
	deactiveDate?: Date;
	userName?: string;
	score?: number;
}
