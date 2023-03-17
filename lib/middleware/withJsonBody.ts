import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import TypeError from "../error/TypeError";

const withJsonBody = () => {
    return (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
        if (req.headers["content-type"] !== "application/json")
            throw new TypeError("Request body must be JSON.");
        next();
    };
};

export default withJsonBody;
