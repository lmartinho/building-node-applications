define(['views/index', 'views/register', 'views/login', 'views/forgot_password'], function(IndexView, RegisterView, LoginView, ForgotPasswordView) {
	var SocialRouter = Backbone.Router.extend({
		currentView: null,

		routes: {
			'index': 'index',
			'login': 'login',
			'register': 'register',
			'forgot-password': 'forgot_password'
		},

		changeView: function(view) {
			if(this.currentView != null) {
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},

		index: function() {
			this.changeView(new IndexView());
		},

		login: function() {
			this.changeView(new LoginView());
		},

		register: function() {
			this.changeView(new RegisterView());
		},

		forgot_password: function() {
			this.changeView(new ForgotPasswordView());
		}
	});

	return new SocialRouter();
})