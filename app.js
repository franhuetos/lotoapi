var express = require('express');
var server = express();
const compression = require('compression');
const cacheSrv = require('./apiServer/services/cache.service.js');

const APP_CONST = require('./apiServer/constants.js');

server.use(compression());

server.get('/data/bonoloto/', function (req, res) {
    // if(!req.headers['x-forwarded-for'] || req.headers['x-forwarded-for'] === APP_CONST.LOTODATOS.IP ){
        cacheSrv.get(APP_CONST.SORTEO.BONOLOTO)
        .then(function(response){
            res.status(200).json(response);
        }).catch((error)=>{
            res.status(500).json({error: 500, message: error});
        });
    // }else{
    //     res.status(401).json();
    // }
});

server.get('/data/primitiva/', function (req, res) {
    // if(!req.headers['x-forwarded-for'] || req.headers['x-forwarded-for'] === APP_CONST.LOTODATOS.IP){
        cacheSrv.get(APP_CONST.SORTEO.PRIMITIVA)
        .then(function(response){
            res.status(200).json(response);
        }).catch((error)=>{
            res.status(500).json({error: 500, message: error});
        });
    // }else{
    //     res.status(401).json();
    // }
});

server.get('/data/euromillones/', function (req, res) {
    // if(!req.headers['x-forwarded-for'] || req.headers['x-forwarded-for'] === APP_CONST.LOTODATOS.IP){
        cacheSrv.get(APP_CONST.SORTEO.EUROMILLONES)
        .then(function(response){
            res.status(200).json(response);
        }).catch((error)=>{
            res.status(500).json({error: 500, message: error});
        });
    // }else{
    //     res.status(401).json();
    // }
});

server.get('/data/elgordo/', function (req, res) {
    // if(!req.headers['x-forwarded-for'] || req.headers['x-forwarded-for'] === APP_CONST.LOTODATOS.IP){
        cacheSrv.get(APP_CONST.SORTEO.ELGORDO)
        .then(function(response){
            res.status(200).json(response);
        }).catch((error)=>{
            res.status(500).json({error: 500, message: error});
        });
    // }else{
    //     res.status(401).json();
    // }
});

server.get('/data/', function (req, res) {
    // if(!req.headers['x-forwarded-for'] || req.headers['x-forwarded-for'] === APP_CONST.LOTODATOS.IP){
        Promise.all([
                cacheSrv.get(APP_CONST.SORTEO.PRIMITIVA),
                cacheSrv.get(APP_CONST.SORTEO.BONOLOTO),
                cacheSrv.get(APP_CONST.SORTEO.EUROMILLONES),
                cacheSrv.get(APP_CONST.SORTEO.ELGORDO)
            ])
        .then(function(response){
            res.status(200).json(response);
        }).catch((error)=>{
            res.status(500).json();
        });
    // }else{
    //     res.status(401).json();
    // }
});

server.get('/data/*', function (req, res) {
    res.status(400).json();
});

server.get('/info/', function (req, res) {
        cacheSrv.info()
        .then((response)=>{
            res.status(200).json(response);
        })
        .catch((response)=>{
            res.status(500).json();
        });
        
});

server.get('*', function (req, res) {
    res.status(400).json();
});

server.listen(APP_CONST.APP.PORT, function() {
    console.log('Api server listening on port ' + APP_CONST.APP.PORT);
});