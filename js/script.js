document.addEventListener("DOMContentLoaded", async function () {
	const pokemonData = [];

	//const pokemonList = await getPokemonList();
	const pokemonList = ["GIGANTAMAX-GENGAR", "MOLTRES"];

	for (const pokemon of pokemonList) {
		if (pokemon.includes("[UNRELEASED]")) {
			const cleanedPokemon = pokemon.replace("[UNRELEASED]", "");
			continue;
		}
		const data = await pogoAPI2(pokemon);
		pokemonData.push(data);
	}

	function cleanRankings(damageRankings, range) {
		damageRankings.sort((a, b) => b.damage - a.damage);

		return damageRankings.slice(0, range);
	}

	/*
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
*/
	///////////////////////////
	const bossData = await pogoAPI2("GIGANTAMAX-RILLABOOM");
	results = await generateDamageRankings(pokemonData, bossData);
	finalresults = cleanRankings(results, 10);
	console.log(finalresults);
});
