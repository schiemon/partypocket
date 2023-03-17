import {
    AfterCallback,
    handleAuth,
    handleCallback,
    Session,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../lib/User";

const afterCallback: AfterCallback = async (
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
) => {
    // create user!
    await createUser(session.user.sub);
    return session;
};

export default handleAuth({
    async callback(req: NextApiRequest, res: NextApiResponse) {
        try {
            await handleCallback(req, res, { afterCallback });
        } catch (error: any) {
            console.error("Error while handling callback", error);
            res.status(error.status || 500).end(error.message);
        }
    },
});
