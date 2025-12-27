import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  // Create votacoes table
  await queryInterface.createTable('votacoes', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
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

  // Create votacoes_deputados table
  await queryInterface.createTable('votacoes_deputados', {
    idVotacao: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'votacoes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    deputadoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'deputados',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    voto: {
      type: DataTypes.ENUM('ABSTENCAO', 'ARTIGO_17', 'NAO', 'OBSTRUCAO', 'SIM'),
      allowNull: false,
    },
    votoMoment: {
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

  // Add indexes for votacoes_deputados
  await queryInterface.addIndex('votacoes_deputados', ['idVotacao']);
  await queryInterface.addIndex('votacoes_deputados', ['deputadoId']);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('votacoes_deputados');
  await queryInterface.dropTable('votacoes');
};
