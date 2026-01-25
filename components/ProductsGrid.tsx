
import React from 'react';
import { Box, Plus, Search, Tag, Edit3, Trash2, Eye, Ruler, BoxSelect, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductsGridProps {
  products: Product[];
  onNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onNewProduct, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Box className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Produtos</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar produto..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all w-64"
              />
            </div>
            <button 
              onClick={onNewProduct}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase text-slate-400 font-bold border-b border-slate-50 bg-slate-50/30">
                <th className="py-4 px-6">Produto / Especificações</th>
                <th className="py-4 px-6">Categoria</th>
                <th className="py-4 px-6">Preço Venda / Custo</th>
                <th className="py-4 px-6 text-center">Margem</th>
                <th className="py-4 px-6">Estoque</th>
                <th className="py-4 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const margin = product.price > 0 ? ((product.price - product.costPrice) / product.price) * 100 : 0;
                  return (
                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Tag className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700">{product.name}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {product.size && (
                                <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase" title="Tamanho">
                                  <Ruler className="w-2.5 h-2.5" />
                                  {product.size}
                                </span>
                              )}
                              {product.material && (
                                <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase" title="Material">
                                  <BoxSelect className="w-2.5 h-2.5" />
                                  {product.material}
                                </span>
                              )}
                              {product.finishing && (
                                <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase" title="Acabamento">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  {product.finishing}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">
                            R$ {product.price.toFixed(2)}
                          </span>
                          {product.costPrice > 0 && (
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                              Custo: R$ {product.costPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                          margin > 40 ? 'bg-emerald-100 text-emerald-600' : margin > 20 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {margin.toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-bold ${product.stock < 10 ? 'text-rose-500' : 'text-slate-600'}`}>
                          {product.stock} un
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onEditProduct(product)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-slate-400 hover:text-blue-600" 
                            title="Visualizar Detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onEditProduct(product)}
                            className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-slate-400 hover:text-orange-600" 
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-slate-400 hover:text-rose-600" 
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
