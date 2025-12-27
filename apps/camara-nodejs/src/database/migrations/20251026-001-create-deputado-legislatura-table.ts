import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('deputado_legislatura', {
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
    legislaturaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'legislaturas',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    partidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'partidos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
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

  // Add index for deputadoId
  await queryInterface.addIndex('deputado_legislatura', ['deputadoId'], {
    name: 'idx_deputado_legislatura_deputado_id',
  });

  // Add index for legislaturaId
  await queryInterface.addIndex('deputado_legislatura', ['legislaturaId'], {
    name: 'idx_deputado_legislatura_legislatura_id',
  });

  // Add index for partidoId
  await queryInterface.addIndex('deputado_legislatura', ['partidoId'], {
    name: 'idx_deputado_legislatura_partido_id',
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('deputado_legislatura');
};
