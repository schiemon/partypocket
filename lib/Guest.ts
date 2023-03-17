import { Guest } from "@prisma/client";
import prisma, { TransactionablePrisma } from "./db";
import assert from "assert";
import { existsPartyById, PartyNotFoundError } from "./Party";
import { StatusCodes } from "http-status-codes";
import ApiError from "./error/ApiError";
import { GuestDraft, GuestUpdatable } from "../pages/api/guest";

export class GuestError extends ApiError {
    constructor(status: StatusCodes, message: string) {
        super(status, message);
    }
}

class GuestNameGivenError extends GuestError {
    constructor(
        status: StatusCodes,
        name: string,
        partyId: string,
        message?: string
    ) {
        if (!message)
            message = `Guest '${name}' does already exists in party ${partyId}.`;
        super(status, message);
    }
}

export class GuestNotFoundError extends GuestError {
    constructor(guest_id: string) {
        super(StatusCodes.NOT_FOUND, `Could not find guest with id ${guest_id}`);
    }
}

export async function getGuest(guest_id: string) {
    return prisma.guest.findUnique({
        where: {
            id: guest_id,
        },
    });
}

export async function addGuest(
    guest: GuestDraft,
    checkIfPartyExists = true
): Promise<Guest> {
    return prisma.$transaction<Guest>(async (prismaClient) => {
        // We first have to check whether the name of the guest is already given.
        if (checkIfPartyExists)
            if (!(await existsPartyById(guest.party_id, prismaClient)))
                throw new PartyNotFoundError(guest.party_id);

        if (await isGuestNameGiven(guest.party_id, guest.name, prismaClient))
            throw new GuestNameGivenError(
                StatusCodes.BAD_REQUEST,
                guest.name,
                guest.party_id
            );

        // Then we can add the guest to the party.
        return prismaClient.guest.create({
            data: {
                name: guest.name,
                party_id: guest.party_id,
                paid: guest.paid,
            },
        });
    });
}

export async function updateGuest(guest: GuestUpdatable): Promise<Guest> {
    // TODO: business checks
    return prisma.guest.update({
        where: {
            id: guest.id,
        },
        data: guest,
    });
}

export async function isGuestNameGiven(
    partyId: string,
    name: string,
    prismaClient?: TransactionablePrisma
): Promise<boolean> {
    if (!prismaClient) prismaClient = prisma;
    const guestCount = await prismaClient.guest.count({
        where: {
            name: name,
            party_id: partyId,
        },
    });

    assert(guestCount <= 1);

    return guestCount === 1;
}
export async function deleteGuest(guest_id: string) {
    return prisma.guest.delete({
        where: {
            id: guest_id,
        },
    });
}

export async function getGuests(party_id: string): Promise<Guest[]> {
    return prisma.guest.findMany({
        where: {
            party_id: party_id,
        },
    });
}