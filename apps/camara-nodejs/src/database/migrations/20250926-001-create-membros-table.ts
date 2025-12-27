import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('membros', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    deputadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'deputados',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    partidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'partidos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    legislaturaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'legislaturas',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
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

  await queryInterface.addIndex('membros', ['partidoId']);
  await queryInterface.addIndex('membros', ['deputadoId']);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('membros');
};
