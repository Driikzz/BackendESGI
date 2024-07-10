import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IRdv {
    id?: number;
    idTuteur: number;
    idSuiveur: number;
    idAlternant: number;
    entreprise: string;
    formation: string;
    dateRdv: Date;
    creationDate?: Date;
}

interface IRdvCreationAttributes extends Optional<IRdv, 'id'> {}

class Rdv extends Model<IRdv, IRdvCreationAttributes> implements IRdv {
    public id!: number;
    public idTuteur!: number;
    public idSuiveur!: number;
    public idAlternant!: number;
    public entreprise!: string;
    public formation!: string;
    public dateRdv!: Date;
    public creationDate!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Rdv.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    idTuteur: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idSuiveur: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idAlternant: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    entreprise: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    formation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateRdv: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    creationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'rdvs',
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('La table Rdv a été créée (si elle n\'existait pas déjà).');
    })
    .catch((error) => {
        console.error('Erreur lors de la création de la table Rdv :', error);
    });

export default Rdv;
