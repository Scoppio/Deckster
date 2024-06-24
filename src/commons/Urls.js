const ADDR = "localhost";
const PORT = ":8000";

export class Urls {

  static get api_url() {
    return "http://" + ADDR + PORT;
  }

  static get ws_url() {
    return "ws://" + ADDR + PORT;
  }
}