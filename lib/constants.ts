import assert from "assert";
// @ts-ignore
import uj from "url-join";

const assert_positive = (constant: number) => assert(constant > 0);

// Constraints on party entities.
export const PARTY_DESCRIPTION_MAX_LEN = parseInt(
    process.env.PP_PARTY_DESCRIPTION_MAX_LEN || "256"
);
export const PARTY_NAME_MIN_LEN = parseInt(
    process.env.PP_PARTY_NAME_MIN_LEN || "8"
);
export const PARTY_NAME_MAX_LEN = parseInt(
    process.env.PARTY_NAME_MAX_LEN || "64"
);
export const PARTY_MAX_COST_PER_GUEST = parseInt(
    process.env.PARTY_NAME_MAX_LEN || "500"
);

assert_positive(PARTY_DESCRIPTION_MAX_LEN);
assert_positive(PARTY_NAME_MIN_LEN);
assert_positive(PARTY_NAME_MAX_LEN);
assert(PARTY_NAME_MIN_LEN < PARTY_NAME_MAX_LEN);

// API endpoints
export const BASE_URL = uj(process.env.BASE_URL!);
export const API_BASE = uj(BASE_URL, "api");
export const API_PARTIES_ENDPOINT = uj(API_BASE, "party");
export const API_GUEST_ENDPOINT = uj(API_BASE, "guest");
