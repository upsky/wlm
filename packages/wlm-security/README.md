для регламинтирования прав на метод необходиом запустить команду


WlmSecurity.addMethods({
	имяМетода: {
		roles: "имя роли"
	},
	имяМетода2: {
	    roles: ["имя роли1","имя роли2"]  //необходимо хотя бы одно совпадение
    },
    checkLogin: {
    		authNotRequired: true,
    		roles: 'all'
    },
});

если приер выше не работает тогда попробовать

WlmSecurity._methods.имяМетода({
	authNotRequired: true,
	roles: 'имя роли1'
});