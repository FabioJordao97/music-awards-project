import { BandDatabase } from "../data/BandDatabase";
import { BandInputDTO } from "./entities/Band";
import { UserRole } from "./entities/User";
import { CustomError } from "./error/CustomError";
import { Authenticator } from "./services/Authenticator";
import { IdGenerator } from "./services/IdGenerator";

export class BandBusiness {
    constructor (
        private idGenerator: IdGenerator,
        private bandDatabase: BandDatabase,
        private authenticator: Authenticator
    ) {}

    public async postBand(band: BandInputDTO, token: string){
        const id = this.idGenerator.generate();

        const tokenData = this.authenticator.getData(token)

        if(tokenData.role !== UserRole.ADMIN){
            throw new CustomError(401, 'Unauthorized')
        }

        await this.bandDatabase.postBand(
            id,
            band.name,
            band.music_genre,
            band.responsible
        )

        if(!band.music_genre || !band.name || !band.responsible){
            throw new CustomError(400, 'Missing informations.')
        }
    }

    public async getBandByIdOrName(id: string){
            const bandResult = await this.bandDatabase.getBandById(id)

            if(!bandResult){
                throw new CustomError(404, "Band not found")
            }

            const band = {
                id: bandResult.id,
                name: bandResult.name,
                music_genre: bandResult.music_genre,
                responsible: bandResult.responsible
            }

            const result = (band)

            return result
    }
}