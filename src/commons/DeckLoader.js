import { Card } from "../commons/Card";
import { Urls } from "./Urls";


export const fetchDeck = async (id, authorization) => {
  try {
    const response = await fetch(`${Urls.api_url}/vtt/deck/${id}/json?format=json`, {
      headers: {
        'Authorization': `token ${authorization.token}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const commanders = [];
    for (const card_quantity of data["commanders"]) {
      for (let i = 0; i < card_quantity.quantity; i++) {
        const card = new Card(card_quantity.card);
        commanders.push(card);
      }
    }

    const deck = [];
    for (const card_quantity of data["mainboard"]) {
      for (let i = 0; i < card_quantity.quantity; i++) {
        const card = new Card(card_quantity.card);
        deck.push(card);
      }
    }

    const sideboard = [];
    for (const card_quantity of data["sideboard"]) {
      for (let i = 0; i < card_quantity.quantity; i++) {
        const card = new Card(card_quantity.card);
        sideboard.push(card);
      }
    }

    return { id, deck, commanders, sideboard };
  } catch (error) {
    console.error("Error:", error);
  }
};
