import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi, getCaisseUser } from '../../services/caisseApiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Employee { id: number; name: string; color: string; }

interface Shift {
  id: number;
  user_id: number;
  user_name: string;
  color: string;
  day_index: number;
  start_time: string;
  end_time: string;
  label: string | null;
  location: string | null;
  hours: number;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// ─── Helpers date ─────────────────────────────────────────────────────────────

function getMonday(d: Date): Date {
  const dt = new Date(d);
  const day = dt.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  dt.setDate(dt.getDate() + diff);
  dt.setHours(0, 0, 0, 0);
  return dt;
}
function addDays(d: Date, n: number): Date {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt;
}
function fmtISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function fmt(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// ─── Modal Ajouter / Modifier ─────────────────────────────────────────────────

const ShiftModal: React.FC<{
  shift: Shift | null;
  defaultDayIndex: number;
  weekStart: Date;
  employees: Employee[];
  onClose: () => void;
  onSaved: () => void;
}> = ({ shift, defaultDayIndex, weekStart, employees, onClose, onSaved }) => {
  const [userId,   setUserId]   = useState(shift ? String(shift.user_id) : (employees[0] ? String(employees[0].id) : ''));
  const [dayIndex, setDayIndex] = useState(shift ? shift.day_index : defaultDayIndex);
  const [startTime,setStartTime]= useState(shift?.start_time ?? '09:00');
  const [endTime,  setEndTime]  = useState(shift?.end_time ?? '17:00');
  const [breakMin, setBreakMin] = useState(0);
  const [label,    setLabel]    = useState(shift?.label ?? '');
  const [location, setLocation] = useState(shift?.location ?? '');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const save = async () => {
    if (!userId) { setError('Sélectionnez un coach.'); return; }
    if (endTime <= startTime) { setError("L'heure de fin doit être après l'heure de début."); return; }
    setSaving(true);
    setError(null);
    const payload = {
      user_id: Number(userId),
      week_start: fmtISO(weekStart),
      day_index: dayIndex,
      start_time: startTime,
      end_time: endTime,
      break_minutes: breakMin || 0,
      label: label.trim() || undefined,
      location: location.trim() || undefined,
    };
    try {
      if (shift) {
        await caisseApi.put(`/admin/schedule/${shift.id}`, payload);
      } else {
        await caisseApi.post('/admin/schedule', payload);
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.message || Object.values(e?.errors ?? {})[0]?.[0] || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-bold text-gray-900">{shift ? 'Modifier le créneau' : 'Ajouter un créneau'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Coach</label>
            <select value={userId} onChange={e => setUserId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black bg-white">
              {employees.map(e => (
                <option key={e.id} value={String(e.id)}>{e.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Jour</label>
            <select value={dayIndex} onChange={e => setDayIndex(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black bg-white">
              {DAYS.map((d, i) => (
                <option key={i} value={i}>{d} — {fmt(addDays(weekStart, i))}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Début</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fin</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Pause (minutes, optionnel)</label>
            <input type="number" min={0} max={120} value={breakMin}
              onChange={e => setBreakMin(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Libellé (optionnel)</label>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Ex: Ouverture, Fermeture…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Lieu (optionnel)</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Studio, Bar, Accueil…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
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
            {saving ? 'Enregistrement…' : shift ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────

const AdminSchedule: React.FC = () => {
  const navigate = useNavigate();
  const user = getCaisseUser();

  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts,    setShifts]    = useState<Shift[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const [addDayIndex, setAddDayIndex] = useState<number | null>(null);
  const [editShift,   setEditShift]   = useState<Shift | null>(null);
  const [deleteShift, setDeleteShift] = useState<Shift | null>(null);
  const [deleting,    setDeleting]    = useState(false);

  useEffect(() => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) { navigate('/caisse'); return; }
  }, [user, navigate]);

  useEffect(() => {
    caisseApi.get<{ data: Employee[] }>('/planning/employees').then(res => {
      setEmployees(res.data ?? []);
    }).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await caisseApi.get(`/planning/week?week=${fmtISO(weekStart)}`);
      setShifts(res.data ?? []);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    if (!deleteShift) return;
    setDeleting(true);
    try {
      await caisseApi.del(`/admin/schedule/${deleteShift.id}`);
      setDeleteShift(null);
      load();
    } catch (e: any) {
      alert(e?.message || 'Erreur lors de la suppression.');
    } finally {
      setDeleting(false);
    }
  };

  const shiftsByDay = (i: number) => shifts.filter(s => s.day_index === i).sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white text-sm transition-colors">← Dashboard</button>
          <span className="text-gray-600">|</span>
          <span className="font-semibold tracking-wide">Gestion du planning</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Navigation semaine */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:border-black transition font-medium">
            ← Semaine préc.
          </button>
          <span className="text-sm font-semibold text-gray-900">
            Semaine du {fmt(weekStart)} au {fmt(addDays(weekStart, 6))}
          </span>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:border-black transition font-medium">
            Semaine suiv. →
          </button>
        </div>

        {employees.length === 0 && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 mb-6">
            Aucun coach trouvé. Ajoutez d'abord un coach depuis la page "Coachs".
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">{error}</div>
        ) : (
          <div className="space-y-4">
            {DAYS.map((d, i) => {
              const dayShifts = shiftsByDay(i);
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{d}</span>
                      <span className="text-xs text-gray-400 ml-2">{fmt(addDays(weekStart, i))}</span>
                    </div>
                    <button
                      onClick={() => setAddDayIndex(i)}
                      className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:border-black hover:text-black transition font-medium"
                    >
                      + Créneau
                    </button>
                  </div>
                  {dayShifts.length === 0 ? (
                    <div className="px-5 py-4 text-xs text-gray-400">Aucun créneau — repos.</div>
                  ) : (
                    dayShifts.map(s => (
                      <div key={s.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{s.user_name}{s.label ? ` — ${s.label}` : ''}</p>
                          <p className="text-xs text-gray-400">{s.start_time} → {s.end_time} · {s.hours}h{s.location ? ` · ${s.location}` : ''}</p>
                        </div>
                        <button
                          onClick={() => setEditShift(s)}
                          className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:border-black hover:text-black transition font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setDeleteShift(s)}
                          className="text-xs px-2.5 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Ajouter */}
      {addDayIndex !== null && employees.length > 0 && (
        <ShiftModal
          shift={null}
          defaultDayIndex={addDayIndex}
          weekStart={weekStart}
          employees={employees}
          onClose={() => setAddDayIndex(null)}
          onSaved={load}
        />
      )}

      {/* Modal Modifier */}
      {editShift && (
        <ShiftModal
          shift={editShift}
          defaultDayIndex={editShift.day_index}
          weekStart={weekStart}
          employees={employees}
          onClose={() => setEditShift(null)}
          onSaved={load}
        />
      )}

      {/* Modal Confirmer suppression */}
      {deleteShift && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">Supprimer ce créneau ?</h3>
            <p className="text-sm text-gray-500 mb-5">
              <span className="font-medium text-gray-900">{deleteShift.user_name}</span> — {deleteShift.start_time} → {deleteShift.end_time}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteShift(null)}
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

export default AdminSchedule;
