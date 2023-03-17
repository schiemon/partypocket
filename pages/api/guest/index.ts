import { NextApiResponse } from "next";

import { Guest, Party, User } from "@prisma/client";
import {
    addGuest,
    deleteGuest,
    getGuest,
    GuestNotFoundError,
    updateGuest,
} from "../../../lib/Guest";
import { StatusCodes } from "http-status-codes";
import { getParty, PartyNotFoundError } from "../../../lib/Party";
import withUser, {
    NextApiRequestWithUser,
} from "../../../lib/middleware/withDBUser";
import { UserDoesNotHostGuestError, UserNotHostError } from "../../../lib/User";
import TypeError from "../../../lib/error/TypeError";
import ncWithHandler from "../../../utils/api/ncWithHandler";
import withJsonBody from "../../../lib/middleware/withJsonBody";
import { assertEquals, equals } from "typescript-is";
import assert from "assert";

export type GuestDraft = Omit<Guest, "id">;
export type GuestUpdatable = Omit<Guest, "party_id">;

export type GuestSelectionData = { id: string };
// POST handler - Creates a party.
async function postHandler(req: NextApiRequestWithUser, res: NextApiResponse) {
    const user: User = req.user;
    const guestInput: unknown = req.body;

    const guestToCreate = assertEquals<GuestDraft>(guestInput);

    const party: Party | null = await getParty(guestToCreate.party_id);

    if (party === null) throw new PartyNotFoundError(guestToCreate.party_id);

    if (party.host_id !== user.id) throw new UserNotHostError(user.id, party.id);

    // Check if guest already exists.
    res.status(StatusCodes.OK).json(await addGuest(guestToCreate, false));
}

// PUT handler - Creates a party.
async function putHandler(req: NextApiRequestWithUser, res: NextApiResponse) {
    const user: User = req.user;
    const guestInput: unknown = req.body;

    const guestToUpdate = assertEquals<GuestUpdatable>(guestInput);
    const oldGuest = await getGuest(guestToUpdate.id);

    if (oldGuest === null) throw new GuestNotFoundError(guestToUpdate.id);

    const party: Party | null = await getParty(oldGuest.party_id);

    if (party === null) throw new PartyNotFoundError(oldGuest.party_id);

    if (party.host_id !== user.id) throw new UserNotHostError(user.id, party.id);

    // Check if oldGuest already exists.
    res.status(StatusCodes.OK).json(await updateGuest(guestToUpdate));
}

async function deleteHandler(
    req: NextApiRequestWithUser,
    res: NextApiResponse
) {
    const user = req.user;
    const guestSelectionData = assertEquals<GuestSelectionData>(req.body);
    const maybeGuest = await getGuest(guestSelectionData.id);

    if (maybeGuest === null) throw new GuestNotFoundError(guestSelectionData.id);

    // TODO: Combine requests
    const guest = <Guest>maybeGuest;
    const party = await getParty(guest.party_id);

    assert(party !== null);

    if (user.id !== party.host_id) {
        throw new UserDoesNotHostGuestError(user.id, party.id, guest.id);
    }

    res.status(StatusCodes.OK).json(await deleteGuest(guest.id));
}

const handler = withUser(
    ncWithHandler()
        .use(withJsonBody())
        .post(postHandler)
        .delete(deleteHandler)
        .put(putHandler)
);

export default handler;