const typeChart = {
	types: {
		normal: {
			rock: 0.71,
			ghost: 0.51,
			steel: 0.71,
			fighting: 1.4,
		},
		fire: {
			water: 0.71,
			fire: 0.71,
			grass: 1.4,
			bug: 1.4,
			steel: 1.4,
			rock: 0.71,
			dragon: 0.71,
		},
		water: {
			fire: 1.4,
			water: 0.71,
			electric: 0.71,
			grass: 0.71,
		},
		rock: {
			fire: 1.4,
			flying: 1.4,
		},
		electric: {
			water: 1.4,
			electric: 0.71,
			ground: 0.51,
		},
		grass: {
			water: 1.4,
			fire: 0.71,
			electric: 0.71,
			grass: 0.71,
		},
		fighting: {
			normal: 1.4,
			ghost: 0.51,
			fighting: 1,
			psychic: 0.71,
			fairy: 0.71,
		},
		ghost: {
			normal: 0.51,
			ghost: 1.4,
			dark: 1.4,
		},
		psychic: {
			fighting: 1.4,
			ghost: 1.4,
			psychic: 0.71,
			dark: 0.51,
		},
		dragon: {
			dragon: 1.4,
			fairy: 0.51,
		},
		dark: {
			fighting: 0.71,
			ghost: 1.4,
			psychic: 1.4,
			fairy: 0.51,
		},
		fairy: {
			fighting: 1.4,
			dragon: 1.4,
			dark: 1.4,
			steel: 0.71,
		},
	},
};

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
		const bossName = document.getElementById("bossName").value.trim().toLowerCase();

		let baseHP = 0,
			baseAttack = 0,
			baseDefense = 0,
			baseSpAttack = 0,
			baseSpDefense = 0,
			baseSpeed = 0;
		(attackTypes = []), (bossTypes = []);

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

		testMoves = await getMoves(pokemonName);
		console.log(`testMoves: ${testMoves}`);
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

		function calculateEffectiveness(attackerTypes, defenderTypes) {
			let Effectiveness = new Array(attackerTypes.length).fill(1);
			attackerTypes.forEach((atype, i) => {
				defenderTypes.forEach((dtype) => {
					const multiplier = typeChart.types[atype]?.[dtype] ?? 1;
					Effectiveness[i] *= multiplier;
				});
			});

			console.log(`Effectiveness: ${Effectiveness}`);
			return Effectiveness;
		}

		let STAB = 1.2;
		let Power = 400;
		let Eff = calculateEffectiveness(testMoves, bossTypes);

		let damage = Math.floor(((0.5 * Power * Attack) / Defense) * STAB * Eff) + 1;
	});
});
