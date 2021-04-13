import { Request, Response } from "express";
import { Band, BandInputDTO } from "../business/entities/Band";
import { CustomError } from "../business/error/CustomError";
import { Authenticator } from "../business/services/Authenticator";
import { BandBusiness } from "../business/BandBusiness";
import { IdGenerator } from "../business/services/IdGenerator";
import { BandDatabase } from "../data/BandDatabase";

const bandBusiness = new BandBusiness(
    new IdGenerator(),
    new BandDatabase(),
    new Authenticator()
)

export class BandController {
    public async bandSignup(req: Request, res: Response) {
        try {

            const {name, music_genre, responsible} = req.body

            const bandAuthorization = {
                token: req.headers.authorization
            }

            const bandInput: BandInputDTO = {
                name: name,
                music_genre: music_genre,
                responsible: responsible
            }

            await bandBusiness.postBand(bandInput, bandAuthorization.token as string)

            if(!bandAuthorization){
                throw new CustomError(401, "unauthorized")
            }

            res.status(200).send('Band successfully inserted')

        } catch(error){
            res.status(error.statusCode || 400).send(error.message)
        }
    }

    public async getBandById(req: Request, res: Response) {
        try{
        const bandInfo = req.params.id || req.params.name

        const band: Band = await bandBusiness.getBandByIdOrName(bandInfo)

        res.status(200).send(band)
        
    } catch(error){
        res.status(error.statusCode || 400).send(error.message)
    }
}
}