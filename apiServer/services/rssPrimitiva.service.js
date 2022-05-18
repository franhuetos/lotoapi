const Parser = require('rss-parser');
const cheerio = require('cheerio');
var Primitiva = require('../models/primitivaModel.js');
var credentials = require('../credentials.js');
var ddbbAtlasClient = require('../ddbbAtlasClient.js').ddbbAtlasClient;

const parser = new Parser();
const url = credentials.rss.primitiva;

function updateInfo() {
    return new Promise((resolve, reject) =>{
        parser.parseURL(url, function(err, feed) {
            let insertPromises = [];

            for(var indice in feed.items){
                const instance = new Primitiva();
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
                            instance.info.especial.acertantes = $(this).text();
                            break;
                        case 2:
                            instance.info.especial.premio = $(this).text();
                            break;
                        case 4:
                            instance.info.primera.acertantes = $(this).text();
                            break;
                        case 5:
                            instance.info.primera.premio = $(this).text();
                            break;
                        case 7:
                            instance.info.segunda.acertantes = $(this).text();
                            break;
                        case 8:
                            instance.info.segunda.premio = $(this).text();
                            break;
                        case 10:
                            instance.info.tercera.acertantes = $(this).text();
                            break;
                        case 11:
                            instance.info.tercera.premio = $(this).text();
                            break;
                        case 13:
                            instance.info.cuarta.acertantes = $(this).text();
                            break;
                        case 14:
                            instance.info.cuarta.premio = $(this).text();
                            break;
                        case 16:
                            instance.info.quinta.acertantes = $(this).text();
                            break;
                        case 17:
                            instance.info.quinta.premio = $(this).text();
                            break;
                        case 19:
                            instance.info.reintegro.acertantes = $(this).text();
                            break;
                        case 20:
                            instance.info.reintegro.premio = $(this).text();
                            break;
                        case 22:
                            instance.premiosJoker.primera.premio = $(this).text();
                            break;
                        case 24:
                            instance.premiosJoker.segunda.premio = $(this).text();
                            break;
                        case 26:
                            instance.premiosJoker.tercera.premio = $(this).text();
                            break;
                        case 28:
                            instance.premiosJoker.cuarta.premio = $(this).text();
                            break;
                        case 30:
                            instance.premiosJoker.quinta.premio = $(this).text();
                            break;
                        case 32:
                            instance.premiosJoker.sexta.premio = $(this).text();
                            break;
                        case 34:
                            instance.premiosJoker.septima.premio = $(this).text();
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
                            case 3:
                                instance.joker = /\d+/.exec($(this).text())[0];
                                break;
                        }
                    });


                    let upsertData = instance.toObject();
                    upsertData._id = day + '-' + month + '-' + year;

                    insertPromises.push(ddbbAtlasClient.insert('primitiva', upsertData));   
                }
            }

            Promise.all(insertPromises)
                .then((response)=>{
                    resolve({
                        data: null,
                        message: 'La Primitiva se ha actualizado',
                        error: null
                    });  
                })
                .catch((error) => {
                    resolve({
                        data: null,
                        message: 'Error al actualizar La Primitiva',
                        error: 500
                    });
                });
                      
        });
    }); 
}

module.exports = updateInfo;


