import { ParsedUrlQuery } from "querystring";
import { openDB } from "../openDB";
import { CarModel } from '../../api/Car';
import { getAsString } from '../utils/common';

const mainQuery = `
    FROM car
    WHERE (@make is NULL OR @make = make)
    AND (@model is NULL OR @model = model)
    AND (@minprice is NULL OR @minprice <= price)
    AND (@maxprice is NULL OR @maxprice >= price)
`;

export async function getPaginatedCarsWithFilters(query: ParsedUrlQuery) {
    const db = await openDB();

    const page = getValueAsNumber(query.page) || 1;
    const rowsPerPage = getValueAsNumber(query.rowsperpage) || 4;
    const offset = (page - 1) * rowsPerPage;

    const dbParams = {
        '@make': getValueAsString(query.make),
        '@model': getValueAsString(query.model),
        '@minprice': getValueAsNumber(query.minprice),
        '@maxprice': getValueAsNumber(query.maxprice)
    };

    const carsPromise = db.all<CarModel[]>(
        `SELECT * ${mainQuery} LIMIT @rowsPerPage OFFSET @offset `, 
        { ...dbParams, '@rowsPerPage': rowsPerPage, '@offset': offset });

    const totalRowsPromise = db.get<{count: number}>(
        `SELECT COUNT(*) as count ${mainQuery}`, dbParams);

    const [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);

    return { cars, totalPages: Math.ceil(totalRows.count / rowsPerPage) };
}

function getValueAsString(value: string | string[]) {
    const str = getAsString(value);
    return !str || str.toLocaleLowerCase() === 'all' ? null : str;
}

function getValueAsNumber(value: string | string[]) {
    const str = getValueAsString(value);
    const num = parseInt(str);
    return isNaN(num) ? null : num;
}