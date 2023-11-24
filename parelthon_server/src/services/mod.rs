pub mod comment;
pub mod s3;
pub mod user;
pub mod video;
pub mod segment_anything;

use axum::response::{IntoResponse, Response};
use http::StatusCode;

#[derive(thiserror::Error, Debug)]
pub enum DatabaseError {
    #[error("SQL query error")]
    DatabaseError(#[from] sqlx::Error),
    #[error(transparent)]
    ChronoParseError(#[from] chrono::ParseError),
    #[error("Unknown Error")]
    Unknown,
}

impl IntoResponse for DatabaseError {
    fn into_response(self) -> Response {
        match self {
            DatabaseError::DatabaseError(err) => {
                (StatusCode::INTERNAL_SERVER_ERROR, format!("{}", err)).into_response()
            }
            DatabaseError::ChronoParseError(err) => {
                (StatusCode::INTERNAL_SERVER_ERROR, format!("{}", err)).into_response()
            }
            DatabaseError::Unknown => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Unkown Error".to_string(),
            )
                .into_response(),
        }
    }
}
