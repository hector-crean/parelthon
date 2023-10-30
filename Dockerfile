# Set up a build environment
FROM messense/rust-musl-cross:x86_64-musl as chef
ENV SQLX_OFFLINE=true
RUN cargo install cargo-chef

RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates && \
    update-ca-certificates

WORKDIR /rebibe

# Prepare for caching dependencies
FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json --bin parelthon_server

# Build the dependencies
FROM chef AS builder
COPY --from=planner /rebibe/recipe.json recipe.json
RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json --bin parelthon_server
COPY . .
# Build the application.
RUN cargo build -p parelthon_server --release --target x86_64-unknown-linux-musl 

# Create the final minimal image
FROM scratch
# Adjust the copy path based on where the binaries end up
COPY --from=builder /rebibe/target/x86_64-unknown-linux-musl/release/parelthon_server /parelthon_server
# Copy the CA certificates from the build stage to the final image
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
ENTRYPOINT ["/parelthon_server"]
EXPOSE 3000
