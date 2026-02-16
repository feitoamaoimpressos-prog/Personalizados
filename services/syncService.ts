
const API_BASE = 'https://api.keyvalue.xyz';

export const syncService = {
  generateKey(): string {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  },

  // Codificação segura e compacta
  encode(data: any): string {
    // Removemos a logo do sync de nuvem por ser muito pesada (geralmente > 100kb)
    // Isso evita o erro 413 (Payload Too Large) que trava o pareamento
    const dataToSync = { ...data };
    if (dataToSync.companySettings) {
      dataToSync.companySettings = { ...dataToSync.companySettings, logo: '' };
    }
    
    const str = JSON.stringify(dataToSync);
    return btoa(unescape(encodeURIComponent(str)));
  },

  decode(base64: string): any {
    try {
      const str = decodeURIComponent(escape(atob(base64)));
      return JSON.parse(str);
    } catch (e) {
      console.error("Falha ao decodificar dados da nuvem", e);
      return null;
    }
  },

  async upload(key: string, data: any): Promise<boolean> {
    try {
      const payload = {
        timestamp: Date.now(),
        data: this.encode(data),
        v: 2
      };
      
      const response = await fetch(`${API_BASE}/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      return response.ok;
    } catch (e) {
      console.warn("Cloud Sync: Erro ao enviar para nuvem", e);
      return false;
    }
  },

  async download(key: string): Promise<{data: any, timestamp: number} | null> {
    try {
      // Adiciona timestamp para evitar cache do navegador
      const response = await fetch(`${API_BASE}/${key}?nocache=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) return null;
      
      const result = await response.json();
      if (!result || !result.data) return null;

      const decodedData = this.decode(result.data);
      return {
        data: decodedData,
        timestamp: result.timestamp || 0
      };
    } catch (e) {
      console.warn("Cloud Sync: Erro ao baixar da nuvem", e);
      return null;
    }
  }
};
