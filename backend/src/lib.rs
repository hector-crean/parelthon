pub mod authentication;
pub mod csv_ops;
pub mod errors;
pub mod services;

use axum::{
    routing::{get, post},
    Router,
};
use http::Method;
use visage_models::random::Random;

use services::{
    s3::S3Bucket,
    user::{self, get::get_users},
    video::{self},
};
use sqlx::{Pool, Postgres};
use tokio::sync::broadcast;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::{DefaultMakeSpan, DefaultOnResponse, TraceLayer},
};
use tracing::Level;

const USER_COOKIE_NAME: &str = "user_token";
const COOKIE_MAX_AGE: &str = "9999999";

#[derive(Clone)]
pub struct AppState {
    pool: Pool<Postgres>,
    bucket: S3Bucket,
    random: Random,
}

impl AppState {
    pub fn new(pool: Pool<Postgres>, bucket: S3Bucket, random: Random) -> Self {
        Self {
            pool,
            bucket,
            random,
        }
    }

    pub async fn router(self) -> errors::Result<axum::Router> {
        let trace_layer = TraceLayer::new_for_http()
            .make_span_with(DefaultMakeSpan::new().level(Level::INFO))
            .on_response(DefaultOnResponse::new().level(Level::INFO));

        sqlx::migrate!("./migrations").run(&self.pool).await?;

        let cors_layer = CorsLayer::new()
            // allow `GET` and `POST` when accessing the resource
            .allow_methods([Method::GET, Method::POST])
            // allow requests from any origin
            .allow_origin(Any);

        let router = Router::new()
            .layer(cors_layer)
            .layer(trace_layer)
            .route("/users", post(user::post::create_user).get(get_users))
            .route("/video", post(video::post::create_video))
            .with_state(self);

        let api = Router::new().nest("/:version/api", router);

        Ok(api)
    }
}
