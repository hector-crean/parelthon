use crate::AppState;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Json},
};
use http::StatusCode;
use parelthon_models::video::{GetVideo, Video};
use uuid::Uuid;

#[derive(thiserror::Error, Debug)]
pub enum GetVideoError {
    #[error(transparent)]
    SqlxError(#[from] sqlx::Error),
}

impl IntoResponse for GetVideoError {
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

pub async fn get_video(
    State(state): State<AppState>,
    Path((api_id, video_id)): Path<(String, Uuid)>,
) -> Result<Json<Video>, GetVideoError> {
    let video = sqlx::query_as::<_, Video>(r#"select * from "video" where video_id = $1"#)
        .bind(video_id)
        .fetch_one(&state.pool)
        .await?;

    tracing::debug!("video: {:?}", &video);

    Ok(Json(video))
}

pub async fn get_videos(State(state): State<AppState>) -> Result<Json<Vec<Video>>, GetVideoError> {
    let videos = sqlx::query_as::<_, Video>(r#"select * from "video" "#)
        .fetch_all(&state.pool)
        .await?;

    tracing::debug!("videos {:?}", &videos);

    Ok(Json(videos))
}
