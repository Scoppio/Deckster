const cardColors = {
    green: "#3d8253", 
    black: "#0f1306", 
    red: "#9e2e20", 
    blue: "#01a0c0",
    white: "#ddd7db", 
    colorless: "#b0bcc3",
    multicolor: "#d6c574",
}

export class Card {
    constructor(name, cost, type, text) {
        this._uid = Math.floor(Math.random() * 1000000) + ""
        this.name = name
        this.cost = cost
        // Random card color
        this.color = Object.keys(cardColors)[Math.floor(Math.random() * 7)]
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