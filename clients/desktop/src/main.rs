// #[tokio::main]
// async fn main() -> Result<(), Error> {
//     Ok(())
// }

use visage_desktop_client::{errors, update_video};

#[tokio::main]
async fn main() -> errors::Result<()> {
    update_video().await?;
    Ok(())
}
