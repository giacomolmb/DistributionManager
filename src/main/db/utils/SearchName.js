const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbconfig');

const SearchName = sequelize.define("SearchName", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    full_name: {
        type: DataTypes.STRING(90),
        allowNull: false
    },
    full_name_reverse: {
        type: DataTypes.STRING(90),
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATEONLY,
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
    familiar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    createdAt: false,
    updatedAt: false
});

module.exports = SearchName;