(function () {
  "use strict";

  var root = document.documentElement;

  // ---------- Theme toggle ----------
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) {}

  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // ---------- Mobile menu ----------
  var menuBtn = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- Header border on scroll ----------
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Active nav link ----------
  var sections = document.querySelectorAll("main section[id]");
  var linkFor = {};
  document.querySelectorAll(".nav-links a[href^='#']").forEach(function (a) {
    linkFor[a.getAttribute("href").slice(1)] = a;
  });
  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(linkFor).forEach(function (k) { linkFor[k].classList.remove("active"); });
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });

    // ---------- Reveal on scroll ----------
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- Publications ----------
  var pubs = Array.prototype.slice.call(document.querySelectorAll(".pub"));
  var years = Array.prototype.slice.call(document.querySelectorAll(".pub-year"));
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var search = document.querySelector(".search");
  var empty = document.querySelector(".no-results");
  var activeType = "all";

  // Titles without a DOI link become a Google Scholar search link.
  pubs.forEach(function (pub) {
    var t = pub.querySelector("span.title");
    if (!t) return;
    var a = document.createElement("a");
    a.className = "title";
    a.href = "https://scholar.google.com/scholar?q=" + encodeURIComponent('"' + t.textContent.trim() + '"');
    a.target = "_blank";
    a.rel = "noopener";
    a.title = "Find on Google Scholar";
    a.textContent = t.textContent;
    t.replaceWith(a);
  });

  // Counts on filter buttons.
  filters.forEach(function (btn) {
    var type = btn.dataset.type;
    var n = type === "all" ? pubs.length : pubs.filter(function (p) { return p.dataset.type === type; }).length;
    var span = document.createElement("span");
    span.className = "count";
    span.textContent = n;
    btn.appendChild(span);
  });

  function applyFilters() {
    var q = search ? search.value.trim().toLowerCase() : "";
    var shown = 0;
    pubs.forEach(function (pub) {
      var okType = activeType === "all" || pub.dataset.type === activeType;
      var okText = !q || pub.textContent.toLowerCase().indexOf(q) !== -1;
      pub.hidden = !(okType && okText);
      if (!pub.hidden) shown++;
    });
    years.forEach(function (y) {
      y.hidden = !y.querySelector(".pub:not([hidden])");
    });
    if (empty) empty.hidden = shown !== 0;
  }

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeType = btn.dataset.type;
      filters.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      applyFilters();
    });
  });
  if (search) search.addEventListener("input", applyFilters);

  // ---------- Footer year ----------
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
