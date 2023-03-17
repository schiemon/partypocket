import { Party } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteParty, getParty, PartyNotFoundError } from "../../../lib/Party";
import { getUser } from "../../../lib/User";
import withUser, {
    NextApiRequestWithUser,
} from "../../../lib/middleware/withDBUser";
import checkHostOfParty from "../../../utils/api/checkHostOfParty";
import ncWithHandler from "../../../utils/api/ncWithHandler";
import TypeError from "../../../lib/error/TypeError";

const getPartyId = (req: NextApiRequest) => {
    const { party_id } = req.query;
    if (typeof party_id !== "string")
        throw TypeError.fromTypeMismatch("party_id", "string");

    return party_id;
};

const getUserAndParty = async (sub: string, partyId: string) => {
    return Promise.all([getUser(sub), getParty(partyId)]);
};

async function getHandler(req: NextApiRequestWithUser, res: NextApiResponse) {
    const partyId = getPartyId(req);

    const party: Party | null = await getParty(partyId);

    if (party === null) throw new PartyNotFoundError(partyId);

    checkHostOfParty(req.user, party);

    res.status(200).json(party);
}

async function deleteHandler(
    req: NextApiRequestWithUser,
    res: NextApiResponse
) {
    const partyId = getPartyId(req);
    const party: Party | null = await getParty(partyId);

    if (party === null) throw new PartyNotFoundError(partyId);

    checkHostOfParty(req.user, party);

    res.status(200).json(deleteParty(party.id));
}

export default withUser(ncWithHandler().delete(deleteHandler).get(getHandler));