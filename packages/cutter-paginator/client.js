CutterPaginator = {
	reactive: {},
	init: function (name) {
		if (!name) {
			name = 'default';
		}
		var reactive = this.reactive;
		var create = new ReactiveVar({
			onSetPage: function () {
			},
			name: name,
			//конфигурации
			allCount: 0,         //всего элементов в выдаче
			nowPage: 1,          //текущая страница
			itemsPage: 10,        //количество элементов на одной странице
			//стандартная конфигурация
			showButtons: 10,     //количество страниц для отображения
			isFastJump: false,   //отображать кнопки перехода в начало/конец
			autoFastJump: 20,    //отображать кнопки перехода в начало/конец автоматически при превышении указанного числа страниц
			isShowInfo: true,    //отображать дополнительную информацию
			//служебное
			isNowFastJump: false,//отображать ли кнопки перехода в начало/конец в данный момент
			nowShowButtons: 0,    //высчитанное число страниц
			isShow: false,       //отображать ли пагинатор
			buttons: [],         //массив кнопок (внутренние данные)
			isNoFirst: true,     //маркер (не первая страница)
			isNoLast: true,      //маркер (не последняя страница)
		});
		reactive[name] = create;
	},
	checkIsset: function (name) {
		if (name && !this.reactive[name]) {
			this.init(name);
		}
	},
	get: function (name) {
		if (!name) return;
		this.checkIsset(name);
		return this.reactive[name].get();
	},
	set: function (name, data) {
		if (!name) return;
		this.checkIsset(name);
		return this.reactive[name].set(data);
	},
	update: function (name) {
		if (!name) return;
		this.checkIsset(name);
		var config = this.reactive[name];
		config.dep.changed();
	},
	genUpd: function (name) {
		if (!name) return;
		var nowconfig = this.get(name);
		nowconfig.onSetPage({
				page: nowconfig.nowPage,
				skip: (nowconfig.nowPage - 1) * nowconfig.itemsPage
			}
		);
		this.generate(name, nowconfig.allCount, nowconfig.itemsPage, nowconfig.nowPage);
	},
	/**
	 * @param name      String имя текущего пагинатора
	 * @param inputData Number общее число данных
	 * @param itemsPage Number данных на странице
	 * @param nowPage   Number текущая страница
	 */
	generate: function (name, inputData, itemsPage, nowPage) {
		if (!name) return;
		var config = this.get(name);
		config.itemsPage = itemsPage;
		config.isNowFastJump = config.isFastJump;
		config.nowShowButtons = config.showButtons;
		config.nowPage = nowPage ? nowPage : 1;
		config.buttons = [];
		config.allCount = inputData;
		//колчество страниц
		var matCountButtons = Math.ceil(+config.allCount / +config.itemsPage);
		if (!config.isNowFastJump) {
			config.isNowFastJump = config.autoFastJump !== 0 && config.autoFastJump < matCountButtons;
		}
		config.isNoFirst = config.nowPage !== 1;
		config.isNoLast = config.nowPage !== matCountButtons;
		config.isShow = matCountButtons > 1 ? true : false;
		if (config.isShow) {
			if (+matCountButtons < config.nowShowButtons) {
				config.nowShowButtons = matCountButtons;
			}
			var centerPosition = Math.ceil(config.nowShowButtons / 2);
			var correctPosition = config.nowPage - centerPosition;
			if (correctPosition < 0) {
				correctPosition = 0;
			}
			if (correctPosition + config.nowShowButtons > matCountButtons) {
				correctPosition = matCountButtons - config.nowShowButtons;
			}
			for (var n = 1; n <= config.nowShowButtons; n++) {
				var button = {
					page: n + correctPosition,
					selected: "",
					nameConfig: config.name
				};
				if (config.nowPage == n + correctPosition) {
					button.selected = "active";
				}
				config.buttons.push(button);
			}
		}
		this.update(name);
	}
};

Template.cutterPaginator.helpers({
	config: function () {
		return CutterPaginator.get(this.name);
	}
});

Template.cutterPaginator.events({
	"click li[name = Previous]": function (e) {
		e.preventDefault();
		var name = Template.instance().data.name;
		CutterPaginator.get(name).nowPage--;
		CutterPaginator.genUpd(name);
	},
	"click li[name = Next]": function (e) {
		e.preventDefault();
		var name = Template.instance().data.name;
		CutterPaginator.get(name).nowPage++;
		CutterPaginator.genUpd(name);
	},
	"click li[name = jumpBegin]": function (e) {
		e.preventDefault();
		var name = Template.instance().data.name;
		CutterPaginator.get(name).nowPage = 1;
		CutterPaginator.genUpd(name);
	},
	"click li[name = jumpEnd]": function (e) {
		e.preventDefault();
		var name = Template.instance().data.name;
		var config = CutterPaginator.get(name);
		config.nowPage = Math.ceil(config.allCount / config.itemsPage);
		CutterPaginator.genUpd(name);
	},
});

Template.cutterPaginatorButton.events({
	"click li[name = paginatorButton]": function (e) {
		e.preventDefault();
		var data = Template.instance().data;
		CutterPaginator.get(data.nameConfig).nowPage = data.page;
		CutterPaginator.genUpd(data.nameConfig);
	}
});