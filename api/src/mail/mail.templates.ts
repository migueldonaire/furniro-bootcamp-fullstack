// Email templates: plain HTML, no template library.
// Each function returns the subject and the HTML of one email.

export interface EmailContent {
  subject: string;
  html: string;
}

// The name comes from the user: escape it so nobody can inject HTML
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Shared frame of every email: header, content and footer
function layout(title: string, content: string): string {
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,sans-serif;color:#333">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:8px;padding:32px">
      <h1 style="margin:0 0 24px;color:#b88e2f;font-size:28px">Furniro</h1>
      <h2 style="margin:0 0 16px;font-size:20px">${title}</h2>
      ${content}
      <p style="margin:32px 0 0;font-size:12px;color:#999">
        Si no has sido tú, ignora este email.
      </p>
    </div>
  </body>
</html>`;
}

// Big button with the link (and the link as text, in case the button fails)
function button(link: string, text: string): string {
  return `<p style="margin:24px 0">
        <a href="${link}" style="background:#b88e2f;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold">${text}</a>
      </p>
      <p style="font-size:12px;color:#666">O copia este enlace en el navegador:<br>${link}</p>`;
}

// 1. After registering: confirm the email to activate the account
export function verifyEmailTemplate(name: string, link: string): EmailContent {
  return {
    subject: 'Confirma tu cuenta de Furniro',
    html: layout(
      `¡Hola, ${escapeHtml(name)}!`,
      `<p>Gracias por registrarte. Pulsa el botón para activar tu cuenta.</p>
      ${button(link, 'Activar mi cuenta')}
      <p>El enlace caduca en 24 horas.</p>`,
    ),
  };
}

// 2. Forgot password: link to choose a new one
export function resetPasswordTemplate(
  name: string,
  link: string,
): EmailContent {
  return {
    subject: 'Cambia tu contraseña de Furniro',
    html: layout(
      `Hola, ${escapeHtml(name)}`,
      `<p>Hemos recibido una petición para cambiar tu contraseña.</p>
      ${button(link, 'Elegir una contraseña nueva')}
      <p>El enlace caduca en 30 minutos y solo se puede usar una vez.</p>`,
    ),
  };
}
