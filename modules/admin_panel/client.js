if (Meteor.isClient) {

    Template.adminPanel.rendered = function() {
        return log.trace('adminPanel rendered');
    };

    Template.adminPanel.helpers({
        adminPanel: {
            blockId: "adminFunctions"
        }
    });
}