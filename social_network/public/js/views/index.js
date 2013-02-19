define(['SocialNetView', 'text!templates/index.html', 'views/status', 'models/Status'], 
	function(SocialNetView, indexTemplate, StatusView, Status) {
		var indexView = SocialNetView.extend({
			el: $('#content'),

			events: {
				'submit form': 'updateStatus'
			},

			initialize: function() {
				this.collection.on('add', this.onStatusAdded, this);
				this.collection.on('reset', this.onStatusCollectionReset, this);
			},

			onStatusCollectionReset: function(collection) {
				var that = this;
				collection.each(function (model) {
					that.onStatusAdded(model);
				});
			},

			onStatusAdded: function(status) {
				var statusHtml = (new StatusView({
					model: status
				})).render().el;

				$(statusHtml).prependTo('.status-list').hide().fadeIn('slow');
			},

			updateStatus: function() {
				var statusText = $('input[name=status]').val();
				var statusCollection = this.collection;
				$.ajax({
					type: 'POST',
					url: '/accounts/me/status',
					data: { status: statusText },
					success: function(data) {
						statusCollection.add(new Status({status: statusText}));
					},
					error: function() {
						console.warn('problem adding status');
					}
				});

				return false;
			},

			render: function() {
				this.$el.html(indexTemplate);
			}
		});

		return indexView;
	}
);
