import { LoginInputDTO, User, UserInputDTO, UserRole } from '../src/business/entities/User';
import { CustomError } from '../src/business/error/CustomError';
import { Authenticator } from '../src/business/services/Authenticator';
import { IdGenerator } from '../src/business/services/IdGenerator'
import { UserBusiness } from '../src/business/UserBusiness'

const idGenerator = { generate: jest.fn(() => "bigbrother") } as IdGenerator;

const userDatabase = {
    createUser: jest.fn(async (user: User) => { }),
    getUserByEmail: jest.fn((email: string)=>{
        if(email === "test@email.com"){
            return User.toUserModel({
                id: 'user_id',
                name: 'user_name',
                email,
                password: '123456',
                role: UserRole.ADMIN
            })
        } else {
            throw new CustomError(404, 'Unable to find user')
        }
    })
}  as any;

const hashGenerator = {
    hash: jest.fn((password: string) => 'senha'),
    compare: jest.fn((text: string, hash: string) => text === '123456' ? true : false)
} as any;

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

const userBusiness = new UserBusiness(
    idGenerator as any,
    hashGenerator as any,
    authenticator as any,
    userDatabase as any
)

describe.skip('Signup', () => {

    test('Should return an error', async () => {

        expect.assertions(2)

        try {

            const signupUser = {
                name: '',
                email: 'mike@gmail.com',
                password: "potato",
                role: "normal"
            }
            await userBusiness.createUser(
                signupUser
            )

            console.log()
        } catch (error) {
            expect(error.statusCode).toBe(422);
            expect(error.message).toEqual("Missing input");
        }
    })

    test('Should return token', async () => {
        expect.assertions(1)
        const user = {
            name: 'Mike',
            email: 'mike@gmail.com',
            password: "potato",
            role: "normal"
        } as UserInputDTO

        const result = await userBusiness.createUser(user)
        expect(result).toBe('token')
    })
})

describe.skip('Login', () => {
     
    test('Should return error when email is wrong', async () => {
        expect.assertions(2)

        const userLogin = {
            email: 'gerardway@email.com',
            password: '123456'
        } as LoginInputDTO

        try {
            await userBusiness.getUserByEmail(userLogin)
        } catch(error){
            expect(error.message).toBe('Unable to find user')
            expect(error.code).toBe(404)
        }
    })

    test('Should return access token', async () =>{
        expect.assertions(1)
        const userLogin = {
            email: 'test@email.com',
            password: '123456'
        } as LoginInputDTO

        const result = userBusiness.getUserByEmail(userLogin)
        expect(result).toBe('token')
    })
})