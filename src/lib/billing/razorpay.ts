export async function razorpayRequest<T>(path: string, init: RequestInit = {}) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('BILLING_NOT_CONFIGURED');

  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) throw new Error(`Razorpay returned HTTP ${response.status}`);
  return response.json() as Promise<T>;
}
