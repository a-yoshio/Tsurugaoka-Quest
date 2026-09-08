# Tsurugaoka Quest

鶴岡クエストのモバイルアプリと AWS バックエンドを管理する pnpm monorepo です。

## 使用技術

- Node.js 22 / pnpm 9
- フロントエンド: TypeScript, React Native (Expo SDK 54), `react-native-webview`
- バックエンド: AWS Amplify Gen 2 (AWS AppSync + DynamoDB)
- ツールチェーン: mise

## セットアップ

### 前提

Node.js と pnpm を mise で揃える場合:

```sh
mise install
```

Docker を利用する場合は、イメージの build 時に mise と `mise.toml` で指定した Node.js / pnpm がインストールされます。

```sh
docker build -t tsurugaoka-quest .
docker run --rm -it -p 8081:8081 tsurugaoka-quest
```

### 依存関係のインストール

```sh
pnpm install
```

### 開発

モバイルアプリの開発サーバーを起動します。Expo Go または Android/iOS シミュレーターで確認できます。

```sh
pnpm dev
```

バックエンドを AWS の sandbox 環境へデプロイし、Amplify の outputs を生成します。AWS 認証済みの環境で実行してください。

```sh
pnpm dev:backend
```

### ビルド・テスト

```sh
pnpm build
pnpm test
```

ネイティブ実機・シミュレーター向けのビルドは、依存関係のインストール後に次のコマンドを使用します。

```sh
pnpm --filter @tsurugaoka/mobile android
pnpm --filter @tsurugaoka/mobile ios
```

## ディレクトリ構成

```text
apps/mobile/       React Native アプリ（WebView シェル）
packages/backend/  Amplify Gen 2 の AppSync/DynamoDB 定義
docs/userstory/    ユーザーストーリー
```

Amplify の生成物 (`amplify_outputs.json`) は環境ごとに異なるため、Git 管理対象外です。
