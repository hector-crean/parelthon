-- Add migration script here
-- Add up migration script here
create extension if not exists "uuid-ossp";

-- User
create type role as enum ('user', 'superuser', 'admin', 'moderator');

-- create type point2d as (x real, y real);
create table "user" (
    user_id uuid primary key not null default (uuid_generate_v4()),
    username varchar(100) not null unique,
    email text not null,
    password_hash text not null,
    role role default 'user',
    updated_at timestamp with time zone default now() not null
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
    s3_key varchar(255) not null,
    s3_url varchar(255) not null,
    updated_at timestamp with time zone default now() not null,
    created_at timestamp with time zone default now() not null
);

-- Create the video comment table
create table if not exists video_comment (
    comment_id uuid primary key not null default (uuid_generate_v4()),
    user_id uuid references "user"(user_id) on delete cascade,
    video_id uuid references video(video_id) on delete cascade,
    updated_at timestamp with time zone default now() not null,
    created_at timestamp with time zone default now() not null,
    screen_x real not null,
    screen_y real not null,
    start_time real not null,
    end_time real,
    comment_text text NOT NULL
);