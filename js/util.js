/*
async function fetchPokemonInfo(name) {
	let info = [];
	try {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
		const data = await response.json();
		data.stats.forEach((stat) => {
			info.push(stat.base_stat);
		});
		info.push(data.types.map((typeInfo) => typeInfo.type.name));
	} catch (error) {
		console.error("Error:", error.message);
	}
	return info;
}

async function getMoves(pokemonName, isGmax) {
	try {
		const response = await fetch("assets/maxMove.json");
		if (!response.ok) {
			throw new Error("Bad Move Fetch");
		}
		const data = await response.json();
		console.log(isGmax);
		if (isGmax) {
			pokemonName = "gigantamax_" + pokemonName;
			console.log("isGmax");
		}
		const moveData = data.find((object) => object.name === pokemonName).moves;

		return moveData;
	} catch (error) {
		console.error(`Move Error`);
	}
}

function calcSpeedMod(speed) {
	return 1 + (speed - 75) / 500;
}

async function pogoAPI(id) {
	try {
		const response = await fetch(`https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex/name/${id}.json`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error:", error.message);
	}
}
*/
async function calculateEffectiveness(attackerTypes, defenderTypes) {
	const response = await fetch("assets/typeChart.json");
	const typeChart = await response.json();

	let Effectiveness = new Array(attackerTypes.length).fill(1);

	//console.log("attacker types", attackerTypes);
	//console.log("defender types", defenderTypes);
	for (const [i, aType] of attackerTypes.entries()) {
		for (dType of defenderTypes) {
			const multiplier = typeChart[aType]?.[dType] ?? 1;
			Effectiveness[i] *= multiplier;
		}
	}

	return Effectiveness;
}

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

async function fetchList(filepath) {
	try {
		const response = await fetch(filepath);
		const data = (await response.text()).split(`\n`);

		return data;
	} catch {
		console.error(`Error fetching ${filepath}:`, error);
	}
}

async function pogoAPI2(name) {
	try {
		const result = [];
		let data;
		let isGMAX = false;
		const moveData = [];
		const types = [];
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

		for (const attack in data.quickMoves) {
			const moveType = data.quickMoves[attack].type.type;
			if (!moveData.includes(moveType)) {
				moveData.push(moveType);
			}
		}

		types.push(data.primaryType.type);
		types.push(data.secondaryType?.type);

		result.push({
			name: name,
			attack: `${data.stats.attack}`,
			defense: `${data.stats.defense}`,
			stamina: `${data.stats.stamina}`,
			type: types,
			quickMoves: moveData,
			gmax: isGMAX,
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
		damage = Math.floor(0.5 * Power * ((pokemon.attack * CPM) / (boss.defense * bossCPM)) * STAB * typeEffectivenessMultiplier[0]) + 1;
		result.push({
			name: `${pokemon.name}`,
			damage: `${damage}`,
			type: `${pokemon.type[0]}`,
			stab: STAB,
			mult: typeEffectivenessMultiplier[0],
			attack: pokemon.attack,
		});
	} else {
		const Power = 250;
		typeEffectivenessMultiplier = await calculateEffectiveness(pokemon.quickMoves, boss.type);
		for (const [i, moveType] of pokemon.quickMoves.entries()) {
			STAB = pokemon.type.includes(moveType) ? 1.2 : 1;
			damage = Math.floor(0.5 * Power * ((pokemon.attack * CPM) / (boss.defense * bossCPM)) * STAB * typeEffectivenessMultiplier[i]) + 1;
			result.push({
				name: `${pokemon.name}`,
				damage: `${damage}`,
				type: `${moveType}`,
				stab: STAB,
				mult: typeEffectivenessMultiplier[i],
				attack: pokemon.attack,
			});
		}
	}

	return result;
}

async function generateDamageRankings(pokemonData, bossData) {
	const damageRankings = [];

	for (pokemon of pokemonData) {
		data = await calculateDamage(pokemon, bossData);
		for (entry of data) {
			damageRankings.push(entry);
		}
	}
	damageRankings.sort((a, b) => b.damage - a.damage);

	return damageRankings;
}

function cleanRankings(damageRankings) {
	damageRankings.sort((a, b) => b.damage - a.damage);

	return damageRankings;
}
