
const API_BASE = 'https://api.keyvalue.xyz';

export const syncService = {
  generateKey(): string {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  },

  // Limpa os dados removendo propriedades de UI e imagens pesadas
  // Isso é crucial para não exceder o limite de 64kb/100kb do servidor gratuito
  cleanupForSync(data: any): any {
    const clean = { ...data };
    
    // Remove estados de interface que não pertencem ao banco de dados
    delete clean.activeView;
    delete clean.dateRange;
    delete clean.hideValues;
    delete clean.isLoading;
    delete clean.isSyncModalOpen;
    delete clean.syncStatus;

    // Remove a Logo para o Sync (Imagens em Base64 são muito pesadas)
    // A logo continuará salva no banco local de cada PC individualmente
    if (clean.companySettings) {
      clean.companySettings = { ...clean.companySettings, logo: '' };
    }

    return clean;
  },

  encode(data: any): string {
    try {
      const cleaned = this.cleanupForSync(data);
      const str = JSON.stringify(cleaned);
      // Codificação UTF-8 segura
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      console.error("Erro na codificação:", e);
      return "";
    }
  },

  decode(base64: string): any {
    try {
      const str = decodeURIComponent(escape(atob(base64)));
      return JSON.parse(str);
    } catch (e) {
      console.error("Erro na decodificação:", e);
      return null;
    }
  },

  async upload(key: string, data: any): Promise<{ success: boolean; error?: string }> {
    try {
      const encodedData = this.encode(data);
      
      // Verifica tamanho aproximado (Base64 + JSON overhead)
      if (encodedData.length > 95000) {
        return { success: false, error: "BANCO MUITO GRANDE. Tente excluir pedidos antigos do histórico." };
      }

      const payload = {
        timestamp: Date.now(),
        data: encodedData,
        v: "2.1"
      };
      
      // Usamos POST. O keyvalue.xyz aceita POST para criar ou atualizar.
      const response = await fetch(`${API_BASE}/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        if (response.status === 413) return { success: false, error: "DADOS MUITO PESADOS PARA A NUVEM." };
        return { success: false, error: `ERRO DO SERVIDOR (${response.status})` };
      }

      return { success: true };
    } catch (e) {
      console.error("Cloud Sync: Falha de rede", e);
      return { success: false, error: "FALHA DE CONEXÃO COM O SERVIDOR." };
    }
  },

  async download(key: string): Promise<{data: any, timestamp: number} | null> {
    try {
      // nocache é vital para que o segundo computador veja a mudança do primeiro
      const response = await fetch(`${API_BASE}/${key}?nocache=${Date.now()}`, {
        method: 'GET',
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
      return null;
    }
  }
};
