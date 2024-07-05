const ADDR = "abstractobserver.studio";
const PORT = "";

export class Urls {

  static get api_url() {
    return "http://" + ADDR + PORT;
  }

  static get ws_url() {
    return "ws://" + ADDR + PORT;
  }
}