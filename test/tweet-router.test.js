require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');

describe('app routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('POST route creates a Tweet in the database', () => {

        return request(app)
            .post('/api/v1/tweets')
            .send({ 
                handle: 'butts',
                text: 'suuuuup'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    handle: 'butts',
                    text: 'suuuuup', 
                    __v: 0
                });
            });
    });  

    it('RANDOM post route successful', () => {

        return request(app)
            .post('/api/v1/tweets?random=true')
            .send({ 
                handle: 'butts',
                text: 'suuuuup', 
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    handle: 'butts',
                    text: expect.any(String),
                    __v: 0
                });
            });
    });  
      

    it('GET returns all Tweets', async() => {

        const tweet1 = await Tweet.create({
            handle: 'I am handle one',
            text: 'I am text one'
        });

        const tweet2 = await Tweet.create({
            handle: 'I am handle two',
            text: 'I am text two'
        });

        return request(app)
            .get('/api/v1/tweets')
            .then(res => {
                expect(res.body).toEqual([
                    { _id: tweet1._id.toString(), handle: tweet1.handle, text: tweet1.text },
                    { _id: tweet2._id.toString(), handle: tweet2.handle, text: tweet2.text }
                ]);
            });
    });


    it('GET /:id returns a Tweet by id', async() => {

        const tweet = await Tweet.create({
            handle: 'I am handle one',
            text: 'I am text one'
        });

        return request(app)
            .get(`/api/v1/tweets/${tweet._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: tweet._id.toString(),
                    handle: tweet.handle,
                    text: tweet.text
                });
            });
    });


    it('PATCH Tweets/:id updates a Tweet by id', async() => {

        const tweet = await Tweet.create({
            handle: 'I am handle one',
            text: 'I am text one'
        });

        return request(app)
            .patch(`/api/v1/tweets/${tweet._id}`)
            .send({ 
                text: 'I am NEW text',
            })
            .then(res => {
                expect(res.body).toEqual({ 
                    _id: expect.any(String),
                    text: 'I am NEW text', 
                    __v: 0 });
            });
    });

   
    it('deletes Tweet if there is NO film', async() => {

        const tweet = await Tweet.create({
            handle: 'I am handle one',
            text: 'I am text one'
        });

        return request(app)
            .delete(`/api/v1/tweets/${tweet._id}`)
            .then(res => {
                expect(res.body).toEqual({ 
                    _id: expect.any(String),
                    handle: 'I am handle one',
                    text: 'I am text one',
                    __v: 0 });
            });
    });
});
