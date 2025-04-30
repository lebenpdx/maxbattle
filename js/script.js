document.addEventListener("DOMContentLoaded", async function () {
	console.clear();
	const form = document.getElementById("ivForm");

	async function fetchCPM(level) {
		try {
			const response = await fetch("assets/CPM.json");
			if (!response.ok) {
				throw new Error("Bad CPM Fetch");
			}
			const data = await response.json();
			const levelData = data.find((object) => object.Level === level).CPM;

			return levelData;
		} catch (error) {
			console.error(`CPM Error`);
		}
	}

	testCPM = await fetchCPM(40);
	console.log(testCPM);

	form.addEventListener("submit", async function (event) {
		event.preventDefault();

		const attackIV = parseInt(document.getElementById("attackIV").value, 10);
		const defenseIV = parseInt(document.getElementById("defenseIV").value, 10);
		const staminaIV = parseInt(document.getElementById("staminaIV").value, 10);
		const pokemonName = document.getElementById("pokemonName").value.trim().toLowerCase();

		let baseHP = 0,
			baseAttack = 0,
			baseDefense = 0,
			baseSpAttack = 0,
			baseSpDefense = 0,
			baseSpeed = 0;

		try {
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
			if (!response.ok) {
				throw new Error("Pokemon not found");
			}

			const data = await response.json();

			data.stats.forEach((stat) => {
				switch (stat.stat.name) {
					case "hp":
						baseHP = stat.base_stat;
						break;
					case "attack":
						baseAttack = stat.base_stat;
						break;
					case "defense":
						baseDefense = stat.base_stat;
						break;
					case "special-attack":
						baseSpAttack = stat.base_stat;
						break;
					case "special-defense":
						baseSpDefense = stat.base_stat;
						break;
					case "speed":
						baseSpeed = stat.base_stat;
						break;
				}
			});
		} catch (error) {
			console.error("Error:", error.message);
		}

		let scaledAttack = Math.round(2 * ((7 / 8) * Math.max(baseAttack, baseSpAttack) + (1 / 8) * Math.min(baseAttack, baseSpAttack)));
		let speedMod = 1 + (baseSpeed - 75) / 500;
		let goAttack = Math.round(scaledAttack * speedMod);
		//console.log(`goAttack: ${goAttack}`);

		let scaledDefense = Math.round(2 * ((5 / 8) * Math.max(baseDefense, baseSpDefense) + (3 / 8) * Math.min(baseDefense, baseSpDefense)));
		let goDefense = Math.round(scaledDefense * speedMod);
		//console.log(`goDefense: ${goDefense}`);

		let goStamina = Math.floor(baseHP * (7 / 4) + 50);
		//console.log(`goStamina: ${goStamina}`);

		let Attack = goAttack + attackIV;
		let Defense = goDefense + defenseIV;
		let Stamina = goStamina + staminaIV;

		let trueAttack = Attack * testCPM;
		let trueDefense = Defense * testCPM;
		let trueStamina = Stamina * testCPM;

		document.getElementById("calcAttack").innerText = `Attack: ${Math.floor(trueAttack)}`;
		document.getElementById("calcDefense").innerText = `Defense: ${Math.floor(trueDefense)}`;
		document.getElementById("calcStamina").innerText = `Stamina: ${Math.floor(trueStamina)}`;
	});
});
