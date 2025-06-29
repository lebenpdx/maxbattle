async function calculateEffectiveness(attackerTypes, defenderTypes) {
	const response = await fetch("../assets/typeChart.json");
	const typeChart = await response.json();
	let Effectiveness = 1;

	for (dType of defenderTypes) {
		const multiplier = typeChart[attackerTypes]?.[dType] ?? 1;
		Effectiveness *= multiplier;
	}
	return Effectiveness;
}

async function fetchCPM(level) {
	try {
		const response = await fetch("../assets/CPM.json");
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

async function fetchList(filepath) {
	try {
		const response = await fetch(filepath);
		const data = (await response.text()).split(`\n`);

		return data;
	} catch {
		console.error(`Error fetching ${filepath}:`, error);
	}
}

async function pogoAPI(name) {
	try {
		const result = [];
		let data;
		let isGMAX = false;
		let processedName = name;

		if (processedName.includes("GIGANTAMAX-")) {
			processedName = processedName.replace("GIGANTAMAX-", "");
			isGMAX = true;
		}
		if (!name.includes("_")) {
			const response = await fetch(`https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex/name/${processedName}.json`);
			data = await response.json();
		} else {
			const response = await fetch(`https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex/name/${processedName.split("_")[0]}.json`);
			data = await response.json();
			data = data.regionForms[processedName];
		}

		const quickMoves = Object.assign(data.quickMoves, data.eliteQuickMoves);
		const chargedMoves = Object.assign(data.cinematicMoves, data.eliteCinematicMoves);

		const quickMoveKey = Object.keys(quickMoves);
		const chargedMoveKey = Object.keys(chargedMoves);

		result.push({
			name: name,
			attack: data.stats.attack,
			defense: data.stats.defense,
			stamina: data.stats.stamina,
			type: [data.primaryType.type, data.secondaryType?.type].filter(Boolean),
			gmax: isGMAX,
			quickMoves: quickMoveKey.map((attack) => ({
				type: quickMoves[attack].type.type,
				duration: quickMoves[attack].durationMs,
				power: quickMoves[attack].power,
			})),
			chargedMoves: chargedMoveKey.map((attack) => ({
				type: chargedMoves[attack].type.type,
				power: chargedMoves[attack].power,
			})),
		});
		return result[0];
	} catch (error) {
		console.error("Error:", error.message, name);
	}
}

async function getPokemonList(filepath) {
	try {
		const response = await fetch(filepath);
		const data = await response.text();
		const list = data.split("\n");

		return list;
	} catch (error) {
		console.error("Error:", error.message);
	}
}

async function calculateDamage(pokemon, boss) {
	let damage = 0;
	const result = [];
	let typeEffectivenessMultiplier = 1;
	let STAB = 1;
	const CPM = 0.7903; //Level 40 CPM for base testing
	const bossCPM = 0.84029999; //GMAX CPM

	if (pokemon.gmax) {
		const Power = 350;
		typeEffectivenessMultiplier = await calculateEffectiveness([pokemon.type[0]], boss.type);
		STAB = 1.2;
		damage = Math.floor(0.5 * Power * ((pokemon.attack * CPM) / (boss.defense * bossCPM)) * STAB * typeEffectivenessMultiplier) + 1;
		result.push({
			name: pokemon.name,
			damage: damage,
			type: pokemon.type[0],
			stab: STAB,
			mult: typeEffectivenessMultiplier,
			attack: pokemon.attack,
		});
	} else {
		const Power = 250;
		for (const move of pokemon.quickMoves) {
			const exists = result.some((obj) => obj.type === move.type && obj.name === pokemon.name);
			if (exists) {
				continue;
			}

			typeEffectivenessMultiplier = await calculateEffectiveness(move.type, boss.type);
			STAB = pokemon.type.includes(move.type) ? 1.2 : 1;
			damage = Math.floor(0.5 * Power * ((pokemon.attack * CPM) / (boss.defense * bossCPM)) * STAB * typeEffectivenessMultiplier) + 1;
			result.push({
				name: pokemon.name,
				damage: damage,
				type: move.type,
				stab: STAB,
				mult: typeEffectivenessMultiplier,
				attack: pokemon.attack,
			});
			//console.log(result);
		}
	}
	return result;
}

async function generateDamageRankings(pokemonData, bossData) {
	const damageRankings = (await Promise.all(pokemonData.map((p) => calculateDamage(p, bossData)))).flat();
	return damageRankings.sort((a, b) => b.damage - a.damage);
}

async function generateDefenseRankings(pokemonData, bossData) {
	const defenseRankings = (await Promise.all(pokemonData.map((pokemon) => calculateDefense(bossData, pokemon)))).flat();
	return defenseRankings.sort((a, b) => b.hits - a.hits);
}
/*
function cleanRankings(damageRankings) {
	damageRankings.sort((a, b) => b.damage - a.damage);

	return damageRankings;
}
*/
async function calculateDefense(attacker, defender) {
	const result = [];
	const details = [];
	let totalDamage = 0;
	const CPM = 0.7903; //Level 40 CPM for base testing
	const bossCPM = 0.84029999; //GMAX CPM
	const damageArray = [];
	if (defender.gmax) {
		return result;
	}
	for (move of attacker.chargedMoves) {
		const typeEffectivenessMultiplier = await calculateEffectiveness(move.type, defender.type);
		const Power = move.power;
		const STAB = attacker.type.includes(move.type) ? 1.2 : 1;

		damage = Math.floor(0.5 * Power * ((attacker.attack * CPM) / (defender.defense * bossCPM)) * STAB * typeEffectivenessMultiplier) + 1;
		totalDamage += damage;
		details.push({
			type: move.type,
			Effectiveness: typeEffectivenessMultiplier,
			damage: damage,
		});
	}

	avgDamage = totalDamage / attacker.chargedMoves.length;

	hp = Math.floor(defender.stamina * CPM);
	hits = (hp / avgDamage).toFixed(2);
	result.push({
		name: defender.name,
		defense: defender.defense,
		hp: hp,
		hits: hits,
		averageDamage: avgDamage,
		details: details,
	});
	return result;
}
