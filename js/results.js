window.addEventListener("DOMContentLoaded", async function () {
	const boss = new URLSearchParams(window.location.search).get("boss");
	const storedPokemonData = this.sessionStorage.getItem("storedPokemonData");
	const pokemonData = JSON.parse(storedPokemonData);
	const galleryContainer = document.getElementById("galleryContainer");
	const bossData = await pogoAPI2(boss);
	finalresults = await generateDamageRankings(pokemonData, bossData);
	for (result of finalresults) {
		const newResult = document.createElement("div");
		newResult.className = "tempResult";
		newResult.style.backgroundColor = "#" + Math.floor(Math.random(1) * 16777215).toString(16);

		const folder = result.name.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		const img = document.createElement("img");
		img.src = `assets/images/${folder}/${result.name}.webp`;
		img.style.width = "100%";
		img.classList.add("galleryImg");

		const pokemonName = document.createElement("h3");
		pokemonName.textContent = result.name;

		const bestType = document.createElement("p");
		bestType.textContent = `Best Attack ${result.type}`;

		const damage = document.createElement("p");
		damage.textContent = `Damage: ${result.damage}`;

		newResult.classList.add("gallery");
		newResult.append(img);
		newResult.append(pokemonName);
		newResult.append(bestType);
		newResult.append(damage);

		galleryContainer.append(newResult);
	}
});
