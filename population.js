
/*
	Evolutionary algorithm
*/

/*
@param 
*/
function Population(pop_size, idv_factory)
{
	this.keepBest = true;
	this.elitism = false;
	this.isFirstGeneration = true;
	this.individuals = [];
	for(let i = 0; i < pop_size; ++i) {
		const idv = idv_factory();
		idv.randomize();
		this.individuals.push(idv);
	}
	this.evaluateRunning = false;
	this.evalItr = 0;
}

Population.prototype.clearFitnesses = function()
{
	const half = Math.trunc(this.individuals.length / 2)
	let start = !this.elitism ? 0 : (this.isFirstGeneration ? 0 : half);
	for(let i = start; i < this.individuals.length; ++i) {
		this.individuals[i].clearFitness();
	}
}

/// Return true when all individuals evaluated
Population.prototype.evaluate = function()
{
	if(!this.evaluateRunning) {
		this.evaluateRunning = true;
		const half = Math.trunc(this.individuals.length / 2);
		this.evalItr = !this.elitism ? 0 : (this.isFirstGeneration ? 0 : half);
	}

	this.individuals[ this.evalItr ].evaluate();
	this.evalItr += 1;
	if(this.evalItr >= this.individuals.length) {
		this.evaluateRunning = false;
	}
	return !this.evaluateRunning;
}

/* Returns best fitness this generation
@param spread
*/
Population.prototype.evolve = function(spread)
{
	this.individuals.sort(this.individuals[0].compareIndividuals);

	const half = Math.trunc(this.individuals.length / 2)
	for(let i = 0; i < half; ++i) {
		const parent = this.individuals[i];
		const offspring = this.individuals[half + i];

		offspring.copy(parent);
		offspring.mutate(spread);
		if(!this.elitism) {
			if(!this.keepBest || i != 0) {
				parent.mutate(spread);
			}
		}
	}

	this.isFirstGeneration = false;

	return this.individuals[0];
}
