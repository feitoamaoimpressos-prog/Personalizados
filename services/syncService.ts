
const API_BASE = 'https://api.keyvalue.xyz';

export const syncService = {
  generateKey(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  },

  async upload(key: string, data: any): Promise<boolean> {
    try {
      // Removemos o que não precisa subir para a nuvem para economizar espaço
      const cleanData = { ...data };
      delete cleanData.activeView;
      delete cleanData.isLoading;
      
      const payload = {
        timestamp: Date.now(),
        source: 'browser-client',
        data: btoa(encodeURIComponent(JSON.stringify(cleanData)))
      };
      
      const response = await fetch(`${API_BASE}/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      return response.ok;
    } catch (e) {
      console.error("Erro crítico no upload:", e);
      return false;
    }
  },

  async download(key: string): Promise<{data: any, timestamp: number} | null> {
    try {
      // Cache busting para garantir que pegamos o dado mais novo
      const response = await fetch(`${API_BASE}/${key}?t=${Date.now()}`);
      if (!response.ok) return null;
      
      const result = await response.json();
      if (!result || !result.data) return null;

      const decodedData = JSON.parse(decodeURIComponent(atob(result.data)));
      return {
        data: decodedData,
        timestamp: result.timestamp || 0
      };
    } catch (e) {
      console.error("Erro crítico no download:", e);
      return null;
    }
  }
};
