pub mod authentication;
pub mod csv_ops;
pub mod errors;
pub mod services;

use axum::{
    extract::DefaultBodyLimit,
    routing::{get, post},
    Router,
};
use http::{header::CONTENT_TYPE, Method};
use parelthon_models::random::Random;

use services::{
    comment::{
        get::{get_comment_by_id, get_comments, get_comments_by_video_id},
        post::create_comment,
    },
    s3::S3Bucket,
    user::{self, get::get_users},
    video::{
        self,
        get::{get_video, get_videos},
    },
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
        let http_trace_layer = TraceLayer::new_for_http()
            .make_span_with(
                DefaultMakeSpan::new()
                    .level(Level::INFO)
                    .level(Level::DEBUG),
            )
            .on_response(
                DefaultOnResponse::new()
                    .level(Level::INFO)
                    .level(Level::DEBUG),
            );

        sqlx::migrate!("./migrations").run(&self.pool).await?;

        let cors_layer = CorsLayer::new()
            // allow `GET` and `POST` when accessing the resource
            .allow_methods([Method::GET, Method::POST])
            // allow requests from any origin
            .allow_origin(Any)
            .allow_headers([CONTENT_TYPE]);

        let router = Router::new()
            .route("/users", post(user::post::create_user).get(get_users))
            .route(
                "/videos",
                post(video::post::create_video_multipart).get(get_videos),
            )
            .route("/videos/:video_id", get(get_video))
            .route("/videos/:video_id/comments", get(get_comments_by_video_id))
            .route("/comments", post(create_comment))
            .with_state(self);

        let api = Router::new()
            .nest("/:version/api", router)
            .layer(DefaultBodyLimit::max(1024 * 1024 * 1024))
            .layer(CorsLayer::permissive())
            .layer(http_trace_layer);
        Ok(api)
    }
}
