
(function () {
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* fade sections in as they enter the viewport, project cards staggered */
  var items = document.querySelectorAll(".reveal");
  var lastY = window.scrollY;
  var goingDown = true;

  if (calm || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("visible"); });
  } else {
    document.querySelectorAll(".project").forEach(function (el, i) {
      el.style.transitionDelay = (i * 90) + "ms";
    });

    /* show without animating, used when the reader is moving back up */
    function showInstantly(el) {
      var delay = el.style.transitionDelay;
      el.style.transition = "none";
      el.style.transitionDelay = "0s";
      el.classList.add("visible");
      void el.offsetWidth;
      el.style.transition = "";
      el.style.transitionDelay = delay;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (goingDown) {
            entry.target.classList.add("visible");
          } else {
            showInstantly(entry.target);
          }
        } else {
          /* reset once it is out of sight so it can play again on the way down */
          entry.target.classList.remove("visible");
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* drifting rings in the header, plus the progress bar and active nav link */
  var rings = document.querySelectorAll(".band-deco img, .band-front img");
  var bar = document.getElementById("progress-bar");
  var links = document.querySelectorAll("nav a");
  var sections = document.querySelectorAll("section[id]");
  var ticking = false;

  function frame() {
    var y = window.scrollY;

    if (!calm) {
      rings.forEach(function (ring) {
        var speed = parseFloat(ring.getAttribute("data-speed")) || 0;
        var rot = parseFloat(ring.getAttribute("data-rot")) || 0;
        ring.style.transform = "translate3d(0," + (y * speed) + "px,0) rotate(" + rot + "deg)";
      });
    }

    var height = document.documentElement.scrollHeight - window.innerHeight;
    if (!bar) { ticking = false; return; }
    bar.style.width = (height > 0 ? Math.min(y / height, 1) * 100 : 0) + "%";

    var current = "";
    sections.forEach(function (section) {
      if (y >= section.offsetTop - 140) { current = section.id; }
    });
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y !== lastY) { goingDown = y > lastY; lastY = y; }
    if (!ticking) { window.requestAnimationFrame(frame); ticking = true; }
  }, { passive: true });

  frame();
})();
