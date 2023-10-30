use std::{
    io::Read,
    path::{Path, PathBuf},
};

use crate::{services::s3::S3Error, AppState};
use axum::{
    extract::State,
    response::{IntoResponse, Json, Response},
};
use axum_typed_multipart::{FieldData, TryFromMultipart, TypedMultipart};
use chrono::{DateTime, NaiveDate, Utc};
use geo_types::coord;
use http::StatusCode;
use parelthon_models::{
    comment::{CreateVideoComment, VideoComment},
    point2d::Point2D,
    video::{CreateVideoFromFilePath, Video},
};
use sqlx::query_as;
use tempfile::{NamedTempFile, PersistError};
use tokio::sync::broadcast::error::SendError;
use uuid::Uuid;

#[derive(thiserror::Error, Debug)]
pub enum CreateCommentError {
    #[error(transparent)]
    SqlxError(#[from] sqlx::Error),
}

impl IntoResponse for CreateCommentError {
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

//https://github.com/launchbadge/sqlx/blob/main/examples/postgres/axum-social-with-tests/src/http/post/comment.rs

pub async fn create_comment(
    State(state): State<AppState>,
    Json(video_comment): Json<CreateVideoComment>,
) -> Result<Json<VideoComment>, CreateCommentError> {
    let mut trans = state.pool.begin().await?;

    tracing::info!("create user: {:?}", &video_comment);

    let CreateVideoComment {
        video_id,
        user_id,
        comment_text,
        coordinates,
        start_time,
        end_time,
    } = video_comment;

    let comment = query_as!(
        VideoComment,
        r#"
            insert into video_comment(user_id, video_id, comment_text, start_time, end_time, screen_x, screen_y)
            values ($1, $2, $3, $4, $5, $6, $7)
            returning *
        "#,
        user_id,
        video_id,
        comment_text,
        start_time,
        end_time,
        coordinates.x,
        coordinates.y,
    )
    .fetch_one(&mut *trans)
    .await?;

    // Commit the transaction since both operations succeeded
    trans.commit().await?;

    Ok(Json(comment))
}
