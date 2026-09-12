FROM ubuntu:stonking

ENV MISE_DATA_DIR=/opt/mise \
    MISE_CONFIG_DIR=/workspace \
    PATH=/opt/mise/shims:/opt/mise/bin:/root/.local/bin:${PATH}

WORKDIR /workspace

RUN apt-get update \
    && apt-get install --no-install-recommends -y ca-certificates curl git build-essential zsh \
    && rm -rf /var/lib/apt/lists/* \
    && curl --proto '=https' --tlsv1.2 -sSf https://mise.run | MISE_INSTALL_PATH=/usr/local/bin/mise sh \
    && mise --version \
    && printf '%s\n' \
       'export PATH="/opt/mise/shims:/opt/mise/bin:/usr/local/bin:$PATH"' \
       'eval "$(mise activate zsh)"' \
       > /etc/zsh/zshrc
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install the exact Node.js and pnpm versions declared by the repository.
COPY mise.toml ./
RUN mise install

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/backend/package.json packages/backend/package.json
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 8081
CMD ["pnpm", "dev", "--", "--host", "0.0.0.0"]
