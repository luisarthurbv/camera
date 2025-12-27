import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';
import * as path from 'path';

export const createMigrator = (sequelize: Sequelize) => {
  return new Umzug({
    migrations: {
      glob: path.join(__dirname, 'migrations/*.ts'),
      resolve: ({ name, path: migrationPath }) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const migration = require(migrationPath);
        return {
          name,
          up: async () =>
            migration.up(sequelize.getQueryInterface(), Sequelize),
          down: async () =>
            migration.down(sequelize.getQueryInterface(), Sequelize),
        };
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
};
