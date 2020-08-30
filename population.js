
/*
	Evolutionary algorithm
*/

function compare_individuals(a, b)
{
	return a.fitness - b.fitness;
}

/*
@param 
*/
function Population(pop_size, idv_factory)
{
	this.isFirstGeneration = true;
	this.individuals = [];
	for(let i = 0; i < pop_size; ++i) {
		const idv = idv_factory();
		idv.randomize();
		this.individuals.push(idv);
	}
}

Population.prototype.clearFitnesses = function()
{
	const half = Math.trunc(this.individuals.length / 2)
	let start = this.isFirstGeneration ? 0 : half;
	for(let i = start; i < this.individuals.length; ++i) {
		this.individuals[i].fitness = 0;
	}
}

Population.prototype.evaluate = function()
{
	const half = Math.trunc(this.individuals.length / 2)
	let start = this.isFirstGeneration ? 0 : half;
	for(let i = start; i < this.individuals.length; ++i) {
		this.individuals[i].evaluate();
	}
}

/* Returns best fitness this generation
@param spread
*/
Population.prototype.evolve = function(spread)
{
	this.individuals.sort(compare_individuals);
	const best = this.individuals[0].fitness;

	const half = Math.trunc(this.individuals.length / 2)
	for(let i = 0; i < half; ++i) {
		const parent = this.individuals[i];
		const offspring = this.individuals[half + i];

		offspring.copy(parent);
		offspring.mutate(spread);
		// parent.mutate(spread);
	}

	this.isFirstGeneration = false;

	return best;
}
