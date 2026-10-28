import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  FileText,
  HelpCircle,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  Trash2,
  Edit2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KnowledgeCategory, KnowledgeItem, KnowledgeSourceType } from '../../types';

export const KnowledgePage: React.FC = () => {
  const { knowledge, addKnowledgeItem, updateKnowledgeItem, deleteKnowledgeItem, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<KnowledgeCategory>('products');
  const [formSourceType, setFormSourceType] = useState<KnowledgeSourceType>('document');
  const [formContent, setFormContent] = useState('');

  const categories: { id: KnowledgeCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Knowledge' },
    { id: 'products', label: 'Product Formulations & Pricing' },
    { id: 'shipping', label: 'Shipping & Delivery TAT' },
    { id: 'returns', label: 'Returns & Guarantee' },
    { id: 'faqs', label: 'Customer FAQs' },
    { id: 'policies', label: 'B2B & Terms' }
  ];

  const filteredKnowledge = knowledge.filter(k => {
    const matchesCategory = selectedCategory === 'all' || k.category === selectedCategory;
    const matchesSearch =
      k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (isEditingId) {
      const existing = knowledge.find(k => k.id === isEditingId);
      if (existing) {
        updateKnowledgeItem({
          ...existing,
          title: formTitle,
          category: formCategory,
          sourceType: formSourceType,
          content: formContent,
          lastUpdated: 'Just now'
        });
      }
    } else {
      addKnowledgeItem({
        title: formTitle,
        category: formCategory,
        sourceType: formSourceType,
        content: formContent,
        lastUpdated: 'Just now',
        assignedAgents: ['agent-1', 'agent-2'],
        status: 'indexed',
        tokenCount: Math.round(formContent.length / 4)
      });
    }

    setIsAddModalOpen(false);
    setIsEditingId(null);
    setFormTitle('');
    setFormContent('');
  };

  const handleEdit = (item: KnowledgeItem) => {
    setIsEditingId(item.id);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormSourceType(item.sourceType);
    setFormContent(item.content);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Agent Knowledge Base</h1>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              RAG Vector Store (Simulated)
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Ingest brand policies, detergent formulations, courier timelines, and FAQs for instant semantic retrieval.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setIsEditingId(null);
              setFormTitle('');
              setFormContent('');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Knowledge Document</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles, pricing guidelines, ingredients, FAQs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredKnowledge.map(doc => (
          <div
            key={doc.id}
            className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#635BFF] flex items-center justify-center text-xs">
                    {doc.sourceType === 'catalog' ? (
                      <ShoppingBag className="w-4 h-4" />
                    ) : doc.sourceType === 'faq' ? (
                      <HelpCircle className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {doc.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{doc.title}</h3>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded capitalize shrink-0 ${
                    doc.status === 'indexed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {doc.status.replace('_', ' ')}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-600 line-clamp-4 leading-relaxed font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {doc.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="tabular-nums font-mono">{doc.tokenCount} tokens</span>
                <span>·</span>
                <span className="tabular-nums font-mono">{doc.viewsOrUses} uses</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(doc)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                  title="Edit document"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteKnowledgeItem(doc.id)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                  title="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD/EDIT DOCUMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {isEditingId ? 'Edit Knowledge Document' : 'Ingest New Knowledge Document'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwalifestive Gifting Guidelines & Bulk Tiers"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as KnowledgeCategory)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="products">Products & Pricing</option>
                    <option value="shipping">Shipping & TAT</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="faqs">Customer FAQs</option>
                    <option value="policies">B2B Policies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Source Format</label>
                  <select
                    value={formSourceType}
                    onChange={e => setFormSourceType(e.target.value as KnowledgeSourceType)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="document">Text Document</option>
                    <option value="catalog">Product Catalog</option>
                    <option value="faq">FAQ Collection</option>
                    <option value="pdf">PDF Handbook</option>
                    <option value="url">Website URL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Content (Indexed for Agent Vector Retrieval)
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste clear brand specifications, policy steps, or Q&A..."
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  className="w-full p-3 font-mono text-xs border border-slate-200 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-xs cursor-pointer"
                >
                  {isEditingId ? 'Update & Re-Index' : 'Index Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
