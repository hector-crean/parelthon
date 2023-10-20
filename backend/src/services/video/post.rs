use crate::{services::s3::S3Error, AppState};
use axum::{
    extract::State,
    response::{IntoResponse, Json, Response},
};
use chrono::{DateTime, NaiveDate, Utc};
use http::StatusCode;
use parelthon_models::video::{CreateVideo, Video};
use sqlx::query_as;
use tokio::sync::broadcast::error::SendError;
use uuid::Uuid;

#[derive(thiserror::Error, Debug)]
pub enum CreateVideoError {
    #[error(transparent)]
    SqlxError(#[from] sqlx::Error),
    #[error(transparent)]
    S3Error(#[from] S3Error),
}

impl IntoResponse for CreateVideoError {
    fn into_response(self) -> axum::response::Response {
        match self {
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Unkown Error".to_string(),
            )
                .into_response(),
        }
    }
}

pub async fn create_video(
    State(state): State<AppState>,
    Json(CreateVideo {
        title,
        description,
        path_buf,
    }): Json<CreateVideo>,
) -> Result<Json<Video>, CreateVideoError> {
    let mut trans = state.pool.begin().await?;

    let s3_key = Uuid::new_v4().to_string();

    let s3_url = state
        .bucket
        .upload_object(path_buf, format!("{}", &s3_key).as_str())
        .await?;

    let video_id = Uuid::new_v4();

    let dt = chrono::offset::Utc::now();

    let video = query_as!(
        Video,
        r#"INSERT INTO video (video_id, title, description, s3_key, s3_url, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"#,
        video_id,
        title,
        description,
        s3_key,
        s3_url,
        dt,
        dt
    )
    .fetch_one(&mut *trans)
    .await?;

    tracing::debug!("create video: {:?}", video);

    // Commit the transaction since both operations succeeded
    trans.commit().await?;

    Ok(Json(video))
}
