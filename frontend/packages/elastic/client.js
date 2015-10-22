class Search {
	constructor (type) {
		check(type, String);
		this._type = type;
		this._results = new ReactiveVar([]);
	}

	query (query) {
		check(query, String);
		query = query.trim();
		if (query === '') {
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
}

Elastic = { Search };
