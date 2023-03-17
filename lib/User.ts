import prisma from "../lib/db";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { StatusCodes } from "http-status-codes";
import AuthorizationError from "./error/AuthorizationError";

class UserError extends ApiError {
    constructor(status: StatusCodes, message: string) {
        super(status, message);
    }
}

export class UserNotFoundError extends UserError {
    constructor(status: StatusCodes, sub: string) {
        const message = `Could not find user with subject field '${sub}'.`;
        super(status, message);
    }
}

export class UserNotHostError extends AuthorizationError {
    constructor(userId: string, partyId: string) {
        const message = `User '${userId}' is not host of the party '${partyId}'`;
        super(message);
    }
}

export class UserDoesNotHostGuestError extends AuthorizationError {
    constructor(userId: string, partyId: string, guestId: string) {
        const message = `User '${userId}' is not host of '${guestId}' in party '${partyId}'`;
        super(message);
    }
}

/*
    Creates a user if it does not exist.
*/
export default async function createUser(sub: string): Promise<User> {
    return prisma.user.upsert({
        where: {
            sub: sub,
        },
        update: {},
        create: {
            sub: sub,
        },
    });
}

/*
    Finds user from its unique subject field given by the session.
 */
export async function getUser(sub: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: {
            sub: sub,
        },
    });
}
