use crate::AppState;

use axum::{extract::State, response::Json};
use parelthon_models::video::{GetVideo, Video};

pub async fn get_video(
    State(state): State<AppState>,
    Json(GetVideo { video_id }): Json<GetVideo>,
) -> Result<Json<Video>, sqlx::Error> {
    let video = sqlx::query_as::<_, Video>(r#"select * from "video" where video_id = $1"#)
        .bind(video_id)
        .fetch_one(&state.pool)
        .await?;

    tracing::debug!("update bike status: {:?}", &video);

    Ok(Json(video))
}
