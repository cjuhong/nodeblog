module.exports = {
	mail: function() {
		return {

			service: "Gmail",
			// sets automatically host, port and connection security settings
			auth: {
				user: "gmail.user@gmail.com",
				pass: "userpass"
			}

		};
	}
};