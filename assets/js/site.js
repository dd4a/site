// Email obfuscation: construct mailto links from data attributes
document.addEventListener('DOMContentLoaded', () => {
  const emailLinks = document.querySelectorAll('.js-email');
  emailLinks.forEach((link) => {
    const user = link.getAttribute('data-user');
    const domain = link.getAttribute('data-domain');
    const subject = link.getAttribute('data-subject');
    if (user && domain) {
      const email = user + '@' + domain;
      let href = 'mailto:' + email;
      if (subject) {
        href += '?subject=' + encodeURIComponent(subject);
      }
      link.href = href;
      // Set aria-label with email address (no @ symbol to avoid screen reader confusion)
      const ariaEmail = user + ' at ' + domain;
      link.setAttribute('aria-label', link.textContent + ' at ' + ariaEmail);
      // Do NOT replace link text with raw email
    }
  });
});

// Accessible menu toggle (button controls nav via aria-expanded)
(() => {
  const btn = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-site-nav]');
  if (!btn || !nav) return;

  const setOpen = (open) => {
    nav.dataset.open = open ? "true" : "false";
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  setOpen(false);

  btn.addEventListener("click", () => {
    const open = nav.dataset.open !== "true";
    setOpen(open);
    if (open) {
      const firstLink = nav.querySelector("a");
      if (firstLink) firstLink.focus();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.dataset.open === "true") {
      setOpen(false);
      btn.focus();
    }
  });

  // Close when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (nav.dataset.open !== "true") return;
    const target = e.target;
    if (!nav.contains(target) && target !== btn) setOpen(false);
  });
})();
