import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.addColumn('deputado_legislatura', 'estado', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.removeColumn('deputado_legislatura', 'estado');
};
