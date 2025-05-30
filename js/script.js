document.addEventListener("DOMContentLoaded", async function () {
	const pokemonData = [];

	const pokemonList = await getPokemonList("assets/maxPokemonList.txt");
	const bossList = await getPokemonList("assets/bossList.txt");

	for (const pokemon of pokemonList) {
		if (pokemon.includes("[UNRELEASED]")) {
			const cleanedPokemon = pokemon.replace("[UNRELEASED]", "");
			continue;
		}
		const data = await pogoAPI2(pokemon);
		pokemonData.push(data);
	}

	const bossSelectionContainer = document.getElementById("bossSelectionContainer");

	for (const boss of bossList) {
		const bossButton = document.createElement("button");
		bossButton.textContent = `${boss}`;
		bossButton.style.display = "block";
		bossButton.addEventListener("click", async () => {
			resultsContainer.innerHTML = "";
			const bossData = await pogoAPI2(boss);
			results = await generateDamageRankings(pokemonData, bossData);
			finalresults = cleanRankings(results, 10);
			for (result of finalresults) {
				const newResult = document.createElement("div");
				newResult.textContent = result.name + "" + result.damage + result.type;
				resultsContainer.append(newResult);
			}
		});
		bossSelectionContainer.append(bossButton);
	}
});
