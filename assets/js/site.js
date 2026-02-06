// Email obfuscation: construct mailto links from data attributes
document.addEventListener('DOMContentLoaded', () => {
  const emailLinks = document.querySelectorAll('.js-email');
  emailLinks.forEach((link) => {
    const user = link.getAttribute('data-user');
    const domain = link.getAttribute('data-domain');
    const subject = link.getAttribute('data-subject');
    if (user && domain) {
      const email = user + String.fromCharCode(64) + domain;
      let href = 'm' + 'a' + 'i' + 'l' + 't' + 'o' + ':' + email;
      if (subject) {
        href += '?' + 's' + 'u' + 'b' + 'j' + 'e' + 'c' + 't' + '=' + encodeURIComponent(subject);
      }
      link.href = href;
      // aria-label required: use 'at' instead of '@' (avoid literal @ in label)
      const ariaLabel = 'Email us at ' + user + ' at ' + domain;
      link.setAttribute('aria-label', ariaLabel);
      // Do NOT replace visible link text with the raw email
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
