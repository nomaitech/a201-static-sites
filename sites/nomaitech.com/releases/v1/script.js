const reveals = document.querySelectorAll(
  ".preview-card, .step-card, .tutorial-card, .service-card, .card, .stat, .cta-card, .section-header"
);

const onIntersect = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(onIntersect, {
  threshold: 0.2,
});

reveals.forEach((el, index) => {
  el.classList.add("reveal");
  el.style.transitionDelay = `${Math.min(index * 60, 300)}ms`;
  observer.observe(el);
});
