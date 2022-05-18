const Parser = require('rss-parser');
const cheerio = require('cheerio');
var Euromillon = require('../models/euromillonModel.js');
var credentials = require('../credentials.js');
var ddbbAtlasClient = require('../ddbbAtlasClient.js').ddbbAtlasClient;
const APP_CONST = require('../constants.js');

const parser = new Parser();
const url = credentials.rss.euromillon;

function updateInfo() {
    return new Promise((resolve, reject) =>{
        parser.parseURL(url, function(err, feed) {
            let insertPromises = [];

            for(var indice in feed.items){
                const instance = new Euromillon();
                delete instance._id;
                // instance.date = feed.items[indice].isoDate || new Date(feed.items[indice].pubDate);

                // let month = ('0' + (instance.date.getMonth()+1)).slice(-2);
                // let day = ('0' + instance.date.getDate()).slice(-2);
                // let year = instance.date.getFullYear();

                let titleSplitted = feed.items[indice].title.split(' ');
                let day = titleSplitted[5];
                let month = APP_CONST.MONTH[titleSplitted[7]];
                let year = titleSplitted[9];
                instance.date = new Date(year, APP_CONST.MONTH_DATE[titleSplitted[7]], day);

                if( feed.items[indice].title.indexOf(day) < 0 || feed.items[indice].title.indexOf(year) < 0){
                    continue;
                }

                const $ = cheerio.load(feed.items[indice].content);
                let valid = false;
                $('td').each(function(index, element){
                    valid = true;
                    //Cada 4 td es un sorteo nuevo
                    switch (index){
                        case 1:
                            instance.info.primera.acertantes = $(this).text();
                            break;
                        case 2:
                            instance.info.primera.premio = $(this).text();
                            break;
                        case 3:
                            instance.info.primera.acertantesTotal = $(this).text();
                            break;
                        case 5:
                            instance.info.segunda.acertantes = $(this).text();
                            break;
                        case 6:
                            instance.info.segunda.premio = $(this).text();
                            break;
                        case 7:
                            instance.info.segunda.acertantesTotal = $(this).text();
                            break;
                        case 9:
                            instance.info.tercera.acertantes = $(this).text();
                            break;
                        case 10:
                            instance.info.tercera.premio = $(this).text();
                            break;
                        case 11:
                            instance.info.tercera.acertantesTotal = $(this).text();
                            break;
                        case 13:
                            instance.info.cuarta.acertantes = $(this).text();
                            break;
                        case 14:
                            instance.info.cuarta.premio = $(this).text();
                            break;
                        case 15:
                            instance.info.cuarta.acertantesTotal = $(this).text();
                            break;
                        case 17:
                            instance.info.quinta.acertantes = $(this).text();
                            break;
                        case 18:
                            instance.info.quinta.premio = $(this).text();
                            break;
                        case 19:
                            instance.info.quinta.acertantesTotal = $(this).text();
                            break;
                        case 21:
                            instance.info.sexta.acertantes = $(this).text();
                            break;
                        case 22:
                            instance.info.sexta.premio = $(this).text();
                            break;
                        case 23:
                            instance.info.sexta.acertantesTotal = $(this).text();
                            break;
                        case 25:
                            instance.info.septima.acertantes = $(this).text();
                            break;
                        case 26:
                            instance.info.septima.premio = $(this).text();
                            break;
                        case 27:
                            instance.info.septima.acertantesTotal = $(this).text();
                            break;
                        case 29:
                            instance.info.octava.acertantes = $(this).text();
                            break;
                        case 30:
                            instance.info.octava.premio = $(this).text();
                            break;
                        case 31:
                            instance.info.octava.acertantesTotal = $(this).text();
                            break;
                        case 33:
                            instance.info.novena.acertantes = $(this).text();
                            break;
                        case 34:
                            instance.info.novena.premio = $(this).text();
                            break;
                        case 35:
                            instance.info.novena.acertantesTotal = $(this).text();
                            break;
                        case 37:
                            instance.info.decima.acertantes = $(this).text();
                            break;
                        case 38:
                            instance.info.decima.premio = $(this).text();
                            break;
                        case 39:
                            instance.info.decima.acertantesTotal = $(this).text();
                            break;
                        case 41:
                            instance.info.undecima.acertantes = $(this).text();
                            break;
                        case 42:
                            instance.info.undecima.premio = $(this).text();
                            break;
                        case 43:
                            instance.info.undecima.acertantesTotal = $(this).text();
                            break;
                        case 45:
                            instance.info.duodecima.acertantes = $(this).text();
                            break;
                        case 46:
                            instance.info.duodecima.premio = $(this).text();
                            break;
                        case 47:
                            instance.info.duodecima.acertantesTotal = $(this).text();
                            break;
                        case 49:
                            instance.info.trigesima.acertantes = $(this).text();
                            break;
                        case 50:
                            instance.info.trigesima.premio = $(this).text();
                            break;
                        case 51:
                            instance.info.trigesima.acertantesTotal = $(this).text();
                            break;
                        case 53:
                            instance.premiosMillon.acertantesTotal = $(this).text();
                            break;  
                        case 54:
                            instance.premiosMillon.premio = $(this).text();
                            break;                    
                    }
                });

                if(valid){

                    $('b').each(function(index, element){
                        switch (index){
                            case 0:
                                let [n1, n2, n3, n4, n5] = $(this).text().split('-');
                                instance.n1 = n1;
                                instance.n2 = n2;
                                instance.n3 = n3;
                                instance.n4 = n4;
                                instance.n5 = n5;
                                break;
                            case 1:
                                let [star1, star2] = $(this).text().split('-');
                                instance.star1 = star1;
                                instance.star2 = star2;
                                break;
                            case 2:
                                instance.millon = $(this).text().replace('€', '').trim();
                                break;

                        }
                    });


                    let upsertData = instance.toObject();
                    upsertData._id = day + '-' + month + '-' + year;

                    insertPromises.push(ddbbAtlasClient.insert('euromillon', upsertData));   
                }
            }

            Promise.all(insertPromises)
                .then((response)=>{
                    resolve({
                        data: null,
                        message: 'Euromillones se ha actualizado',
                        error: null
                    });  
                })
                .catch((error) => {
                    resolve({
                        data: null,
                        message: 'Error al actualizar Euromillones',
                        error: 500
                    });
                });
                      
        });
    }); 
}

module.exports = updateInfo;


