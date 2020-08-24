import { openDB } from "../openDB";

export interface Make {
    id: number;
    make: string;
    count: number;
}

export async function getMakes() {
    const db = await openDB();
    const makes = await db.all<Make[]>(`
        SELECT id, make, count(*) as count
        FROM car
        GROUP BY make
    `);
    return makes;
}