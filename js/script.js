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
		let attackTypes = [],
			bossTypes = [];

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
		let bossInfo = await fetchPokemonInfo(bossName);
		let bossSpeedMod = calcSpeedMod(bossInfo[5]);

		let trueBossDefense = Math.round(Math.round(2 * ((5 / 8) * Math.max(bossInfo[2], bossInfo[4]) + (3 / 8) * Math.min(bossInfo[2], bossInfo[4]))) * bossSpeedMod) * 0.84529999; //0.84529999 for gmax level 51 cpm

		let STAB = 1.2;
		let Power = 200 + maxAttackLevel * 50;
		let Eff = await calculateEffectiveness(moves, bossInfo[6]);
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
