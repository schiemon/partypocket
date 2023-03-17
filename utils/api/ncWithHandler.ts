import nextconnect, { ErrorHandler } from "next-connect";
import standardApiErrorHandler from "../../lib/middleware/standardApiErrorHandler";
import { NextApiRequest, NextApiResponse } from "next";

const ncWithHandler = <Req extends NextApiRequest, Res extends NextApiResponse>(
    errorHandler?: ErrorHandler<Req, Res>
) =>
    nextconnect<Req, Res>({
        onError: errorHandler ? errorHandler : standardApiErrorHandler,
    });

export default ncWithHandler;
