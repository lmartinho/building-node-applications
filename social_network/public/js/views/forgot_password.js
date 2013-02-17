define(['text!templates/forgot_password.html'], function(forgotPasswordTemplate) {
	var forgotView = Backbone.View.extend({
		el: $('#content'),

		events: {
			'submit form': 'forgot'
		},

		forgot: function() {
			$.post('/forgot-password', {
				email: $('input[name=email]').val()
			}, function(data) {
				console.log(data);
			})
			return false;
		},

		render: function() {
			this.$el.html(forgotPasswordTemplate);
		}
	});

	return forgotView;
});