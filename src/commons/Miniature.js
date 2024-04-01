import { Utils } from './Utils';


export class Miniature {
  constructor(mini) {
    this._uid = mini._uid || Utils.random_id_str;
    this.name = mini.name;
    this.image_uris = mini.image_uris;
  }

  get image_uri() {
    return this.image_uris.img;
  }
}
