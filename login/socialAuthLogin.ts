/**
 * Social auth login views accept only POST with a CSRF token.
 * Gets the token (it also sets the csrftoken cookie) and submits a form to /login/<backend>/
 */
export async function socialAuthLogin(backend: string) {
    const response = await fetch('/api/auth/csrf', { credentials: 'same-origin' });
    const { csrf_token } = await response.json();
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/login/${backend}/`;
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'csrfmiddlewaretoken';
    tokenInput.value = csrf_token;
    form.appendChild(tokenInput);
    document.body.appendChild(form);
    form.submit();
}
