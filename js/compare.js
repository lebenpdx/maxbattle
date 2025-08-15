window.addEventListener("DOMContentLoaded", async function () {
	const storedPokemonData = sessionStorage.getItem("storedPokemonData");
	const pokemonData = JSON.parse(storedPokemonData);
	const bossData = await pogoAPI("ETERNATUS");

	addPokemonSelectorListener("compare1Pokemon", "compare1ImgPlaceholder", pokemonData);
	addPokemonSelectorListener("compare2Pokemon", "compare2ImgPlaceholder", pokemonData);

	addInputListener("compare1", pokemonData, bossData);
	addInputListener("compare2", pokemonData, bossData);

	createOptions(pokemonData);
	console.log(bossData);
	console.log(pokemonData);
});

function addInputListener(containerID, pokemonData, bossData) {
	const target = document.getElementById(`${containerID}InputContainer`);
	target.addEventListener("input", async function () {
		const pokemon = pokemonData.find((pokemonData) => pokemonData.name === document.getElementById(`${containerID}Pokemon`).value);
		const damage = await calculateDamage(pokemon, bossData, Number(document.getElementById(`${containerID}Attack`).value));
		console.log(damage);
		console.log(bossData.defense);
	});
}

function addPokemonSelectorListener(selectElement, imgElement, pokemonData) {
	const target = document.getElementById(selectElement);

	target.addEventListener("change", function () {
		const pokemon = pokemonData.find((pokemonData) => pokemonData.name === target.value);
		const folder = target.value.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		const img = document.createElement("img");
		const imgTarget = document.getElementById(imgElement);
		img.src = `../assets/images/${folder}/${target.value}.webp`;
		imgTarget.innerHTML = "";
		imgTarget.appendChild(img);
	});
}

function createOptions(pokemonData) {
	console.log("run");
	const compare1Pokemon = document.getElementById("compare1Pokemon");
	const compare2Pokemon = document.getElementById("compare2Pokemon");

	const options = pokemonData.map((pokemon) => {
		const option = document.createElement("option");
		option.value = pokemon.name;
		option.textContent = pokemon.name;
		return option;
	});

	options.forEach((option) => compare1Pokemon.appendChild(option));
	options.forEach((option) => compare2Pokemon.appendChild(option.cloneNode(true)));
}
