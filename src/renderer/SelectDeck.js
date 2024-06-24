import { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { Urls } from "../commons/Urls";
import { fetchDeck } from "../commons/DeckLoader";

import './selectDeck.css';

export const SelectDeck = ({ authorization, handleDeckSelectionChange }) => {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  useEffect(() => {
    fetch(`${Urls.api_url}/decks/json?format=json`, {
      headers: {
        'Authorization': `token ${authorization.token}`,
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => setDecks(data.results))
      .catch(error => {
        console.error('There was an error fetching the decks!', error);
      });
  }, [setDecks, authorization]);
  
  useEffect(() => {
    if (selectedDeck) {
      fetchDeck(selectedDeck.id, authorization)
        .then(deck => handleDeckSelectionChange(deck));
    }
  }, [selectedDeck, authorization, handleDeckSelectionChange]);

  const deckThumbnail = ( deck ) => {
    if (deck.commanders.length > 0) {
      return deck.commanders[0].card.image_uris.art_crop;
    }
    return null;
  };

  if (decks.length === 0) {
    return (
      <div className="form-container">
        <div className="form-box">
          <h2>Loading decks...</h2>
        </div>
      </div>
    );
  }
  else 
  {
    return (
      <div className="sd-container">
      <div className="sd-box">
        <h1>Decks</h1>
        <div className="deck-mosaic">
          {decks.map((deck, index) => (
            <div 
              key={index} 
              className="deck" 
              onClick={() => setSelectedDeck(deck)}
            >
              <h2>{deck.name}</h2>
              <img 
                src={deckThumbnail(deck)} 
                alt={`${deck.name} commander`} 
                className="deck-thumbnail"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  }
};


SelectDeck.propTypes = {
  authorization: PropTypes.object.isRequired, 
  handleDeckSelectionChange: PropTypes.func.isRequired
};
