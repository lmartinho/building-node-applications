define(['SocialNetView', 'text!templates/profile.html', 'text!templates/status.html', 'models/Status', 'views/Status'],
	function(SocialNetView, profileTemplate, statusTemplate, Status, StatusView) {
		var profileView = SocialNetView.extend({
			el: $('#content'),

			initialize: function() {
				this.model.bind('change', this.render, this);
			},

			render: function() {
				console.log('rendering profile view');
				this.$el.html(_.template(profileTemplate, this.model.toJSON()));

				var statusCollection = this.model.get('status');
				console.log('status collection: ', statusCollection);

				if(statusCollection != null) {
					_.each(statusCollection, function(statusJson) {
						var statusModel = new Status(statusJson);
						var statusHtml = (new StatusView({model: statusModel})).render().el;
						console.log(statusHtml);
						$(statusHtml).prependTo('.status-list').hide().fadeIn('slow');
					});
				}
			}
		});

		return profileView;
	}
);