import { BandBusiness } from "../src/business/BandBusiness";
import { Band, BandInputDTO } from "../src/business/entities/Band";
import { UserRole } from "../src/business/entities/User";
import { CustomError } from "../src/business/error/CustomError";
import { Authenticator } from "../src/business/services/Authenticator";
import { IdGenerator } from "../src/business/services/IdGenerator";

const idGenerator = { generate: jest.fn(() => "bigbrother") } as IdGenerator;

const bandDatabase = {
    postBand: jest.fn(async (band: Band) => { }),
    getBandByIdOrName: jest.fn((input: string) => {
        if (input === 'idValido' || input === 'nomeValido') {
            return {
                id: 'idBanda',
                name: 'Labanda',
                music_genre: 'BACK N ROLL',
                responsible: 'Amandinha'
            }
        } else {
            throw new CustomError(404, 'Unable to find band')
        }
    })
}

const authenticator = {
    generateToken: jest.fn((payload: { id: string, role: UserRole }) => 'token'),
    getData: jest.fn((token: string) => {
        switch (token) {
            case 'userToken':
                return { id: 'id_do_token', role: 'NORMAL' }
            case 'adminToken':
                return { id: 'id_do_token', role: 'ADMIN' }

            default:
                return undefined
        }
    })
} as Authenticator;

const bandBusiness = new BandBusiness(
    idGenerator as any,
    authenticator as any,
    bandDatabase as any
)

describe.skip('Insert band', () => {
    test('Should return error when no name', async () => {
        expect.assertions(2)

        const token = 'adminToken'

        const band = {
            music_genre: 'BACK N ROLL',
            responsible: 'Severo'
        } as BandInputDTO

        try {
            await bandBusiness.postBand(band, token)
        } catch (error) {
            expect(error.message).toBe('Missing informations')
            expect(error.code).toBe(400)
        }
    })

    test('Should return success', async () => {
        expect.assertions(1)
        const token = 'adminToken'

        const band = {
            name: 'Severo & Snape',
            music_genre: 'BACK N ROLL',
            responsible: 'Severo'
        } as BandInputDTO

        await bandBusiness.postBand(band, token)

        expect(bandDatabase.postBand).toHaveBeenCalledWith({
            "id": "idBanda",
            "name": "Severo & Snape",
            "music_genre": "BACK N ROLL",
            "responsible": "Severo"
        })
    })
})

describe('Get Band', () => {
    test('Should return error when there is no input', async () => {
        expect.assertions(2)

        const input = ''

        try {
            await bandBusiness.getBandByIdOrName(input)
        }

        catch (error) {
            expect(error.message).toBe('Band not found')
            expect(error.code).toBe(404)
        }
    })

    test('Should return band', async () => {
        expect.assertions(2)

        const input = 'idValido'

        const result = await bandBusiness.getBandByIdOrName(input)

        expect(result).toBe({
            id: 'idBanda',
            name: 'Labanda',
            music_genre: 'BACK N ROLL',
            responsible: 'Amandinha'
        })

    })
})