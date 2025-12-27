import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('deputados', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nomeCivil: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dataNascimento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dataFalecimento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ufNascimento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    municipioNascimento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Add indexes for better performance
  await queryInterface.addIndex('deputados', ['cpf']);
  await queryInterface.addIndex('deputados', ['nomeCivil']);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('deputados');
};
