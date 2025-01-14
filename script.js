const pokemonList = document.getElementById("pokemon-list");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filter-btn");
const resetButton = document.getElementById("reset");

let allPokemon = [];

async function fetchPokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
    const data = await response.json();
    allPokemon = await Promise.all(
      data.results.map(async (pokemon) => {
        const pokemonData = await fetch(pokemon.url).then((res) => res.json());
        return {
          name: pokemonData.name,
          image: pokemonData.sprites.front_default,
          types: pokemonData.types.map((type) => type.type.name),
          abilities: pokemonData.abilities.map((ability) => ability.ability.name),
        };
      })
    );
    displayPokemon(allPokemon);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

function displayPokemon(pokemonArray) {
  pokemonList.innerHTML = pokemonArray
    .map(
      (pokemon) => `
      <div class="pokemon-card ${pokemon.types[0]}">
        <div class="front">
          <img src="${pokemon.image}" alt="${pokemon.name}" />
          <h3>${pokemon.name}</h3>
        </div>
        <div class="back">
          <p><strong>Types:</strong> ${pokemon.types.join(", ")}</p>
          <p><strong>Abilities:</strong> ${pokemon.abilities.join(", ")}</p>
        </div>
      </div>
    `
    )
    .join("");
}

function filterByType(type) {
  if (type === "all") {
    displayPokemon(allPokemon);
  } else {
    const filteredPokemon = allPokemon.filter((pokemon) =>
      pokemon.types.includes(type)
    );
    displayPokemon(filteredPokemon);
  }
}

function searchPokemon() {
  const query = searchInput.value.toLowerCase();
  const filteredPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query)
  );
  displayPokemon(filteredPokemon);
}

function resetFilters() {
  searchInput.value = "";
  displayPokemon(allPokemon);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.getAttribute("data-type");
    filterByType(type);
  });
});

searchInput.addEventListener("input", searchPokemon);
resetButton.addEventListener("click", resetFilters);

fetchPokemon();