const getStorageKey = (clientId) => `por_client_favorites_${clientId}`;

export function getClientFavorites(clientId) {
  if (!clientId) return [];

  try {
    const savedFavorites = JSON.parse(localStorage.getItem(getStorageKey(clientId)) || '[]');
    return Array.isArray(savedFavorites) ? savedFavorites : [];
  } catch (error) {
    console.error('Failed to load client favorites:', error);
    return [];
  }
}

export function saveClientFavorites(clientId, favorites) {
  if (!clientId) return;
  localStorage.setItem(getStorageKey(clientId), JSON.stringify(favorites));
}
