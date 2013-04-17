define(['SocialNetView', 'text!templates/login.html'], function(SocialNetView, loginTemplate) {
	var loginView = SocialNetView.extend({
		requireLogin: false,
		el: $('#content'),
		events: {
			"submit form": "login"
		},

		login: function() {
			var socketEvents = this.socketEvents;
			$.post('/login',
				this.$('form').serialize(), function(data) {
					console.log(data + " logging");
					socketEvents.trigger('app:loggedin');
					window.location.hash = 'index';
				}).error(function(){
					$("#error").text('Unable to login.');
					$("#error").slideDown();
				});
			return false;
		},
		initialize: function(options) {
			this.socketEvents = options.socketEvents;
		},
		render: function() {
			$(this.el).html(loginTemplate);
			$("#error").hide();
			$("input[name=email]").focus();
		}
	});
	return loginView;
});