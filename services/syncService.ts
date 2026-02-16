
const API_BASE = 'https://api.keyvalue.xyz';

export const syncService = {
  // Gera uma chave aleatória de 8 caracteres para o usuário
  generateKey(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  },

  // Salva os dados na nuvem
  async upload(key: string, data: any): Promise<boolean> {
    try {
      const payload = {
        timestamp: Date.now(),
        data: btoa(unescape(encodeURIComponent(JSON.stringify(data))))
      };
      
      const response = await fetch(`${API_BASE}/${key}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      return response.ok;
    } catch (e) {
      console.error("Erro no upload para nuvem:", e);
      return false;
    }
  },

  // Busca os dados da nuvem
  async download(key: string): Promise<{data: any, timestamp: number} | null> {
    try {
      const response = await fetch(`${API_BASE}/${key}`);
      if (!response.ok) return null;
      
      const result = await response.json();
      if (!result.data) return null;

      const decodedData = JSON.parse(decodeURIComponent(escape(atob(result.data))));
      return {
        data: decodedData,
        timestamp: result.timestamp
      };
    } catch (e) {
      console.error("Erro no download da nuvem:", e);
      return null;
    }
  }
};
