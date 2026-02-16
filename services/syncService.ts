
const API_BASE = 'https://api.keyvalue.xyz';

export const syncService = {
  generateKey(): string {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  },

  // Limpeza profunda para garantir que o pareamento funcione em redes instáveis
  cleanupForSync(data: any): any {
    const clean = { ...data };
    
    // 1. Remove imagens e logos (pesam muito)
    if (clean.companySettings) {
      clean.companySettings = { ...clean.companySettings, logo: '' };
    }

    // 2. Remove pedidos muito antigos (mais de 60 dias) do histórico para encolher o banco
    if (clean.orders && clean.orders.length > 50) {
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      const limitDate = sixtyDaysAgo.toISOString().split('T')[0];
      
      clean.orders = clean.orders.filter((o: any) => {
        // Mantém tudo que não está entregue ou que é recente
        if (o.productionStatus !== 'Pedido entregue') return true;
        return o.date >= limitDate;
      });
    }

    // 3. Remove metadados de UI
    delete clean.activeView;
    delete clean.dateRange;
    delete clean.hideValues;
    delete clean.isLoading;
    delete clean.isSyncModalOpen;
    delete clean.syncStatus;

    return clean;
  },

  encode(data: any): string {
    try {
      const cleaned = this.cleanupForSync(data);
      const str = JSON.stringify(cleaned);
      // btoa + encodeURIComponent para suportar caracteres especiais (acentos)
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return "";
    }
  },

  decode(base64: string): any {
    try {
      const str = decodeURIComponent(escape(atob(base64)));
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  },

  async upload(key: string, data: any): Promise<{ success: boolean; error?: string }> {
    try {
      const encodedData = this.encode(data);
      
      // Limite de segurança para evitar erro 413
      if (encodedData.length > 90000) {
        return { success: false, error: "BANCO MUITO CHEIO. Limpe o histórico de pedidos entregues." };
      }

      const payload = {
        timestamp: Date.now(),
        data: encodedData,
        v: "2.5"
      };
      
      const response = await fetch(`${API_BASE}/${key}`, {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        return { success: false, error: `SERVIDOR INSTÁVEL (${response.status})` };
      }

      return { success: true };
    } catch (e) {
      console.error("Erro de rede no upload:", e);
      return { success: false, error: "FALHA DE CONEXÃO. Verifique sua internet." };
    }
  },

  async download(key: string): Promise<{data: any, timestamp: number} | null> {
    try {
      // Usamos cache: no-store e timestamp na URL para forçar o dado mais novo
      const response = await fetch(`${API_BASE}/${key}?t=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
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
