CREATE TABLE "surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"step_one" json NOT NULL,
	"step_two" json NOT NULL,
	"step_three" json NOT NULL,
	"step_four" json NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
