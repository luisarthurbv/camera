# Database Migrations with Umzug

This project uses Umzug for database migrations with Sequelize.

## Migration Commands

```bash
# Run all pending migrations
npm run migrate:up

# Rollback the last migration
npm run migrate:down

# Check migration status
npm run migrate:status
```

## Creating New Migrations

1. Create a new migration file in `src/database/migrations/` following the naming pattern:
   `YYYYMMDD-NNN-description.ts`

2. Use the following template:

```typescript
import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  // Migration logic here
};

export const down = async (queryInterface: QueryInterface) => {
  // Rollback logic here
};
```

## How It Works

- **Automatic Migrations**: In development mode, migrations run automatically when the application starts
- **Manual Control**: Use npm scripts for manual migration control
- **Migration Tracking**: Umzug tracks executed migrations in the database
- **Rollback Support**: Each migration includes rollback logic

## Migration Files

- `migration.config.ts` - Umzug configuration
- `migration.service.ts` - NestJS service for programmatic migration control
- `migrate.ts` - CLI script for running migrations
- `migrations/` - Directory containing all migration files
