import { render } from "@testing-library/react-native";
import App from "./App";

jest.mock("react-native-webview", () => ({
  WebView: "WebView"
}));

describe("App", () => {
  it("renders the WebView game shell", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("game-webview")).toBeTruthy();
  });
});
