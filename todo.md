
We want to create a backend, which can enable the upload of videos/images etc., and then the addition of markup to them.

If we begin with video.

We would like to pin labels to a particular coordinate in the video, and at a particualar timestamp (or over an interval)

We can use markdown, rather than rich text for the comments?
```rust

struct Author {
    name: String,
}

struct Comment {
    author: Author,
    created: Datetine<Utc>,
    updated_at: Datetime<Utc>,
    content: String,
}

struct Point2d {
    x: f32,
    y: f32
}

struct Annotation {
    id: Uuid,
    position: Point2d,
    comment: Comment
}





```

