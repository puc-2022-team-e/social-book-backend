
type CommentaryModel = {
    discussionId: number | undefined,
    commentary:string,
    registerDate: Date ,
    deactiveDate: Date | undefined,
    userId: number | undefined,
    score: number
  };