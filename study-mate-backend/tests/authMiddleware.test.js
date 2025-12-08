// tests/authMiddleware.test.js
jest.mock('jsonwebtoken');

const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
});

describe('auth middleware', () => {
    test('401-et ad, ha nincs x-auth-token header', () => {
        const req = { header: jest.fn().mockReturnValue(undefined) };
        const res = mockResponse();
        const next = jest.fn();

        auth(req, res, next);

        expect(req.header).toHaveBeenCalledWith('x-auth-token');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'No token, authorization denied',
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('next() hívódik és beállítja req.user-t érvényes token esetén', () => {
        const req = {
            header: jest.fn().mockReturnValue('VALID_TOKEN'),
        };
        const res = mockResponse();
        const next = jest.fn();

        const decoded = { id: 'user123', name: 'Teszt Elek' };
        jwt.verify.mockReturnValue(decoded);

        auth(req, res, next);

        expect(req.header).toHaveBeenCalledWith('x-auth-token');
        expect(jwt.verify).toHaveBeenCalledWith('VALID_TOKEN', 'test-secret');
        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalled();
    });

    test('401-et ad, ha a token érvénytelen', () => {
        const req = {
            header: jest.fn().mockReturnValue('BAD_TOKEN'),
        };
        const res = mockResponse();
        const next = jest.fn();

        jwt.verify.mockImplementation(() => {
            throw new Error('invalid token');
        });

        auth(req, res, next);

        expect(req.header).toHaveBeenCalledWith('x-auth-token');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Token is not valid',
        });
        expect(next).not.toHaveBeenCalled();
    });
});
