use crate::{services::s3::S3Error, AppState};
use axum::{
    extract::State,
    response::{IntoResponse, Json, Response},
};
use http::StatusCode;
use tokio::sync::broadcast::error::SendError;
use uuid::Uuid;
use visage_models::video::{CreateVideo, Video};

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

    let s3_key = Uuid::new_v4();

    let s3_url = state
        .bucket
        .upload_object(path_buf, format!("{}", &s3_key).as_str())
        .await?;

    let video = sqlx::query_as::<_, Video>(
            r#"insert into "video"(title, description, s3_key, s3_url) values ($1, $2, $3, $4) returning *"#,
        )
        .bind(title)
        .bind(description)
        .bind(s3_key)
        .bind(s3_url)
        .fetch_one(&mut *trans)
        .await?;

    tracing::debug!("create bike: {:?}", video);

    // Commit the transaction since both operations succeeded
    trans.commit().await?;

    Ok(Json(video))
}
