'use client';

import { type CSSProperties, type FormEvent, useState } from 'react';
import type { ChangePasswordRequest, UpdateProfileRequest, UserProfile } from '@cairn/types';
import { TopbarActions } from './TopbarActions';

interface Props {
  profile: UserProfile;
  onSaveProfile: (body: UpdateProfileRequest) => Promise<void>;
  onChangePassword: (body: ChangePasswordRequest) => Promise<void>;
  onLogout: () => void;
}

type Msg = { kind: 'ok' | 'err'; text: string } | null;

const headStyle: CSSProperties = { margin: '0 0 14px', fontSize: 14, fontWeight: 600 };

function Feedback({ msg }: { msg: Msg }) {
  if (!msg) {
    return null;
  }
  return (
    <p
      style={{
        fontFamily: 'var(--mono)',
        fontSize: 11.5,
        margin: '0 0 10px',
        color: msg.kind === 'ok' ? 'var(--ok)' : 'var(--no)',
      }}
    >
      {msg.text}
    </p>
  );
}

/** Tela "Ajustes" — perfil, tempo disponível e senha (Fatia 3 settings). */
export function SettingsMain({ profile, onSaveProfile, onChangePassword, onLogout }: Props) {
  const [name, setName] = useState(profile.name ?? '');
  const [email, setEmail] = useState(profile.email);
  const [profileMsg, setProfileMsg] = useState<Msg>(null);

  const [budget, setBudget] = useState(String(profile.weeklyBudgetHours));
  const [budgetMsg, setBudgetMsg] = useState<Msg>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<Msg>(null);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    try {
      await onSaveProfile({ name, email });
      setProfileMsg({ kind: 'ok', text: 'Perfil salvo ✓' });
    } catch (err) {
      setProfileMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Falha ao salvar' });
    }
  }

  async function saveBudget(e: FormEvent) {
    e.preventDefault();
    setBudgetMsg(null);
    try {
      await onSaveProfile({ weeklyBudgetHours: Number(budget) });
      setBudgetMsg({ kind: 'ok', text: 'Tempo disponível salvo ✓' });
    } catch (err) {
      setBudgetMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Falha ao salvar' });
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setPwdMsg(null);
    try {
      await onChangePassword({ currentPassword, newPassword });
      setPwdMsg({ kind: 'ok', text: 'Senha alterada ✓' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPwdMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Falha ao trocar senha' });
    }
  }

  return (
    <div className="b-main">
      <div className="b-topbar">
        <div className="wk">
          <span className="n">Ajustes</span>
          <span className="r">perfil · tempo disponível · senha</span>
        </div>
        <span style={{ flex: 1 }} />
        <TopbarActions onLogout={onLogout} />
      </div>

      <div className="b-body" style={{ maxWidth: 520 }}>
        <form className="b-tcard" onSubmit={saveProfile}>
          <h3 style={headStyle}>Perfil</h3>
          <div className="b-field">
            <label htmlFor="set-name">nome</label>
            <input id="set-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
          </div>
          <div className="b-field">
            <label htmlFor="set-email">email</label>
            <input
              id="set-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Feedback msg={profileMsg} />
          <button type="submit" className="b-btn">
            salvar perfil
          </button>
        </form>

        <form className="b-tcard" onSubmit={saveBudget}>
          <h3 style={headStyle}>Tempo disponível</h3>
          <div className="b-field">
            <label htmlFor="set-budget">horas por semana</label>
            <input
              id="set-budget"
              type="number"
              min={0.5}
              max={40}
              step={0.5}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <Feedback msg={budgetMsg} />
          <button type="submit" className="b-btn">
            salvar
          </button>
        </form>

        <form className="b-tcard" onSubmit={savePassword}>
          <h3 style={headStyle}>Senha</h3>
          <div className="b-field">
            <label htmlFor="set-cur">senha atual</label>
            <input
              id="set-cur"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="b-field">
            <label htmlFor="set-new">nova senha</label>
            <input
              id="set-new"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <Feedback msg={pwdMsg} />
          <button type="submit" className="b-btn">
            trocar senha
          </button>
        </form>
      </div>
    </div>
  );
}
