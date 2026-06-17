import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProfile1781707290718 implements MigrationInterface {
    name = 'UserProfile1781707290718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "weekly_budget_hours" real NOT NULL DEFAULT '6'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "weekly_budget_hours"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

}
