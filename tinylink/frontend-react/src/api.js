const API_BASE = import.meta.env.VITE_API_URL;

// Ensure environment variable is present
if (!API_BASE) {
  throw new Error("VITE_API_URL is missing. Set it in your .env file.");
}

const API_URL = `${API_BASE}/api/links`;

export const fetchLinks = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch links');
  return response.json();
};

export const createLink = async (url, code) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, code: code || undefined })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong');
  return data;
};

export const deleteLink = async (code) => {
  const response = await fetch(`${API_URL}/${code}`, {
    method: 'DELETE'
  });

  if (!response.ok) throw new Error('Failed to delete link');
};

export const fetchLinkStats = async (code) => {
  const response = await fetch(`${API_URL}/${code}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Link not found');
    throw new Error('Failed to load statistics');
  }
  return response.json();
};
