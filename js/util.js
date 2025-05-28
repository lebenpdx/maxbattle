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

async function calculateEffectiveness(attackerTypes, defenderTypes) {
	const response = await fetch("assets/typeChart.json");
	const typeChart = await response.json();

	let Effectiveness = new Array(attackerTypes.length).fill(1);

	attackerTypes.forEach((atype, i) => {
		defenderTypes.forEach((dtype) => {
			const multiplier = typeChart[atype.toLowerCase()]?.[dtype.toLowerCase()] ?? 1;
			Effectiveness[i] *= multiplier;
		});
	});
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

async function pogoAPI(id) {
	try {
		const response = await fetch(`https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex/name/${id}.json`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error:", error.message);
	}
}

async function getPokemonList() {
	try {
		const response = await fetch("assets/maxPokemonList.txt");
		const data = await response.text();
		const list = data.split("\n");

		return list;
	} catch (error) {
		console.error("Error:", error.message);
	}
}
