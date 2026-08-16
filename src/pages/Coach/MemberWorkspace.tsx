import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi, caisseApiDownload } from '../../services/caisseApiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MembreResult {
  id: number; nom: string; first_name: string; last_name: string;
  email: string; phone: string; abonne_actif: boolean;
}

interface AnamneseItem {
  id: number;
  member_id: number;
  coach: { id: number; first_name: string | null; last_name: string | null } | null;
  objectifs: string | null;
  antecedents_medicaux: string | null;
  allergies: string | null;
  traitements_en_cours: string | null;
  blessures_douleurs: string | null;
  contre_indications: string | null;
  observations: string | null;
  niveau_activite: string | null;
  frequence_souhaitee: number | null;
  poids_kg: number | null;
  taille_cm: number | null;
  tension_arterielle: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface ExerciseItem {
  id: number;
  training_program_id: number;
  ordre: number;
  jour: string | null;
  nom_exercice: string;
  groupe_musculaire: string | null;
  series: number | null;
  repetitions: string | null;
  repos_secondes: number | null;
  charge: string | null;
  notes: string | null;
}

interface ProgramItem {
  id: number;
  member_id: number;
  coach: { id: number; first_name: string | null; last_name: string | null } | null;
  titre: string;
  objectif: string | null;
  description: string | null;
  date_debut: string | null;
  date_fin: string | null;
  statut: 'actif' | 'termine' | 'archive';
  exercises: ExerciseItem[];
  created_at: string | null;
  updated_at: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const strOrUndef = (v: string): string | undefined => (v.trim() === '' ? undefined : v.trim());
const numOrUndef = (v: string): number | undefined => (v.trim() === '' ? undefined : Number(v));

// ─── Recherche membre ─────────────────────────────────────────────────────────

const MemberSearchPanel: React.FC<{ onSelect: (m: MembreResult) => void }> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MembreResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (q.trim().length < 2) { setResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await caisseApi.get<{ success: boolean; data: MembreResult[] }>(`/caisse/membres/search?q=${encodeURIComponent(q.trim())}`);
        setResults(res.data ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Rechercher un membre</h2>
        <div className="relative">
          <input type="text" value={query} onChange={e => handleSearch(e.target.value)}
            placeholder="Nom, prénom, téléphone, email…"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            autoFocus autoComplete="off" />
          {searching && <div className="absolute right-3 top-3"><div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" /></div>}
        </div>
        {results.length > 0 && (
          <div className="mt-2 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            {results.map(m => (
              <button key={m.id} onClick={() => onSelect(m)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left border-b last:border-0 transition">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{m.nom}</p>
                  <p className="text-xs text-gray-400">{m.phone || m.email}</p>
                </div>
                {m.abonne_actif && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Actif</span>}
              </button>
            ))}
          </div>
        )}
        {query.trim().length >= 2 && !searching && results.length === 0 && (
          <p className="mt-3 text-sm text-gray-400 text-center">Aucun membre trouvé pour « {query} »</p>
        )}
      </div>
    </div>
  );
};

// ─── Onglet Anamnèse ──────────────────────────────────────────────────────────

const NIVEAU_ACTIVITE_OPTIONS = [
  { value: '', label: 'Non renseigné' },
  { value: 'sedentaire', label: 'Sédentaire' },
  { value: 'modere', label: 'Modéré' },
  { value: 'actif', label: 'Actif' },
  { value: 'tres_actif', label: 'Très actif' },
] as const;

const emptyAnamneseForm = {
  objectifs: '', antecedents_medicaux: '', allergies: '', traitements_en_cours: '',
  blessures_douleurs: '', contre_indications: '', observations: '',
  niveau_activite: '', frequence_souhaitee: '', poids_kg: '', taille_cm: '', tension_arterielle: '',
};

const ANAMNESE_TEXT_FIELDS = [
  ['objectifs', 'Objectifs'],
  ['antecedents_medicaux', 'Antécédents médicaux'],
  ['allergies', 'Allergies'],
  ['traitements_en_cours', 'Traitements en cours'],
  ['blessures_douleurs', 'Blessures / douleurs'],
  ['contre_indications', 'Contre-indications'],
  ['observations', 'Observations'],
] as const;

const AnamneseTab: React.FC<{ member: MembreResult }> = ({ member }) => {
  const [history, setHistory] = useState<AnamneseItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [form, setForm] = useState(emptyAnamneseForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await caisseApi.get<{ success: boolean; data: AnamneseItem[] }>(`/members/${member.id}/anamneses`);
      setHistory(res.data ?? []);
    } catch {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [member.id]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setSuccess(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        objectifs: strOrUndef(form.objectifs),
        antecedents_medicaux: strOrUndef(form.antecedents_medicaux),
        allergies: strOrUndef(form.allergies),
        traitements_en_cours: strOrUndef(form.traitements_en_cours),
        blessures_douleurs: strOrUndef(form.blessures_douleurs),
        contre_indications: strOrUndef(form.contre_indications),
        observations: strOrUndef(form.observations),
        niveau_activite: strOrUndef(form.niveau_activite),
        frequence_souhaitee: numOrUndef(form.frequence_souhaitee),
        poids_kg: numOrUndef(form.poids_kg),
        taille_cm: numOrUndef(form.taille_cm),
        tension_arterielle: strOrUndef(form.tension_arterielle),
      };
      await caisseApi.post(`/members/${member.id}/anamneses`, payload);
      setForm(emptyAnamneseForm);
      setSuccess(true);
      loadHistory();
    } catch (e: any) {
      setError(e?.message || Object.values(e?.errors ?? {})[0]?.[0] || 'Erreur lors de l’enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Historique des bilans</h3>
        {loadingHistory ? (
          <p className="text-sm text-gray-400">Chargement…</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun bilan enregistré pour ce membre.</p>
        ) : (
          <div className="space-y-2">
            {history.map(a => (
              <div key={a.id} className="border border-gray-100 rounded-xl p-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{a.created_at}</span>
                  {a.niveau_activite && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{a.niveau_activite}</span>
                  )}
                </div>
                {a.objectifs && <p className="text-gray-600">🎯 {a.objectifs}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {a.poids_kg ? `${a.poids_kg} kg` : ''} {a.taille_cm ? `· ${a.taille_cm} cm` : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Nouveau bilan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Niveau d'activité</label>
            <select value={form.niveau_activite} onChange={update('niveau_activite')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black">
              {NIVEAU_ACTIVITE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fréquence souhaitée (séances/semaine)</label>
            <input type="number" min={0} max={14} value={form.frequence_souhaitee} onChange={update('frequence_souhaitee')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Poids (kg)</label>
            <input type="number" step="0.1" value={form.poids_kg} onChange={update('poids_kg')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Taille (cm)</label>
            <input type="number" step="0.1" value={form.taille_cm} onChange={update('taille_cm')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tension artérielle</label>
            <input value={form.tension_arterielle} onChange={update('tension_arterielle')} placeholder="ex: 12/8"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {ANAMNESE_TEXT_FIELDS.map(([field, label]) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <textarea value={form[field]} onChange={update(field)} rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
          ))}
        </div>

        {error && <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">Bilan enregistré.</div>}

        <button onClick={save} disabled={saving}
          className="mt-4 bg-black text-white rounded-xl py-2.5 px-6 text-sm font-semibold hover:bg-gray-800 disabled:opacity-40">
          {saving ? 'Enregistrement…' : 'Enregistrer le bilan'}
        </button>
      </div>
    </div>
  );
};

// ─── Onglet Programme ─────────────────────────────────────────────────────────

interface ExerciseRowState {
  key: string;
  id?: number;
  jour: string;
  nom_exercice: string;
  groupe_musculaire: string;
  series: string;
  repetitions: string;
  repos_secondes: string;
  charge: string;
  notes: string;
}

const rowFromExercise = (e: ExerciseItem): ExerciseRowState => ({
  key: `ex-${e.id}`,
  id: e.id,
  jour: e.jour ?? '',
  nom_exercice: e.nom_exercice,
  groupe_musculaire: e.groupe_musculaire ?? '',
  series: e.series != null ? String(e.series) : '',
  repetitions: e.repetitions ?? '',
  repos_secondes: e.repos_secondes != null ? String(e.repos_secondes) : '',
  charge: e.charge ?? '',
  notes: e.notes ?? '',
});

const blankRow = (): ExerciseRowState => ({
  key: `new-${Math.random().toString(36).slice(2)}`,
  jour: '', nom_exercice: '', groupe_musculaire: '', series: '', repetitions: '', repos_secondes: '', charge: '', notes: '',
});

const toExercisePayload = (r: ExerciseRowState) => ({
  jour: strOrUndef(r.jour),
  nom_exercice: r.nom_exercice.trim(),
  groupe_musculaire: strOrUndef(r.groupe_musculaire),
  series: numOrUndef(r.series),
  repetitions: strOrUndef(r.repetitions),
  repos_secondes: numOrUndef(r.repos_secondes),
  charge: strOrUndef(r.charge),
  notes: strOrUndef(r.notes),
});

const ProgramBuilder: React.FC<{
  member: MembreResult;
  initialProgram: ProgramItem | null;
  onCancel: () => void;
  onSaved: (p: ProgramItem) => void;
}> = ({ member, initialProgram, onCancel, onSaved }) => {
  const [programId, setProgramId] = useState<number | null>(initialProgram?.id ?? null);
  const [titre, setTitre] = useState(initialProgram?.titre ?? '');
  const [objectif, setObjectif] = useState(initialProgram?.objectif ?? '');
  const [description, setDescription] = useState(initialProgram?.description ?? '');
  const [dateDebut, setDateDebut] = useState(initialProgram?.date_debut ?? '');
  const [dateFin, setDateFin] = useState(initialProgram?.date_fin ?? '');
  const [statut, setStatut] = useState<'actif' | 'termine' | 'archive'>(initialProgram?.statut ?? 'actif');
  const initialRows = initialProgram ? initialProgram.exercises.map(rowFromExercise) : [];
  const [exercises, setExercises] = useState<ExerciseRowState[]>(initialRows);
  const [savedExercises, setSavedExercises] = useState<ExerciseRowState[]>(initialRows);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const addRow = () => setExercises(rows => [...rows, blankRow()]);
  const removeRow = (key: string) => setExercises(rows => rows.filter(r => r.key !== key));
  const updateRow = (key: string, field: keyof ExerciseRowState, value: string) =>
    setExercises(rows => rows.map(r => (r.key === key ? { ...r, [field]: value } : r)));
  const moveRow = (key: string, dir: -1 | 1) => setExercises(rows => {
    const idx = rows.findIndex(r => r.key === key);
    const newIdx = idx + dir;
    if (idx < 0 || newIdx < 0 || newIdx >= rows.length) return rows;
    const copy = [...rows];
    [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
    return copy;
  });

  const applyProgram = (p: ProgramItem) => {
    setProgramId(p.id);
    setTitre(p.titre);
    setObjectif(p.objectif ?? '');
    setDescription(p.description ?? '');
    setDateDebut(p.date_debut ?? '');
    setDateFin(p.date_fin ?? '');
    setStatut(p.statut);
    const rows = p.exercises.map(rowFromExercise);
    setExercises(rows);
    setSavedExercises(rows);
    onSaved(p);
  };

  const save = async () => {
    setError(null);
    if (!titre.trim()) { setError('Le titre du programme est requis.'); return; }
    if (exercises.some(r => !r.nom_exercice.trim())) { setError('Chaque exercice doit avoir un nom.'); return; }

    setSaving(true);
    try {
      if (programId === null) {
        const res = await caisseApi.post<{ success: boolean; data: ProgramItem }>(`/members/${member.id}/programs`, {
          titre: titre.trim(),
          objectif: strOrUndef(objectif),
          description: strOrUndef(description),
          date_debut: strOrUndef(dateDebut),
          date_fin: strOrUndef(dateFin),
          statut,
          exercises: exercises.map(toExercisePayload),
        });
        applyProgram(res.data);
      } else {
        await caisseApi.put(`/programs/${programId}`, {
          titre: titre.trim(),
          objectif: strOrUndef(objectif),
          description: strOrUndef(description),
          date_debut: strOrUndef(dateDebut),
          date_fin: strOrUndef(dateFin),
          statut,
        });

        const savedById = new Map(savedExercises.filter(r => r.id).map(r => [r.id as number, r]));
        const currentIds = new Set(exercises.filter(r => r.id).map(r => r.id as number));

        for (const r of savedExercises) {
          if (r.id && !currentIds.has(r.id)) {
            await caisseApi.del(`/programs/${programId}/exercises/${r.id}`);
          }
        }

        const updatedRows: ExerciseRowState[] = [];
        for (const r of exercises) {
          if (!r.id) {
            const res = await caisseApi.post<{ success: boolean; data: ExerciseItem }>(`/programs/${programId}/exercises`, toExercisePayload(r));
            updatedRows.push({ ...r, id: res.data.id });
          } else {
            const prev = savedById.get(r.id);
            const changed = !prev || JSON.stringify(toExercisePayload(prev)) !== JSON.stringify(toExercisePayload(r));
            if (changed) {
              await caisseApi.put(`/programs/${programId}/exercises/${r.id}`, toExercisePayload(r));
            }
            updatedRows.push(r);
          }
        }

        const order = updatedRows.filter(r => r.id).map(r => r.id as number);
        if (order.length > 0) {
          await caisseApi.put(`/programs/${programId}/exercises/reorder`, { order });
        }

        const fresh = await caisseApi.get<{ success: boolean; data: ProgramItem }>(`/programs/${programId}`);
        applyProgram(fresh.data);
      }
    } catch (e: any) {
      setError(e?.message || Object.values(e?.errors ?? {})[0]?.[0] || 'Erreur lors de l’enregistrement du programme.');
    } finally {
      setSaving(false);
    }
  };

  const downloadPdf = async () => {
    if (programId === null) return;
    setDownloadingPdf(true);
    setError(null);
    try {
      await caisseApiDownload(`/programs/${programId}/pdf`, `programme_${member.nom.replace(/\s+/g, '_')}.pdf`);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du téléchargement du PDF.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{programId ? 'Modifier le programme' : 'Nouveau programme'}</h3>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600">✕ Fermer</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Titre</label>
          <input value={titre} onChange={e => setTitre(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Objectif</label>
          <input value={objectif} onChange={e => setObjectif(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
          <select value={statut} onChange={e => setStatut(e.target.value as 'actif' | 'termine' | 'archive')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black">
            <option value="actif">Actif</option>
            <option value="termine">Terminé</option>
            <option value="archive">Archivé</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date de début</label>
          <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date de fin</label>
          <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Exercices</h4>
        <button onClick={addRow} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition">
          + Ajouter un exercice
        </button>
      </div>

      {exercises.length === 0 ? (
        <p className="text-sm text-gray-400 py-3">Aucun exercice pour l'instant.</p>
      ) : (
        <div className="space-y-2 mb-4">
          {exercises.map((r, i) => (
            <div key={r.key} className="border border-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400">#{i + 1}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveRow(r.key, -1)} disabled={i === 0}
                    className="text-xs px-2 py-1 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30">▲</button>
                  <button onClick={() => moveRow(r.key, 1)} disabled={i === exercises.length - 1}
                    className="text-xs px-2 py-1 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30">▼</button>
                  <button onClick={() => removeRow(r.key)}
                    className="text-xs px-2 py-1 rounded-lg text-red-500 hover:bg-red-50">✕</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input placeholder="Exercice*" value={r.nom_exercice} onChange={e => updateRow(r.key, 'nom_exercice', e.target.value)}
                  className="col-span-2 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
                <input placeholder="Jour" value={r.jour} onChange={e => updateRow(r.key, 'jour', e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
                <input placeholder="Groupe musculaire" value={r.groupe_musculaire} onChange={e => updateRow(r.key, 'groupe_musculaire', e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
                <input placeholder="Séries" type="number" value={r.series} onChange={e => updateRow(r.key, 'series', e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
                <input placeholder="Répétitions (ex: 8-12)" value={r.repetitions} onChange={e => updateRow(r.key, 'repetitions', e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
                <input placeholder="Repos (s)" type="number" value={r.repos_secondes} onChange={e => updateRow(r.key, 'repos_secondes', e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
                <input placeholder="Charge" value={r.charge} onChange={e => updateRow(r.key, 'charge', e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
                <input placeholder="Notes" value={r.notes} onChange={e => updateRow(r.key, 'notes', e.target.value)}
                  className="col-span-2 sm:col-span-4 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving}
          className="bg-black text-white rounded-xl py-2.5 px-6 text-sm font-semibold hover:bg-gray-800 disabled:opacity-40">
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        {programId !== null && (
          <button onClick={downloadPdf} disabled={downloadingPdf}
            className="border border-gray-200 rounded-xl py-2.5 px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40">
            {downloadingPdf ? 'Téléchargement…' : '📄 Télécharger le PDF'}
          </button>
        )}
      </div>
    </div>
  );
};

const STATUT_BADGE: Record<ProgramItem['statut'], string> = {
  actif: 'bg-green-100 text-green-700',
  termine: 'bg-gray-100 text-gray-600',
  archive: 'bg-amber-100 text-amber-700',
};

const ProgrammeTab: React.FC<{ member: MembreResult }> = ({ member }) => {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<'new' | ProgramItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await caisseApi.get<{ success: boolean; data: ProgramItem[] }>(`/members/${member.id}/programs`);
      setPrograms(res.data ?? []);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, [member.id]);

  useEffect(() => { load(); }, [load]);

  const downloadPdf = async (p: ProgramItem) => {
    setDownloadingId(p.id);
    try {
      await caisseApiDownload(`/programs/${p.id}/pdf`, `programme_${member.nom.replace(/\s+/g, '_')}.pdf`);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du téléchargement du PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (editing) {
    return (
      <ProgramBuilder
        member={member}
        initialProgram={editing === 'new' ? null : editing}
        onCancel={() => setEditing(null)}
        onSaved={() => { setEditing(null); load(); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Programmes d'entraînement</h3>
        <button onClick={() => setEditing('new')}
          className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition">
          + Nouveau programme
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <p className="text-sm text-gray-400">Chargement…</p>
      ) : programs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-gray-400 text-sm">
          Aucun programme pour ce membre.
        </div>
      ) : (
        <div className="space-y-2">
          {programs.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{p.titre}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_BADGE[p.statut]}`}>{p.statut}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{p.exercises.length} exercice{p.exercises.length > 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => downloadPdf(p)} disabled={downloadingId === p.id}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40">
                  {downloadingId === p.id ? '…' : '📄 PDF'}
                </button>
                <button onClick={() => setEditing(p)}
                  className="text-xs bg-black text-white rounded-lg px-3 py-1.5 hover:bg-gray-800">
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────

const MemberWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [membre, setMembre] = useState<MembreResult | null>(null);
  const [tab, setTab] = useState<'anamnese' | 'programme'>('anamnese');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => (membre ? setMembre(null) : navigate('/caisse'))}
            className="text-gray-400 hover:text-white text-sm transition-colors">
            {membre ? '← Rechercher un autre membre' : '← Retour'}
          </button>
          <span className="text-gray-600">|</span>
          <span className="font-semibold tracking-wide">Anamnèse & Programme</span>
        </div>
        {membre && <span className="text-sm text-gray-300">{membre.nom}</span>}
      </div>

      {!membre ? (
        <MemberSearchPanel onSelect={setMembre} />
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex gap-1 mb-6">
            {(['anamnese', 'programme'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${tab === t ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {t === 'anamnese' ? 'Anamnèse' : 'Programme'}
              </button>
            ))}
          </div>

          {tab === 'anamnese' ? <AnamneseTab member={membre} /> : <ProgrammeTab member={membre} />}
        </div>
      )}
    </div>
  );
};

export default MemberWorkspace;
