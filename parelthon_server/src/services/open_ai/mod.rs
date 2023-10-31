pub mod chat;
pub mod function;
pub mod role;

use chat::{request::ChatCompletionRequest, response::ChatCompletionResponse};
use dotenv::dotenv;
use reqwest::{
    header::{self, HeaderMap, HeaderValue},
    Client,
};

use serde::{Deserialize, Serialize};
use serde_json::json;
use strum::{EnumString, EnumVariantNames};

#[derive(Debug, EnumString)]
enum ChatCompletionModel {
    #[strum(to_string = "gpt-4")]
    GPT4,
    #[strum(to_string = "gpt-4-0613")]
    GPT4_0613,
    #[strum(to_string = "gpt-4-32k")]
    GPT4_32K,
    #[strum(to_string = "gpt-4-32k-0613")]
    GPT4_32K_0613,
    #[strum(to_string = "gpt-3.5-turbo")]
    GPT3_5Turbo,
    #[strum(to_string = "gpt-3.5-turbo-0613")]
    GPT3_5Turbo_0613,
    #[strum(to_string = "gpt-3.5-turbo-16k")]
    GPT3_5Turbo_16K,
    #[strum(to_string = "gpt-3.5-turbo-16k-0613")]
    GPT3_5Turbo_16K_0613,
}

#[derive(thiserror::Error, Debug)]
pub enum OpenAiClientError {
    #[error(transparent)]
    ReqwestError(#[from] reqwest::Error),
}

struct OpenAiClient {
    open_api_key: String,
    client: reqwest::Client,
}

impl OpenAiClient {
    pub fn new(open_api_key: String) -> Self {
        let client = reqwest::Client::new();

        Self {
            client,
            open_api_key,
        }
    }
    pub async fn chat(
        &self,
        req: ChatCompletionRequest,
    ) -> Result<ChatCompletionResponse, OpenAiClientError> {
        // Create a `CreateUser` instance

        let resp = self
            .client
            .post("https://api.openai.com/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", self.open_api_key))
            .header("Content-Type", "application/json")
            .json(&req)
            .send()
            .await?
            .json::<ChatCompletionResponse>()
            .await?;

        Ok(resp)
    }
}

#[cfg(test)]
mod tests {

    use std::env;

    use serde_json::Value;

    use super::{chat::request::ChatCompletionMessage, role::OpenAiRole, *};

    fn open_ai_client() -> OpenAiClient {
        dotenv().ok();

        let open_ai_key = env::var("OPEN_AI_KEY").expect("Failed to get OpenAI key");

        OpenAiClient::new(open_ai_key)
    }

    #[tokio::test]
    async fn basic_chat() -> Result<(), OpenAiClientError> {
        let open_ai = open_ai_client();

        let msgs = vec![
            ChatCompletionMessage {
                role: OpenAiRole::System,
                content: Some(r#"
                You are a Socratic tutor. Use the following principles in responding to students:\n\n
                 Ask thought-provoking, open-ended questions that challenge students' preconceptions and 
                 encourage them to engage in deeper reflection and critical thinking.\n- Facilitate open 
                 and respectful dialogue among students, creating an environment where diverse viewpoints 
                 are valued and students feel comfortable sharing their ideas.\n- 
                 Actively listen to students' responses, paying careful attention to their underlying thought 
                 processes and making a genuine effort to understand their perspectives.\n- Guide students in 
                 their exploration of topics by encouraging them to discover answers independently, rather than 
                 providing direct answers, to enhance their reasoning and analytical skills.\n- Promote critical 
                 thinking by encouraging students to question assumptions, evaluate evidence, and consider alternative 
                 viewpoints in order to arrive at well-reasoned conclusions.\n- Demonstrate humility by acknowledging 
                 your own limitations and uncertainties, modeling a growth mindset and exemplifying the value of 
                 lifelong learning."#.to_string()),
                function_call: None,
                name: None,
            },
            ChatCompletionMessage {
                role: OpenAiRole::User,
                content: Some(
                    "Help me to understand the future of artificial intelligence.".to_string(),
                ),
                function_call: None,
                name: None,
            },
        ];

        let req = ChatCompletionRequest::new("gpt-4".to_string(), msgs)
            .temperature(0.8)
            .max_tokens(1024)
            .top_p(1.)
            .frequency_penalty(0.)
            .presence_penalty(0.);

        println!("{:?}", req);

        let resp = open_ai
            .client
            .post("https://api.openai.com/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", open_ai.open_api_key))
            .header("Content-Type", "application/json")
            .json(&req)
            .send()
            .await?
            .json::<ChatCompletionResponse>()
            .await?;

        Ok(())
    }
}
