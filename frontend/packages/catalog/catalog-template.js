
var template = Template.catalog;
var templateRoot = Template.catalogRoot;
var templateCategory = Template.catalogCategory;
var templateEditor = Template.editor;
var Catalog;
var newCategoryTitle = 'Новая категория';

var selectText = function (element) {
	if (document.body.createTextRange) { // ms
		var range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	}
};
var startEvent = function(data) {
	if (data.event) {
		data.event.stopPropagation();
	}

	var selectedNode = Catalog.__selectedNode.get();
	var setValue;

	if (data.type == 'selected') {
		if (this.__edited.get()) {
			return;
		}

		setValue = !_.isUndefined(data.value) ? data.value : !this.__selected.get();

		if (data.event && data.event.shiftKey) {

		} else if (data.event && data.event.ctrlKey) {
			if (!setValue) {
				Catalog.__selectedNode.set(selectedNode = _.without(selectedNode, this));
			}
		} else {
			if (selectedNode.length) {
				_.each(selectedNode, function (val) {
					val.__selected.set(false);
				});
				Catalog.__selectedNode.set(selectedNode = []);
			}
		}

		this.__selected.set(setValue);

		if (setValue) {
			Catalog.__selectedNode.set(_.union(selectedNode, [this]));
		}
	} else if (data.type == 'opened') {
		this.__opened.set(!_.isUndefined(data.value) ? data.value : !this.__opened.get());
	} else if (data.type == 'add') {
		if (selectedNode.length > 1) {
			return;
		}

		var currentNode = selectedNode.length ? selectedNode[0] : Catalog;

		currentNode.createChild(newCategoryTitle, function(newCategory) {
			var needAction = Catalog.__needAction.get();

			needAction[newCategory.id()] = [{ type: 'selected', value: true }, { type: 'edit', value: true }];

			Catalog.__needAction.set(needAction);

			if (currentNode.type() == 'category') {
				startEvent.call(currentNode, { type: 'opened', value: true });
			}
		});
	} else if (data.type == 'edit') {
		if (selectedNode.length != 1) {
			return;
		}

		var currValue = selectedNode[0].__edited.get();

		setValue = !_.isUndefined(data.value) ? data.value : !currValue;

		if (setValue == currValue) {
			return;
		}

		selectedNode[0].__edited.set(setValue);
	} else if (data.type == 'remove') {
		_.each(selectedNode, function (val) {
			val.remove();
		});

		Catalog.__selectedNode.set([]);
	} else if (data.type == 'dragstart') {
		_.each(selectedNode, function(val) {
			startEvent.call(val, { type: 'selected', value: false });
		});
	} else if (data.type == 'drop') {
		var targetCategory = Blaze.getData(data.event.toElement);

		if (targetCategory) {
			this.moveTo(targetCategory.id(), function(result) {
				if (result && targetCategory.type() == 'category') {
					startEvent.call(targetCategory, { type: 'opened', value: true });
				}
			});
		}
	}

	console.log(data);
};


template.onCreated(function() {
	window.Catalog = Catalog = new CatalogConstructor('main');
	Catalog.__selectedNode = new ReactiveVar([]);
	Catalog.__needAction = new ReactiveVar({});
});

template.helpers({
	ready: function() {
		return Catalog.ready();
	},
	catalog: function() {
		return Catalog;
	},
	can: function(type) {
		var selectedNode = Catalog.__selectedNode.get();

		if (type == 'add') {
			return selectedNode.length <= 1;
		}
		if (type == 'edit') {
			return selectedNode.length == 1;
		}
		if (type == 'remove') {
			return selectedNode.length;
		}
	}
});

template.events({
	'click .add, click .remove, click .edit': function(e) {
		var action = _.find(['add', 'edit', 'remove'], function(val) {
			return e.currentTarget.classList.contains(val);
		});

		startEvent.call(null, { type: action, event: e });
	}
});


templateRoot.onRendered(function() {
	this.$('.selector').droppable({
		hoverClass: 'drag-hover',
		tolerance: 'pointer'
	});
});


templateCategory.onCreated(function() {
	var self = this;
	var category = this.data;

	category.__opened = new ReactiveVar(false);
	category.__selected = new ReactiveVar(false);
	category.__edited = new ReactiveVar(false);
	category.__selectText = new ReactiveVar(false);

	this.autorun(function() {
		if (category.__selectText.get()) {
			selectText(self.$('.name').focus()[0]);
			category.__selectText.set(false);
		}
	});
});

templateCategory.onRendered(function() {
	var category = this.data;
	var id = category.id();
	var needAction = Catalog.__needAction.get();

	if (needAction[id]) {
		_.each(needAction[id], function(val) {
			startEvent.call(category, val);
		});

		delete needAction[id];

		Catalog.__needAction.set(needAction);
	}

	this.$('.node-inner').draggable({
		helper: 'clone',
		distance: 5,
		cursorAt: { top: -10, left: -10 }
	}).droppable({
		hoverClass: 'drag-hover',
		tolerance: 'pointer'
	});
});

templateCategory.helpers({
	opened: function() {
		return this.__opened.get();
	},
	selected: function() {
		return this.__selected.get();
	},
	edited: function() {
		return this.__edited.get();
	}
});

templateCategory.events({
	'click .toggle, dblclick .node-inner': function(e) {
		startEvent.call(this, { type: 'opened', event: e });
	},
	'click .node-inner': function(e) {
		startEvent.call(this, { type: 'selected', event: e });
	},
	'dragstart .node-inner': function(e) {
		startEvent.call(this, { type: 'dragstart', event: e });
	},
	'dragstop .node-inner': function(e) {
		startEvent.call(this, { type: 'drop', event: e });
	}
});


templateEditor.onRendered(function() {
	var self = this;

	this._dataBackup = {};

	this.$('.editor').modal().one('hidden.bs.modal', function(e) {
		startEvent.call(self.data, { type: 'edit', value: false, event: e });
	});
});

templateEditor.events({
	'keyup input, keyup textarea': function(e, ti) {
		ti._dataBackup[e.target.name] = e.target.value;
	},
	'submit form': function(e, ti) {
		e.preventDefault();

		this.data(ti._dataBackup);
		this.save();

		ti.$('.editor').modal('hide');
	}
});