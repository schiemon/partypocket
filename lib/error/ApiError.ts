import { StatusCodes } from "http-status-codes";
import { CustomError } from "ts-custom-error";

export default class ApiError extends CustomError {
    constructor(public statusCode: StatusCodes, public message: string) {
        super(message);
    }
}