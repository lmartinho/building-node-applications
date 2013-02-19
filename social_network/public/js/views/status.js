define(['SocialNetView', 'text!templates/status.html'], function(SocialNetView, statusTemplate) {
	var statusView = SocialNetView.extend({
		render: function() {
			this.$el.html(_.template(statusTemplate, this.model.toJSON()));
			// @todo: not really sure if this is the right way to go about this
			return this;
		}
	});

	return statusView;
});