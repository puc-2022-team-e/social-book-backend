
export interface bookPayload{
    authors: string;
    coverURL: string;
    mainCategory: string;
    pageCount: string;
    publisher: string;
    short: string;
    subtitle: string;
    title: string;
}

export interface imageLinks{
    thumbnail: string;
    mainImage: string;
}

export interface bookInfo{
    title: string;
    authors: Array<string>;
    subtitle: string;
    mainCategory: string;
    pageCount: number;
    publisher: string;
    imageLinks: imageLinks;
}

export interface bookObject{
    short: string;
    selfLink: string;
    avarageRating: number;
    ratingCount: number;
    bookInfo: bookInfo;
}