const ADDR = "abstractobserver.studio";
const PORT = "";

// const ADDR = "localhost";
// const PORT = ":8000";

export class Urls {

  static get api_url() {
    return "https://" + ADDR + PORT;
  }

  static get ws_url() {
    return "wss://" + ADDR + PORT;
  }
}