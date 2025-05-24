import { ContentfulStatusCode } from "hono/utils/http-status";

export class RequestError extends Error {
    statusCode: ContentfulStatusCode;
    constructor(
        message: string = "Invalid Request",
        statusCode: ContentfulStatusCode = 400
    ) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class UnprocessableError extends Error {
    statusCode: ContentfulStatusCode;
    constructor(
        message: string = "Request cannot be processed",
        statusCode: ContentfulStatusCode = 422
    ) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class AuthError extends Error {
    statusCode: ContentfulStatusCode;
    constructor(
        message: string = "Unauthorized - Auth",
        statusCode: ContentfulStatusCode = 401
    ) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class PermissionError extends Error {
    statusCode: ContentfulStatusCode;
    constructor(
        message: string = "Forbidden - No Permission",
        statusCode: ContentfulStatusCode = 403
    ) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class DatabaseError extends Error {
    statusCode: ContentfulStatusCode;
    constructor(
        message: string = "Internal Server Error - Database",
        statusCode: ContentfulStatusCode = 500
    ) {
        super(message);
        this.statusCode = statusCode;
    }
}
