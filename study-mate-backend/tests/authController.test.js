// __tests__/authController.test.js
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController = require('../controllers/authController');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
});

//
// REGISTER TESTEK
//
describe('authController.register', () => {
    test('400-at ad, ha a jelszavak nem egyeznek', async () => {
        const req = {
            body: {
                name: 'Teszt Elek',
                email: 'test@test.com',
                password: 'jelszo1',
                passwordConfirm: 'jelszo2',
            },
        };
        const res = mockResponse();

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Passwords do not match' });
    });

    test('400-at ad, ha a felhasználó már létezik', async () => {
        const req = {
            body: {
                name: 'Teszt Elek',
                email: 'exists@test.com',
                password: 'jelszo',
                passwordConfirm: 'jelszo',
            },
        };
        const res = mockResponse();

        User.findOne.mockResolvedValue({ _id: 'existingId' });

        await authController.register(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'exists@test.com' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User already exists' });
    });

    test('sikeres regisztráció esetén visszaadja a tokent és a user adatokat', async () => {
        const req = {
            body: {
                name: 'Teszt Elek',
                email: 'new@test.com',
                password: 'jelszo',
                passwordConfirm: 'jelszo',
            },
        };
        const res = mockResponse();

        // nincs meglévő user
        User.findOne.mockResolvedValue(null);

        // új user mentése
        const saveMock = jest.fn().mockResolvedValue(undefined);
        User.mockImplementation((data) => ({
            ...data,
            _id: 'newUserId',
            save: saveMock,
        }));

        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue('hashed_pw');
        jwt.sign.mockReturnValue('test-token');

        await authController.register(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'new@test.com' });
        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith('jelszo', 'salt');
        expect(User).toHaveBeenCalledWith({
            name: 'Teszt Elek',
            email: 'new@test.com',
            passwordHash: 'hashed_pw',
        });
        expect(saveMock).toHaveBeenCalled();

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'newUserId' },
            'test-secret',
            { expiresIn: '1h' }
        );

        expect(res.json).toHaveBeenCalledWith({
            token: 'test-token',
            user: {
                id: 'newUserId',
                name: 'Teszt Elek',
                email: 'new@test.com',
            },
        });
    });

    test('500-at ad, ha váratlan hiba történik', async () => {
        const req = {
            body: {
                name: 'Teszt Elek',
                email: 'err@test.com',
                password: 'jelszo',
                passwordConfirm: 'jelszo',
            },
        };
        const res = mockResponse();

        User.findOne.mockRejectedValue(new Error('DB error'));

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
});

//
// LOGIN TESTEK
//
describe('authController.login', () => {
    test('400-at ad, ha a felhasználó nem található', async () => {
        const req = {
            body: { email: 'notfound@test.com', password: 'jelszo' },
        };
        const res = mockResponse();

        User.findOne.mockResolvedValue(null);

        await authController.login(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'notfound@test.com' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
    });

    test('400-at ad, ha a jelszó nem egyezik', async () => {
        const req = {
            body: { email: 'user@test.com', password: 'rossz' },
        };
        const res = mockResponse();

        User.findOne.mockResolvedValue({
            _id: 'userId',
            email: 'user@test.com',
            name: 'User',
            passwordHash: 'hashed_pw',
        });

        bcrypt.compare.mockResolvedValue(false); // nem egyezik

        await authController.login(req, res);

        expect(bcrypt.compare).toHaveBeenCalledWith('rossz', 'hashed_pw');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
    });

    test('sikeres login esetén visszaadja a tokent és a user adatokat', async () => {
        const req = {
            body: { email: 'user@test.com', password: 'jo' },
        };
        const res = mockResponse();

        User.findOne.mockResolvedValue({
            _id: 'userId',
            email: 'user@test.com',
            name: 'User',
            passwordHash: 'hashed_pw',
        });

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('login-token');

        await authController.login(req, res);

        expect(bcrypt.compare).toHaveBeenCalledWith('jo', 'hashed_pw');
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'userId' },
            'test-secret',
            { expiresIn: '1h' }
        );

        expect(res.json).toHaveBeenCalledWith({
            token: 'login-token',
            user: {
                id: 'userId',
                name: 'User',
                email: 'user@test.com',
            },
        });
    });

    test('500-at ad, ha váratlan hiba történik', async () => {
        const req = {
            body: { email: 'user@test.com', password: 'jelszo' },
        };
        const res = mockResponse();

        User.findOne.mockRejectedValue(new Error('DB error'));

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
});
