CREATE TABLE "songs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"artist" text NOT NULL,
	"spotify_id" varchar(256) NOT NULL,
	"preview_url" text,
	"image_url" text,
	"danceability" double precision DEFAULT 0 NOT NULL,
	"energy" double precision DEFAULT 0 NOT NULL,
	"loudness" double precision DEFAULT 0 NOT NULL,
	"speechiness" double precision DEFAULT 0 NOT NULL,
	"acousticness" double precision DEFAULT 0 NOT NULL,
	"instrumentalness" double precision DEFAULT 0 NOT NULL,
	"liveness" double precision DEFAULT 0 NOT NULL,
	"valence" double precision DEFAULT 0 NOT NULL,
	"acousticness_artist" double precision DEFAULT 0 NOT NULL,
	"danceability_artist" double precision DEFAULT 0 NOT NULL,
	"energy_artist" double precision DEFAULT 0 NOT NULL,
	"instrumentalness_artist" double precision DEFAULT 0 NOT NULL,
	"liveness_artist" double precision DEFAULT 0 NOT NULL,
	"speechiness_artist" double precision DEFAULT 0 NOT NULL,
	"valence_artist" double precision DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "name_idx" ON "songs" USING btree ("name");--> statement-breakpoint
CREATE INDEX "artist_idx" ON "songs" USING btree ("artist");--> statement-breakpoint
CREATE INDEX "spotify_idx" ON "songs" USING btree ("spotify_id");