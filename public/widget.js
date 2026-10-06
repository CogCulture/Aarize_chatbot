(function () {
  // Prevent duplicate initialization
  if (window.__AARIZE_CHATBOT_LOADED__) return;
  window.__AARIZE_CHATBOT_LOADED__ = true;

  // Auto-detect chatbot server origin from the script src
  const currentScript =
    document.currentScript ||
    document.querySelector('script[src*="widget.js"]');
  let baseUrl = "http://34.56.204.149:3000"; // Default fallback

  if (currentScript && currentScript.src) {
    try {
      const url = new URL(currentScript.src);
      baseUrl = url.origin;
    } catch (e) {
      console.warn("[Aarize Chatbot] Could not parse script origin, using default:", baseUrl);
    }
  }

  // Inject styles for the widget button and iframe container
  const style = document.createElement("style");
  style.id = "aarize-widget-styles";
  style.innerHTML = `
    #aarize-chat-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    #aarize-chat-frame {
      width: 420px;
      height: 640px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 100px);
      border: none;
      border-radius: 20px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08);
      background: #ffffff;
      margin-bottom: 16px;
      display: none;
      opacity: 0;
      transform: translateY(20px) scale(0.96);
      transform-origin: bottom right;
      transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #aarize-chat-frame.aarize-open {
      display: block;
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    #aarize-chat-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #111111;
      color: #ffffff;
      border: none;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      position: relative;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      outline: none;
    }

    #aarize-chat-toggle:hover {
      transform: scale(1.06);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    }

    #aarize-chat-toggle:active {
      transform: scale(0.95);
    }

    .aarize-toggle-icon {
      width: 28px;
      height: 28px;
      transition: transform 0.2s ease, opacity 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .aarize-close-icon {
      display: none;
    }

    #aarize-chat-container.is-open .aarize-open-icon {
      display: none;
    }

    #aarize-chat-container.is-open .aarize-close-icon {
      display: flex;
    }

    @media (max-width: 480px) {
      #aarize-chat-container {
        bottom: 16px;
        right: 16px;
      }
      #aarize-chat-frame {
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0;
        border-radius: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Create main container
  const container = document.createElement("div");
  container.id = "aarize-chat-container";

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.id = "aarize-chat-frame";
  iframe.src = baseUrl;
  iframe.title = "Aarize Virtual Assistant";
  iframe.allow = "microphone";

  // Create toggle button
  const button = document.createElement("button");
  button.id = "aarize-chat-toggle";
  button.setAttribute("aria-label", "Toggle Aarize Chat");

  button.innerHTML = `
    <div class="aarize-toggle-icon aarize-open-icon">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <div class="aarize-toggle-icon aarize-close-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  `;

  // Toggle open/close logic
  let isOpen = false;

  function toggleChat(forceState) {
    isOpen = typeof forceState === "boolean" ? forceState : !isOpen;

    if (isOpen) {
      iframe.style.display = "block";
      // Force repaint before adding class for smooth transition
      void iframe.offsetWidth;
      iframe.classList.add("aarize-open");
      container.classList.add("is-open");
    } else {
      iframe.classList.remove("aarize-open");
      container.classList.remove("is-open");
      setTimeout(() => {
        if (!isOpen) iframe.style.display = "none";
      }, 250);
    }
  }

  button.onclick = () => toggleChat();

  // Listen for postMessage from inside iframe (e.g. if close button inside chatbot is pressed)
  window.addEventListener("message", function (event) {
    if (event.origin !== baseUrl) return;
    if (event.data && event.data.type === "AARIZE_CHAT_CLOSE") {
      toggleChat(false);
    }
  });

  // Append elements to DOM
  container.appendChild(iframe);
  container.appendChild(button);
  document.body.appendChild(container);
})();
