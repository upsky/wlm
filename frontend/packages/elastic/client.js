class Search {
	constructor (type) {
		check(type, String);
		this._type = type;
		this._results = new ReactiveVar([]);
	}

	query (query) {
		if (this.isEmpty(query)) {
			this._results.set([]);
		} else {
			Meteor.call(`search/${this._type}`, query, (error, result) => {
				if (error)
					console.error(error); // TODO
				else
					this._results.set(result);
			});
		}
	}

	results () {
		return this._results.get();
	}

	//noinspection JSMethodCanBeStatic
	isEmpty (query) { // may be overridden
		return query === '';
	}
}

Elastic = { Search };
