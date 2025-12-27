import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.addColumn('deputados', 'sexo', {
    type: DataTypes.STRING(1),
    allowNull: true,
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.removeColumn('deputados', 'sexo');
};
