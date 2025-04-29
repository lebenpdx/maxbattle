document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("ivForm");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const attack = parseInt(document.getElementById("attackIV").value, 10);
        const defense = parseInt(document.getElementById("defenseIV").value, 10);
        const stamina = parseInt(document.getElementById("staminaIV").value, 10);
        const pokemonName = document.getElementById("pokemonName").value.trim().toLowerCase();

        let baseHP=0, baseAttack=0, baseDefense=0,baseSpAttack=0, baseSpDefense=0, baseSpeed=0;



        try {
            const response = await fetch(`https://pogoapi.net/api/v1/pokemon_stats.json`);
            if(!response.ok) {
                throw new Error("Stat Fetch Error");
            }
            const data = await response.json();
            const pokemon = Object.values(data).find(p => p.pokemon_name.toLowerCase() === pokemonName)
            if(!pokemon){
                throw new Error(`${pokemonName} not found`)
            }
            console.log(pokemon);

            const fastResponse = await fetch("https://pogoapi.net/api/v1/fast_moves.json");
            if(!response.ok) {
                throw new Error("Fast Move Fetch Error");
            }
            const fastData = await fastResponse.json();
            console.log(fastData)

        } catch(error) {
                console.error("Error:",error.message);
        }

        console.log("HP:", baseHP);
        console.log("Attack", baseAttack);
        console.log("Defense", baseDefense);
        console.log("SpAttack", baseSpAttack);
        console.log("SpDefense", baseSpDefense);
        console.log("Speed", baseSpeed)
        console.log(`${pokemonName} IVs:`, { attack, defense, stamina });

        let scaledAttack = Math.round(2 * ((7/8)*Math.max(baseAttack,baseSpAttack) + (1/8)*Math.min(baseAttack,baseSpAttack)));
        let speedMod = 1 + (baseSpeed - 75) / 500
        let goAttack = Math.round(scaledAttack * speedMod);
        console.log(`goAttack: ${goAttack}`)

        let scaledDefense = Math.round(2 * ((5/8) * Math.max(baseDefense,baseSpDefense) + (3/8) * Math.min(baseDefense,baseSpDefense)))
        let goDefense = Math.round(scaledDefense * speedMod);
        console.log(`goDefense: ${goDefense}`);
        
        let goStamina = Math.floor(baseHP * (7/4) + 50);
        console.log(`goStamina: ${goStamina}`)
    });
});