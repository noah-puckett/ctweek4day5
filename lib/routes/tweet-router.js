const { Router } = require('express');
const randomQuote = require('../middleware/random-quote');
const Tweet = require('../models/Tweet');


module.exports = Router() 

    .post('/', randomQuote, (req, res, next) => {

        const {
            handle,
            text
        } = req.body;

        const {
            random
        } = req.query;

        if(random) {
            Tweet
                .create({ handle, text: req.quote })
                .then(tweet => {
                    res.send(tweet);
                })
                .catch(next);
        }
        else {
            Tweet
                .create({ handle, text })
                .then(tweet => {
                    res.send(tweet);
                })
                .catch(next);
        }
    })

    .get('/', (req, res, next) => {
        
        Tweet
            .find()
            .select({ __v: false })
            .then(tweets => {
                res.send(tweets);
            })
            .catch(next);
    }) 

    .get('/:id', (req, res, next) => {
        Tweet
            .findById(req.params.id)
            .select({ __v: false })
            .then(tweet => {
                res.send(tweet);
            })
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {

        const {
            text
        } = req.body;

        Tweet
            .findByIdAndUpdate(req.params.id, { text }, { new: true })
            .select({ handle: false })
            .then(updatedTweet => {
                res.send(updatedTweet);
            })
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Tweet
            .findById(req.params.id)
            .then(deletedTweet => {
                res.send(deletedTweet);
            })
            .catch(next);
    });
