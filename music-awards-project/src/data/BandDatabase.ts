import { Band } from "../business/entities/Band";
import { BaseDatabase } from "./BaseDatabase";
import { CustomError } from "../business/error/CustomError";

export class BandDatabase extends BaseDatabase {
    private static TABLE_NAME = 'lama_band'

    private static toBandModel(user: any): Band {
        return new Band (
            user.id,
            user.name,
            user.music_genre,
            user.responsible
        )
    }

    public async postBand(
        id: string,
        name: string,
        music_genre: string,
        responsible: string
    ):Promise<void> {
        try {
            await BandDatabase.connection
            .insert({
                id,
                name,
                music_genre,
                responsible
            })
            .into(BandDatabase.TABLE_NAME)
        } catch(error){
            throw new CustomError(500, "An unexpected error ocurred");
    } 

    }

    public async getBandById(id: string):Promise<any>{
        try {
           const result = await BandDatabase.connection
            .select(
                "*"
            )
            .from(BandDatabase.TABLE_NAME)
            .where({id})

            return result[0]

        } catch(error){
            throw new CustomError(500, "An unexpected error ocurred");
        }
    }
}