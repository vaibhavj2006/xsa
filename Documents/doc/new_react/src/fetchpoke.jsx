import React, { useEffect, useState } from 'react';
import Header from './Header.jsx';
import './index.css';

const Pokemon = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [allTypes, setAllTypes] = useState([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
      .then(res => res.json())
      .then(data => {
        const urls = data.results.map(p => p.url);
        return Promise.all(urls.map(url => fetch(url).then(res => res.json())));
      })
      .then(allPokemonData => {
        const cleaned = allPokemonData.map(p => ({
          name: p.name,
          id: p.id,
          types: p.types.map(t => t.type.name),
          imageUrl: p.sprites.front_default
        }));

        const uniqueTypes = new Set(cleaned.flatMap(p => p.types));
        setAllTypes(['All', ...Array.from(uniqueTypes)]);
        setPokemonList(cleaned);
        setFilteredList(cleaned);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let list = [...pokemonList];

    if (searchTerm) {
      list = list.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (typeFilter !== 'All') {
      list = list.filter(p => p.types.includes(typeFilter));
    }

    setFilteredList(list);
  }, [searchTerm, typeFilter, pokemonList]);

  if (loading) return <p className="status-text">Loading Pokémon...</p>;
  if (error) return <p className="status-text error">Error: {error}</p>;

  return (
    <div className="container">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        allTypes={allTypes}
      />

      {filteredList.length === 0 ? (
        <p className="status-text">No Pokémon match your search.</p>
      ) : (
        <div className="pokemon-grid">
          {filteredList.map((pokemon) => (
            <div key={pokemon.id} className="card">
              <img className="img" src={pokemon.imageUrl} alt={pokemon.name} />
              <p className="p">name - {pokemon.name}</p>
              <p className="p">type - {pokemon.types.join(', ')}</p>
              <p className="p">ID number - {pokemon.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pokemon;
