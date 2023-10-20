use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::point2d::Point2D;

#[derive(Debug, sqlx::FromRow, Deserialize, Serialize)]
struct VideoComment {
    comment_id: Uuid,
    user_id: Option<Uuid>,
    video_id: Option<Uuid>,
    start_time: f64,
    end_time: Option<f64>,
    updated_at: chrono::DateTime<chrono::Utc>,
    coordinates: Point2D,
    comment_text: String,
    created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CreateVideoComment {
    user_id: Uuid,
    markdown: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GetVideoComment {
    pub comment_id: Uuid,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct UpdateVideoComment {
    pub comment_id: Uuid,
    pub markdown: String,
}
