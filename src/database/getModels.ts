import { openDB } from "../openDB";

export interface Model {
    id: number;
    model: string;
    count: number;
}

export async function getModels(make: string) {
    const db = await openDB();
    const models = await db.all<Model[]>(`
        SELECT id, model, count(*) as count
        FROM car
        WHERE make = ?
        GROUP BY model
    `, make);
    return models;
}