CREATE TABLE "Token" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" bigint NOT NULL,
	"token" text NOT NULL,
	"available" boolean NOT NULL,
	"blocked" boolean NOT NULL,
	"expiryDate" text NOT NULL,
	"createdAt" text NOT NULL,
	"updatedAt" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"isVerified" text NOT NULL,
	"isBlocked" boolean NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
