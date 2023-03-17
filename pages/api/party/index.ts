import { NextApiResponse } from "next";
import {
    createParty,
    getPartiesOf,
    PartyCreationData,
} from "../../../lib/Party";
import withUser, {
    NextApiRequestWithUser,
} from "../../../lib/middleware/withDBUser";
import withJsonBody from "../../../lib/middleware/withJsonBody";
import ncWithHandler from "../../../utils/api/ncWithHandler";
import { assertEquals } from "typescript-is";

// GET handler - Gets all parties.
async function getHandler(req: NextApiRequestWithUser, res: NextApiResponse) {
    const user = req.user;
    const parties = await getPartiesOf(user.id);
    res.status(200).json(parties);
}

// POST handler - Creates a party.
async function postHandler(req: NextApiRequestWithUser, res: NextApiResponse) {
    const partyCreationData = assertEquals<PartyCreationData>(req.body);
    res.status(200).json(await createParty(req.user.id, partyCreationData));
}

const handler = withUser(
    ncWithHandler()
        .get(getHandler)
        .post(ncWithHandler().use(withJsonBody()).use(postHandler))
);
export default handler;
