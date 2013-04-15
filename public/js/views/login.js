define(['text!templates/login.html'], function(loginTemplate) {
	var loginView = Backbone.View.extend({
		el: $('#content'),
		events: {
			"submit form": "login"
		},
		// login: function() {
		// 	$.post('/login', {
		// 		email: $('input[name=email]').val(),
		// 		password: $('input[name=password]').val()
		// 	}, function(data) {
		// 		console.log(data);
		// 	}).error(function() {
		// 		$("#error").text('Unable to login.');
		// 		$("#error").slideDown();
		// 	});
		// 	return false;
		// },
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
		}
	});
	return loginView;
});