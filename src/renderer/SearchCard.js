import { useEffect, useState, useCallback } from 'react';
import PropTypes from "prop-types";
import { Urls } from '../commons/Urls';
// import { useQuery } from '@tanstack/react-query';

import './searchCard.css';


export const SearchCard = ({ 
  gameState
}) => {
  
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [tokenFilter, setTokenFilter] = useState(false);

  const fetchCards = useCallback(async () => {
    try {
      const url = `${Urls.api_url}/cards/search?starts_with_name=${encodeURIComponent(query)}${tokenFilter ? '&type=token' : ''}`;
      const response = await fetch(url,
        {headers: {
          'Authorization': `token ${gameState.authorization.token}`,
          'Content-Type': 'application/json'
        },}
      );
      const data = await response.json();
      setCards(data.content);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  }, [query, tokenFilter, gameState]);

  useEffect(() => {
    if (query.length > 0) {
      fetchCards();
    }
  }, [query, fetchCards]);

  const handleEntrySelected = async (card) => {
    console.log('Selected card:', card);
    const url = `${Urls.api_url}/card/${card.id}`;
    const response = await fetch(url,
      {headers: {
        'Authorization': `token ${gameState.authorization.token}`,
        'Content-Type': 'application/json'
      },}
    );
    const data = await response.json();
    const cards = gameState.createCardInstances([data]);
    gameState.addCardsToBattlefield(cards);
    gameState.changeAppState("game");
  };

  const closeSearchScreen = () => {
    gameState.changeAppState("game");
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <div>
          <label style={{ marginRight: '20px' }}>Search for card:</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for cards"
            aria-label="Input card name to search for"
            style={{ marginRight: '20px' }}
          />
          <button onClick={() => setTokenFilter(!tokenFilter)} style={{ marginRight: '20px' }}>
            {tokenFilter ? 'Remove Token Filter' : 'Add Token Filter'}
          </button>
          <button onClick={closeSearchScreen}>
            Close
          </button>
          </div>
        <p>{cards.length} Cards found</p>
      </div>
      <div style={{ maxHeight: 'auto', overflowY: 'scroll', marginTop: '10px' }}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            tabIndex={index}
            onClick={() => handleEntrySelected(card)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEntrySelected(card);
              }
            }}
            style={{ padding: '5px', borderBottom: '1px solid #ccc', cursor: 'pointer' }}
          >
            {card.name} - {card.tset}
          </div>
        ))}
      </div>
    </div>
  );
};

SearchCard.propTypes = {
  gameState: PropTypes.object.isRequired
};