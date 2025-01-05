'use server';

export async function fetchProcessDefinitionXml(processDefinitionKey: string) {
  const token = await fetchAuthToken(); // Auflösen der Promise

  console.log('Fetching process definition XML...');
  const response = await fetch(
    `http://localhost:8081/v1/process-definitions/${processDefinitionKey}/xml`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Token einfügen
      },
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to fetch process definition XML: ${response.statusText}`,
    );
  }

  return responseText;
}

export async function fetchAuthToken(): Promise<string> {
  const url =
    'http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token';

  const formData = new URLSearchParams();
  formData.append('username', 'demo'); // Ersetze dies mit deinem Benutzernamen
  formData.append('password', 'demo'); // Ersetze dies mit deinem Passwort
  formData.append('grant_type', 'password'); // Oder 'password', falls Username/Password verwendet wird
  formData.append('client_id', 'camunda-identity'); // Ersetze dies mit deinem Client-ID
  formData.append('client_secret', '2I4NbP2qznopJpu0xcvre2Zq4BwZaKGe'); // Ersetze dies mit deinem Client-Secret
  formData.append('scope', 'openid');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}
