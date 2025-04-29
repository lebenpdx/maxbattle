document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("ivForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const attack = parseInt(document.getElementById("attackIV").value, 10);
        const defense = parseInt(document.getElementById("defenseIV").value, 10);
        const stamina = parseInt(document.getElementById("staminaIV").value, 10);
        const pokemonName = document.getElementById("pokemonName").value.trim().toLowerCase();

        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(response => {
                console.log(`fetching ${pokemonName}`);
                if(!response.ok) {
                    throw new Error("Pokemon not found");
                }
                return response.json();
            })
            .then(data => {
                data.stats.forEach(stat => {
                    console.log(`${stat.stat.name}: ${stat.base_stat}`)
                })
            })
            .catch(error => {
                console.error("Error:",error.message);
            })

        console.log(`${pokemonName} IVs:`, { attack, defense, stamina });
    });
});