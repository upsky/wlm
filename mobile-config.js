App.info({
	id: 'ru.winlevel.market',
	name: 'WL Market',
	description: 'WL Market Mobile App',
	author: 'WinTwin Group',
	email: 'admin@wl-market.com',
	website: 'https://wl-market.com'
});

// Set up resources such as icons and launch screens.
App.icons({
	'iphone_2x': 'mobile/icons/apple-touch-icon-120x120.png'
});

App.launchScreens({
	'iphone_2x': 'mobile/splashes/apple-640x960.png',
	'iphone5': 'mobile/splashes/apple-640x1136.png',
	'iphone6': 'mobile/splashes/apple-750x1334.png',
	'iphone6p_landscape': 'mobile/splashes/apple-1080x1920.png'
});

//// Set PhoneGap/Cordova preferences
App.setPreference('StatusBarOverlaysWebView', false);
App.setPreference('StatusBarStyle', 'black');

App.accessRule("https://vk.com/*");
App.accessRule("https://m.vk.com/*", {launchExternal: true});
App.accessRule("https://s.ytimg.com/yts/*");
App.accessRule("https://www.youtube.com/embed/*");
App.accessRule("http://wlmarket.meteor.com/*");
App.accessRule("http://meteor.local/*");
App.accessRule("*");

// Pass preferences for a particular PhoneGap/Cordova plugin
//App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//  APP_ID: '1234567890',
//  API_KEY: 'supersecretapikey'
//});