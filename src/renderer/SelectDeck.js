import { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { Urls } from "../commons/Urls";
import { fetchDeck } from "../commons/DeckLoader";
import { useQuery } from '@tanstack/react-query';

import './selectDeck.css';

export const SelectDeck = ({ authorization, handleDeckSelectionChange }) => {

  const [selectedDeck, setSelectedDeck] = useState(null);
  const [tab, setTab] = useState('user');

  const tabs = ['user', 'public', 'precon'];

  const fetchDecks = async () => {
    const response = await fetch(`${Urls.api_url}/vtt/decks`, {
      headers: {
        'Authorization': `token ${authorization.token}`,
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data.decks;
  };

  const { data, isLoading, isError } = useQuery({ queryKey: ['deck'], queryFn: fetchDecks });

  useEffect(() => {
    if (selectedDeck) {
      fetchDeck(selectedDeck.id, authorization)
        .then(deck => handleDeckSelectionChange(deck));
    }
  }, [selectedDeck, authorization, handleDeckSelectionChange]);

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

  const getDeckArtCrop = (deck) => {
      if (deck.face_commander.image_uris)
        return deck.face_commander.image_uris.art_crop;
      return deck.face_commander.card_faces[0].image_uris.art_crop;
  };

  return (
    <div className="sd-container">
    <div className="sd-box">
      <h1>Decks</h1>
      <div className="tabs" style={{display: 'flex', justifyContent: 'space-around'}}>
        {tabs.map((_tab) => (
          <div 
            key={_tab} 
            className={`tab ${_tab === tab ? 'active' : ''}`} 
            tabIndex={"0"}
            onClick={() => setTab(_tab)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setTab(_tab);
              }
            }}  
          >
            {_tab}
          </div>
        ))}
      </div>
      <div className="deck-mosaic">
        {data[tab].map((deck) => (
          <div 
            key={deck.id} 
            className="deck" 
            tabIndex={"0"}
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
              src={getDeckArtCrop(deck)}
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
