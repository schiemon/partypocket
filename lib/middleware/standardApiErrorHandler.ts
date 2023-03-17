import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import ApiError from "../error/ApiError";

export default function standardApiErrorHandler(
    error: Error,
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log(error);
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    res.status(statusCode).json({
        ok: false,
        error: {
            type: error.constructor.name,
            message: error.message,
        },
    });
}
