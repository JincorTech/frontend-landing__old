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