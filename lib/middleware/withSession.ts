import { NextApiRequest, NextApiResponse } from "next";
import { NextConnect, NextHandler, RequestHandler } from "next-connect";
import { getSession, Session } from "@auth0/nextjs-auth0";
import { ApiError } from "next/dist/server/api-utils";
import { StatusCodes } from "http-status-codes";

export type RequestSessionExtension = {
    session: Session;
};
export type NextApiRequestWithSession = NextApiRequest &
    RequestSessionExtension;

class SessionNotFoundError extends ApiError {
    constructor(status: StatusCodes) {
        super(status, `Could not find session.`);
    }
}

// TODO: Make it more generic.
// Auth0 should have populated session so we can obtain it with getSession()
const withSession = () => {
    const handler: RequestHandler<NextApiRequest, NextApiResponse> = (
        req: NextApiRequest,
        res: NextApiResponse,
        next: NextHandler
    ) => {
        const session = getSession(req, res);
        if (session === null || session === undefined) {
            throw new SessionNotFoundError(StatusCodes.INTERNAL_SERVER_ERROR);
        }
        const extendedReq = <NextApiRequestWithSession>req;
        extendedReq.session = session;
        next();
    };

    return handler;
};

export default withSession;
