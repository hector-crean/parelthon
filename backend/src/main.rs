use aws_sdk_s3::config::{Credentials, Region};
use dotenv::dotenv;
use parelthon_server::services::s3::S3Bucket;
use parelthon_server::{errors, AppState};
use sqlx::postgres::PgPoolOptions;
use std::convert::From;
use tokio::sync::broadcast;

use std::{
    env,
    net::SocketAddr,
    sync::{Arc, Mutex},
};

use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use pbkdf2::password_hash::rand_core::OsRng;
use rand_chacha::ChaCha8Rng;
use rand_core::{RngCore, SeedableRng};

#[tokio::main]
async fn main() -> errors::Result<()> {
    dotenv().ok();

    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .init();

    let port: u16 = 1690;

    let addr = SocketAddr::from(([127, 0, 0, 1], port));

    tracing::debug!("listening on {}", addr);

    let db_url = env::var("DATABASE_URL")?;

    // setup connection pool
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .expect("can't connect to database");

    let aws_key = std::env::var("AWS_ACCESS_KEY_ID").expect("Failed to get AWS key.");
    let aws_key_secret =
        std::env::var("AWS_SECRET_ACCESS_KEY").expect("Failed to get AWS secret key.");
    let s3_region = std::env::var("AWS_REGION").unwrap_or("eu-west-2".to_string());
    let aws_bucket = std::env::var("S3_BUCKET_NAME").expect("Failed to get AWS Bucket key");
    let aws_config = aws_sdk_s3::config::Builder::new()
        .region(Region::new(s3_region.clone()))
        .credentials_provider(Credentials::new(
            aws_key,
            aws_key_secret,
            None,
            None,
            "loaded-from-custom-env",
        ))
        .build();

    let bucket = S3Bucket::new(aws_config, &s3_region, &aws_bucket);

    let random = ChaCha8Rng::seed_from_u64(OsRng.next_u64());

    let router = AppState::new(pool, bucket, Arc::new(Mutex::new(random)))
        .router()
        .await?;

    let server = axum::Server::bind(&addr)
        .serve(router.into_make_service_with_connect_info::<SocketAddr>())
        .await?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    use axum::Json;
    use parelthon_models::user::User;

    use parelthon_models::user::{CreateUser, CreateUserResponse};
    use parelthon_models::video::{CreateVideoFromFilePath, Video};
    use parelthon_server::services::s3::S3Bucket;
    use serde_json::json;
    use std::net::SocketAddr;
    use std::path::PathBuf;

    // for `call`
    // for `oneshot` and `ready`

    async fn router_instance() -> errors::Result<(SocketAddr, axum::Router)> {
        dotenv().ok();

        let addr = SocketAddr::from(([127, 0, 0, 1], 1699));

        let db_url = env::var("DATABASE_URL").unwrap(); // Unwrap here for simplicity in tests

        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&db_url)
            .await
            .expect("can't connect to the database");

        let aws_key = std::env::var("AWS_ACCESS_KEY_ID").expect("Failed to get AWS key.");
        let aws_key_secret =
            std::env::var("AWS_SECRET_ACCESS_KEY").expect("Failed to get AWS secret key.");
        let s3_region = std::env::var("AWS_REGION").unwrap_or("eu-west-2".to_string());
        let aws_bucket = std::env::var("S3_BUCKET_NAME").expect("Failed to get AWS Bucket key");
        let aws_config = aws_sdk_s3::config::Builder::new()
            .region(Region::new(s3_region.clone()))
            .credentials_provider(Credentials::new(
                aws_key,
                aws_key_secret,
                None,
                None,
                "loaded-from-custom-env",
            ))
            .build();

        let bucket = S3Bucket::new(aws_config, &s3_region, &aws_bucket);

        let random = ChaCha8Rng::seed_from_u64(OsRng.next_u64());

        let router = AppState::new(pool, bucket, Arc::new(Mutex::new(random)))
            .router()
            .await?;

        Ok((addr, router))
    }

    #[tokio::test]
    async fn mock_create_user() -> errors::Result<()> {
        dotenv().ok();

        let (addr, router) = router_instance().await?;

        tokio::spawn(async move {
            axum::Server::bind(&addr)
                .serve(router.into_make_service())
                .await
                .unwrap();
        });

        let client = reqwest::Client::new();

        // Create a `CreateUser` instance
        let user: CreateUser = rand::random();

        let CreateUserResponse {
            session_token: _,
            user_id: _,
        } = client
            .post(format!("http://{}/v1/api/users", addr))
            .json(&json!(user))
            .send()
            .await?
            .json::<CreateUserResponse>()
            .await?;

        assert_eq!(1, 1);

        Ok(())
    }

    #[tokio::test]
    async fn mock_list_users() -> errors::Result<()> {
        dotenv().ok();

        let (addr, router) = router_instance().await?;

        tokio::spawn(async move {
            axum::Server::bind(&addr)
                .serve(router.into_make_service())
                .await
                .unwrap();
        });

        let client = reqwest::Client::new();

        let users = client
            .get(format!("http://{}/v1/api/users", addr))
            .send()
            .await?
            .json::<Vec<User>>()
            .await?;

        assert_eq!(1, 1);

        Ok(())
    }

    #[tokio::test]
    async fn mock_create_video() -> errors::Result<()> {
        dotenv().ok();

        let (addr, router) = router_instance().await?;

        tokio::spawn(async move {
            axum::Server::bind(&addr)
                .serve(router.into_make_service())
                .await
                .unwrap();
        });

        let client = reqwest::Client::new();

        let path = PathBuf::from(
            r"C:\Users\Hector.C\rust\parelthon\backend\src\test_assets\video\hero-loop.mp4",
        );

        // Create a `CreateUser` instance
        let create_video = CreateVideoFromFilePath {
            title: "test_video".to_string(),
            description: None,
            path_buf: path,
        };

        let resp = client
            .post(format!("http://{}/v1/api/video", addr))
            .json(&json!(create_video))
            .send()
            .await?
            .json::<Video>()
            .await?;

        tracing::debug!("{:?}", resp);

        Ok(())
    }
}

// create user
// create post
//
