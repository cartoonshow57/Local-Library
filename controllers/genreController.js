var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
var mongoose = require('mongoose');
var validator = require('express-validator');

exports.genre_list = function(req, res, next) {
    Genre.find()
        .populate('genre')
        .sort([['name', 'ascending']])
        .exec(function(err, list_genres) {
            if (err) {return next(err);}
            array = [];
            a = new Set();
            for (var object in list_genres) {
                if (a.has(list_genres[object].name)) {
                    array.push(list_genres[object]);
                    a.add(list_genres[object].name);
                } else {
                    a.add(list_genres[object].name);
                }
            }    
            res.render('genre_list', {title: "Genre List", list_genres: array});
        });
};

exports.genre_detail = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },
        genre_books: function(callback) {
            Book.find({'genre': req.params.id })
                .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre == null) {
            var err = new Error('Genre not found!');
            err.status = 404;
            return next(err);
        }
        res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books});
    });
};

exports.genre_create_get = function(req, res) {
    res.render('genre_form', { title: 'Create Genre' });
};

exports.genre_create_post = [
    validator.body('name', 'Genre name required').trim().isLength({ min: 1 }),
    validator.sanitizeBody('name').escape(),

    (req, res, next) => {
        var errors = validator.validationResult(req);
        var genre = new Genre(
            { name: req.body.name }
        );
        if (!errors.isEmpty()) {
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        }
        else {
            Genre.findOne({ 'name': req.body.name })
                .exec(function(err, found_genre) {
                    if (err) {return next(err); }
                    if (found_genre) {
                        res.redirect(found_genre.url);
                    }
                    else {
                        genre.save(function(err) {
                            if (err) {return next(err); }
                            res.redirect(genre.url);
                        });
                    }
                });
        }
    }
];

exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
