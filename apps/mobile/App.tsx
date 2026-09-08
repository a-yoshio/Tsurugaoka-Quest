import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const startScreen = `
<!doctype html>
<html lang="ja">
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; background: #101828; color: #f8fafc; font-family: sans-serif; }
      main { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 32px; text-align: center; }
      h1 { margin: 0 0 12px; font-size: 34px; letter-spacing: 3px; }
      p { color: #cbd5e1; margin: 0 0 40px; }
      button { border: 0; border-radius: 12px; padding: 16px 56px; background: #f59e0b; color: #1e293b; font-size: 18px; font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <h1>鶴岡クエスト</h1>
      <p>冒険の準備はできましたか？</p>
      <button id="start" type="button">ゲームを始める</button>
    </main>
    <script>
      document.getElementById("start").addEventListener("click", function () {
        window.ReactNativeWebView.postMessage("start-game");
      });
    </script>
  </body>
</html>
`;

export default function App() {
  const [started, setStarted] = useState(false);
  const handleMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    if (event.nativeEvent.data === "start-game") {
      setStarted(true);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container} testID="mobile-app">
      <StatusBar style="light" />
      <WebView
        originWhitelist={["*"]}
        source={{ html: started ? startScreen.replace("冒険の準備はできましたか？", "ゲームを開始します。") : startScreen }}
        onMessage={handleMessage}
        testID="game-webview"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101828"
  }
});
