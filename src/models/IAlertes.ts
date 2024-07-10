import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IAlertes {
    id: number;
    alternantId: number;
    duoId: number;
    formulaireId: number;
    message: string;
    datedeCreation: Date;
    dateDeTraitement: Date | null;
    traitantId: number | null; 
}

interface AlertesCreationAttributes extends Optional<IAlertes, 'id'> {}

class Alertes extends Model<IAlertes, AlertesCreationAttributes> implements IAlertes {
    public id!: number;
    public alternantId!: number;
    public duoId!: number;
    public formulaireId!: number;
    public message!: string;
    public datedeCreation!: Date;
    public dateDeTraitement!: Date | null;
    public traitantId!: number | null;
}

Alertes.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    alternantId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    duoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    formulaireId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    datedeCreation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Set default to current timestamp
    },
    dateDeTraitement: {
        type: DataTypes.DATE,
        allowNull: true // Allow null to indicate the alert has not been processed yet
    },
    traitantId: {
        type: DataTypes.INTEGER,
        allowNull: true // Allow null to indicate the alert has not been processed yet
    }
}, {
    tableName: 'alertes',
    sequelize,
    timestamps: false // Explicitly mention this to avoid confusion
});

Alertes.sync({ force: false })
    .then(() => {
        console.log('The table for the Alertes model was just (re)created!');
    })
    .catch((error) => {
        console.error('Error creating table:', error);
    });

export default Alertes;
