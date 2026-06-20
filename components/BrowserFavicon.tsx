"use client";

import { useEffect } from "react";

const emojiFavicon = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="32" y="48" font-size="48" text-anchor="middle">🪐</text></svg>`,
)}`;

const botPattern =
  /Googlebot|Googlebot-Image|Google-InspectionTool|AdsBot-Google|Mediapartners-Google/i;

function applyEmojiFavicon() {
  const icons = document.head.querySelectorAll<HTMLLinkElement>(
    'link[rel="icon"], link[rel="shortcut icon"]',
  );

  icons.forEach((icon) => {
    icon.dataset.searchFavicon = icon.href;
    icon.type = "image/svg+xml";
    icon.sizes.value = "any";
    icon.href = emojiFavicon;
  });

  if (!document.head.querySelector('link[data-browser-favicon="emoji"]')) {
    const browserIcon = document.createElement("link");
    browserIcon.rel = "icon";
    browserIcon.type = "image/svg+xml";
    browserIcon.sizes.value = "any";
    browserIcon.href = emojiFavicon;
    browserIcon.dataset.browserFavicon = "emoji";
    document.head.appendChild(browserIcon);
  }
}

export function BrowserFavicon() {
  useEffect(() => {
    if (botPattern.test(navigator.userAgent)) {
      return;
    }

    applyEmojiFavicon();
  }, []);

  return null;
}
