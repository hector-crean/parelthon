use uuid::Uuid;

pub struct VideoLabel {
    label_id: Uuid,
    position: (f32, f32),
    //does it need to be an interval?
    timestamp: f32,
    comment_id: Uuid,
}

struct ImageLabel {
    label_id: Uuid,
    position: (f32, f32),
    comment_id: Uuid,
}
