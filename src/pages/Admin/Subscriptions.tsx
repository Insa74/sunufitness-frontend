import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi, getCaisseUser } from '../../services/caisseApiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Membre { id: number; nom: string; email: string; phone: string; }

interface Sub {
  id: number;
  membre: Membre;
  title: string;
  product_slug: string;
  type: string;
  montant: number;
  devise: string;
  start_date: string;
  end_date: string | null;
  end_datetime: string | null;
  status: string;
  payment_method: string | null;
  cree_par: string;
  cree_par_id: number | null;
  created_at: string;
  recu_numero: string | null;
}

interface Coach { id: number; nom: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt    = (n: number) => new Intl.NumberFormat('fr-SN').format(n);
const fmtXOF = (n: number) => fmt(n) + ' XOF';

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  active:   { label: 'Actif',    cls: 'bg-green-100 text-green-700' },
  expired:  { label: 'Expiré',   cls: 'bg-gray-100 text-gray-500' },
  canceled: { label: 'Annulé',   cls: 'bg-red-100 text-red-600' },
  pending:  { label: 'En attente', cls: 'bg-yellow-100 text-yellow-700' },
  failed:   { label: 'Échoué',   cls: 'bg-red-100 text-red-600' },
};

const STATUSES = ['active', 'expired', 'canceled', 'pending'];

// ─── Modal Modifier ───────────────────────────────────────────────────────────

const EditModal: React.FC<{
  sub: Sub;
  onClose: () => void;
  onSaved: () => void;
}> = ({ sub, onClose, onSaved }) => {
  const [title,      setTitle]      = useState(sub.title || '');
  const [startDate,  setStartDate]  = useState(sub.start_date ? sub.start_date.split('/').reverse().join('-') : '');
  const [endDate,    setEndDate]    = useState(sub.end_date   ? sub.end_date.split('/').reverse().join('-')   : '');
  const [status,     setStatus]     = useState(sub.status);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await caisseApi.put(`/admin/subscriptions/${sub.id}`, {
        title,
        start_date: startDate || undefined,
        end_date:   endDate   || undefined,
        status,
      });
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la modification.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-bold text-gray-900">Modifier l'abonnement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 text-sm">
            <p className="font-semibold text-gray-900">{sub.membre.nom}</p>
            <p className="text-gray-400 text-xs">{sub.recu_numero || '—'}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Libellé</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date début</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date fin</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black bg-white">
              {STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]?.label ?? s}</option>
              ))}
            </select>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Annuler
          </button>
          <button onClick={save} disabled={saving}
            className="flex-1 bg-black text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-800 disabled:opacity-40">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────

const AdminSubscriptions: React.FC = () => {
  const navigate = useNavigate();
  const user = getCaisseUser();

  const [subs,       setSubs]       = useState<Sub[]>([]);
  const [coaches,    setCoaches]    = useState<Coach[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  // Filtres
  const [search,     setSearch]     = useState('');
  const [date,       setDate]       = useState('');
  const [coachId,    setCoachId]    = useState('');
  const [statusF,    setStatusF]    = useState('');

  // Modals
  const [editSub,    setEditSub]    = useState<Sub | null>(null);
  const [deleteSub,  setDeleteSub]  = useState<Sub | null>(null);
  const [deleting,   setDeleting]   = useState(false);

  useEffect(() => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) { navigate('/caisse'); return; }
  }, [user, navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (date)   params.set('date', date);
      if (statusF) params.set('status', statusF);
      const res: any = await caisseApi.get(`/admin/subscriptions?${params}`);
      setSubs(res.data?.data ?? res.data ?? []);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, [search, date, statusF]);

  useEffect(() => {
    caisseApi.get('/admin/subscriptions/coaches').then((res: any) => {
      setCoaches(res.data ?? []);
    }).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    if (!deleteSub) return;
    setDeleting(true);
    try {
      await caisseApi.del(`/admin/subscriptions/${deleteSub.id}`);
      setDeleteSub(null);
      load();
    } catch (e: any) {
      alert(e?.message || 'Erreur lors de la suppression.');
    } finally {
      setDeleting(false);
    }
  };

  // Filtre coach côté client (coach stocké en metadata)
  const filteredSubs = coachId
    ? subs.filter(s => String(s.cree_par_id) === coachId)
    : subs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white text-sm transition-colors">← Dashboard</button>
          <span className="text-gray-600">|</span>
          <span className="font-semibold tracking-wide">Gestion des abonnements</span>
        </div>
        <span className="text-xs text-gray-400">{filteredSubs.length} résultat{filteredSubs.length > 1 ? 's' : ''}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Filtres */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un membre…"
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black"
            />
          </div>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black bg-white"
          />
          <select
            value={coachId}
            onChange={e => setCoachId(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black bg-white"
          >
            <option value="">Tous les vendeurs</option>
            {coaches.map(c => (
              <option key={c.id} value={String(c.id)}>{c.nom}</option>
            ))}
          </select>
          <select
            value={statusF}
            onChange={e => setStatusF(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black bg-white"
          >
            <option value="">Tous les statuts</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]?.label ?? s}</option>
            ))}
          </select>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">{error}</div>
        ) : filteredSubs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Aucun abonnement trouvé.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Membre</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Service</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Montant</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Début</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Fin</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Vendeur</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Statut</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.map(s => {
                    const st = STATUS_LABELS[s.status] ?? { label: s.status, cls: 'bg-gray-100 text-gray-500' };
                    return (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{s.membre.nom}</p>
                          <p className="text-xs text-gray-400">{s.membre.phone || s.membre.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-800">{s.title}</p>
                          {s.recu_numero && <p className="text-xs text-gray-400">{s.recu_numero}</p>}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{fmtXOF(s.montant)}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.start_date || '—'}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.end_datetime || s.end_date || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{s.cree_par}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditSub(s)}
                              className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:border-black hover:text-black transition font-medium"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => setDeleteSub(s)}
                              className="text-xs px-2.5 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Modifier */}
      {editSub && (
        <EditModal sub={editSub} onClose={() => setEditSub(null)} onSaved={load} />
      )}

      {/* Modal Confirmer suppression */}
      {deleteSub && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">Supprimer cet abonnement ?</h3>
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-medium text-gray-900">{deleteSub.membre.nom}</span> — {deleteSub.title}
            </p>
            <p className="text-sm text-gray-500 mb-5">
              {fmtXOF(deleteSub.montant)} · {deleteSub.start_date}
            </p>
            <p className="text-xs text-red-600 bg-red-50 rounded-xl p-3 mb-5">
              ⚠️ La transaction liée sera également annulée. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteSub(null)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-700 disabled:opacity-40">
                {deleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;
