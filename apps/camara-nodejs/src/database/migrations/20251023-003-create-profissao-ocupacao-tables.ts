import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  // Create deputado_profissao table
  await queryInterface.createTable('deputado_profissao', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    deputadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'deputados',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    titulo: {
      type: DataTypes.STRING,
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

  // Add index for deputadoId in profissao table
  await queryInterface.addIndex('deputado_profissao', ['deputadoId'], {
    name: 'idx_profissao_deputado_id',
  });

  // Create deputado_ocupacao table
  await queryInterface.createTable('deputado_ocupacao', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    deputadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'deputados',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entidade: {
      type: DataTypes.STRING,
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

  // Add index for deputadoId in ocupacao table
  await queryInterface.addIndex('deputado_ocupacao', ['deputadoId'], {
    name: 'idx_ocupacao_deputado_id',
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('deputado_ocupacao');
  await queryInterface.dropTable('deputado_profissao');
};
