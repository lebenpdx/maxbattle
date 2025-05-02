document.addEventListener("DOMContentLoaded", async function () {
	const form = document.getElementById("ivForm");

	form.addEventListener("submit", async function (event) {
		event.preventDefault();
		console.clear();

		//Variable Declaration
		let attackTypes = [];

		//Put off for later. For now we assume the 0 IV's and level 40
		const attackIV = 0;
		const defenseIV = 0;
		const staminaIV = 0;

		//Pull from forms
		const pokemonName = document.getElementById("pokemonName").value.trim();
		const bossName = document.getElementById("bossName").value.trim();
		const pokemonLevel = document.getElementById("pokemonLevel").value.trim();
		const maxAttackLevel = document.getElementById("maxAttackLevel").value.trim();

		CPM = await fetchCPM(parseFloat(pokemonLevel));
		let STAB = 1;
		let Power = 200 + maxAttackLevel * 50;
		let damage = [];

		//Attacker Info
		userPokemonInfo = await fetchPokemonInfo(pokemonName);

		let userSpeedMod = calcSpeedMod(userPokemonInfo[5]);
		let userAttack = (Math.round(Math.round(2 * ((7 / 8) * Math.max(userPokemonInfo[1], userPokemonInfo[3]) + (1 / 8) * Math.min(userPokemonInfo[1], userPokemonInfo[3]))) * userSpeedMod) + attackIV) * CPM;
		let userDefense = (Math.round(Math.round(2 * ((5 / 8) * Math.max(userPokemonInfo[2], userPokemonInfo[4]) + (3 / 8) * Math.min(userPokemonInfo[2], userPokemonInfo[4]))) * userSpeedMod) + defenseIV) * CPM;
		let userStamina = (Math.floor(userPokemonInfo[0] * (7 / 4) + 50) + staminaIV) * CPM;

		document.getElementById("calcAttack").innerText = `Attack: ${Math.floor(userAttack)}`;
		document.getElementById("calcDefense").innerText = `Defense: ${Math.floor(userDefense)}`;
		document.getElementById("calcStamina").innerText = `Stamina: ${Math.floor(userStamina)}`;

		userMoves = await getMoves(pokemonName);

		//Boss Info
		let bossInfo = await fetchPokemonInfo(bossName);

		let bossSpeedMod = calcSpeedMod(bossInfo[5]);
		let bossDefense = Math.round(Math.round(2 * ((5 / 8) * Math.max(bossInfo[2], bossInfo[4]) + (3 / 8) * Math.min(bossInfo[2], bossInfo[4]))) * bossSpeedMod) * 0.84529999; //0.84529999 for gmax level 51 cpm

		let typeEffectivenessMultiplier = await calculateEffectiveness(userMoves, bossInfo[6]);

		typeEffectivenessMultiplier.forEach((typeEffectiveness, i) => {
			if (attackTypes.includes(userMoves[i])) {
				STAB = 1.2;
			} else {
				STAB = 1;
			}
			calc = Math.floor(0.5 * Power * (userAttack / bossDefense) * STAB * typeEffectiveness) + 1;
			damage.push(calc);
		});

		const damageDiv = document.getElementById("maxDamage");
		damageDiv.innerHTML = "<h3>Damage</h3>";
		damage.forEach((damages, i) => {
			const result = document.createElement("p");
			result.innerText = `${userMoves[i]}: ${damages}`;
			damageDiv.appendChild(result);
		});

		const bestType = userMoves[damage.indexOf(Math.max(...damage))];
		const bestTypeElement = document.createElement("strong");
		bestTypeElement.innerHTML = `Best Damage Type: ${bestType}`;
		damageDiv.appendChild(bestTypeElement);
	});
});
