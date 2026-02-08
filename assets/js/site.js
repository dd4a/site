// Email obfuscation: decode base64 email and construct mailto links
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".js-email").forEach((link) => {
    const encodedEmail = link.getAttribute("data-email");
    if (!encodedEmail) return;

    // Decode base64 email
    let email;
    try {
      email = atob(encodedEmail);
    } catch (e) {
      return;
    }
    // If href isn't already a mailto, construct and set it (preserve existing mailto)
    const existingHref = link.getAttribute("href") || "";
    const subject = link.getAttribute("data-subject") || "";

    if (!existingHref.startsWith("mailto:")) {
      const params = new URLSearchParams();
      if (subject) params.set("subject", subject);

      const href = `mailto:${email}${params.toString() ? `?${params.toString()}` : ""}`;
      link.setAttribute("href", href);
    }

    // Always set aria-label and avoid using the literal "@" in the label
    const emailWithoutAt = email.replace("@", " at ");
    link.setAttribute("aria-label", `Email us at ${emailWithoutAt}`);
  });
});

// Accessible menu toggle (button controls nav via aria-expanded)
(() => {
  const btn = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-site-nav]");
  if (!btn || !nav) return;

function isMobile() {
  return window.matchMedia("(max-width: 767px)").matches;
}

  const setOpen = (open) => {
  // Desktop: nav should always be available/visible; Mobile: toggle it.
  const mobile = isMobile();
  const actuallyOpen = mobile ? open : true;

  // Semantic visibility (removes from layout + a11y tree when hidden)
  nav.hidden = !actuallyOpen;

  // State hooks (keep CSS + ARIA in sync)
  nav.dataset.open = actuallyOpen ? "true" : "false";
  btn.setAttribute("aria-expanded", actuallyOpen ? "true" : "false");

  // Keyboard reachability:
  // - Mobile: only tabbable when open
  // - Desktop: normal links (no tabindex override)
  const links = nav.querySelectorAll("a");
  if (mobile) {
    links.forEach((link) => (link.tabIndex = actuallyOpen ? 0 : -1));
  } else {
    links.forEach((link) => link.removeAttribute("tabindex"));
  }
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
    if (!nav.contains(target) && !btn.contains(target) setOpen(false);
  });

// Close menu when focus leaves nav and toggle
document.addEventListener("focusin", (event) => {
  if (btn.getAttribute("aria-expanded") === "true") {
    const focused = event.target;
    if (!nav.contains(focused) && !btn.contains(focused)) {
      setOpen(false);
    }
  }
});

// Close menu when a nav link is activated
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setOpen(false);
  }
});

})();
