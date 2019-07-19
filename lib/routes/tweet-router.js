const { Router } = require('express');
const Tweet = require('../models/Tweet');


module.exports = Router() 

    .post('/', (req, res, next) => {

        const {
            handle,
            text
        } = req.body;

        Tweet
            .create({ handle, text })
            .then(tweet => {
                res.send(tweet);
            })
            .catch(next);
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

// .put('/:id', (req, res, next) => {

//     const {
//         handle,
//         text
//     } = req.body;

//     Tweet
//         .findByIdAndUpdate(req.params.id, { handle, text }, { new: true })
//         .then(replacedTweet => {
//             res.send(replacedTweet);
//         })
//         .catch(next);

// })

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
