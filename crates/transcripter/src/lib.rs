extern crate pest;
#[macro_use]
extern crate pest_derive;

use pest::{iterators::Pairs, Parser};
use std::num::{ParseFloatError, ParseIntError};

pub mod transcript_tokenizer {
    #[derive(Parser)]
    #[grammar = "grammars/transcript.pest"]
    pub struct TranscriptParser;
}

#[derive(thiserror::Error, Debug)]
pub enum TranscriptDeserialiseError {
    #[error(transparent)]
    TranscriptPestError(pest::error::Error<transcript_tokenizer::Rule>),
    #[error(transparent)]
    ParseIntError(ParseIntError),
}

type Seconds = i32;

pub struct TranscriptInterval {
    start: Seconds,
    end: Seconds,
    content: String,
}

pub struct TranscriptFile;

impl TranscriptFile {
    pub fn deserialisation(
        pairs: Pairs<transcript_tokenizer::Rule>,
    ) -> Result<Vec<TranscriptInterval>, TranscriptDeserialiseError> {
        use transcript_tokenizer::Rule;

        let mut records: Vec<TranscriptInterval> = vec![];
        let mut last_end_time = 0;

        for pair in pairs {
            match pair.as_rule() {
                Rule::transcript => {
                    for file_item in pair.into_inner() {
                        match file_item.as_rule() {
                            Rule::line => {
                                let mut total_seconds = None;
                                let mut content = String::new();

                                for line in file_item.into_inner() {
                                    match line.as_rule() {
                                          Rule::hours => {
                                            let hour = line.into_inner().map(|num| num.as_str().parse::<i32>());

                                        }
                                         Rule::minutes => {}
                                        Rule::seconds => {

                                            
                                            total_seconds = total_seconds.map(|t| t + )
                                        }
                                        Rule::text => {
                                            content = line.as_str().to_string();
                                        }
                                        _ => {}
                                    }
                                }

                                if let Some(start_time) = timestamp {
                                    let interval = TranscriptInterval {
                                        start: start_time,
                                        end: last_end_time,
                                        content,
                                    };
                                    last_end_time = start_time;
                                    records.push(interval);
                                }
                            }
                            _ => unreachable!(),
                        }
                    }
                }
                _ => unreachable!(),
            }
        }

        Ok(records)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use pest::Parser;
    use transcript_tokenizer::TranscriptParser;

    static TRANSCRIPT: &str = include_str!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/assets/transcript-1.txt"
    ));

    #[test]
    fn test_parse_single_line() {
        let raw_input = "[00:01:30] Example text content\n";
        let pairs = TranscriptParser::parse(transcript_tokenizer::Rule::transcript, raw_input)
            .expect("Failed to parse");

        let intervals = TranscriptFile::deserialisation(pairs).expect("Failed to deserialize");

        assert_eq!(intervals.len(), 1);
        assert_eq!(intervals[0].start, 90);
        assert_eq!(intervals[0].end, 0);
        assert_eq!(intervals[0].content, "Example text content");
    }

    #[test]
    fn test_parse_multiple_lines() {
        let raw_input = "[00:01:30] First line\n[00:02:00] Second line\n";
        let pairs = TranscriptParser::parse(transcript_tokenizer::Rule::transcript, raw_input)
            .expect("Failed to parse");

        let intervals = TranscriptFile::deserialisation(pairs).expect("Failed to deserialize");

        assert_eq!(intervals.len(), 2);
        assert_eq!(intervals[0].start, 90);
        assert_eq!(intervals[0].end, 0);
        assert_eq!(intervals[0].content, "First line");
        assert_eq!(intervals[1].start, 120);
        assert_eq!(intervals[1].end, 90);
        assert_eq!(intervals[1].content, "Second line");
    }

    // Add more tests here to cover edge cases, error handling, etc.
}
