CutterPaginator = {
	reactive:{},
	init: function(name){
		if (!name){
			name='default';
		}
		var reactive = CutterPaginator.reactive;
		var create=new ReactiveVar({
			"onSetPage": function () {
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
		reactive[name]=create;
	},
	checkIsset:function(name){
		if (name && !CutterPaginator.reactive[name]) {
			CutterPaginator.init(name);
		}
	},
	get: function (name) {
		if (name) {
			CutterPaginator.checkIsset(name);
			return CutterPaginator.reactive[name].get();
		}
	},
	set:function(name,data){
		CutterPaginator.checkIsset(name);
		return CutterPaginator.reactive[name].set(data);
	},
	update: function (name) {
		/*var config = CutterPaginator.cache;
		CutterPaginator.reactive.set(config);*/
	},
	genUpd: function (name) {
		if (name){
			var nowconfig =CutterPaginator.get(name);
			nowconfig.onSetPage({
					page: nowconfig.nowPage,
					skip: (nowconfig.nowPage - 1) * nowconfig.itemsPage
				}
			);
			CutterPaginator.generate(nowconfig.allCount, nowconfig.itemsPage, nowconfig.nowPage);
		}
	},
	/**
	 * @param name		String имя текущего пагинатора
	 * @param inputData Number общее число данных
	 * @param itemsPage Number данных на странице
	 * @param nowPage   Number текущая страница
	 */
	generate: function (name, inputData, itemsPage, nowPage) {
		if (name)
		{
			config = CutterPaginator.get(name);
			config.itemsPage = itemsPage;
			config.isNowFastJump = config.isFastJump;
			config.nowShowButtons = config.showButtons;
			config.nowPage = nowPage ? nowPage : 1;
			config.buttons = [];
			config.allCount = inputData;
			//колчество страниц
			var matCountButtons = Math.ceil(+config.allCount / +config.itemsPage);
			config.isNowFastJump = config.autoFastJump !== 0 && config.autoFastJump < matCountButtons;
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
						selected: ""
					};
					if (config.nowPage == n + correctPosition) {
						button.selected = "active";
					}
					config.buttons.push(button);
				}
			}
			//CutterPaginator.update();
		}
	}
};
//CutterPaginator.init();
CutterPaginator.update();
Template.cutterPaginator.helpers({
	"config": function () {
		return CutterPaginator.get(this.name);
	}
});

Template.cutterPaginator.events({
	"click li[name = Previous]": function (e) {
		e.preventDefault();
		CutterPaginator.config.nowPage = CutterPaginator.config.nowPage - 1;
		CutterPaginator.genUpd();
	},
	"click li[name = Next]": function (e) {
		e.preventDefault();
		CutterPaginator.config.nowPage = CutterPaginator.config.nowPage + 1;
		CutterPaginator.genUpd();
	},
	"click li[name = jumpBegin]": function (e) {
		e.preventDefault();
		CutterPaginator.config.nowPage = 1;
		CutterPaginator.genUpd();
	},
	"click li[name = jumpEnd]": function (e) {
		e.preventDefault();
		config = CutterPaginator.config;
		config.nowPage = Math.ceil(config.allCount / config.itemsPage);
		CutterPaginator.genUpd();
	}
});

Template.cutterPaginatorButton.events({
	"click li[name = paginatorButton]": function (e) {
		e.preventDefault();
		var templateData = Template.instance().data;
		CutterPaginator.config.nowPage = templateData.page;
		CutterPaginator.genUpd();
	}
});