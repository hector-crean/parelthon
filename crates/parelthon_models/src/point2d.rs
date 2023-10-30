#[derive(
    Debug, serde::Serialize, serde::Deserialize, sqlx::Type, Clone, PartialEq, sqlx::FromRow,
)]
#[sqlx(type_name = "point2d")]
pub struct Point2D {
    pub x: f32,
    pub y: f32,
}
