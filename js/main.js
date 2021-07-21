class MoviePromo {

	options;

	constructor(selector, _options, multiplePage = false) {
		this.options = _options;
		this.movieConstructor(selector, multiplePage);
	}

	getElement = (tagName, classNames, attributes, innerText) => {
		const element = document.createElement(tagName);

		if (classNames) {
			if (Array.isArray(classNames)) {
				if (classNames.length > 0) element.classList.add(...classNames);
			} else if (typeof classNames === 'string') {
				if (classNames.length > 0) element.classList.add(classNames);
			} else {
				console.error('Type of argument \'classNames\' on method \'getElement()\' must be String or Array');
			}
		}

		if (attributes) {
			for (const [key, value] of Object.entries(attributes)) {
				element[key] = value;
			}
		}

		if (innerText) {
			element.innerText = innerText;
		}

		return element;
	};

	createMenu = (links, menuClass, linkClass) => {
		const menuWrapper = this.getElement('nav', menuClass);

		links.forEach(element => {
			menuWrapper.append(this.getElement('a', linkClass, {
				href: element.link
			}, element.title));
		});

		return menuWrapper;
	}

	createHeader = (params = this.options) => {
		const header = this.getElement('header');
		const container = this.getElement('div', 'container');
		const wrapper = this.getElement('div', 'header');

		if (params.header.logo) {
			const logo = this.getElement('img', 'logo', {
				src: params.header.logo,
				alt: 'Логотип ' + params.title
			});
			wrapper.append(logo);
		}

		if (params.header.menu) {
			wrapper.append(this.createMenu(params.header.menu, 'menu-list', 'menu-link'));
		}

		if (params.header.socials) {
			const socialWrapper = this.getElement('div', 'social');

			params.header.socials.forEach(element => {
				const link = this.getElement('a', 'social-link');
				link.href = element.link;

				link.append(this.getElement('img', '', {
					src: element.img,
					alt: element.title
				}));

				socialWrapper.append(link);
			});

			wrapper.append(socialWrapper);
		}

		header.append(container);
		container.append(wrapper);
		container.append(this.getElement('button', 'menu-button'));

		return header;
	};

	createRating = (rating) => {
		if (typeof rating !== 'number') {
			console.error('Rating must be Number');
			return '';
		}
		const element = this.getElement('div', ['rating', 'animated', 'fadeInRight']);
		const wrapper = this.getElement('div', 'rating-stars');

		for (let i = 1; i <= 10; i++) {
			wrapper.append(this.getElement('img', 'star', {
				src: (i <= rating ? 'img/star.svg' : 'img/star-o.svg'),
				alt: 'Рейтинг ' + rating + ' из 10',
			}))
		}

		element.append(wrapper);

		element.append(this.getElement('div', 'rating-number', {}, rating + '/10'));

		return element;
	};

	createSlider = (params = this.options) => {
		const sliderElement = this.getElement('div', 'series');
		const sliderContainer = this.getElement('div', 'swiper-container');
		const sliderWrapper = this.getElement('div', 'swiper-wrapper');

		const episodes = params.main.episodes.map(element => {
			const slide = this.getElement('div', 'swiper-slide');
			const card = this.getElement('figure', 'card');

			card.append(this.getElement('img', 'card-img', {
				src: element.img,
				alt: element.title,
			}));

			const caption = this.getElement('figcaption', 'card-description');
			caption.append(this.getElement('p', 'card-subtitle', {}, element.subTitle));
			caption.append(this.getElement('p', 'card-title', {}, element.title));

			card.append(caption);
			slide.append(card);

			return slide;
		});

		sliderWrapper.append(...episodes);



		sliderContainer.append(sliderWrapper)
		sliderElement.append(sliderContainer)

		if (episodes.length > 1) {
			sliderElement.append(this.getElement('button', 'arrow'));
		}

		return sliderElement;
	};

	createMainPage = (params = this.options) => {
		const element = this.getElement('main');
		const container = this.getElement('div', 'container');
		const mainWrapper = this.getElement('div', 'main-content');
		const wrapper = this.getElement('div', 'content');

		if (params.main.genre) {
			const genreElement = this.getElement('span', ['genre', 'animated', 'fadeInRight'], {}, params.main.genre);
			wrapper.append(genreElement);
		}

		if (params.main.rating) {
			wrapper.append(this.createRating(params.main.rating));
		}

		wrapper.append(this.getElement('h1', ['main-title', 'animated', 'fadeInRight'], {}, params.title));

		if (params.main.description) {
			wrapper.append(this.getElement('p', ['main-description', 'animated', 'fadeInRight'], {}, params.main.description));
		}

		mainWrapper.append(wrapper);

		if (params.main.trailer) {
			wrapper.append(this.getElement('a', ['button', 'animated', 'fadeInRight', 'youtube-modal'], {
				href: params.main.trailer,
			}, 'Смотреть трейлер'));

			const youtubeButton = this.getElement('a', ['play', 'youtube-modal'], {
				href: params.main.trailer,
			});
			youtubeButton.append(this.getElement('img', 'play-img', {
				src: 'img/play.svg',
				alt: 'play'
			}));
			mainWrapper.append(youtubeButton);
		}

		container.append(mainWrapper);

		if (params.main.episodes) {
			container.append(this.createSlider());
		}

		element.append(container);

		return element;
	};

	createFooter = (params = this.options) => {
		const element = this.getElement('footer', 'footer');
		const container = this.getElement('div', 'container');
		const content = this.getElement('div', 'footer-content');

		if (params.footer.copyright) {
			const wrapper = this.getElement('div', 'left');
			wrapper.append(this.getElement('span', 'copyright', {}, params.footer.copyright));
			content.append(wrapper);
		}

		if (params.footer.menu) {
			const wrapper = this.getElement('div', 'right');
			wrapper.append(this.createMenu(params.footer.menu, 'footer-menu', 'footer-link'));
			content.append(wrapper);
		}

		container.append(content);
		element.append(container);

		if (params.footer.backgroundColor) {
			element.style.backgroundColor = params.footer.backgroundColor;
		}

		return element;
	}

	movieConstructor = (selector, container) => {
		let app;
		if (container) {
			app = document.getElementById(container.id).appendChild(this.getElement('div', selector));
		} else {
			app = document.querySelector(selector);
		}
		app.classList.add('body-app');

		if (this.options.backgroundImage) {
			app.style.backgroundImage = "url(" + this.options.backgroundImage + ")";
		}

		if (this.options.backgroundColor) {
			app.style.backgroundColor = this.options.backgroundColor;
		}

		if (this.options.color) {
			app.style.color = this.options.color;
		}

		this.options.title = this.options.title ?? 'Promo Page';
		document.querySelector('title').innerText = this.options.title;

		if (this.options.header) {
			app.append(this.createHeader());
		}

		if (this.options.main) {
			app.append(this.createMainPage());
		}

		if (this.options.footer) {
			app.append(this.createFooter());
		}
	};

};


class PromoPage {
	static instance;
	options;
	constructor(selector, _options) {
		this.options = _options;
		if (Array.isArray(this.options)) {
			this.createMultiplePage(selector);
		} else {
			new MoviePromo('body', this.options);
		}
		self.instance = this;
	}

	static getInstance = () => self.instance;

	createMultiplePage = (selector) => {

		const container = document.querySelector(selector).appendChild(document.createElement('div'));
		container.classList.add('page-container');
		const wrapper = container.appendChild(document.createElement('div'));
		wrapper.classList.add('swiper-wrapper');

		for (const options in this.options) {
			const slide = wrapper.appendChild(document.createElement('div'));
			slide.id = 'container' + options;
			slide.classList.add('swiper-slide');
			new MoviePromo('page', this.options[options], slide);
		}

		const prevBtn = document.createElement('div');
		prevBtn.classList.add('swiper-button-prev')
		container.append(prevBtn);
		const nextBtn = document.createElement('div');
		nextBtn.classList.add('swiper-button-next')
		container.append(nextBtn);
		this.setTitle(0);
	}


	setTitle(page) {
		document.querySelector('title').innerText = this.options[page].title;
	}
}

document.addEventListener('DOMContentLoaded', function () {
	let mySwiper = new Swiper('.page-container', {
		loop: true,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",

		},
	});

	mySwiper.on('slideChange', () => {
		PromoPage.getInstance().setTitle(mySwiper.realIndex);
	});

	new Swiper('.swiper-container', {
		loop: true,
		navigation: {
			nextEl: '.arrow',
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 20
			},
			541: {
				slidesPerView: 2,
				spaceBetween: 40
			}
		}
	});

	const menuButton = document.querySelector('.menu-button');
	const menu = document.querySelector('.header');
	menuButton.addEventListener('click', function () {
		menuButton.classList.toggle('menu-button-active');
		menu.classList.toggle('header-active');
	})
});

