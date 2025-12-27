import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('deputados', 'redesSociais', {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    });
    await queryInterface.addColumn('deputados', 'website', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('deputados', 'redesSociais');
    await queryInterface.removeColumn('deputados', 'website');
  },
};
