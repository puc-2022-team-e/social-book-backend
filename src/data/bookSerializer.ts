import { bookInfo, bookObject, bookPayload, imageLinks } from "./books.interface"

export class BooksSerializer {
    static InitialBookObject(payload: bookPayload) {
        const imageLinks: imageLinks = {
            thumbnail: payload.coverURL,
            mainImage: payload.coverURL
        }

        const bookInfo: bookInfo = {
            title: payload.title,
            subtitle: payload.subtitle,
            mainCategory: payload.mainCategory,
            pageCount: payload.pageCount as unknown as number,
            authors: [payload.authors],
            publisher: payload.publisher,
            imageLinks: imageLinks,
        }

        const bookInitialSetUP: bookObject = {
            short: payload.short,
            selfLink: "",
            avarageRating: 0,
            ratingCount: 0,
            bookInfo: bookInfo
        }

        return bookInitialSetUP
    }
}