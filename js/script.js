document.addEventListener("DOMContentLoaded", async function () {
	const pokemonData = [];

	const pokemonList = await getPokemonList("assets/maxPokemonList.txt");
	const bossList = await getPokemonList("assets/bossList.txt");

	for (const pokemon of pokemonList) {
		if (pokemon.includes("[UNRELEASED]")) {
			//const cleanedPokemon = pokemon.replace("[UNRELEASED]", "");
			continue;
		}
		const data = await pogoAPI2(pokemon);
		pokemonData.push(data);
	}
	sessionStorage.setItem("storedPokemonData", JSON.stringify(pokemonData));
	const bossSelectionContainer = document.getElementById("bossSelectionContainer");

	for (const boss of bossList) {
		const bossButton = document.createElement("a");
		bossButton.href = `results.html?boss=${encodeURIComponent(boss)}`;
		bossButton.innerHTML = `<img src="assets/images/gmax/GIGANTAMAX-ALCREMIE.png" alt="MaxBattle Image" id="bossImg" style="width: 50px; height: 50px;"/>`;

		bossSelectionContainer.append(bossButton);
	}
});
