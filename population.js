
/*
	Evolutionary algorithm
*/

function compare_individuals(a, b)
{
	return a.get_fitness() - b.get_fitness();
}

/*
@param 
*/
function Population(pop_size, idv_factory)
{
	this.individuals = [];
	for(let i = 0; i < pop_size; ++i) {
		const idv = idv_factory();
		idv.randomize();
		idv.evaluate();
		this.individuals.push(idv);
	}
	this.individuals.sort(compare_individuals);
}

Population.prototype.evolve = function(spread)
{
	const half = Math.trunc(this.individuals.length / 2)
	for(let i = 0; i < half; ++i) {
		const parent = this.individuals[i];
		const offspring = this.individuals[half + i];

		offspring.copy(parent);
		offspring.mutate(spread);
		offspring.evaluate();

		parent.mutate(spread);
		parent.evaluate();
	}
	this.individuals.sort(compare_individuals);

	return this.individuals[0].get_fitness();
}
