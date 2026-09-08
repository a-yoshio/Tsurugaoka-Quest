FROM debian:bookworm-slim

ENV MISE_DATA_DIR=/opt/mise \
    MISE_CONFIG_DIR=/workspace \
    PATH=/opt/mise/shims:/opt/mise/bin:/root/.local/bin:${PATH}

WORKDIR /workspace

RUN apt-get update \
    && apt-get install --no-install-recommends -y ca-certificates curl git build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && curl --proto '=https' --tlsv1.2 -sSf https://mise.run | sh

# Install the exact Node.js and pnpm versions declared by the repository.
COPY mise.toml ./
RUN mise install

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/backend/package.json packages/backend/package.json
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 8081
CMD ["pnpm", "dev", "--", "--lan"]
