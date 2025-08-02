document.addEventListener("DOMContentLoaded", async function () {
	const pokemonList = await getPokemonList("../assets/maxPokemonList.txt");
	//const pokemonList = await getPokemonList("../assets/allPokemon.txt");

	const dynamax = await getPokemonList("../assets/dynamaxPokemonList.txt");
	const upcoming = await getPokemonList("../assets/upcoming.txt");
	const allGigantamax = await getPokemonList("../assets/gigatamaxPokemonList.txt");
	const unreleasedPokemon = await getPokemonList("../assets/unreleasedPokemonList.txt");

	const filteredList = pokemonList.filter((pokemon) => !pokemon.includes("[UNRELEASED]"));
	const pokemonData = await Promise.all(filteredList.map((pokemon) => pogoAPI(pokemon)));
	sessionStorage.setItem("storedPokemonData", JSON.stringify(pokemonData));

	const upcomingContainer = document.getElementById("homeUpcomingContainer");
	const dynamaxGallery = document.getElementById("dynamaxGallery");
	const gigantamaxGallery = document.getElementById("gigantamaxGallery");
	const unreleasedGallery = document.getElementById("unreleasedGallery");

	for (const pokemon of allGigantamax) {
		const gigantamaxItem = document.createElement("a");
		const name = document.createElement("p");
		const img = document.createElement("img");

		gigantamaxItem.href = `results.html?boss=${encodeURIComponent(pokemon)}`;
		gigantamaxItem.classList.add("galleryItem");

		const folder = pokemon.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		img.src = `../assets/images/${folder}/${pokemon}.webp`;
		name.textContent = `${pokemon.replace("GIGANTAMAX-", " ").replaceAll("_", " ")}`;

		gigantamaxItem.append(img);
		gigantamaxItem.append(name);
		gigantamaxGallery.append(gigantamaxItem);
	}

	for (const pokemon of dynamax) {
		const dynamaxItem = document.createElement("a");
		const name = document.createElement("p");
		const img = document.createElement("img");

		dynamaxItem.href = `results.html?boss=${encodeURIComponent(pokemon)}`;
		dynamaxItem.classList.add("galleryItem");

		const folder = pokemon.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		img.src = `../assets/images/${folder}/${pokemon}.webp`;
		name.textContent = `${pokemon}`;

		dynamaxItem.append(img);
		dynamaxItem.append(name);
		dynamaxGallery.append(dynamaxItem);
	}

	for (const pokemon of unreleasedPokemon) {
		const gigantamaxItem = document.createElement("a");
		const name = document.createElement("p");
		const img = document.createElement("img");
		img.classList.add("grayscale");

		gigantamaxItem.href = `results.html?boss=${encodeURIComponent(pokemon)}`;
		gigantamaxItem.classList.add("galleryItem");

		const folder = pokemon.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		img.src = `../assets/images/${folder}/${pokemon}.webp`;
		name.textContent = `${pokemon.replace("GIGANTAMAX-", " ").replaceAll("_", " ")}`;

		gigantamaxItem.append(img);
		gigantamaxItem.append(name);
		unreleasedGallery.append(gigantamaxItem);
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
		heading.innerText = "Upcoming Event";

		img.src = `../assets/images/${folder}/${pokemon}.webp`;
		card.append(heading);
		card.append(img);
		card.append(name);
		link.append(card);
		upcomingContainer.append(link);
	}
});
