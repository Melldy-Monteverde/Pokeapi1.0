const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";

// === CARGA INICIAL DE TODOS LOS POKÉMON ===
(async function cargarTodos() {
    const promesas = [];
    for (let i = 1; i <= 1025; i++) {
        promesas.push(obtenerPokemon(i));
    }
    
    const pokemons = await Promise.all(promesas);
    
    pokemons.forEach((data) => {
        if (data) mostrarPokemon(data);
    });
})();

// === FUNCIÓN ASÍNCRONA PARA OBTENER DATOS ===
async function obtenerPokemon(id) {
    try {
        const response = await fetch(`${URL}${id}`);
        if (!response.ok) throw new Error(`Error al obtener Pokémon ${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// === FUNCIÓN PARA MOSTRAR CADA POKÉMON ===
function mostrarPokemon(poke) {
    let tipos = poke.types
        .map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`)
        .join("");
    
    let pokeId = poke.id.toString().padStart(3, "0");
    
    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
    <p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-imagen">
      <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
    </div>
    <div class="pokemon-info">
      <div class="nombre-contenedor">
        <p class="pokemon-id">#${pokeId}</p>
        <h2 class="pokemon-nombre">${poke.name}</h2>
      </div>
      <div class="pokemon-tipos">
        ${tipos}
      </div>
      <div class="pokemon-stats">
        <p class="stat">${poke.height}m</p>
        <p class="stat">${poke.weight}kg</p>
      </div>
    </div>
  `;
    listaPokemon.append(div);
}

// === EVENTOS DE LOS BOTONES DE FILTRO ===
botonesHeader.forEach((boton) =>
    boton.addEventListener("click", async (event) => {
        const botonId = event.currentTarget.id;
        listaPokemon.innerHTML = "";
        
        // Cargar solo los primeros 151 Pokémon (Generación 1)
        const promesas = [];
        for (let i = 1; i <= 1025; i++) {
            promesas.push(obtenerPokemon(i));
        }
        
        const pokemons = await Promise.all(promesas);
        
        pokemons.forEach((data) => {
            if (!data) return;
            
            if (botonId === "ver-todos") {
                mostrarPokemon(data);
            } else {
                const tipos = data.types.map((type) => type.type.name);
                if (tipos.includes(botonId)) {
                    mostrarPokemon(data);
                }
            }
        });
    })
);