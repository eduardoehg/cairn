import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskProgress1781556878523 implements MigrationInterface {
    name = 'TaskProgress1781556878523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "task_id" character varying NOT NULL, "status" character varying NOT NULL, "incomplete_reason" text, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8f65518956d364e550b06a8342b" UNIQUE ("user_id", "task_id"), CONSTRAINT "PK_d3a98edef96427df8adb5feb8e4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task_progress"`);
    }

}
