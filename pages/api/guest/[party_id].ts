import { assertEquals } from "typescript-is";
import withUser, {
    NextApiRequestWithUser,
} from "../../../lib/middleware/withDBUser";
import { Party } from "@prisma/client";
import { getParty, PartyNotFoundError } from "../../../lib/Party";
import { UserNotHostError } from "../../../lib/User";
import { StatusCodes } from "http-status-codes";
import { getGuests } from "../../../lib/Guest";
import { NextApiResponse } from "next";
import ncWithHandler from "../../../utils/api/ncWithHandler";

async function getHandler(req: NextApiRequestWithUser, res: NextApiResponse) {
    const user_id = req.user.id;
    const { party_id } = assertEquals<{ party_id: string }>(req.query);
    const party: Party | null = await getParty(party_id);

    if (party === null) throw new PartyNotFoundError(party_id);

    if (party.host_id !== user_id) throw new UserNotHostError(user_id, party_id);

    res.status(StatusCodes.OK).json(await getGuests(party_id));
}

export default withUser(ncWithHandler().get(getHandler));
