// Email obfuscation: construct mailto links from data attributes
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".js-email").forEach((link) => {
    const user = link.getAttribute("data-user");
    const domain = link.getAttribute("data-domain");
    if (!user || !domain) return;

    // If already set (or user has JS disabled), don't override.
    const existingHref = link.getAttribute("href") || "";
    if (existingHref.startsWith("mailto:")) return;

    const subject = link.getAttribute("data-subject") || "";
    const email = `${user}${String.fromCharCode(64)}${domain}`;

    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);

    const href = `mailto:${email}${params.toString() ? `?${params.toString()}` : ""}`;
    link.setAttribute("href", href);

    // Accessibility label: avoid literal "@"
    link.setAttribute("aria-label", `Email us at ${user} at ${domain}`);
  });
});

// Accessible menu toggle (button controls nav via aria-expanded)
(() => {
  const btn = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-site-nav]");
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.dataset.open === "true") {
      setOpen(false);
      btn.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (nav.dataset.open !== "true") return;
    const target = e.target;
    if (!nav.contains(target) && target !== btn) setOpen(false);
  });
})();
