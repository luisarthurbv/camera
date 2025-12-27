import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.changeColumn('deputados', 'cpf', {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.changeColumn('deputados', 'cpf', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  });
};
