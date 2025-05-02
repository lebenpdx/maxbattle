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

function calcSpeedMod(speed) {
	console.log(`calcspeedmod ${speed}`);
	return 1 + (speed - 75) / 500;
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
