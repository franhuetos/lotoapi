const Parser = require('rss-parser');
const cheerio = require('cheerio');
var Bonoloto = require('../models/bonolotoModel.js');
var credentials = require('../credentials.js');
var ddbbAtlasClient = require('../ddbbAtlasClient.js').ddbbAtlasClient;

const parser = new Parser();
const url = credentials.rss.bonoloto;

function updateInfo() {
    return new Promise((resolve, reject) =>{
        parser.parseURL(url, function(err, feed) {
            let insertPromises = [];

            for(var indice in feed.items){
                const instance = new Bonoloto();
                delete instance._id;
                instance.date = feed.items[indice].isoDate || new Date(feed.items[indice].pubDate);

                let month = ('0' + (instance.date.getMonth()+1)).slice(-2);
                let day = ('0' + instance.date.getDate()).slice(-2);
                let year = instance.date.getFullYear();

                if( feed.items[indice].title.indexOf(day) < 0 || feed.items[indice].title.indexOf(year) < 0){
                    continue;
                }

                const $ = cheerio.load(feed.items[indice].content);
                let valid = false;
                $('td').each(function(index, element){
                    valid = true;
                    //Cada 3 td es un sorteo nuevo
                    switch (index){
                        case 1:
                            instance.info.primera.acertantes = $(this).text();
                            break;
                        case 2:
                            instance.info.primera.premio = $(this).text();
                            break;
                        case 4:
                            instance.info.segunda.acertantes = $(this).text();
                            break;
                        case 5:
                            instance.info.segunda.premio = $(this).text();
                            break;
                        case 7:
                            instance.info.tercera.acertantes = $(this).text();
                            break;
                        case 8:
                            instance.info.tercera.premio = $(this).text();
                            break;
                        case 10:
                            instance.info.cuarta.acertantes = $(this).text();
                            break;
                        case 11:
                            instance.info.cuarta.premio = $(this).text();
                            break;
                        case 13:
                            instance.info.quinta.acertantes = $(this).text();
                            break;
                        case 14:
                            instance.info.quinta.premio = $(this).text();
                            break;
                        case 16:
                            instance.info.reintegro.acertantes = $(this).text();
                            break;
                        case 17:
                            instance.info.reintegro.premio = $(this).text();
                            break;
                    }
                });

                if(valid){

                    $('b').each(function(index, element){
                        switch (index){
                            case 0:
                                let [n1, n2, n3, n4, n5, n6] = $(this).text().split('-');
                                instance.n1 = n1;
                                instance.n2 = n2;
                                instance.n3 = n3;
                                instance.n4 = n4;
                                instance.n5 = n5;
                                instance.n6 = n6;
                                break;
                            case 1:
                                instance.complementary = /\d+/.exec($(this).text())[0];
                                break;
                            case 2:
                                instance.refund = /\d+/.exec($(this).text())[0];
                                break;
                        }
                    });

                    let upsertData = instance.toObject();
                    upsertData._id = day + '-' + month + '-' + year;

                    insertPromises.push(ddbbAtlasClient.insert('bonoloto', upsertData));   
                }
            }

            Promise.all(insertPromises)
                .then((response)=>{
                    resolve({
                        data: null,
                        message: 'Bonoloto se ha actualizado',
                        error: null
                    });  
                })
                .catch((error) => {
                    resolve({
                        data: null,
                        message: 'Error al actualizar Bonoloto',
                        error: 500
                    });
                });
                      
        });
    }); 
}

module.exports = updateInfo;


