use std::str::FromStr;

use pest::iterators::Pair;
use pest::{iterators::Pairs, Parser};
use serde::{Deserialize, Serialize};
use transcripter::transcript_tokenizer;

fn main() -> () {
    let input = include_str!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/assets/transcript-1.txt"
    ));

    let pairs = transcript_tokenizer::TranscriptParser::parse(
        transcript_tokenizer::Rule::transcript,
        input,
    )
    .expect("unsuccessful parse");

    // let proteins = Protein::deserialisation(pairs);
}
