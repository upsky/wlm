/**
 * Created by kriz on 08/10/15.
 */

Template.defaultLayout.events({
	"click [name=loginInstructionsShow]": function () {
		Modal.show('loginInstructionsModal');
	}
});