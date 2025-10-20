// Enkel interaktivitet och kontaktformulärhantering
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  yearEl.textContent = new Date().getFullYear();

  // Ladda CV-länk (antingen länk till fil i repo eller PDF)
  const downloadCV = document.getElementById('download-cv');
  downloadCV.href = 'assets/CV_Elin_Axelsson_2025.pdf'; // byt sökväg om du lägger PDF i assets

  // Kontaktformulär
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Skickar...';
    const endpoint = form.dataset.endpoint.trim();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Fyll i alla fält.';
      return;
    }

    // Om användaren fyllt i data-endpoint (t.ex. en Formspree-endpoint) -> skicka POST
    if (endpoint) {
      try {
        const payload = new FormData();
        payload.append('name', name);
        payload.append('email', email);
        payload.append('message', message);

        const res = await fetch(endpoint, {
          method: 'POST',
          body: payload,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (res.ok) {
          status.textContent = 'Meddelandet skickades! Tack.';
          form.reset();
        } else {
          const json = await res.json().catch(()=>({ok:false}));
          status.textContent = (json && json.error) ? ('Fel: ' + json.error) : 'Något gick fel vid skickandet.';
        }
      } catch (err) {
        status.textContent = 'Någonting gick fel: ' + err.message;
      }
    } else {
      // Mailto-fallback (öppnar användarens e-postklient)
      const subject = encodeURIComponent(`Kontakt via portfolio: ${name}`);
      const body = encodeURIComponent(`Namn: ${name}\nE-post: ${email}\n\nMeddelande:\n${message}`);
      window.location.href = `mailto:elin_ax@outlook.com?subject=${subject}&body=${body}`;
      status.textContent = 'Öppnar e-postklienten...';
    }
  });
});
