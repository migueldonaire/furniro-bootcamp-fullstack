import { MailService } from './mail.service';
import { escapeHtml, verifyEmailTemplate } from './mail.templates';

describe('MailService', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
    process.env.MAIL_FROM = 'furnirobootcampfullstack@gmail.com';
  });

  afterEach(() => {
    delete process.env.BREVO_API_KEY;
  });

  it('without BREVO_API_KEY it does not send anything', async () => {
    await new MailService().sendVerifyEmail('ana@mail.com', 'Ana', 'http://x');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('with BREVO_API_KEY it calls Brevo with the email', async () => {
    process.env.BREVO_API_KEY = 'test-key';
    fetchMock.mockResolvedValue({ ok: true });

    await new MailService().sendResetPassword(
      'ana@mail.com',
      'Ana',
      'http://localhost:5173/reset-password?token=abc',
    );

    const [url, options] = fetchMock.mock.calls[0] as [
      string,
      { headers: Record<string, string>; body: string },
    ];
    const body = JSON.parse(options.body) as {
      to: { email: string }[];
      subject: string;
      htmlContent: string;
    };
    expect(url).toBe('https://api.brevo.com/v3/smtp/email');
    expect(options.headers['api-key']).toBe('test-key');
    expect(body.to).toEqual([{ email: 'ana@mail.com' }]);
    expect(body.subject).toBe('Cambia tu contraseña de Furniro');
    expect(body.htmlContent).toContain('reset-password?token=abc');
  });

  it('throws if Brevo answers with an error', async () => {
    process.env.BREVO_API_KEY = 'test-key';
    fetchMock.mockResolvedValue({ ok: false, status: 401, text: () => 'no' });

    await expect(
      new MailService().sendVerifyEmail('ana@mail.com', 'Ana', 'http://x'),
    ).rejects.toThrow('The email could not be sent');
  });
});

describe('mail templates', () => {
  it('escape the HTML of the name', () => {
    expect(escapeHtml('<b>Ana</b>')).toBe('&lt;b&gt;Ana&lt;/b&gt;');
    const email = verifyEmailTemplate('<script>', 'http://x');
    expect(email.html).not.toContain('<script>');
  });
});
