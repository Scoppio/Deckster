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
    
    const art_descriptions = data["art_descriptions"] || {};

    const commanders = [];
    for (const card_quantity of data["commanders"]) {
      for (let i = 0; i < card_quantity.quantity; i++) {
        const card = new Card(card_quantity.card);
        card.art_description = art_descriptions[card.illustration_id] || 'no description';
        commanders.push(card);
      }
    }

    const deck = [];
    for (const card_quantity of data["mainboard"]) {
      for (let i = 0; i < card_quantity.quantity; i++) {
        const card = new Card(card_quantity.card);
        card.art_description = art_descriptions[card.illustration_id] || 'no description';
        deck.push(card);
      }
    }

    return { id, deck, commanders };
  } catch (error) {
    console.error("Error:", error);
  }
};
