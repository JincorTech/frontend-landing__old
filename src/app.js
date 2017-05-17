import ScrollReveal from 'scrollreveal';

window.sr = ScrollReveal({
    reset: false,
    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',
});


// screenshots
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