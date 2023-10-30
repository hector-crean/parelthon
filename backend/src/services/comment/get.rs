use crate::AppState;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Json},
};
use http::StatusCode;
use parelthon_models::comment::VideoComment;
use uuid::Uuid;

#[derive(thiserror::Error, Debug)]
pub enum GetCommentError {
    #[error(transparent)]
    SqlxError(#[from] sqlx::Error),
}

impl IntoResponse for GetCommentError {
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

pub async fn get_comment_by_id(
    State(state): State<AppState>,
    Path((api_id, comment_id)): Path<(String, Uuid)>,
) -> Result<Json<VideoComment>, GetCommentError> {
    let comment =
        sqlx::query_as::<_, VideoComment>(r#"select * from "comment" where comment_id = $1"#)
            .bind(comment_id)
            .fetch_one(&state.pool)
            .await?;

    tracing::debug!("comment: {:?}", &comment);

    Ok(Json(comment))
}

pub async fn get_comments(
    State(state): State<AppState>,
) -> Result<Json<Vec<VideoComment>>, GetCommentError> {
    let comments = sqlx::query_as::<_, VideoComment>(r#"select * from "comment" "#)
        .fetch_all(&state.pool)
        .await?;

    tracing::debug!("comments {:?}", &comments);

    Ok(Json(comments))
}

pub async fn get_comments_by_video_id(
    State(state): State<AppState>,
    Path((api_id, video_id)): Path<(String, Uuid)>,
) -> Result<Json<Vec<VideoComment>>, GetCommentError> {
    let comments = sqlx::query_as!(
        VideoComment,
        r#"SELECT * from "video_comment" where video_id = $1"#,
        video_id,
    )
    .fetch_all(&state.pool)
    .await?;

    tracing::debug!("comments {:?}", &comments);

    Ok(Json(comments))
}
