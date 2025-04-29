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
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            if(!response.ok) {
                throw new Error("Pokemon not found");
            }
        
            const data = await response.json();

                data.stats.forEach(stat => {
                    switch(stat.stat.name) {
                        case 'hp':
                            baseHP = stat.base_stat;
                            break;
                        case 'attack':
                            baseAttack=stat.base_stat;
                            break;
                        case 'defense':
                            baseDefense=stat.base_stat;
                            break;
                        case 'special-attack':
                            baseSpAttack = stat.base_stat;
                            break;
                        case 'special-defense':
                            baseSpDefense = stat.base_stat;
                            break;
                        case 'speed':
                            baseSpeed = stat.base_stat;
                            break;
                    }
                })
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

        let scaledAttack = Math.round(2*((7/8)*Math.max(baseAttack,baseSpAttack) + (1/8)*Math.min(baseAttack,baseSpAttack)));
        let speedMod = 1 + (baseSpeed - 75) / 500
        let goAttack = Math.round(scaledAttack * speedMod);
        console.log(`goAttack: ${goAttack}`)

    });
});