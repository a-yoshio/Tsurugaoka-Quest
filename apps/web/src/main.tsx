import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="start-screen">
      <section className="start-card" aria-labelledby="game-title">
        <p className="eyebrow">TSURUOKA ADVENTURE</p>
        <h1 id="game-title">TSURUGAOKA QUEST</h1>
        <p className="lead">鶴岡のまちを舞台にした冒険へようこそ。</p>
        <button type="button" onClick={() => alert("ゲームを開始します。")}>
          ゲームを始める
        </button>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
