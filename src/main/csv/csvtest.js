const { bulkInsertPersons } = require("../db/dbcontroller");
const { readPersons } = require("./csvmodule");

const result = readPersons('/Users/giacomo/Desktop/users.csv')
    .then(newPersons => bulkInsertPersons(newPersons))
    .then(result => {return result});
result.then((result) => {console.log(result)})