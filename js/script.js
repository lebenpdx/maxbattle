document.addEventListener("DOMContentLoaded", async function () {
	const form = document.getElementById("ivForm");

	async function fetchCPM(level) {
		try {
			const response = await fetch("assets/CPM.json");
			if (!response.ok) {
				throw new Error("Bad CPM Fetch");
			}
			const data = await response.json();
			const levelData = data.find((object) => object.Level === level).CPM;
			console.log(`CPM: ${levelData}`);
			return levelData;
		} catch (error) {
			console.error(`CPM Error`);
		}
	}

	form.addEventListener("submit", async function (event) {
		event.preventDefault();
		console.clear();

		//Variable Declaration
		let baseHP = 0,
			baseAttack = 0,
			baseDefense = 0,
			baseSpAttack = 0,
			baseSpDefense = 0,
			baseSpeed = 0;
		(attackTypes = []), (bossTypes = []);

		let bossHP = 0,
			bossAttack = 0,
			bossDefense = 0,
			bossSpAttack = 0,
			bossSpDefense = 0,
			bossSpeed = 0;
		//Put off for later. For now we assume the 0 IV's and level 40
		const attackIV = 0;
		const defenseIV = 0;
		const staminaIV = 0;
		//const attackIV = parseInt(document.getElementById("attackIV").value, 10);
		//const defenseIV = parseInt(document.getElementById("defenseIV").value, 10);
		//const staminaIV = parseInt(document.getElementById("staminaIV").value, 10);

		//Pull from forms
		const pokemonName = document.getElementById("pokemonName").value.trim().toLowerCase();
		const bossName = document.getElementById("bossName").value.trim().toLowerCase();
		const pokemonLevel = document.getElementById("pokemonLevel").value.trim();
		const maxAttackLevel = document.getElementById("maxAttackLevel").value.trim();
		console.log(`Pokemon level: ${pokemonLevel}`);
		console.log(`Max Attack Level: ${maxAttackLevel}`);

		//Precomputation
		CPM = await fetchCPM(parseFloat(pokemonLevel));

		//Attacker Info

		userPokemonInfo = await fetchPokemonInfo(pokemonName);
		console.log(`UserPokemonInfo:`);
		console.log(`[HP,Atk,Def,SpAtk,SpDef,Spd,Type]`);
		console.log(userPokemonInfo);

		let userSpeedMod = calcSpeedMod(userPokemonInfo[5]);

		let trueAttack = (Math.round(Math.round(2 * ((7 / 8) * Math.max(userPokemonInfo[1], userPokemonInfo[3]) + (1 / 8) * Math.min(userPokemonInfo[1], userPokemonInfo[3]))) * userSpeedMod) + attackIV) * CPM;
		let trueDefense = (Math.round(Math.round(2 * ((5 / 8) * Math.max(userPokemonInfo[2], userPokemonInfo[4]) + (3 / 8) * Math.min(userPokemonInfo[2], userPokemonInfo[4]))) * userSpeedMod) + defenseIV) * CPM;
		let trueStamina = (Math.floor(userPokemonInfo[0] * (7 / 4) + 50) + staminaIV) * CPM;

		document.getElementById("calcAttack").innerText = `Attack: ${Math.floor(trueAttack)}`;
		document.getElementById("calcDefense").innerText = `Defense: ${Math.floor(trueDefense)}`;
		document.getElementById("calcStamina").innerText = `Stamina: ${Math.floor(trueStamina)}`;

		moves = await getMoves(pokemonName);
		//Boss Info
		try {
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${bossName}`);
			if (!response.ok) {
				throw new Error("Boss not found");
			}
			const data = await response.json();
			data.stats.forEach((stat) => {
				switch (stat.stat.name) {
					case "hp":
						bossHP = stat.base_stat;
						break;
					case "attack":
						bossAttack = stat.base_stat;
						break;
					case "defense":
						bossDefense = stat.base_stat;
						break;
					case "special-attack":
						bossSpAttack = stat.base_stat;
						break;
					case "special-defense":
						bossSpDefense = stat.base_stat;
						break;
					case "speed":
						bossSpeed = stat.base_stat;
						break;
				}
			});

			console.log(`${bossName} types: ${bossTypes}`);
		} catch (error) {
			console.error("Error:", error.message);
		}
		let bossSpeedMod = calcSpeedMod(bossSpeed);

		let trueBossDefense = Math.round(Math.round(2 * ((5 / 8) * Math.max(bossDefense, bossSpDefense) + (3 / 8) * Math.min(bossDefense, bossSpDefense))) * bossSpeedMod) * 0.84529999; //0.84529999 for gmax level 51 cpm

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
		let Power = 200 + maxAttackLevel * 50;
		let Eff = await calculateEffectiveness(moves, bossTypes);
		let damage = [];

		Eff.forEach((Effectiveness, i) => {
			if (attackTypes.includes(moves[i])) {
				STAB = 1.2;
			} else {
				STAB = 1;
			}
			calc = Math.floor(0.5 * Power * (trueAttack / trueBossDefense) * STAB * Effectiveness) + 1;
			damage.push(calc);
		});
		console.log(damage);

		const damageDiv = document.getElementById("maxDamage");
		damageDiv.innerHTML = "<h3>Damage</h3>";
		damage.forEach((damages, i) => {
			const result = document.createElement("p");
			result.innerText = `${moves[i]}: ${damages}`;
			damageDiv.appendChild(result);
		});

		const bestType = moves[damage.indexOf(Math.max(...damage))];
		console.log(bestType);
	});
});
