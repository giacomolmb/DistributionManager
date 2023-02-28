const { Sequelize, Op } = require('sequelize');
const { 
    sequelize,
    Person,
    Association,
    Location,
    Referent,
    Proposer,
    Material,
    Intervention,
    FamilyMember,
    Project
} = require("./dbconfig");

const SearchName = require('./utils/SearchName');

module.exports = {
    findAllPersons,
    insertPerson,
    findPerson,
    findPersonById,
    findAssociation,
    getLocations,
    getReferents,
    getAllAssociations,
    getAssociation,
    getLocation,
    insertAssociation,
    insertReferent,
    insertLocation,
    addIntervention,
    updatePerson,
    getIntervention,
    deleteIntervention,
    insertFamilyMember,
    createProject,
    getAllProjects,
    getProject,
    searchProject,
    bulkInsertPersons,
}

async function findAllPersons(){
    const persons = await Person.findAll({raw: true});
    return persons;
}

async function findPerson(searchText){
    const results = await SearchName.findAll({
        where: {
            [Op.or]: [
                {
                    full_name: {
                        [Op.like]: '%' + searchText + '%'
                    }
                },
                {
                    full_name_reverse: {
                        [Op.like]: '%' + searchText + '%'
                    }
                }, 
                {
                    document_number: {
                        [Op.like]: searchText + '%'
                    }
                }
            ]
        },
        replacements: {
            searchText: searchText
        },
        raw: true
    });
    return results;
}

async function getAllAssociations(){
    const associations = await Association.findAll({raw: true});
    return associations;
}

async function getAssociation(associationId){
    const result = await Association.findByPk(associationId, {
        include: {
            model: Location, 
            as: "locations"
        }
    });
    return JSON.stringify(result, null, 4);
}

async function getLocation(locationId){
    const result = await Location.findByPk(locationId, {include: [{model: Association, as: "association"}, {model: Referent, as: "referents"}]});
    return JSON.stringify(result, null, 4);
}

async function findAssociation(searchText){
    const results = await Association.findAll({
        where: {
            name: {
                [Op.like]: searchText + '%'
            }
        },
        raw: true
    });
    return results;
}

async function getLocations(associationId){
    const results = await Location.findAll({
        where: {
            association_id: associationId
        },
        raw: true
    });
    return results;
}

async function getReferents(locationId){
    const results = await Referent.findAll({
        where: {
            location_id: locationId
        },
        raw: true
    });
    return results;
}

async function findPersonById(id){
    const result = await Person.findByPk(id, {
        include: [
            {
                model: Intervention, 
                as: "interventions",
            },
            {
                model: FamilyMember, 
                as: "family_members",
            },
        ],
        order: Sequelize.literal('interventions.date DESC')
    })
    return JSON.stringify(result, null, 4)
}

async function insertPerson(person){
    const newPerson = await Person.create(person, {
        include: [
            {
                model: Proposer,
                as: 'proposers'
            },
            {
                model: FamilyMember,
                as: 'family_members'
            }
        ]
    });
    return JSON.stringify(newPerson, null, 4);
}

function bulkInsertPersons(persons){
    return new Promise(async (resolve, reject) => {
        const newPersons = await Person.bulkCreate(persons);
        resolve(JSON.stringify(newPersons, null, 4));
    })
}

async function updatePerson(person, id){
    const updatedPerson = await Person.update(person, {
        where: {
            id: id
        }
    });
    return JSON.stringify(updatedPerson, null, 4);
}

async function insertReferent(referent){
    const newReferent = await Referent.create({
        name: referent.name,
        role: referent.role,
        mobile_number: referent.mobile_number,
        email: referent.email,
        location_id: referent.location_id,
    });
    return JSON.stringify(newReferent, null, 4);
}

async function insertAssociation(association){
    const newAssociation = await Association.create({
        name: association.name,
        type: association.type,
        logo_uri: association.logo_uri
    });
    return JSON.stringify(newAssociation, null, 4);
}

async function insertFamilyMember(familyMember){
    const newFamilyMember = await FamilyMember.create(familyMember);
    return JSON.stringify(newFamilyMember, null, 4);
}

async function insertLocation(location){
    const newLocation = await Location.create({
        country: location.country,
        city: location.city,
        address: location.address,
        association_id: location.association_id
    });
    return JSON.stringify(newLocation, null, 4);
}

async function addIntervention(intervention) {
    if(intervention.materials_specified === "true"){
        const newIntervention = await Intervention.create(intervention, {
            include: {
                model: Material,
                as: 'materials'
            }
        })
        return JSON.stringify(newIntervention, null, 4);
    } else {
        const newIntervention = await Intervention.create(intervention)
        return JSON.stringify(newIntervention, null, 4);
    }
}

async function getIntervention(interventionId) {
    const intervention = await Intervention.findByPk(interventionId, {
        include: [
            {
                model: Person,
                as: 'person'
            },
            {
                model: Material,
                as: 'materials'
            },
            {
                model: Project,
                as: 'project'
            }
        ]
    });
    return JSON.stringify(intervention, null, 4);
}

async function deleteIntervention(interventionId) {
    const intervention = await Intervention.destroy({
        where: {
            id: interventionId
        }
    });
    return JSON.stringify(intervention, null, 4);
}

async function createProject(project) {
    const newProject = await Project.create(project);
    return JSON.stringify(newProject, null, 4);
}

async function getAllProjects() {
    const result = await Project.findAll();
    return JSON.stringify(result, null, 4);
}

async function getProject(projectId) {
    const result = await Project.findByPk(projectId, {
        include: {
            model: Intervention,
            as: 'interventions',
            include: {
                model: Person,
                as: 'person'
            }
        }
    });
    return JSON.stringify(result, null, 4);
}

async function searchProject(searchText) {
    const result = await Project.findAll({
        where: {
            [Op.or]: [
                {
                    code: {
                        [Op.like]: searchText + '%'
                    }
                },
                {
                    country: {
                        [Op.like]: searchText + '%'
                    }
                }
            ]
        }
    });
    return JSON.stringify(result, null, 4);
}