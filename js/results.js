window.addEventListener("DOMContentLoaded", async function () {
	const boss = new URLSearchParams(window.location.search).get("boss");
	const storedPokemonData = this.sessionStorage.getItem("storedPokemonData");
	const pokemonData = JSON.parse(storedPokemonData);
	const resultsContainer = document.getElementById("resultsContainer");
	const bossData = await pogoAPI2(boss);
	finalresults = await generateDamageRankings(pokemonData, bossData);

	for (result of finalresults) {
		const newResult = document.createElement("div");
		newResult.className = "tempResult";

		const folder = result.name.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		const img = document.createElement("img");
		img.src = `assets/images/${folder}/${result.name}.png`;
		img.alt = "placeholder";
		img.style.width = "100%";
		img.style.height = "auto";

		const pokemonName = document.createElement("h3");
		pokemonName.textContent = result.name;

		const bestType = document.createElement("p");
		bestType.textContent = `Best Attack ${result.type}`;

		const damage = document.createElement("p");
		damage.textContent = `Damage: ${result.damage}`;

		newResult.className = "tempResult";
		newResult.append(img);
		newResult.append(pokemonName);
		newResult.append(bestType);
		newResult.append(damage);

		resultsContainer.append(newResult);
	}
});
