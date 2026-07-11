import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi, getCaisseUser } from '../../services/caisseApiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoachItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  color: string;
  has_pin: boolean;
}

const DEFAULT_COLORS = ['#1A7A5E', '#185FA5', '#7C3AED', '#E69C2A', '#E24B4A', '#0891B2'];

// ─── Modal Ajouter ────────────────────────────────────────────────────────────

const AddModal: React.FC<{ onClose: () => void; onSaved: () => void }> = ({ onClose, onSaved }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [pin,       setPin]       = useState('');
  const [color,     setColor]     = useState(DEFAULT_COLORS[0]);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const save = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Le prénom et le nom sont requis.');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setError('Le PIN doit contenir exactement 4 chiffres.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await caisseApi.post('/admin/coaches', {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        pin,
        color,
      });
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.message || Object.values(e?.errors ?? {})[0]?.[0] || 'Erreur lors de la création.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-bold text-gray-900">Ajouter un coach</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Prénom</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} autoFocus
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nom</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email (optionnel)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone (optionnel)</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Code PIN (4 chiffres, pour la caisse et le pointage)</label>
            <input value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric" placeholder="••••"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black tracking-widest" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Couleur</label>
            <div className="flex gap-2">
              {DEFAULT_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition ${color === c ? 'border-black scale-110' : 'border-transparent'}`}
                  style={{ background: c }} />
              ))}
            </div>
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
            {saving ? 'Création…' : 'Créer le coach'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────

const AdminCoaches: React.FC = () => {
  const navigate = useNavigate();
  const user = getCaisseUser();

  const [coaches, setCoaches] = useState<CoachItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const [showAdd,    setShowAdd]    = useState(false);
  const [removeCoach, setRemoveCoach] = useState<CoachItem | null>(null);
  const [removing,   setRemoving]   = useState(false);

  useEffect(() => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) { navigate('/caisse'); return; }
  }, [user, navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await caisseApi.get('/admin/coaches');
      setCoaches(res.data ?? []);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirmRemove = async () => {
    if (!removeCoach) return;
    setRemoving(true);
    try {
      await caisseApi.del(`/admin/coaches/${removeCoach.id}`);
      setRemoveCoach(null);
      load();
    } catch (e: any) {
      alert(e?.message || 'Erreur lors du retrait.');
    } finally {
      setRemoving(false);
    }
  };

  const ini = (n: string) => n.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white text-sm transition-colors">← Dashboard</button>
          <span className="text-gray-600">|</span>
          <span className="font-semibold tracking-wide">Gestion des coachs</span>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">
          + Ajouter un coach
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">{error}</div>
        ) : coaches.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Aucun coach pour le moment.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {coaches.map(c => (
              <div key={c.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: c.color }}>
                  {ini(c.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.phone || c.email}</p>
                </div>
                {!c.has_pin && (
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">PIN non défini</span>
                )}
                <button
                  onClick={() => setRemoveCoach(c)}
                  className="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Ajouter */}
      {showAdd && (
        <AddModal onClose={() => setShowAdd(false)} onSaved={load} />
      )}

      {/* Modal Confirmer retrait */}
      {removeCoach && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">Retirer ce coach ?</h3>
            <p className="text-sm text-gray-500 mb-5">
              <span className="font-medium text-gray-900">{removeCoach.name}</span> n'apparaîtra plus sur l'écran de pointage ni dans la caisse.
            </p>
            <p className="text-xs text-blue-700 bg-blue-50 rounded-xl p-3 mb-5">
              ℹ️ Son historique de pointage et ses séances passées sont conservés. Cette action est réversible.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRemoveCoach(null)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={confirmRemove} disabled={removing}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-700 disabled:opacity-40">
                {removing ? 'Retrait…' : 'Retirer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoaches;
