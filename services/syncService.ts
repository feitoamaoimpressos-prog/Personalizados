
const API_BASE = 'https://api.keyvalue.xyz';

export const syncService = {
  // Gera uma chave aleatória segura para sincronização
  generateKey(): string {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  },

  // Codificação robusta para UTF-8 em Base64 (evita erros com acentos)
  encode(data: any): string {
    const str = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(str)));
  },

  // Decodificação robusta
  decode(base64: string): any {
    const str = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(str);
  },

  // Salva os dados na nuvem usando POST (padrão do keyvalue.xyz para chaves novas ou existentes)
  async upload(key: string, data: any): Promise<boolean> {
    try {
      // Remove campos de estado efêmero antes de subir
      const cleanData = { ...data };
      delete cleanData.activeView;
      delete cleanData.isLoading;
      delete cleanData.isSyncModalOpen;

      const payload = {
        timestamp: Date.now(),
        data: this.encode(cleanData),
        appId: 'feitoamao-v1'
      };
      
      const response = await fetch(`${API_BASE}/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      return response.ok;
    } catch (e) {
      console.error("Cloud Sync: Erro no upload:", e);
      return false;
    }
  },

  // Busca os dados da nuvem
  async download(key: string): Promise<{data: any, timestamp: number} | null> {
    try {
      // Cache busting com query string
      const response = await fetch(`${API_BASE}/${key}?nocache=${Date.now()}`);
      if (!response.ok) return null;
      
      const result = await response.json();
      if (!result || !result.data) return null;

      const decodedData = this.decode(result.data);
      return {
        data: decodedData,
        timestamp: result.timestamp || 0
      };
    } catch (e) {
      console.error("Cloud Sync: Erro no download:", e);
      return null;
    }
  }
};
