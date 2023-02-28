const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const { bulkInsertPersons } = require('../db/dbcontroller');

const removeEmptyFields = (data) => {
    Object.keys(data).forEach(key => {
        if (data[key] === "" || data[key] == null) {
            delete data[key];
        }
    });
}

function readPersons(filename){
    return new Promise((resolve, reject) => {
        const newPersons = []
        fs.createReadStream(filename)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => {
                return error
            })
            .on('data', (row) => {
                removeEmptyFields(row);
                newPersons.push(row);
            })
            .on('end', () => {
                resolve(newPersons)
            });
    })
}

function importPersons(filename){
    readPersons(filename).then((newPersons) => {
        return bulkInsertPersons(newPersons);
    });
}

module.exports = {
    importPersons,
    readPersons
};