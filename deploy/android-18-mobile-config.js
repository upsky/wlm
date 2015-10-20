App.info({
	id: 'com.wl-market.android',
	version: '0.1.1',
	name: 'WL Market',
	description: 'WL Market Mobile App',
	author: 'WinTwin Group',
	email: 'admin@wl-market.com',
	website: 'https://wl-market.com'
});

// Set up resources such as icons and launch screens.
App.icons({
	iphone_2x: 'mobile/icons/apple-touch-icon-120x120.png',
	iphone_3x: 'mobile/icons/apple-touch-icon-180x180.png',

	android_ldpi: 'mobile/icons/android-chrome-36x36.png',
	android_mdpi: 'mobile/icons/android-chrome-48x48.png',
	android_hdpi: 'mobile/icons/android-chrome-72x72.png',
	android_xhdpi: 'mobile/icons/android-chrome-96x96.png'
});

App.launchScreens({
	iphone_2x: 'mobile/splashes/apple-640x960.png',
	iphone5: 'mobile/splashes/apple-640x1136.png',
	iphone6: 'mobile/splashes/apple-750x1334.png',
	iphone6p_portrait: 'mobile/splashes/apple-1080x1920.png',

	android_ldpi_portrait: 'mobile/splashes/android-480x800.png',
	android_mdpi_portrait: 'mobile/splashes/android-480x800.png',
	android_hdpi_portrait: 'mobile/splashes/android-480x800.png',
	android_xhdpi_portrait: 'mobile/splashes/android-480x800.png'
});

//// Set PhoneGap/Cordova preferences
App.setPreference('StatusBarOverlaysWebView', false);
App.setPreference('StatusBarStyle', 'black');
App.setPreference('Orientation', 'portrait');

//App.setPreference('minSdkVersion', 14);
App.setPreference('android-maxSdkVersion', '18');

App.accessRule("https://vk.com/*");
App.accessRule("https://m.vk.com/*", {launchExternal: true});
App.accessRule("https://s.ytimg.com/yts/*");
App.accessRule("https://www.youtube.com/embed/*");
App.accessRule("http://wlmarket.meteor.com/*");
App.accessRule("http://wlm.he24.ru/*");
App.accessRule("*");


// Pass preferences for a particular PhoneGap/Cordova plugin
//App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//  APP_ID: '1234567890',
//  API_KEY: 'supersecretapikey'
//});