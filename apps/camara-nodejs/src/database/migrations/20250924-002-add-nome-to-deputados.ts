import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.addColumn('deputados', 'nome', {
    type: DataTypes.STRING,
    allowNull: true,
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.removeColumn('deputados', 'nome');
};
