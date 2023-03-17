import ApiError from "./ApiError";
import { StatusCodes } from "http-status-codes";

export default class AuthorizationError extends ApiError {
    constructor(message: string) {
        super(StatusCodes.UNAUTHORIZED, message);
    }
}
