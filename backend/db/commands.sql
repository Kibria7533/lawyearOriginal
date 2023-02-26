CREATE DATABASE dissier_database;
ALTER TABLE "public"."users" ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
--\c into dissier_database

CREATE TABLE user{
    id SERIAL PRIMARY KEY,
    user_id CHARACTER
    email: CHARACTER
    pass CHARACTER
}