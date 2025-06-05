document.addEventListener("DOMContentLoaded", async function () {
	const pokemonList = await getPokemonList("assets/maxPokemonList.txt");
	const rotation = await getPokemonList("assets/rotation.txt");
	const bossList = await getPokemonList("assets/bossList.txt");
	const upcoming = await getPokemonList("assets/upcoming.txt");

	const filteredList = pokemonList.filter((pokemon) => !pokemon.includes("[UNRELEASED]"));
	const pokemonData = await Promise.all(filteredList.map((pokemon) => pogoAPI2(pokemon)));
	sessionStorage.setItem("storedPokemonData", JSON.stringify(pokemonData));

	//const galleryContainer = document.getElementById("galleryContainer");
	const rotationContainer = document.getElementById("rotation");
	const upcomingContainer = document.getElementById("homeUpcomingContainer");
	/*
	for (const boss of bossList) {
		const bossButton = document.createElement("a");
		bossButton.href = `results.html?boss=${encodeURIComponent(boss)}`;
		bossButton.classList.add("galleryCard");
		bossButton.style.borderColor = "#" + Math.floor(Math.random(1) * 16777215).toString(16);
		const folder = boss.includes("GIGANTAMAX-") ? "gmax" : "dmax";

		bossButton.innerHTML = `<img src="assets/images/${folder}/${boss}.webp" class="galleryCardImg" alt="MaxBattle Image""/>`;

		//galleryContainer.append(bossButton);
	}
*/

	for (const pokemon of rotation) {
		const link = document.createElement("a");
		const name = document.createElement("p");
		const img = document.createElement("img");
		link.href = `results.html?boss=${encodeURIComponent(pokemon)}`;
		const folder = pokemon.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		img.src = `assets/images/${folder}/${pokemon}.webp`;
		name.textContent = `${pokemon}`;
		link.append(img);
		link.append(name);
		rotationContainer.append(link);
	}

	for (pokemon of upcoming) {
		const link = document.createElement("a");

		const card = document.createElement("div");
		const img = document.createElement("img");
		const name = document.createElement("p");

		link.href = `results.html?boss=${encodeURIComponent(pokemon)}`;
		const folder = pokemon.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		name.textContent = `${pokemon.replace("-", " ")}`;
		card.classList.add("card");
		const heading = document.createElement("h1");
		heading.innerText = "Upcoming Boss";

		img.src = `assets/images/${folder}/${pokemon}.webp`;
		card.append(heading);
		card.append(img);
		card.append(name);
		link.append(card);
		upcomingContainer.append(link);
	}
});
