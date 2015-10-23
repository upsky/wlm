var VerificationCode = function () {

	function create (phoneNumber) {
		console.log(phoneNumber);
	}

	function check (phoneNumber) {

	}


	return {
		create: create,
		check: check
	}
};

WLmVerificationCode = new VerificationCode();