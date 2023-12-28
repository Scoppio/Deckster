export class Card {
    constructor(name, cost, type, text) {
        this._uid = Math.floor(Math.random() * 1000000) + ""
        this.name = name
        this.cost = cost
        this.type = type
        this.text = text
        this.flavourText = "flavour text"
        this.extraDescription = "extra description  "
        this.cardInfo = "info"
        this.author = "author"
        this.copyRight = "copyright"
        this.description = "description"
        this.artUrl = "https://image.ibb.co/fqdLEn/nissa.jpg"
        this.setIconUrl = "https://image.ibb.co/kzaLjn/OGW_R.png"
        this.setAlt = "OGW-icon"
    }
}