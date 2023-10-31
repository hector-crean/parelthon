use serde::{Deserialize, Serialize};
use strum::{EnumString, EnumVariantNames};

#[derive(Serialize, Deserialize, EnumString, EnumVariantNames, Debug)]
#[strum(serialize_all = "lowercase")]
pub enum OpenAiRole {
    System,
    User,
    Assistant,
    Function,
}
