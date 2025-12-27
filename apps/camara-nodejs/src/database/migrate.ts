#!/usr/bin/env ts-node
import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
import { createMigrator } from './migration.config';

// Load environment variables
config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});

async function runMigrations() {
  try {
    const migrator = createMigrator(sequelize);
    const migrations = await migrator.up();

    if (migrations.length > 0) {
      console.log(
        '✅ Executed migrations:',
        migrations.map((m) => m.name),
      );
    } else {
      console.log('✅ No pending migrations');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function rollbackMigration() {
  try {
    const migrator = createMigrator(sequelize);
    const migrations = await migrator.down();

    if (migrations.length > 0) {
      console.log(
        '✅ Rolled back migrations:',
        migrations.map((m) => m.name),
      );
    } else {
      console.log('✅ No migration to rollback');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  }
}

async function showStatus() {
  try {
    const migrator = createMigrator(sequelize);
    const pending = await migrator.pending();
    const executed = await migrator.executed();

    console.log('📊 Migration Status:');
    console.log(`   Executed: ${executed.length}`);
    console.log(`   Pending: ${pending.length}`);

    if (executed.length > 0) {
      console.log('\n✅ Executed migrations:');
      executed.forEach((m) => console.log(`   - ${m.name}`));
    }

    if (pending.length > 0) {
      console.log('\n⏳ Pending migrations:');
      pending.forEach((m) => console.log(`   - ${m.name}`));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Status check failed:', error);
    process.exit(1);
  }
}

const command = process.argv[2];

switch (command) {
  case 'up':
    runMigrations();
    break;
  case 'down':
    rollbackMigration();
    break;
  case 'status':
    showStatus();
    break;
  default:
    console.log('Usage: npm run migrate [up|down|status]');
    console.log('  up     - Run pending migrations');
    console.log('  down   - Rollback last migration');
    console.log('  status - Show migration status');
    process.exit(1);
}
