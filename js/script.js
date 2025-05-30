document.addEventListener("DOMContentLoaded", async function () {
	const pokemonData = [];

	const pokemonList = await getPokemonList();
	//const pokemonList = ["GIGANTAMAX-INTELEON"];

	for (const pokemon of pokemonList) {
		const data = await pogoAPI2(pokemon);
		pokemonData.push(data);
	}

	async function generateDamageRankings(pokemonData, bossData) {
		const damageRankings = [];

		for (pokemon of pokemonData) {
			data = await calculateDamage(pokemon, bossData);
			for (entry of data) {
				damageRankings.push(entry);
			}
		}
		damageRankings.sort((a, b) => b.damage - a.damage);
		return damageRankings;
	}

	async function calculateDamage(pokemon, boss) {
		let damage = 0;
		const result = [];
		let typeEffectivenessMultiplier = 1;
		let STAB = 1;
		const CPM = 0.7903; //Level 40 CPM for base testing
		const bossCPM = 0.84529999; //Bosses have level 51 scaling

		if (pokemon.gmax) {
			const Power = 350;
			typeEffectivenessMultiplier = await calculateEffectiveness([pokemon.type[0]], boss.type);
			STAB = 1.2;
			damage = Math.floor(0.5 * Power * ((pokemon.attack * CPM) / (boss.defense * bossCPM)) * STAB * typeEffectivenessMultiplier) + 1;
			result.push({
				name: `${pokemon.name}`,
				damage: `${damage}`,
				type: `${pokemon.type[0]}`,
				stab: STAB,
				mult: typeEffectivenessMultiplier,
			});
		} else {
			const Power = 250;
			typeEffectivenessMultiplier = await calculateEffectiveness(pokemon.quickMoves, boss.type);
			for (const [i, moveType] of pokemon.quickMoves.entries()) {
				STAB = pokemon.type.includes(moveType) ? 1.2 : 1;
				damage = Math.floor(0.5 * Power * ((pokemon.attack * CPM) / (boss.defense * bossCPM)) * STAB * typeEffectivenessMultiplier[i]) + 1;
				result.push({
					name: `${pokemon.name}`,
					damage: `${damage}`,
					type: `${moveType}`,
					stab: STAB,
					mult: typeEffectivenessMultiplier[i],
				});
			}
		}

		//console.log(result);
		return result;
	}

	/////////////////////////////////////////////////
	const form = document.getElementById("userPokemon");

	const bossSelect = document.getElementById("bossName");
	const bossImg = document.getElementById("bossImg");
	bossSelect.selectedIndex = 0;

	bossSelect.addEventListener("change", () => {
		//const selectedOption = bossSelect.options[bossSelect.selectedIndex];
		const bossName = bossSelect.value;
		const isGmax = bossSelect.options[bossSelect.selectedIndex].hasAttribute("data-g");
		const folder = isGmax ? "gmax" : "dmax";
		bossImg.src = `assets/images/${folder}/${bossName}.png`;

		if (!bossImg.src) {
			bossImg.src = "assets/images/placeholder.png";
		}
	});

	form.addEventListener("submit", async function (event) {
		event.preventDefault();
		console.clear();

		//Put off for later. For now we assume the IVs are at the floor of 10
		const attackIV = 10;
		const defenseIV = 10;
		const staminaIV = 10;

		//Pull from forms
		const select = document.getElementById("pokemonName");
		const pokemonName = select.value.trim();
		const bossName = document.getElementById("bossName").value.trim();
		const pokemonLevel = document.getElementById("pokemonLevel").value.trim();
		const maxAttackLevel = document.getElementById("maxAttackLevel").value.trim();
		const isGmax = select.options[select.selectedIndex].hasAttribute("data-g");

		CPM = await fetchCPM(parseFloat(pokemonLevel));

		document.getElementById("calcAttack").innerText = `Attack: ${Math.floor(userAttack)}`;
		document.getElementById("calcDefense").innerText = `Defense: ${Math.floor(userDefense)}`;
		document.getElementById("calcStamina").innerText = `Stamina: ${Math.floor(userStamina)}`;

		userMoves = await getMoves(pokemonName, isGmax);
		console.log(userMoves);

		const damageDiv = document.getElementById("maxDamage");
		damageDiv.innerHTML = "<h3>Damage</h3>";
		damage.forEach((damages, i) => {
			const result = document.createElement("p");
			result.innerText = `${userMoves[i]}: ${damages}`;
			damageDiv.appendChild(result);
		});

		const bestType = userMoves[damage.indexOf(Math.max(...damage))];
		const bestTypeElement = document.createElement("p");
		bestTypeElement.innerHTML = `<strong>Best Damage Type: ${bestType}</strong>`;
		damageDiv.appendChild(bestTypeElement);
	});

	///////////////////////////
	const bossData = await pogoAPI2("GIGANTAMAX-RILLABOOM");
	results = await generateDamageRankings(pokemonData, bossData);
	console.log(results);
});
