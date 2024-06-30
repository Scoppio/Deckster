import { useEffect, useState, useCallback } from 'react';
import PropTypes from "prop-types";
import { Urls } from '../commons/Urls';

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

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for cards"
        aria-label="Card Search"
      />
      <div>
        <button onClick={() => setTokenFilter(!tokenFilter)}>
          {tokenFilter ? 'Remove Token Filter' : 'Add Token Filter'}
        </button>
      </div>
      <p>{cards.length} Cards found</p>
      <div style={{ maxHeight: '400px', overflowY: 'scroll', marginTop: '10px' }}>
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