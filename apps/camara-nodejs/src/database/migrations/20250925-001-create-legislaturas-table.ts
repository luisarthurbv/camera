import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('legislaturas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    dataInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dataFim: {
      type: DataTypes.DATE,
      allowNull: false,
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

  await queryInterface.addIndex('legislaturas', ['dataInicio']);
  await queryInterface.addIndex('legislaturas', ['dataFim']);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('legislaturas');
};
