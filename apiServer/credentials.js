
// feed anterior http://www.selae.net/gl/la-primitiva/resultados/.formatoRSS',

module.exports = {
    environment: 'production', //[develop|production]
    ddbbLocal: {
        url: 'mongodb://localhost:27017/statistics',
        name: 'statistics',
        collection: {
            'primitiva': 'primitiva',
            'bonoloto': 'bonoloto',
            'euromillon': 'euromillon',
            'gordo-primitiva': 'gordo-primitiva',
            'lototurf': 'lototurf'
        }
    },
    ddbbAtlas: {
        url: 'mongodb+srv://updater:TPC1Piq2YgeX97S3@m001-sandbox-akdlr.mongodb.net/test?retryWrites=true&w=majority',
        name: 'statistics',
        collection: {
            'primitiva': 'primitiva',
            'bonoloto': 'bonoloto',
            'euromillon': 'euromillon',
            'gordo-primitiva': 'gordo-primitiva',
            'lototurf': 'lototurf'
        }
    },
    rss: {
        'primitiva': 'https://www.loteriasyapuestas.es/es/la-primitiva/resultados/.formatoRSS',
        'bonoloto': 'https://www.loteriasyapuestas.es/es/bonoloto/resultados/.formatoRSS',
        'euromillon': 'https://www.loteriasyapuestas.es/es/euromillones/resultados/.formatoRSS',
        'gordo': 'https://www.loteriasyapuestas.es/es/gordo-primitiva/resultados/.formatoRSS',
        'lototurf': 'https://www.loteriasyapuestas.es/es/lototurf/resultados/.formatoRSS'
    },
    botes:{
        'primitiva': 'https://www.loteriasyapuestas.es/es/la-primitiva/botes/.formatoRSS',
    }
};