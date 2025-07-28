window.addEventListener("DOMContentLoaded", async function () {
	const boss = new URLSearchParams(window.location.search).get("boss");
	const storedPokemonData = sessionStorage.getItem("storedPokemonData");
	const pokemonData = JSON.parse(storedPokemonData);
	const bossData = await pogoAPI(boss);
	const attackResults = await generateDamageRankings(pokemonData, bossData);
	const defenseResults = await generateDefenseRankings(pokemonData, bossData);
	//	console.log(attackResults);
	console.log(defenseResults);
	console.log(bossData);

	function injectBoss(boss) {
		const card = document.createElement("div");
		const img = document.createElement("img");

		const folder = boss.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		card.classList.add("card");
		const heading = document.createElement("h1");
		heading.innerText = `${boss.replace("-", " ").replaceAll("_", " ")}`;

		img.src = `../assets/images/${folder}/${boss}.webp`;
		card.append(heading);
		card.append(img);

		selectedBossContainer.append(card);
	}

	async function injectAbout(boss) {
		const target = document.getElementById("about");
		const div = document.createElement("div");
		try {
			const response = await fetch(`../assets/about/${boss}.txt`);
			const content = await response.text();
			div.innerHTML = content;
			target.append(div);
		} catch (error) {
			console.error("Error:", error.message);
		}
	}

	injectBoss(boss);
	injectAbout(boss);
	attackResults.forEach((result, i) => {
		if (i >= 50) {
			return;
		}
		const tableTarget = document.getElementById("resultsTable");

		const row = document.createElement("tr");
		const num = document.createElement("td");
		const name = document.createElement("td");
		const damage = document.createElement("td");
		const move = document.createElement("td");
		const type = this.document.createElement("td");
		const folder = result.name.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		const img = document.createElement("img");
		img.src = `../assets/images/${folder}/${result.name}.webp`;
		num.append(i + 1);
		name.append(img);
		name.append(result.name.replaceAll("_", " "));
		damage.innerText = result.damage;
		move.innerText = result.move;
		type.innerText = result.type;
		num.style.textAlign = "center";
		damage.style.textAlign = "center";

		row.append(num);
		row.append(name);
		row.append(damage);
		row.append(move);
		row.append(type);

		tableTarget.append(row);
	});

	defenseResults.forEach((result, i) => {
		if (i >= 50) {
			return;
		}
		const tableTarget = document.getElementById("defenseTable");

		const row = document.createElement("tr");
		const num = document.createElement("td");
		const name = document.createElement("td");
		const hits = document.createElement("td");
		const folder = result.name.includes("GIGANTAMAX-") ? "gmax" : "dmax";
		const img = document.createElement("img");
		img.src = `../assets/images/${folder}/${result.name}.webp`;
		num.append(i + 1);
		name.append(img);
		name.append(result.name.replaceAll("_", " "));
		hits.innerText = result.hits;
		num.style.textAlign = "center";
		hits.style.textAlign = "center";

		row.append(num);
		row.append(name);
		row.append(hits);

		tableTarget.append(row);
	});

	document.querySelector(".tablinks").click();
});

// https://www.w3schools.com/howto/howto_js_tabs.asp
function openTable(evt, cityName) {
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabContent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(cityName).style.display = "block";
	evt.currentTarget.className += " active";
}
