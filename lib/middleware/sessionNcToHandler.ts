import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession, Session, withApiAuthRequired } from "@auth0/nextjs-auth0";
import nextconnect, { NextConnect, NextHandler } from "next-connect";
import assert from "assert";
import { ServerResponse } from "http";

type RequestExtension = {
  session: Session;
};

type NextApiRequestSessionExtended = NextApiRequest & RequestExtension;

const setSession = (
  req: NextApiRequestSessionExtended,
  res: ServerResponse,
  next: NextHandler
) => {
  const session = getSession(req, res);
  assert(session !== null && session !== undefined);
  req.session = session;
  next();
};

export default function sessionNcToHandler(
  nc: NextConnect<NextApiRequestSessionExtended, NextApiResponse>
): NextApiHandler {
  return withApiAuthRequired(
    nextconnect<NextApiRequest, NextApiResponse>()
      .use<RequestExtension, {}>(setSession)
      .use(nc)
  );
}
