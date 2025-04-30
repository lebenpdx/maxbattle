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

	form.addEventListener("submit", async function (event) {
		event.preventDefault();
		//Variable Declaration
		let baseHP = 0,
			baseAttack = 0,
			baseDefense = 0,
			baseSpAttack = 0,
			baseSpDefense = 0,
			baseSpeed = 0;
		(attackTypes = []), (bossTypes = []);

		//Put off for later. For now we assume the 0 IV's and level 40
		const attackIV = 0;
		const defenseIV = 0;
		const staminaIV = 0;
		const level = 40;
		//const attackIV = parseInt(document.getElementById("attackIV").value, 10);
		//const defenseIV = parseInt(document.getElementById("defenseIV").value, 10);
		//const staminaIV = parseInt(document.getElementById("staminaIV").value, 10);

		//Pull from forms
		const pokemonName = document.getElementById("pokemonName").value.trim().toLowerCase();
		const bossName = document.getElementById("bossName").value.trim().toLowerCase();

		//Precomputation
		CPM = await fetchCPM(level);

		//Attacker Info
		try {
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
			if (!response.ok) {
				throw new Error("Pokemon not found");
			}

			const data = await response.json();
			console.log(data);
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

			attackTypes = data.types.map((typeInfo) => typeInfo.type.name);
			console.log(`${pokemonName} types: ${attackTypes}`);
		} catch (error) {
			console.error("Error:", error.message);
		}

		let speedMod = 1 + (baseSpeed - 75) / 500;

		let trueAttack = (Math.round(Math.round(2 * ((7 / 8) * Math.max(baseAttack, baseSpAttack) + (1 / 8) * Math.min(baseAttack, baseSpAttack))) * speedMod) + attackIV) * CPM;
		let trueDefense = (Math.round(Math.round(2 * ((5 / 8) * Math.max(baseDefense, baseSpDefense) + (3 / 8) * Math.min(baseDefense, baseSpDefense))) * speedMod) + defenseIV) * CPM;
		let trueStamina = (Math.floor(baseHP * (7 / 4) + 50) + staminaIV) * CPM;

		document.getElementById("calcAttack").innerText = `Attack: ${Math.floor(trueAttack)}`;
		document.getElementById("calcDefense").innerText = `Defense: ${Math.floor(trueDefense)}`;
		document.getElementById("calcStamina").innerText = `Stamina: ${Math.floor(trueStamina)}`;

		async function getMoves(pokemonName) {
			try {
				const response = await fetch("assets/maxMove.json");
				if (!response.ok) {
					throw new Error("Bad Move Fetch");
				}
				const data = await response.json();
				const moveData = data.find((object) => object.name === pokemonName).moves;

				return moveData;
			} catch (error) {
				console.error(`Move Error`);
			}
		}

		moves = await getMoves(pokemonName);
		//Boss Info
		try {
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${bossName}`);
			if (!response.ok) {
				throw new Error("Boss not found");
			}
			const data = await response.json();

			bossTypes = data.types.map((typeInfo) => typeInfo.type.name);
			console.log(`${bossName} types: ${bossTypes}`);
		} catch (error) {
			console.error("Error:", error.message);
		}

		async function calculateEffectiveness(attackerTypes, defenderTypes) {
			const response = await fetch("assets/typeChart.json");
			const typeChart = await response.json();

			let Effectiveness = new Array(attackerTypes.length).fill(1);
			attackerTypes.forEach((atype, i) => {
				defenderTypes.forEach((dtype) => {
					const multiplier = typeChart[atype]?.[dtype] ?? 1;
					Effectiveness[i] *= multiplier;
				});
			});
			return Effectiveness;
		}

		let STAB = 1.2;
		let Power = 400;
		let Eff = await calculateEffectiveness(moves, bossTypes);
		let damage = [];

		Eff.forEach((Effectiveness, i) => {
			if (attackTypes.includes(moves[i])) {
				STAB = 1.2;
			} else {
				STAB = 1;
			}
			calc = Math.floor(((0.5 * Power * trueAttack) / trueDefense) * STAB * Effectiveness) + 1;
			damage.push(calc);
		});
		console.log(damage);

		const bestType = moves[damage.indexOf(Math.max(...damage))];
		console.log(bestType);
	});
});
