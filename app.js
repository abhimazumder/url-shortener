const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shortId = require('shortid');
const ShortURL = require('./models/ShortURL');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://abhishek_mazumder:Asdfg09876@url-shortener.qjwovzs.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser : true,
    useUnifiedTopology : true
})

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', async (req, res, next) => {
    ShortURL.find()
    .select('longURL shortURL clicks')
    .exec()
    .then(allURLs => {
        res.render('index', {allURLs : allURLs});
    })
    .catch(error => {
        console.log(error);
        error.status = 500;
        error.message = "Internal Server Error";
        next(error);
    })
});

app.get('/:shortURL', async (req, res, next) => {
    ShortURL.findOne({shortURL : req.params.shortURL})
    .exec()
    .then(URL => {
        URL.clicks++;
        URL.save();
        res.redirect(URL.longURL);
    })
    .catch(error => {
        console.log(error);
        next();
    })
})

app.post('/shortenURL', async (req, res, next) => {
    const shortURL = new ShortURL({
        _id : new mongoose.Types.ObjectId(),
        longURL : req.body.longURL,
        shortURL : shortId.generate()
    })
    await shortURL
    .save()
    .then(result => {
        console.log(result);
        res.redirect('/');
    })
    .catch(error => {
        console.log(error);
        res.render('error', {error : {
            status : 500,
            message : "Internal Server Error"
        }})
    })
})

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error', {error : {
        status : error.status,
        message : error.message
    }})
})
module.exports = app;