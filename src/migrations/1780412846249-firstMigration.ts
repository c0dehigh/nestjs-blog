import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1780412846249 implements MigrationInterface {
    name = 'FirstMigration1780412846249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "meta_option" ("id" SERIAL NOT NULL, "metaValue" json NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "postId" integer, CONSTRAINT "REL_b492d76365f19dffc4d60a7f86" UNIQUE ("postId"), CONSTRAINT "PK_59e834d6ba39bd9bd7c99b8805d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "slug" character varying(256) NOT NULL, "description" text, "schema" text, "featuredImageUrl" character varying(1024), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "dateLedAt" TIMESTAMP, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "UQ_3413aed3ecde54f832c4f44f045" UNIQUE ("slug"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."post_posttype_enum" AS ENUM('post', 'page', 'story', 'series')`);
        await queryRunner.query(`CREATE TYPE "public"."post_status_enum" AS ENUM('draft', 'scheduled', 'review', 'published')`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying(512) NOT NULL, "postType" "public"."post_posttype_enum" NOT NULL DEFAULT 'post', "slug" character varying(256) NOT NULL, "status" "public"."post_status_enum" NOT NULL DEFAULT 'draft', "content" text, "schema" text, "featuredImageUrl" character varying(1024), "publishOn" TIMESTAMP, "authorId" integer, CONSTRAINT "UQ_cd1bddce36edc3e766798eab376" UNIQUE ("slug"), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying(96) NOT NULL, "lastName" character varying(96) NOT NULL, "email" character varying(96) NOT NULL, "password" character varying(96), "googleId" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."upload_type_enum" AS ENUM('image')`);
        await queryRunner.query(`CREATE TABLE "upload" ("id" SERIAL NOT NULL, "name" character varying(1024) NOT NULL, "path" character varying(1024) NOT NULL, "type" "public"."upload_type_enum" NOT NULL DEFAULT 'image', "mime" character varying(128) NOT NULL, "size" character varying(128) NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_tags_tag" ("postId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_e9b7b8e6a07bdccb6a954171676" PRIMARY KEY ("postId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b651178cc41334544a7a9601c4" ON "post_tags_tag" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_41e7626b9cc03c5c65812ae55e" ON "post_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "meta_option" ADD CONSTRAINT "FK_b492d76365f19dffc4d60a7f863" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_tags_tag" ADD CONSTRAINT "FK_b651178cc41334544a7a9601c45" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_tags_tag" ADD CONSTRAINT "FK_41e7626b9cc03c5c65812ae55e8" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_tags_tag" DROP CONSTRAINT "FK_41e7626b9cc03c5c65812ae55e8"`);
        await queryRunner.query(`ALTER TABLE "post_tags_tag" DROP CONSTRAINT "FK_b651178cc41334544a7a9601c45"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "meta_option" DROP CONSTRAINT "FK_b492d76365f19dffc4d60a7f863"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_41e7626b9cc03c5c65812ae55e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b651178cc41334544a7a9601c4"`);
        await queryRunner.query(`DROP TABLE "post_tags_tag"`);
        await queryRunner.query(`DROP TABLE "upload"`);
        await queryRunner.query(`DROP TYPE "public"."upload_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TYPE "public"."post_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."post_posttype_enum"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "meta_option"`);
    }

}
