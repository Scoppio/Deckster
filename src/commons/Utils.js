export class Utils {
  static get random_id_str () {
    return Math.floor(Math.random() * 1000000) + "";
  }

  static get random_id () {
    return Math.floor(Math.random() * 1000000);
  }
}