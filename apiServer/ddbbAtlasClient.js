var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var credentials = require('./credentials.js');

// Connection URL
let url = '';
// Database Name
let dbName = '';
//collection name
const collection = credentials.ddbbAtlas.collection;

if(credentials.environment !== 'develop'){
    url = credentials.ddbbAtlas.url;
    dbName = credentials.ddbbAtlas.name;
}else{
    url = credentials.ddbbLocal.url;
    dbName = credentials.ddbbLocal.name;
}

function connect(callback){
    return MongoClient.connect(url, { useUnifiedTopology: true }, callback);
}

function find(ddbbName){
    return new Promise((resolve, reject) =>{
        // Connect to the db
        connect(function (err, server) {
            if(err){
                resolve({
                    data: null,
                    message: 'Error connecting ddbb',
                    error: 500
                });
            };

            let db = server.db(dbName);
            let ddbbCollection = db.collection(collection[ddbbName]);
            ddbbCollection.find().sort({date: -1}).toArray()
                .then(function(response){
                    server.close();
                    server = null;
                    resolve({
                        data: response,
                        message: null,
                        error: null
                    });
                })
                .catch(function(error){
                    server.close();
                    server = null;
                    resolve({
                        data: null,
                        message: 'Error getting ddbb',
                        error: 500
                    });
                });
        });
    });
}

function findLast(ddbbName){
    return new Promise((resolve, reject) =>{
        // Connect to the db
        connect(function (err, server) {
            if(err){
                resolve({
                    data: null,
                    message: 'Error connecting ddbb',
                    error: 500
                });
            };

            let db = server.db(dbName);
            let ddbbCollection = db.collection(collection[ddbbName]);
            ddbbCollection.find().sort({date: -1}).limit(1).toArray()
                .then(function(response){
                    server.close();
                    server = null;
                    resolve({
                        data: response,
                        message: null,
                        error: null
                    });
                })
                .catch(function(error){
                    server.close();
                    server = null;
                    resolve({
                        data: null,
                        message: 'Error getting ddbb',
                        error: 500
                    });
                });
        });
    });
}

/**
 * 
 * @param {string} fecha formato "2020-01-31"
 */
function findByDate(ddbbName, fecha){
   
    return new Promise((resolve, reject) =>{
        // Connect to the db
        connect(function (err, server) {
            if(err){
                resolve({
                    data: null,
                    message: 'Error connecting ddbb',
                    error: 500
                });
            }else{

                let db = server.db(dbName);
                let ddbbCollection = db.collection(collection[ddbbName]);
                ddbbCollection.find({_id: fecha }).sort({date: -1}).toArray()
                    .then(function(response){
                        server.close();
                        server = null;
                        resolve({
                            data: response,
                            message: null,
                            error: null
                        });
                    })
                    .catch(function(error){
                        server.close();
                        server = null;
                        resolve({
                            data: null,
                            message: 'Error getting ddbb',
                            error: 500
                        });
                    });
            }
        });
    });
}

function insert(ddbbName, upsertData){
    return new Promise((resolve, reject) =>{
        // Connect to the db
        connect(function (err, server) {
            if(err){
                resolve({
                    data: null,
                    message: 'Error connecting ddbb',
                    error: 500
                });
            }else{

                let db = server.db(dbName);
                let ddbbCollection = db.collection(collection[ddbbName]);
                ddbbCollection.replaceOne({_id: upsertData._id}, upsertData, {upsert: true}, function(err, result) {
                    if(err){
                        server.close();
                        server = null;
                        resolve({
                            data: null,
                            message: 'Error ddbb insert',
                            error: 500
                        });
                    }else{
                        server.close();
                        server = null;
                        resolve({
                            data: result.ops[0],
                            message: "inserted",
                            error: null
                        });
                    }
                });
            }
        });
    });
}


/**
 * Actualiza totalmente las ddbb desde ficheros, ojo, machaca datos anteriores
 */
function fillTablesFromStaticData(){
    
    return new Promise((resolve, reject) =>{
            connect(function (err, server) {
                if(err){
                    resolve({
                        data: null,
                        message: 'Error connecting ddbb',
                        error: 500
                    });
                }else{
    
                    let db = server.db(dbName);
                    let promises = [];
                    for(let ddbbCollection in collection){
                        let data = eval(fs.readFileSync(`./data/${ddbbCollection}.js`, 'utf-8'));
                        let collection = db.collection(ddbbCollection);
                        promises.push(collection.insertMany(data,  {
                            ordered: true
                        }));
                    }
                    Promise.all(promises)
                        .then((response)=>{
                            server.close();
                            server = null;
                            resolve({
                                data: null,
                                message: "Tablas actualizadas estaticamente",
                                error: null
                            });
                        })
                        .catch((error)=>{
                            server.close();
                            server = null;
                            resolve({
                                data: null,
                                message: "Error al actualizar las tablas estaticamente",
                                error: 500
                            });
                        });
                    
                }
            });
        });

}

exports.ddbbAtlasClient = {
    find: find,
    findLast: findLast,
    findByDate: findByDate,
    insert: insert,
    fillTablesFromStaticData: fillTablesFromStaticData
}

