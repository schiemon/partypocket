import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getUser, UserNotFoundError } from "../User";
import { StatusCodes } from "http-status-codes";
import { User } from "@prisma/client";
import {
    ErrorHandler,
    NextConnect,
    NextHandler,
    RequestHandler,
} from "next-connect";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import withSession, { NextApiRequestWithSession } from "./withSession";
import ncWithHandler from "../../utils/api/ncWithHandler";

export type RequestUserExtension = {
    user: User;
};
export type NextApiRequestWithUser = NextApiRequestWithSession &
    RequestUserExtension;

// TODO: Make it more generic.
// TODO: next(err) or throw?
// TODO: Make push request to next-connect to handle Request/ Response manipulations.
// <ReqIn, ResInt, ReqOut, ResOut, NextHandler<ReqOut, ResOut>> => NextConnect | NextHandler
const withDBUser = () => {
    const handler: RequestHandler<NextApiRequestWithSession, NextApiResponse> =
        async (req, res, next: NextHandler) => {
            const user = await getUser(req.session.user.sub);
            if (user === null)
                throw new UserNotFoundError(
                    StatusCodes.BAD_REQUEST,
                    req.session.user.sub
                );
            const extendedReq = <NextApiRequestWithUser>req;
            extendedReq.user = user;
            next();
        };

    return handler;
};

export default function withUser(
    nextNextConnect: NextConnect<NextApiRequestWithUser, NextApiResponse>,
    errorHandler?: ErrorHandler<NextApiRequest, NextApiResponse>
): NextApiHandler {
    return withApiAuthRequired(
        ncWithHandler<NextApiRequest, NextApiResponse>(errorHandler)
            .use<{}, {}>(withSession())
            .use<NextApiRequestWithSession, {}>(withDBUser())
            .use<NextApiRequestWithUser, {}>(nextNextConnect)
    );
}
