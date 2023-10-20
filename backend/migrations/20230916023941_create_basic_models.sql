-- Add migration script here
-- Add up migration script here






create extension if not exists "uuid-ossp";

create extension if not exists "postgis";

-- User
create type role as enum ('user', 'superuser', 'admin', 'moderator');

create type point2d  as ( x real, y real);


create table "user" (
    user_id uuid primary key not null default (uuid_generate_v4()),
    username varchar(100) not null unique,
    email text not null,
    password_hash text not null,
    role role default 'user',
    updated_at timestamp with time zone default now()
);

create table if not exists session (
    session_token BYTEA PRIMARY KEY,
    user_id uuid references "user"(user_id) on delete cascade
);



-- Create the video table
create table if not exists video (
    video_id uuid primary key not null default (uuid_generate_v4()),
    title varchar(255) not null,
    description text,
    updated_at timestamp with time zone default now(),
    created_at timestamp with time zone default now()
);

-- Create the video comment table
create table if not exists video_comment (
    comment_id uuid primary key not null default (uuid_generate_v4()),
    user_id uuid references "user"(user_id) on delete cascade,
    video_id uuid REFERENCES video(video_id) on delete cascade,
    start_time real not null,
    end_time real,
    updated_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    coordinates point2d NOT NULL,
    comment_text text NOT NULL
);

