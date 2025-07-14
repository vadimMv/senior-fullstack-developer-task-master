import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRolesAndStatus1721836800000 implements MigrationInterface {
  name = 'UpdateUserRolesAndStatus1721836800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      const tableInfo = await queryRunner.query(`PRAGMA table_info(users)`);
      const columnNames = tableInfo.map((col: any) => col.name);
      if (columnNames.includes('role') && !columnNames.includes('roles')) {
        console.log('Starting migration: Converting single role to multiple roles...');

        await queryRunner.query(`
          ALTER TABLE users ADD COLUMN roles TEXT DEFAULT '["User"]'
        `);

        await queryRunner.query(`
          ALTER TABLE users ADD COLUMN status_new TEXT DEFAULT 'Enabled'
        `);

        await queryRunner.query(`
          UPDATE users 
          SET roles = '["' || COALESCE(role, 'User') || '"]'
          WHERE role IS NOT NULL
        `);

    
        await queryRunner.query(`
          UPDATE users 
          SET status_new = CASE 
            WHEN status = 1 THEN 'Enabled'
            WHEN status = 0 THEN 'Disabled'
            ELSE 'Enabled'
          END
        `);

        await queryRunner.query(`
          CREATE TABLE users_temp AS 
          SELECT id, username, roles, status_new as status FROM users
        `);

        await queryRunner.query(`DROP TABLE users`);

        await queryRunner.query(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            roles TEXT NOT NULL DEFAULT '["User"]',
            status TEXT NOT NULL DEFAULT 'Enabled'
          )
        `);

        await queryRunner.query(`
          INSERT INTO users (id, username, roles, status)
          SELECT id, username, roles, status FROM users_temp
        `);

        await queryRunner.query(`DROP TABLE users_temp`);

        console.log('Migration completed successfully!');
      } else {
        console.log('Migration skipped: Table already appears to be migrated.');
      }

    } catch (error) {
      console.error('Migration up error:', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`DROP TABLE IF EXISTS users`);
    } catch (error) {
      console.error('Migration down error:', error);
      throw error;
    }
  }
}