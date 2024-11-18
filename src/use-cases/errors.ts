export class PublicError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class AuthenticationError extends PublicError {
    constructor() {
        super("You must be logged in to view this content");
        this.name = "AuthenticationError";
    }
}


export class NotFoundError extends PublicError {
    constructor() {
        super("Resource not found");
        this.name = "NotFoundError";
    }
}


export class InvalidDataError extends PublicError {
    constructor() {
        super("Invalid data");
        this.name = "InvalidDataError";
    }
}


export class EmailInUseError extends PublicError {
    constructor() {
        super("Email is already in use");
        this.name = "EmailInUseError";
    }
}