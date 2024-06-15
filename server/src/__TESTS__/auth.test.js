const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const request = require('supertest');
const User = require('../Models/userSchema');
const app = require('./jest.setup');


beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, {});
    console.log('Connected to test database');
})

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('Disconnected from test database');
})

const makePostRequest = async(route ,newUser) =>{
    const response = request(app).post(route).send(newUser);
    return response;
}

describe('Auth Route', () => {
    jest.setTimeout(10000)

    describe('POST /signup', () => {
        it('should create and register a unverified new user', async()=>{
            const newUser = {
                username : 'testuser',
                email : 'testuser@jest.com',
                password : 'testpassword'
            }
            const response = await makePostRequest('/signup', newUser);

            expect(response.statusCode).toBe(200);

            const user = await User.findOne({email : newUser.email});

            expect(response.body).toHaveProperty('success');
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('OTP sent successfully');
            expect(response.body).toHaveProperty('email');
            expect(response.body.email).toBe(newUser.email);
            expect(user.isVerified).toBe(false);
        })
        it('should not create a user with an existing email', async()=>{
            const newUser = {
                username : 'testuser',
                email : 'testuser@jest.com',
                password : 'testpassword'
            }
            const response = await makePostRequest('/signup', newUser);

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('User with the provided email or username already exists');
        })
    })

    describe('POST /login', ()=>{
        it('should authenticate a user with valid credentials', async()=>{
            const verifiedUser = {
                username : 'testuserVerified',
                email : 'testuserVerified@jest.com',
                password : 'testpassword',
                isVerified : true
            }

            const newUser = new User({username : verifiedUser.username, email : verifiedUser.email, isVerified : verifiedUser.isVerified})
            newUser.setPassword(verifiedUser.password);
            await newUser.save();

            const response = await makePostRequest('/login', {email : verifiedUser.email, password : verifiedUser.password});

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('userName');
            expect(response.body.userName).toBe('testuserVerified');
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('profileImage');

            const decodedToken = jwt.verify(response.body.token, process.env.JWT_SECRET);
            expect(decodedToken.userId).toBe(response.body.userId);
            
        })

        it('should not authenticate a user with unverified Email', async()=>{
            const user = {
                email : 'testuser@jest.com',
                password : 'testpassword'
            }

            const response = await makePostRequest('/login', user);

            expect(response.statusCode).toBe(403);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('User not verified. Check Email to verify.');

        })

        it('should not authenticate a user with invalid credentials', async()=>{
            const user = {
                email : 'invalidtestuser@jest.com',
                password : 'testpassword'
            }

            const response = await makePostRequest('/login', user);

            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Invalid email or password')
        })
    
    })

    describe('GET /user', ()=>{
        it('should return a user object', async()=>{
            const verifiedUser = {
                email : 'testuserVerified@jest.com',
            }

            const user = await User.findOne({email : verifiedUser.email});
            const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET, {expiresIn : '1h'});

            const response = await request(app).get('/user').set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.user.email).toBe(verifiedUser.email);
        })
        it('should not return a user object with an invalid token', async()=>{
            const response = await request(app).get('/user').set('Authorization', `Bearer invalidToken`);

            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('message');
        })
    })
})