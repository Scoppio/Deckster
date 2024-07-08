import { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { Urls } from "../commons/Urls";
import { fetchDeck } from "../commons/DeckLoader";
import { useQuery } from '@tanstack/react-query';

import './selectDeck.css';

export const SelectDeck = ({ authorization, handleDeckSelectionChange }) => {

  const [selectedDeck, setSelectedDeck] = useState(null);

  const fetchDecks = async () => {
    const response = await fetch(`${Urls.api_url}/decks/json?format=json`, {
      headers: {
        'Authorization': `token ${authorization.token}`,
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data.results;
  };

  const { data, isLoading, isError } = useQuery({ queryKey: ['decks'], queryFn: fetchDecks });

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
  
  if (isLoading) {
    return (
      <div className="form-container">
        <div className="form-box">
          <h2>Loading decks...</h2>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="form-container">
        <div className="form-box">
          <h2>Error loading decks...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="sd-container">
    <div className="sd-box">
      <h1>Decks</h1>
      <div className="deck-mosaic">
        {data.map((deck) => (
          <div 
            key={deck.id} 
            className="deck" 
            tabIndex={"1"}
            aria-label={`${deck.name} - ${deck.description}`}
            onClick={() => setSelectedDeck(deck)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setSelectedDeck(deck);
              }
            }}
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
  
};


SelectDeck.propTypes = {
  authorization: PropTypes.object.isRequired, 
  handleDeckSelectionChange: PropTypes.func.isRequired
};
