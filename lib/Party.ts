import { Party } from "@prisma/client";
import prisma, { TransactionablePrisma } from "../lib/db";
import {
    PARTY_DESCRIPTION_MAX_LEN,
    PARTY_MAX_COST_PER_GUEST,
    PARTY_NAME_MAX_LEN,
    PARTY_NAME_MIN_LEN,
} from "./constants";
import { StatusCodes } from "http-status-codes";
import ApiError from "./error/ApiError";
import RangeError from "./error/RangeError";

export type PartyCreationData = Omit<Party, "id" | "host_id">;

class PartyError extends ApiError {
    constructor(status: StatusCodes, message: string) {
        super(status, message);
    }
}

export class PartyNotFoundError extends PartyError {
    constructor(partyId: string, message?: string) {
        if (!message) message = `Party with id ${partyId} does not exist.`;
        super(StatusCodes.BAD_REQUEST, message);
    }
}

export class PartyDuplicateError extends PartyError {
    constructor(partyName: string, host_id: string, message?: string) {
        if (!message)
            message = `Party with name ${partyName} already exist at host ${host_id}.`;
        super(StatusCodes.BAD_REQUEST, message);
    }
}

export async function createParty(
    hostId: string,
    partyData: PartyCreationData
): Promise<Party> {
    const { name, description, cost_per_guest } = partyData;

    if (!(PARTY_NAME_MIN_LEN <= name.length && name.length <= PARTY_NAME_MAX_LEN))
        throw RangeError.fromRangeViolation(
            "Length of a party's name",
            PARTY_NAME_MIN_LEN,
            PARTY_NAME_MAX_LEN
        );

    if (description && description.length > PARTY_DESCRIPTION_MAX_LEN)
        throw RangeError.fromRangeViolation(
            "Length of a party's description",
            0,
            PARTY_DESCRIPTION_MAX_LEN
        );

    if (cost_per_guest <= 0)
        throw RangeError.fromPositivityViolation("Cost per guest");

    if (cost_per_guest > PARTY_MAX_COST_PER_GUEST)
        throw RangeError.fromUpperLimitViolation(
            "Cost per guest",
            PARTY_MAX_COST_PER_GUEST
        );

    return prisma.$transaction<Party>(async (prismaClient) => {
        // We first have to check whether the party name at the host already given.
        // With "at the host" mean the belonging of the party to the host.

        const duplicate = await prismaClient.party.findUnique({
            where: {
                uniq_party_name_host_id: {
                    name: partyData.name,
                    host_id: hostId,
                },
            },
        });

        if (duplicate !== null)
            throw new PartyDuplicateError(partyData.name, hostId);

        // Then we can add the guest to the party.
        return prismaClient.party.create({
            data: { ...partyData, host_id: hostId },
        });
    });
}

export async function getPartiesOf(hostId: string): Promise<Party[]> {
    return prisma.party.findMany({
        where: {
            host: {
                id: hostId,
            },
        },
    });
}

export async function getParty(partyId: string): Promise<Party | null> {
    return prisma.party.findUnique({
        where: {
            id: partyId,
        },
    });
}

export async function deleteParty(partyId: string): Promise<Party> {
    const deleteGuests = prisma.guest.deleteMany({
        where: {
            party_id: partyId,
        },
    });

    const deleteActualParty = prisma.party.delete({
        where: {
            id: partyId,
        },
    });

    return prisma
        .$transaction([deleteGuests, deleteActualParty])
        .then(([_, party]) => party);
}

export async function existsPartyById(
    partyId: string,
    prismaClient?: TransactionablePrisma
): Promise<boolean> {
    if (!prismaClient) prismaClient = prisma;

    return (
        (await prismaClient.party.count({
            where: {
                id: partyId,
            },
        })) === 1
    );
}

export async function existsPartyByName(
    partyName: string,
    host_id: string,
    prismaClient?: TransactionablePrisma
): Promise<boolean> {
    if (!prismaClient) prismaClient = prisma;

    return (
        (await prismaClient.party.count({
            where: {
                name: partyName,
                host: {
                    id: host_id,
                },
            },
        })) === 1
    );
}
