import ScrollReveal from 'scrollreveal';
import Siema from 'siema';

// scroll
window.sr = ScrollReveal({
    duration: 300,
    reset: false,
    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',
});

// landing
sr.reveal('.js-landing-section', {
    delay: 550,
    duration: 300,
    distance: '80px',
    scale: 1,
    opaicty: 1,
    viewFactor: 0.00001
});

// start
sr.reveal('.start__name', { delay: 300, origin: 'top', distance: '50px' });
sr.reveal('.start__title', { delay: 200, origin: 'top', distance: '50px' });
sr.reveal('.start__step--first', { delay: 400, distance: '50px' });
sr.reveal('.start__step--second', { delay: 500, distance: '50px' });
sr.reveal('.start__step--third', { delay: 600, distance: '50px' });
sr.reveal('.start__divider', { delay: 800, distance: '0px' });
sr.reveal('.start__button', { delay: 800, distance: '100px' });

// steps
sr.reveal('.step-section__number', { delay: 300, distance: '0px' });
sr.reveal('.step-section__title', { delay: 200 });
sr.reveal('.js-screenshot-first', { delay: 200, duration: 700 });
sr.reveal('.js-screenshot-second', { delay: 200, duration: 700 });
sr.reveal('.js-screenshot-third', { delay: 200, duration: 700 });
sr.reveal('.step-section__text', { delay: 200 });
sr.reveal('.screenshot__dots', { delay: 200 })

// footer
sr.reveal('.footer__logo', { delay: 200, origin: 'top', distance: '50px' });
sr.reveal('.footer__description', { delay: 300, origin: 'top', distance: '50px' });
sr.reveal('.footer__try-button', { delay: 400, origin: 'top', distance: '50px' });
sr.reveal('.js-social-network1', { delay: 500, distance: '50px' });
sr.reveal('.js-social-network2', { delay: 600, distance: '50px' });
sr.reveal('.js-social-network3', { delay: 500, distance: '50px' });
sr.reveal('.js-social-network4', { delay: 600, distance: '50px' });
sr.reveal('.js-social-network5', { delay: 700, distance: '50px' });

// siema
const siema = new Siema({
    selector: '.js-slider',
    duration: 500,
    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',
    perPage: 1,
    startIndex: 0,
    threshold: 20,
    draggable: false,
    loop: false
});

const dots = [].map.call(document.querySelectorAll('.js-dot'), obj => obj);
const slides = [].map.call(document.querySelectorAll('.js-slide'), obj => obj);

const setActive = (collection, index) => {
    const element = collection[index];
    const className = element.className
    collection.map(el => el.classList.remove('active'));
    element.classList.toggle('active');
}

setActive(dots, 0);
setActive(slides, 0);

dots.map((dot, i) => {
    dot.addEventListener('click', () => {
        setActive(dots, i);
        setActive(slides, i);
        return siema.goTo(i);
    });
})