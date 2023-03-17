import ApiError from "./ApiError";
import { StatusCodes } from "http-status-codes";

export default class TypeError extends ApiError {
    constructor(message: string) {
        super(StatusCodes.BAD_REQUEST, message);
    }

    static fromTypeMismatch(identifierMistyped: string, expectedType: string) {
        return new TypeError(
            `${identifierMistyped} must be of type ${expectedType}.`
        );
    }
}
