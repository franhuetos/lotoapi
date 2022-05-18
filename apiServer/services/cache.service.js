var cron = require('node-cron');
var fs = require('fs');

var ddbbAtlasClient = require('../ddbbAtlasClient.js').ddbbAtlasClient;
var rssPrimitiva = require('./rssPrimitiva.service.js');
var getBote = require('./rssBote.service.js');
var rssBonoloto = require('./rssBonoloto.service.js');
var rssEuromillon = require('./rssEuromillon.service.js');
var rssGordo = require('./rssGordoPrimitiva.service.js');

const APP_CONST = require('../constants.js');

let cache = {
    bonoloto: {
        lastUpdate: null,
        data: []
    },
    primitiva: {
        lastUpdate: null,
        data: []
    },
    euromillones: {
        lastUpdate: null,
        data: []
    },
    elgordo: {
        lastUpdate: null,
        data: []
    }
}

updateFromRss();
// getBotes();

//TODO: Actualiza a la 11:00, 22:00 y 23:00
cron.schedule('0 0 11,22,23 * * *', () => {
    updateFromRss();
    // getBotes();
});

function getBotes(){
    return new Promise((resolve, reject) => { 
        Promise.all([
            getBote(APP_CONST.SORTEO.PRIMITIVA)
        ])
        .then(function(response){
            console.log(response);
        }).catch((error)=>{
            console.log("error reading rss %O", error);
            resolve(false);
        });
    });
}

function updateFromRss(){
    console.log('updateFromRss start');
    return new Promise((resolve, reject) => { 
        Promise.all([
            rssPrimitiva(),
            rssBonoloto(),
            rssEuromillon(),
            rssGordo()
        ])
        .then(function(response){
            return getFromDdbb();
        }).then(function(response){
            resolve(true);
        }).catch((error)=>{
            console.log("error reading rss %O", error);
            resolve(false);
        });
    }); 
}

function getFromDdbb(){
    console.log('getFromDdbb start');
    return new Promise((resolve, reject) => { 
        Promise.all([
            ddbbAtlasClient.find(APP_CONST.COLLECTION.BONOLOTO),
            ddbbAtlasClient.find(APP_CONST.COLLECTION.PRIMITIVA),
            ddbbAtlasClient.find(APP_CONST.COLLECTION.EUROMILLONES),
            ddbbAtlasClient.find(APP_CONST.COLLECTION.ELGORDO)
        ])
        .then(function(response){
            update(APP_CONST.SORTEO.BONOLOTO, response[0].data);
            update(APP_CONST.SORTEO.PRIMITIVA, response[1].data);
            update(APP_CONST.SORTEO.EUROMILLONES, response[2].data);
            update(APP_CONST.SORTEO.ELGORDO, response[3].data);
            generateBackupFiles();
            resolve(true);
        }).catch((error)=>{
            console.log("error reading from ddbb");
            resolve(false);
        });
    });
}

function generateBackupFiles(){
    generateBackup(APP_CONST.COLLECTION.BONOLOTO, cache.bonoloto);
    generateBackup(APP_CONST.COLLECTION.PRIMITIVA, cache.primitiva);
    generateBackup(APP_CONST.COLLECTION.EUROMILLONES, cache.euromillones);
    generateBackup(APP_CONST.COLLECTION.ELGORDO, cache.elgordo);
}

function generateBackup(ddbbName, data){
    fs.writeFile(`./apiServer/data_backup/${ddbbName}_new.json`, JSON.stringify(data), function (err) {
        if (err) {
            console.log('error saving' + ddbbName + '.json');
        }else{
            fs.unlink(`./apiServer/data_backup/${ddbbName}.json`, function(error){
                if (err) {
                    console.log('error deleting old ' + ddbbName + '.json');
                }else{
                    fs.rename(`./apiServer/data_backup/${ddbbName}_new.json`, `./apiServer/data_backup/${ddbbName}.json`, (error) => { 
                        if (err) {
                            console.log('error deleting old ' + ddbbName + '.json');
                        }else{
                            //Se ha generado el fichero correctamente
                            // console.log(`${ddbbName}.json file saved`);
                        }
                      }); 
                }
            });
        }   
    });
}

function update(sorteo, data) {
    let lastUpdate = new Date();
    cache[sorteo].data = (data)? data: cache[sorteo].data;
    cache[sorteo].lastUpdate = (data)? lastUpdate: cache[sorteo].lastUpdate;
}

function get(sorteo){
    return new Promise((resolve, reject) =>{
        if(cache[sorteo] && cache[sorteo].data.length){
            resolve(cache[sorteo].data);
        }else{
            ddbbAtlasClient.find(APP_CONST.COLLECTION[sorteo.toUpperCase()])
            .then((response)=>{
                update(sorteo, response.data);
                resolve(cache[sorteo].data);
            })
            .catch((error)=>{
                reject('Error al obtener los datos');
            });
        }
    });
}

async function info(){
    if(!cache.bonoloto.lastUpdate || !cache.primitiva.lastUpdate || !cache.euromillones.lastUpdate || !cache.bonoloto.lastUpdate){
        let resolved = await updateFromRss();
    }
    return {
        bonoloto: cache.bonoloto.lastUpdate,
        primitiva: cache.primitiva.lastUpdate,
        euromillones: cache.euromillones.lastUpdate,
        elgordo: cache.elgordo.lastUpdate,
    }
}

module.exports = {
    get: get,
    info: info
};