shinobi.initbulma = {

	quickviews: [],
	calendars: '',
	tagsInput: '',
	iconpicker: '',

	build: function () {
		shinobi.initbulma.addEventNavbarBurger();
		shinobi.initbulma.addEventModal();
		shinobi.initbulma.addEventTabs();
		shinobi.initbulma.addEventDropdown();
		shinobi.initbulma.activeNavbarHeader();

		if (typeof bulmaQuickview == 'function') {

			shinobi.initbulma.quickviews = bulmaQuickview.attach();
		}

		if (typeof bulmaTagsinput == 'function') {

			shinobi.initbulma.tagsInput = bulmaTagsinput.attach();
		}

		if (typeof bulmaIconpicker == 'function') {

			shinobi.initbulma.iconpicker = bulmaIconpicker.attach();
		}

		if (typeof bulmaCalendar == 'function') {

			shinobi.initbulma.calendars = bulmaCalendar.attach('[type="date"]:not(.is-init-bulma-false)',
				{
					'dateFormat': 'DD/MM/YYYY',
					'displayMode': 'dialog',
					closeOnOverlayClick: false,
				});

		}

	},

	addEventDropdown: function () {

		var dropdownList = document
			.querySelectorAll('.dropdown:not(.is-hoverable)');

		for (var i = 0; i < dropdownList.length; i++) {

			var dropdown = dropdownList[i];
			shinobi.initbulma.addEventDropdownElem(dropdown);
		}
	},

	addEventDropdownElem: function (dropdown) {
		var button = dropdown.getElementsByClassName('dropdown-trigger')[0]
			.getElementsByClassName('button')[0];
		if (button) {
			button.onclick = function () {
				dropdown.classList.toggle('is-active');
			}
		}
	},

	activeNavbarHeader: function () {

		var list = document.querySelectorAll('.navbar.is-init');
		for (var i = 0; i < list.length; i++) {
			var navbar = list[i];
			shinobi.initbulma.activeNavbar(navbar);
		}
	},

	activeNavbar: function (navbar) {
		var listItem = navbar
			.querySelectorAll('.navbar-item[href],.navbar-link[href]');
		var pathNameAppendSearch = shinobi.initbulma.getPathNameAppendSearch();
		for (var i = 0; i < listItem.length; i++) {
			var item = listItem[i];
			var href = item.getAttribute('href');

			if (pathNameAppendSearch.includes(href)) {
				item.classList.add('is-active');
				shinobi.initbulma.activeParentNavbarItem(item.parentNode);
			}
		}

		var refListItem = navbar
			.querySelectorAll('.navbar-item[ref-list],.navbar-link[ref-list]');

		for (var j = 0; j < refListItem.length; j++) {
			var item1 = refListItem[j];
			var refList = item1.getAttribute('ref-list').split(',');
			refList.forEach(function (refItem) {
				if (refItem == pathNameAppendSearch) {
					item1.classList.add('is-active');
					shinobi.initbulma.activeParentNavbarItem(item1.parentNode);
				}
			});
		}
	},

	getPathNameAppendSearch: function () {
		return window.location.pathname + window.location.search;
	},

	activeParentNavbarItem: function (parent) {

		if (parent.hasAttribute('class')) {
			var classList = parent.getAttribute('class');
			var listStopLoop = ['navbar-start', 'nabvar-end', 'navbar-menu',
				'navbar-brand', 'navbar'];
			listStopLoop.forEach(function (classItem) {
				if (classList.includes(classItem)) {
					return;
				}
			});

			if (classList.includes('navbar-item')
				&& classList.includes('has-dropdown')) {
				var navbarLink = parent.getElementsByClassName('navbar-link')[0];
				if (navbarLink) {
					navbarLink.classList.add('is-active');
				}
			} else {
				shinobi.initbulma.activeParentNavbarItem(parent.parentNode);
			}

		}
	},

	activeTab: function (listLi, li) {

		for (var l = 0; l < listLi.length; l++) {
			(listLi[l] == li) ? listLi[l].classList.add('is-active')
				: listLi[l].classList.remove('is-active');

			if (listLi[l].hasAttribute('tab-container-id')) {
				var container = document.getElementById(listLi[l].getAttribute('tab-container-id'));
				if (container) {
					(listLi[l] == li) ? container.classList.remove('is-hidden')
						: container.classList.add('is-hidden');
				}
			}
		}

	},

	addEventTabs: function () {
		var tabsList = document.querySelectorAll('.tabs.is-init');

		for (var i = 0; i < tabsList.length; i++) {
			shinobi.initbulma.addEvenOneTab(tabsList, i);
		}

	},

	addEvenOneTab: function (tabsList, i) {
		var tabs = tabsList[i];
		var listLi = tabs.getElementsByTagName('li');
		var classList = tabs.getAttribute('class');
		for (var l = 0; l < listLi.length; l++) {
			if (!classList.includes('is-not-active-click')) {
				listLi[l].onclick = function () {
					var li = this;
					shinobi.initbulma.activeTab(listLi, li);

				}
			}
			if (classList.includes('is-active-pathname')) {
				var pathname = shinobi.initbulma.getPathNameAppendSearch();
				var a = listLi[l].querySelector('a[href]');
				if (a) {
					var href = a.getAttribute('href');
					if (pathname.includes(href)) {
						listLi[l].classList.add('is-active');
					}
				}
			}
		}
	},

	addEventModal: function () {

		var listModal = document.querySelectorAll('.modal');

		listModal.forEach(function (item, index) {

			shinobi.initbulma.modalEventListener(item);
		});
	},

	modalOpen: function (modal) {
		modal.classList.add("is-active");
		document.documentElement.classList.add('is-clipped');
	},

	modalClose: function (modal) {
		modal.classList.remove("is-active");
		document.documentElement.classList.remove('is-clipped');
	},


	modalEventListener: function (modal) {

		var closeButtonList = modal
			.querySelectorAll('.delete,[aria-label="close"]');
		if (closeButtonList.length > 0) {
			var closeButton = closeButtonList[0];
			if (closeButton) {
				closeButton.onclick = function () {
					shinobi.initbulma.modalClose(modal);
				}
			}
		}

		var cancelModalButtonList = modal
			.getElementsByClassName("cancel-modal-button");

		for (var i = 0; i < cancelModalButtonList.length; i++) {

			cancelModalButtonList[i].onclick = function () {
				shinobi.initbulma.modalClose(modal);
			}
		}

		var modalBackground = modal.getElementsByClassName("modal-background");

		for (var j = 0; j < modalBackground.length; j++) {

			modalBackground[j].onclick = function () {
				shinobi.initbulma.modalClose(modal);
			}
		}

		window.addEventListener("keydown", function (event) {
			if (event.key == 'Escape') {
				shinobi.initbulma.modalClose(modal);
			}
		}, true);

		var footer = modal.getElementsByTagName("footer")[0];

		if (footer) {

			var buttonFooterList = footer.getElementsByTagName("button");

			for (var l in buttonFooterList) {

				buttonFooterList[l].onclick = function () {
					shinobi.initbulma.modalClose(modal);
				}
			}
		}

		if (modal.hasAttribute('control-button-list')) {

			var controlButtonList = modal.getAttribute('control-button-list')
				.split('|');

			for (var k = 0; k < controlButtonList.length; k++) {

				var item = document.getElementById(controlButtonList[k]);

				item.onclick = function () {
					shinobi.initbulma.modalOpen(modal);

					if (item.hasAttribute('snb-render')) {
						var value = item.getAttribute('snb-key');
						var render = item.getAttribute('snb-render');
						eval(render)(item, value);
					}
				}
			}
		}
	},

	addEventNavbarBurger: function () {

		var navbarBurgers = Array.prototype.slice.call(document
			.querySelectorAll('.navbar-burger'), 0);

		if (navbarBurgers.length > 0) {

			navbarBurgers.forEach(function (el) {
				el.addEventListener('click', function () {
					// Get the target from the "data-target" attribute
					var targetId = el.dataset.target;
					var target = document.getElementById(targetId);
					// Toggle the "is-active" class on both the "navbar-burger"
					// and the "navbar-menu"
					el.classList.toggle('is-active');
					target.classList.toggle('is-active');

				});
			});
		}
	},
};