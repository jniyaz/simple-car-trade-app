import { NextApiRequest, NextApiResponse } from "next";
import { getModels } from "../../database/getModels";
import { getAsString } from '../../utils/common';
import { getPaginatedCarsWithFilters } from "../../database/getPaginatedCarsWithFilters";

export default async function models(req: NextApiRequest, res: NextApiResponse) {
    const cars = await getPaginatedCarsWithFilters(req.query);
    res.json(cars);
}