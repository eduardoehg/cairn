import type { ApiInfo } from '@cairn/types';

// Prova de que packages/types é importável também no front.
// Na Fatia 2 isto vira um fetch real de GET /health.
const placeholder: ApiInfo = {
  name: 'cairn-web',
  version: '0.0.0',
  status: 'ok',
};

export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', lineHeight: 1.5 }}>
      <h1>Cairn</h1>
      <p>Esqueleto do monorepo no ar (Fatia 0).</p>
      <pre>{JSON.stringify(placeholder, null, 2)}</pre>
    </main>
  );
}
