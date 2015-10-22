
var template = Template.catalog;
var templateRoot = Template.catalogRoot;
var templateCategory = Template.catalogCategory;
var templateEditor = Template.editor;
var templateEditorForm = Template.editorForm;
var templateProductForm = Template.productForm;
var templateGoods = Template.goods;
var templateProduct = Template.product;
var Catalog;
var newCategoryTitle = 'Новая категория';

var selectText = function (element) {
	var range;
	if (document.body.createTextRange) { // ms
		range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		var selection = window.getSelection();
		range = document.createRange();
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
		setValue = !_.isUndefined(data.value) ? data.value : !this.__selected.get();

		function clearSelected() {
			if (selectedNode.length) {
				_.each(selectedNode, function (val) {
					val.__selected.set(false);
				});
				Catalog.__selectedNode.set(selectedNode = []);
			}
		}
		function select(arr) {
			_.each(arr, function(val) {
				val.__selected.set(true);
				selectedNode.push(val);
			});
		}

		if (data.event && data.event.shiftKey) {
			var firstSelected = selectedNode[0];
			var firstData = firstSelected.data();
			var currData = this.data();
			var firstIndex;
			var currIndex;
			var parentChildren;
			var minIndex;
			var maxIndex;

			clearSelected();

			if (firstData.parentId == currData.parentId) {
				parentChildren = this.parent().getChildren();
				firstIndex = parentChildren.indexOf(firstSelected);
				currIndex = parentChildren.indexOf(this);
				minIndex = _.min([firstIndex, currIndex]);
				maxIndex = _.max([firstIndex, currIndex]);

				var toSlice = parentChildren.slice(minIndex, maxIndex + 1);

				if (firstIndex > currIndex) {
					toSlice.reverse();
				}

				select(toSlice);
			} else {
				var firstPath = firstSelected.path();
				var currPath;

				currIndex = firstPath.indexOf(this);

				if (currIndex != -1) {
					select(firstPath.slice(0, currIndex + 1));
				} else {
					currPath = this.path();

					var firstRootParent = firstPath[firstPath.length - 1];
					var currRootParent = currPath[currPath.length - 1];

					parentChildren = firstRootParent.parent().getChildren();
					firstIndex = parentChildren.indexOf(firstRootParent);
					currIndex = parentChildren.indexOf(currRootParent);
					minIndex = _.min([firstIndex, currIndex]);
					maxIndex = _.max([firstIndex, currIndex]);

					var rootSlice = parentChildren.slice(minIndex, maxIndex + 1);

					if (firstIndex > currIndex) {
						rootSlice.reverse();
					}

					currPath.reverse();

					select(_.union(firstPath, rootSlice, currPath));
				}
			}

			setValue = undefined;
		} else if (data.event && data.event.ctrlKey) {
			if (!setValue) {
				Catalog.__selectedNode.set(selectedNode = _.without(selectedNode, this));
			}
		} else {
			clearSelected();
		}

		if (!_.isUndefined(setValue)) {
			this.__selected.set(setValue);

			if (setValue) {
				Catalog.__selectedNode.set(_.union(selectedNode, [this]));
			}
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

			needAction[newCategory.id()] = [{ type: 'selected', value: true }, { type: 'selectTitle', value: true }];

			Catalog.__needAction.set(needAction);

			if (currentNode.type() == 'category') {
				startEvent.call(currentNode, { type: 'opened', value: true });
			}
		});
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
	} else if (data.type == 'selectTitle') {
		this.__selectTitle.set(true);
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
		if (type == 'remove') {
			return selectedNode.length;
		}
	}
});

template.events({
	'click .add, click .remove': function(e) {
		var action = _.find(['add', 'remove'], function(val) {
			return e.currentTarget.classList.contains(val);
		});

		startEvent.call(null, { type: action, event: e });
	}
});


templateRoot.onRendered(function() {
	this.$('.catalog-selector').droppable({
		hoverClass: 'drag-hover',
		tolerance: 'pointer'
	});
});


templateCategory.onCreated(function() {
	var category = this.data;

	category.__opened = new ReactiveVar(false);
	category.__selected = new ReactiveVar(false);
	category.__selectTitle = new ReactiveVar(false);
	category.goods.__selectedNode = new ReactiveVar([]);
});

templateCategory.onRendered(function() {
	var category = this.data;
	var id = category.id();

	this.autorun(function() {
		var needAction = Catalog.__needAction.get();

		if (needAction[id]) {
			_.each(needAction[id], function(val) {
				startEvent.call(category, val);
			});

			delete needAction[id];

			Catalog.__needAction.set(needAction);
		}
	});

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


templateEditor.helpers({
	selected: function() {
		var selected = Catalog.__selectedNode.get();

		return selected.length == 1 ? selected[0] : selected;
	},
	singleSelect: function() {
		return Catalog.__selectedNode.get().length == 1;
	}
});


templateEditorForm.onCreated(function() {
	var self = this;
	var lastCategory;

	this.autorun(function () {
		var category = self.view.lookup('category')();

		if (category != lastCategory) {
			self._dataBackup = new ReactiveVar({});
			lastCategory = category;
		}
	});
});

templateEditorForm.helpers({
	category: function () {
		return this;
	},
	select: function() {
		var ti = Template.instance();
		if (this.__selectTitle.get()) {
			this.__selectTitle.set(false);
			setTimeout(function () {
				ti.$('#editor__title').focus()[0].select();
			}, 100);
		}
	},
	disabledClass: function() {
		var data = this.data();
		var backup = Template.instance()._dataBackup.get();

		return (!_.isEmpty(backup) && _.some(backup, function(val, key) { return val != data[key]; })) ? '' : 'disabled';
	}
});

templateEditorForm.events({
	'keyup input, keyup textarea': function(e, ti) {
		var backup = ti._dataBackup.get();

		backup[e.target.name] = e.target.value;

		ti._dataBackup.set(backup);
	},
	'submit form': function(e, ti) {
		e.preventDefault();

		this.data(ti._dataBackup.get() || {});
		this.save(function() {
			ti._dataBackup.set({});
		});

		ti.$('#editor__title').blur();
	}
});


templateProductForm.onCreated(function () {
	var self = this;
	var lastSelected;

	this.autorun(function () {
		var selected = self.view.lookup('selected')();

		if (selected != lastSelected) {
			self._dataBackup = new ReactiveVar({});
			lastSelected = selected;
		}
	});
});

templateProductForm.helpers({
	selected: function () {
		var selected = this.goods.__selectedNode.get();

		selected = selected.length ? selected : [{}];

		return selected.length == 1 ? selected[0] : selected;
	},
	singleSelect: function() {
		return !this.goods || this.goods.__selectedNode.get().length == 1;
	},
	select: function() {
		var ti = Template.instance();
		if (this.__selectTitle && this.__selectTitle.get()) {
			this.__selectTitle.set(false);
			setTimeout(function () {
				ti.$('#editor__product__title').focus()[0].select();
			}, 100);
		}
	},
	disabledClass: function() {
		var backup = Template.instance()._dataBackup.get();

		if (!this._data) {
			return _.isEmpty(backup) ? 'disabled' : '';
		}

		var data = this.data();

		return (!_.isEmpty(backup) && _.some(backup, function(val, key) { return val != data[key]; })) ? '' : 'disabled';
	}
});

templateProductForm.events({
	'keyup input, keyup textarea': function(e, ti) {
		var backup = ti._dataBackup.get();

		backup[e.target.name] = e.target.value;

		ti._dataBackup.set(backup);
	},
	'submit form': function(e, ti) {
		e.preventDefault();

		if (!this._data) {
			ti.data.goods.createChild(ti._dataBackup.get() || {});
		} else {
			this.data(ti._dataBackup.get() || {});
			this.save(function () {
				ti._dataBackup.set({});
			});
		}
		ti.$('#editor__product__title').blur();
	}
});


templateGoods.helpers({
	singleSelect: function() {
		return Catalog.__selectedNode.get().length == 1;
	},
	category: function () {
		return Catalog.__selectedNode.get()[0];
	}
});


templateProduct.helpers({
	isSelected: function () {
		return Catalog.__selectedNode.get()[0].goods.__selectedNode.get().indexOf(this) != -1;
	}
});

templateProduct.events({
	'click': function (e, ti) {
		var selected = Catalog.__selectedNode.get()[0].goods.__selectedNode.get();
		var product = ti.data;

		if (selected.indexOf(product) != -1) {
			selected = _.without(selected, product);
		} else {
			selected = [product];
		}

		Catalog.__selectedNode.get()[0].goods.__selectedNode.set(selected);
	}
});