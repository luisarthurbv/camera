import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('orgaos', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    sigla: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    apelido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    casa: {
      type: DataTypes.ENUM('CAMARA_DOS_DEPUTADOS', 'CONGRESSO_NACIONAL'),
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

  // Add indexes for better performance
  await queryInterface.addIndex('orgaos', ['sigla']);
  await queryInterface.addIndex('orgaos', ['nome']);
  await queryInterface.addIndex('orgaos', ['casa']);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('orgaos');
};
