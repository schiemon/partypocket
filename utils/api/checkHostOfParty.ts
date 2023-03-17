import { Party, User } from "@prisma/client";
import { UserNotHostError } from "../../lib/User";

const checkHostOfParty = (user: User, party: Party) => {
    if (user.id !== party.host_id) throw new UserNotHostError(user.id, party.id);
};

export default checkHostOfParty;
