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
  'iphone': 'mobile/icons/apple-touch-icon-60x60.png',
  'iphone_2x': 'mobile/icons/apple-touch-icon-120x120.png'
  // ... more screen sizes and platforms ...
});

//App.launchScreens({
//  'iphone': 'splash/splash-iphone.png',
//  'iphone_2x': 'splash/splashx2-iphone.png',
//  // ... more screen sizes and platforms ...
//});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);

App.accessRule("*");
// Pass preferences for a particular PhoneGap/Cordova plugin
//App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//  APP_ID: '1234567890',
//  API_KEY: 'supersecretapikey'
//});