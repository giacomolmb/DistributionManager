const { Sequelize, Model,DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    process.env.db_name,
    process.env.db_username,
    process.env.password,
    {
        host: process.env.db_host,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
    }
);

const Person = sequelize.define('Person', {
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    religion: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    marital_status: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    mobile_number: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    document_type: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    document_number: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(90),
        allowNull: true
    },
    diseases: {
        type: DataTypes.STRING(145),
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    photo_uri: {
        type: DataTypes.STRING(90),
        allowNull: true
    },
    fingerprint_uri: {
        type: DataTypes.STRING(90),
        allowNull: true
    }
}, {
    tableName: 'Persons'
});

const FamilyMember = sequelize.define('FamilyMember', {
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    document_type: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    document_number: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    referent_family_member_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Persons',
        key: 'id'
        }
    }
});

const Association = sequelize.define('Association', {
    name: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    logo_uri: {
        type: DataTypes.STRING(90),
        allowNull: true
    }
});

const Location = sequelize.define('Location', {
    country: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    association_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Associations',
            key: 'id'
        }
    }
});

const Referent = sequelize.define('Referent', {
    name: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    mobile_number: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    role: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Locations',
        key: 'id'
        }
    }
});

const Project = sequelize.define('Project', {
    code: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    country: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
});

const Intervention = sequelize.define('Intervention', {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    person_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Persons',
            key: 'id'
        }
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Projects',
            key: 'id'
        }
    },
    notes: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    materials_specified: {
        type: DataTypes.STRING(45),
        allowNull: true
    }
});

const Material = sequelize.define('Material', {
    type: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    qty: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    measure: {
        type: DataTypes.STRING(25),
        allowNull: true
    },
    intervention_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'Interventions',
        key: 'id'
        }
    }
});

const Proposer = sequelize.define('Proposer', {
    association_loc_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
        model: 'Locations',
        key: 'id'
        }
    },
    person_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
        model: "Persons",
        key: 'id'
        }
    }
});
  
Association.hasMany(Location, {as: "locations", foreignKey: "association_id"});
Location.belongsTo(Association, { as: "association", foreignKey: "association_id"});
Location.belongsToMany(Person, { as: 'persons', through: Proposer, foreignKey: "association_loc_id", otherKey: "person_id" });
Person.belongsToMany(Location, { as: 'locations', through: Proposer, foreignKey: "person_id", otherKey: "association_loc_id" });
Proposer.belongsTo(Person, { as: "person", foreignKey: "person_id"});
Person.hasMany(Proposer, { as: "proposers", foreignKey: "person_id"});
Proposer.belongsTo(Location, { as: "association_loc", foreignKey: "association_loc_id"});
Location.hasMany(Proposer, { as: "proposers", foreignKey: "association_loc_id"});
Material.belongsTo(Intervention, { as: "intervention", foreignKey: "intervention_id", onDelete: "CASCADE", hooks: true});
Intervention.hasMany(Material, { as: "materials", foreignKey: "intervention_id"});
Referent.belongsTo(Location, { as: "location", foreignKey: "location_id"});
Location.hasMany(Referent, { as: "referents", foreignKey: "location_id"});
Intervention.belongsTo(Person, { as: "person", foreignKey: "person_id"});
Intervention.belongsTo(Project, { as: "project", foreignKey: "project_id"});
Project.hasMany(Intervention, {as: "interventions", foreignKey: "project_id"});
Person.hasMany(Intervention, { as: "interventions", foreignKey: "person_id"});
Person.hasMany(FamilyMember, { as: "family_members", foreignKey: "referent_family_member_id"});
FamilyMember.belongsTo(Person, { as: "referent_family_member", foreignKey: "referent_family_member_id"});

sequelize.sync();

module.exports = {
    sequelize,
    Person,
    Association, 
    Location,
    Referent,
    Material,
    Intervention,
    Proposer,
    FamilyMember,
    Project
};
