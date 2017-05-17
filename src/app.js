import ScrollReveal from 'scrollreveal';
import Siema from 'siema';

// scroll
window.sr = ScrollReveal({
    reset: false,
    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',
});

const screenshotConfig = { delay: 200, duration: 700 };

sr.reveal('.js-screenshot-first', screenshotConfig);
sr.reveal('.js-screenshot-second', screenshotConfig);
sr.reveal('.js-screenshot-third', screenshotConfig);

sr.reveal('.js-landing-section', {
    delay: 550,
    duration: 300,
    distance: '80px',
    scale: 1,
    opaicty: 1,
    viewFactor: 0.00001
});


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

const dots = document.querySelectorAll('.js-dot');
const dotsArray = [].map.call(dots, obj => obj);

dotsArray.map((dot, i) => {
    dot.addEventListener('click', () => siema.goTo(i))
})