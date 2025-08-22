// SPECIAL CONFIG NEEDED FOR SPA APP INJECTION

export default {
    async fetch(request) {
      const response = await fetch(request);
      const contentType = response.headers.get("content-type") || "";
  
      if (contentType.includes("text/html")) {
        let html = await response.text();
  
        // Inject a script that fetches your GitHub CSS and adds it as a <style> after SPA loads
        const injectScript = `
          <script>
            (async () => {
              try {
                const cssUrl = 'https://raw.githubusercontent.com/tool-ext/docmost-css-js-mods/refs/heads/main/Docmost-2-22.css';
                const res = await fetch(cssUrl);
                const cssText = await res.text();
                const style = document.createElement('style');
                style.textContent = cssText;
                document.head.appendChild(style);
              } catch(e) {
                console.error('Failed to load custom CSS:', e);
              }
            })();
          </script>
        `;
  
        html = html.replace("</head>", `${injectScript}</head>`);
        return new Response(html, response);
      }
  
      return response;
    }
  };
  