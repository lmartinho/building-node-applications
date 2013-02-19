define(['views/index', 'views/register', 'views/login', 'views/forgot_password', 'views/profile',
	'models/Account', 'models/StatusCollection'], 
	function(IndexView, RegisterView, LoginView, ForgotPasswordView, ProfileView, Account, StatusCollection) {
	var SocialRouter = Backbone.Router.extend({
		currentView: null,

		routes: {
			'index': 'index',
			'login': 'login',
			'register': 'register',
			'forgot-password': 'forgot_password',
			'profile/:id': 'profile'
		},

		changeView: function(view) {
			if(this.currentView != null) {
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},

		index: function() {
			var statusCollection = new StatusCollection();
			statusCollection.url = '/accounts/me/activity';
			this.changeView(new IndexView({
				collection: statusCollection
			}));
			statusCollection.fetch();
		},

		login: function() {
			this.changeView(new LoginView());
		},

		register: function() {
			this.changeView(new RegisterView());
		},

		forgot_password: function() {
			this.changeView(new ForgotPasswordView());
		},

		profile: function(id) {
			console.log('routing to profile with id: ', id);
			var model = new Account({id: id});
			this.changeView(new ProfileView({model: model}));
			model.fetch();
		}
	});

	return new SocialRouter();
})