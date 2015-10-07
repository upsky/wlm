CutterPaginator ={
    "onSetPage":function(){},
    "config": {
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
        nowShowButtons:0,    //высчитанное число страниц
        isShow: false,       //отображать ли пагинатор
        buttons: [],         //массив кнопок (внутренние данные)
        isNoFirst: true,     //маркер (не первая страница)
        isNoLast: true,      //маркер (не последняя страница)
    },
    "reactive": new Meteor.Collection(null),
    "get":function(){
        return CutterPaginator.reactive.findOne();
    },
    "update":function (){
        var config=CutterPaginator.config;
        var collect=CutterPaginator.reactive;
        if (collect.find().count() !== 1)
        {
            collect.remove({});
            collect.insert(config);
        }else{
            var id = collect.findOne()._id;
            collect.update({_id:id},config);
        }
    },
    "genUpd":function(){
        var config=CutterPaginator.config;
        CutterPaginator.onSetPage({
                page:config.nowPage,
                skip:(config.nowPage - 1) * config.itemsPage}
        );
        CutterPaginator.generate(config.allCount,config.itemsPage,config.nowPage);
    },
    /**
     *
     * @param inputData Number общее число данных
     * @param itemsPage Number данных на странице
     * @param nowPage   Number текущая страница
     */
    "generate":function(inputData,itemsPage,nowPage){
        config = CutterPaginator.config;
        config.itemsPage=itemsPage;
        config.isNowFastJump=config.isFastJump;
        config.nowShowButtons=config.showButtons;
        config.nowPage = nowPage ? nowPage : 1;
        config.buttons=[];
        config.allCount=inputData;
        //колчество страниц
        var matCountButtons = Math.ceil(+config.allCount / +config.itemsPage);
        config.isNowFastJump= config.autoFastJump !== 0 && config.autoFastJump < matCountButtons;
        config.isNoFirst = config.nowPage !== 1;
        config.isNoLast= config.nowPage !== matCountButtons;
        config.isShow = matCountButtons > 1 ? true : false;
        if (config.isShow){
            if (+matCountButtons <  config.nowShowButtons) {config.nowShowButtons =matCountButtons;};
            var centerPosition =Math.ceil(config.nowShowButtons / 2);
            var correctPosition = config.nowPage - centerPosition;
            if (correctPosition < 0) {correctPosition = 0;};
            if (correctPosition + config.nowShowButtons  > matCountButtons ) {correctPosition = matCountButtons - config.nowShowButtons;};
            for (var n = 1; n < config.nowShowButtons +1; n++){
                var button ={
                    page:n + correctPosition,
                    selected:""
                };
                if (config.nowPage == n + correctPosition) {
                    button.selected="active";
                };
                config.buttons.push(button);
            };
        };
        CutterPaginator.update();
    }
};
CutterPaginator.update();
Template.cutterPaginator.helpers({
    "config": function () {
        return CutterPaginator.get();
    }
});

Template.cutterPaginator.events({
    "click li[name=Previous]":function(e){
        e.preventDefault();
        CutterPaginator.config.nowPage = CutterPaginator.config.nowPage - 1;
        CutterPaginator.genUpd();
    },
    "click li[name=Next]":function(e){
        e.preventDefault();
        CutterPaginator.config.nowPage=CutterPaginator.config.nowPage + 1;
        CutterPaginator.genUpd();
    },
    "click li[name=jumpBegin]":function(e){
        e.preventDefault();
        CutterPaginator.config.nowPage = 1;
        CutterPaginator.genUpd();
    },
    "click li[name=jumpEnd]":function(e){
        e.preventDefault();
        config = CutterPaginator.config;
        config.nowPage=Math.ceil(config.allCount / config.itemsPage);
        CutterPaginator.genUpd();
    }
});

Template.cutterPaginatorButton.events({
    "click li[name=paginatorButton]":function(e){
        e.preventDefault();
        var templateData=Template.instance().data;
        CutterPaginator.config.nowPage=templateData.page;
        CutterPaginator.genUpd();
    }
});
