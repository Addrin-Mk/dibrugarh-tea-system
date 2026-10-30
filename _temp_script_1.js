
  // Immediate Portal Gate Check to prevent UI flicker
  (function() {
    try {
      if (sessionStorage.getItem("tea_portal_auth") !== "true") {
        document.documentElement.classList.add("portal-locked");
      }
    } catch(e) {}
  })();
