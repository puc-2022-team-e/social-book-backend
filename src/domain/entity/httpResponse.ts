    
    export class HttpResponse {
        constructor (readonly httpCode: number, readonly message: string | undefined, readonly data: any) {
        }
    }