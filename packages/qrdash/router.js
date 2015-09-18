/**
 * Created by kriz on 29/08/15.
 */


Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {
    name: 'main',
    action: function () {
        Router.go('profile');
    }
});

Router.route('/profile', {
    name: 'profile',
    action: function () {
        this.render('qrProfileAuth');
    }
});

Router.route('/referral', {
    name: 'referral',
    action: function () {
        this.render('qrReferral');
    }
});