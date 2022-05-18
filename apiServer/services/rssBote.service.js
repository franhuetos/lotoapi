const Parser = require('rss-parser');
const cheerio = require('cheerio');
var Primitiva = require('../models/primitivaModel.js');
var credentials = require('../credentials.js');
var ddbbAtlasClient = require('../ddbbAtlasClient.js').ddbbAtlasClient;
const APP_CONST = require('../constants.js');

const parser = new Parser();
const url = credentials.rss.primitiva;
const url_botes = credentials.botes.primitiva;

function getBote(sorteo) {
    return new Promise((resolve, reject) =>{
        parser.parseURL(credentials.botes[sorteo], function(err, feed) {

            for(var indice in feed.items){
                let replaced = feed.items[indice].link.replace(/\%2D/gi, '-');
                let itemSplitted = replaced.split('euro-');
                let ammount = itemSplitted[0].split('de-')[1].replace(/-/g, '.');
                let boteDate = itemSplitted[1].split('-de-');
                console.log(ammount);
                console.log(boteDate);
                ddbbAtlasClient.findByDate(credentials.ddbbAtlas.collection[sorteo], `${boteDate[0]}-${APP_CONST.MONTH[boteDate[1]]}-${boteDate[2]}`)
                .then(function(response){
                    console.log(response);
                })
                .catch(function(error){
                    console.log(error);
                });

                
            }


                      
        });
    }); 
}

module.exports = getBote;


