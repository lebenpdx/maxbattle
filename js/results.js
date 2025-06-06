window.addEventListener("DOMContentLoaded", async function () {
	const boss = new URLSearchParams(window.location.search).get("boss");
	const storedPokemonData = sessionStorage.getItem("storedPokemonData");
	const pokemonData = JSON.parse(storedPokemonData);
	const bossData = await pogoAPI2(boss);
	finalresults = await generateDamageRankings(pokemonData, bossData);
	const defensecalc = await calculateDefense(bossData, bossData);
	console.log(defensecalc);

	finalresults.forEach((result, i) => {
		const tableTarget = document.getElementById("resultsTable");

		const row = document.createElement("tr");
		const num = document.createElement("td");
		const name = document.createElement("td");
		const damage = document.createElement("td");
		const move = document.createElement("td");
		const folder = result.name.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		const img = document.createElement("img");
		img.src = `assets/images/${folder}/${result.name}.webp`;
		num.append(i + 1);
		name.append(img);
		name.append(result.name);
		damage.innerText = result.damage;
		move.innerText = result.type;
		num.style.textAlign = "center";
		damage.style.textAlign = "center";

		row.append(num);
		row.append(name);
		row.append(damage);
		row.append(move);

		tableTarget.append(row);
	});
});
