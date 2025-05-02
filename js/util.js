async function fetchPokemonInfo(name) {
	let info = [];
	try {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
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
			info.push(stat.base_stat);
			console.log(info);
		});
	} catch (error) {
		console.error("Error:", error.message);
	}
	return info;
}
