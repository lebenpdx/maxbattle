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

function getMaxMove(pokemon) {
	const gMaxMoveMap = {
		ALCREMIE: { name: "G-MAX Finale", type: "POKEMON_TYPE_FAIRY" },
		APPLETUN: { name: "G-MAX Sweetness", type: "POKEMON_TYPE_GRASS" },
		CENTISKORCH: { name: "G-MAX Centiferno", type: "POKEMON_TYPE_FIRE" },
		COALOSSAL: { name: "G-MAX Volcalith", type: "POKEMON_TYPE_ROCK" },
		COPPERAJAH: { name: "G-MAX Steelsurge", type: "POKEMON_TYPE_STEEL" },
		CORVIKNIGHT: { name: "G-MAX Wind Rage", type: "POKEMON_TYPE_FLYING" },
		DREDNAW: { name: "G-MAX Stonesurge", type: "POKEMON_TYPE_Water" },
		DURALUDON: { name: "G-MAX Depletion", type: "POKEMON_TYPE_DRAGON" },
		EEVEE: { name: "G-MAX Cuddle", type: "POKEMON_TYPE_NORMAL" },
		FLAPPLE: { name: "G-MAX Tartness", type: "POKEMON_TYPE_GRASS" },
		GARBODOR: { name: "G-MAX Malodor", type: "POKEMON_TYPE_POISON" },
		GRIMMSNARL: { name: "G-MAX Snooze", type: "POKEMON_TYPE_DARK" },
		HATTERENE: { name: "G-MAX Smite", type: "POKEMON_TYPE_FAIRY" },
		LAPRAS: { name: "G-MAX Resonance", type: "POKEMON_TYPE_ICE" },
		MELMETAL: { name: "G-MAX Meltdown", type: "POKEMON_TYPE_STEEL" },
		MEOWTH: { name: "G-MAX Gold Rush", type: "POKEMON_TYPE_Normal" },
		ORBEETLE: { name: "G-MAX Gravitas", type: "POKEMON_TYPE_PSYCHIC" },
		PIKACHU: { name: "G-MAX Volt Crash", type: "POKEMON_TYPE_ELECTRIC" },
		SANDACONDA: { name: "G-MAX Sandblast", type: "POKEMON_TYPE_GROUND" },
		SNORLAX: { name: "G-MAX Replenish", type: "POKEMON_TYPE_NORMAL" },
		URSHIFU_RAPID_STRIKE: { name: "G-MAX Rapid Flow", type: "POKEMON_TYPE_WATER" },
		URSHIFU_SINGLE_STRIKE: { name: "G-MAX One Blow", type: "POKEMON_TYPE_DARK" },
		VENUSAUR: { name: "G-MAX Vine Lash", type: "POKEMON_TYPE_GRASS" },
		CHARIZARD: { name: "G-MAX Wildire", type: "POKEMON_TYPE_FIRE" },
		BLASTOISE: { name: "G-MAX Cannonade", type: "POKEMON_TYPE_WATER" },
		RILLABOOM: { name: "G-MAX Drum Solo", type: "POKEMON_TYPE_GRASS" },
		CINDERACE: { name: "G-MAX Fireball", type: "POKEMON_TYPE_FIRE" },
		INTELEON: { name: "G-MAX Hydrosnipe", type: "POKEMON_TYPE_WATER" },
		GENGAR: { name: "G-MAX Terror", type: "POKEMON_TYPE_GHOST" },
		TOXTRICITY: { name: "G-MAX Stun Shock", type: "POKEMON_TYPE_ELECTRIC" },
		MACHAMP: { name: "G-MAX Chi Strike", type: "POKEMON_TYPE_FIGHTING" },
		KINGLER: { name: "G-MAX Foam Burst", type: "POKEMON_TYPE_WATER" },
		BUTTERFREE: { name: "G-MAX Befuddle", type: "POKEMON_TYPE_BUG" },
	};

	return gMaxMoveMap[pokemon];
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

		const dMaxMoveMap = {
			POKEMON_TYPE_NORMAL: "MAX Strike",
			POKEMON_TYPE_FIRE: "MAX Flare",
			POKEMON_TYPE_WATER: "MAX Geyser",
			POKEMON_TYPE_GRASS: "MAX Overgrowth",
			POKEMON_TYPE_ELECTRIC: "MAX Lightning",
			POKEMON_TYPE_ICE: "MAX Hailstorm",
			POKEMON_TYPE_FIGHTING: "MAX Knuckle",
			POKEMON_TYPE_POISON: "MAX Ooze",
			POKEMON_TYPE_GROUND: "MAX Quake",
			POKEMON_TYPE_FLYING: "MAX Airstream",
			POKEMON_TYPE_PSYCHIC: "MAX Mindstorm",
			POKEMON_TYPE_BUG: "MAX Flutterby",
			POKEMON_TYPE_ROCK: "MAX Rockfall",
			POKEMON_TYPE_GHOST: "MAX Phantasm",
			POKEMON_TYPE_DRAGON: "MAX Wyrmwind",
			POKEMON_TYPE_DARK: "MAX Darkness",
			POKEMON_TYPE_STEEL: "MAX Steelspike",
			POKEMON_TYPE_FAIRY: "MAX Starfall",
		};

		let maxMoves;
		if (processedName.includes("ZACIAN")) {
			maxMoves = [{ name: "Behemoth Blade", type: "POKEMON_TYPE_STEEL" }];
		} else if (processedName.includes("ZAMAZENTA")) {
			maxMoves = [{ name: "Behemoth Bash", type: "POKEMON_TYPE_STEEL" }];
		} else if (isGMAX) {
			maxMoves = getMaxMove(processedName);
		} else {
			maxMoves = quickMoveKey.map((attack) => {
				const type = quickMoves[attack].type.type;
				const name = dMaxMoveMap[type];
				return { name, type };
			});
		}

		result.push({
			name: name,
			attack: data.stats.attack,
			defense: data.stats.defense,
			stamina: data.stats.stamina,
			type: [data.primaryType.type, data.secondaryType?.type].filter(Boolean),
			gmax: isGMAX,
			quickMoves: quickMoveKey.map((attack) => ({
				name: attack,
				type: quickMoves[attack].type.type,
				duration: quickMoves[attack].durationMs,
				power: quickMoves[attack].power,
			})),
			chargedMoves: chargedMoveKey.map((attack) => ({
				name: attack,
				type: chargedMoves[attack].type.type,
				power: chargedMoves[attack].power,
			})),
			maxMoves: maxMoves,
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

async function calculateDamage(pokemon, boss, attackIV = 0) {
	let damage = 0;
	const result = [];
	let typeEffectivenessMultiplier = 1;
	let STAB = 1;
	const CPM = 0.7903; //Level 40 CPM for base testing
	const bossCPM = 0.84029999; //GMAX CPM

	if (pokemon.gmax) {
		const Power = 350;
		typeEffectivenessMultiplier = await calculateEffectiveness([pokemon.maxMoves.type], boss.type);
		STAB = 1.2;
		damage = Math.floor(0.5 * Power * (((pokemon.attack + attackIV) * CPM) / (boss.defense * bossCPM)) * STAB * typeEffectivenessMultiplier) + 1;
		result.push({
			name: pokemon.name,
			damage: damage,
			move: pokemon.maxMoves.name,
			type: pokemon.maxMoves.type.replace("POKEMON_TYPE_", ""),
			stab: STAB,
			mult: typeEffectivenessMultiplier,
			attack: pokemon.attack,
		});
	} else {
		const Power = 250;
		for (const move of pokemon.maxMoves) {
			const exists = result.some((obj) => obj.name === pokemon.name && obj.move === move.name);
			if (exists) {
				continue;
			}

			typeEffectivenessMultiplier = await calculateEffectiveness(move.type, boss.type);
			STAB = pokemon.type.includes(move.type) ? 1.2 : 1;
			damage = Math.floor(0.5 * Power * (((pokemon.attack + attackIV) * CPM) / (boss.defense * bossCPM)) * STAB * typeEffectivenessMultiplier) + 1;
			result.push({
				name: pokemon.name,
				damage: damage,
				move: move.name,
				type: move.type.replace("POKEMON_TYPE_", ""),
				stab: STAB,
				mult: typeEffectivenessMultiplier,
				attack: pokemon.attack,
			});
		}
	}
	return result;
}

async function generateDamageRankings(pokemonData, bossData) {
	const damageRankings = (await Promise.all(pokemonData.map((p) => calculateDamage(p, bossData)))).flat();
	return damageRankings.sort((a, b) => b.damage - a.damage);
}

async function generateDefenseRankings(pokemonData, bossData) {
	const defenseRankings = (
		await Promise.all(
			pokemonData.map((pokemon) => {
				if (pokemon.gmax && pokemonData.some((p) => p.name === pokemon.name.replace("GIGANTAMAX-", ""))) {
					return [];
				}
				return calculateDefense(bossData, pokemon);
			})
		)
	).flat();
	return defenseRankings.sort((a, b) => b.hits - a.hits);
}

async function calculateDefense(attacker, defender) {
	const result = [];
	const details = [];
	let totalDamage = 0;
	const CPM = 0.7903; //Level 40 CPM for base testing
	const bossCPM = 0.84029999; //GMAX CPM
	const damageArray = [];

	for (const move of attacker.chargedMoves) {
		const typeEffectivenessMultiplier = await calculateEffectiveness(move.type, defender.type);
		//const typeEffectivenessMultiplier = 1; //for neutral testing purposes
		const Power = move.power;
		const STAB = attacker.type.includes(move.type) ? 1.2 : 1;

		damage = Math.floor(0.5 * Power * ((attacker.attack * CPM) / (defender.defense * bossCPM)) * STAB * typeEffectivenessMultiplier) + 1;
		totalDamage += damage;
		details.push({
			Name: move.name,
			Type: move.type,
			Power: Power,
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
		stamina: defender.stamina,
		hp: hp,
		hits: hits,
		averageDamage: avgDamage,
		details: details,
	});
	return result;
}
