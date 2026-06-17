import { MigrationInterface, QueryRunner } from "typeorm";

export class Tracks1781703653162 implements MigrationInterface {
    name = 'Tracks1781703653162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "short" character varying NOT NULL, "type" character varying NOT NULL, "goal" text NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "priority" integer NOT NULL DEFAULT '0', "progress" integer, "cadence" character varying, "streak" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tracks"`);
    }

}
