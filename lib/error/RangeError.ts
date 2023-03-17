import ApiError from "./ApiError";
import { StatusCodes } from "http-status-codes";

export default class RangeError extends ApiError {
    constructor(message: string) {
        super(StatusCodes.BAD_REQUEST, message);
    }

    static fromRangeViolation(
        identifierOutOfRange: string,
        min: number,
        max: number
    ) {
        return new RangeError(
            `${identifierOutOfRange} must be between ${min} and ${max}.`
        );
    }

    static fromPositivityViolation(identifierNotPositive: string) {
        return new RangeError(`${identifierNotPositive} must be positive.`);
    }

    static fromUpperLimitViolation(identifierToBig: string, upperLimit: number) {
        return new RangeError(
            `${identifierToBig} is not smaller or equal to ${upperLimit}.`
        );
    }
}
