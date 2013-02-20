define(['SocialNetView', 'views/contact', 'text!templates/contacts.html'],
	function(SocialNetView, ContactView, contextsTemplate) {
		var contactsView = SocialNetView.extend({
			el: $('#content'),

			initialize: function() {
				this.collections.on('reset', this.renderCollection, this);
			},

			render: function() {
				this.$el.html(contactsTemplate);
			},

			renderCollection: function() {
				collection.each(function(contact) {
					var statusHtml = (new ContactView({
						removeButton: true,
						model: contact
					})).render().el;

					$(statusHtml).appendTo('.contacts-list');
				});
			}
		});

		return contactsView;
	}
);