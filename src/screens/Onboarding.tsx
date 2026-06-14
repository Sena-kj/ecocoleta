import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'

const SLIDES = [
  {
    emoji: '🔋',
    eyebrow: 'O problema',
    title: 'O lixo eletrônico não some',
    text: 'Pilhas, celulares e cabos guardados em gavetas ou jogados no lixo comum contaminam solo e água por décadas.',
  },
  {
    emoji: '📍',
    eyebrow: 'A solução',
    title: 'Pontos de coleta perto de você',
    text: 'O EcoColeta mostra no mapa onde descartar cada tipo de material, com horário, distância e o que cada ponto aceita.',
  },
  {
    emoji: '🏆',
    eyebrow: 'O impacto',
    title: 'Descarte vira reconhecimento',
    text: 'Cada descarte validado rende pontos, selos e posição no ranking do seu bairro. Cidadania ambiental que aparece.',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [i, setI] = useState(0)
  const last = i === SLIDES.length - 1
  const s = SLIDES[i]

  return (
    <div className="onb">
      <Card className="onb__card rise" key={i}>
        <button
          onClick={() => navigate('/login')}
          className="faint"
          style={{ background: 'none', border: 0, position: 'absolute', top: 'var(--sp-5)', right: 'var(--sp-5)', fontWeight: 700 }}
        >
          Pular
        </button>
        <div className="onb__emoji" aria-hidden>{s.emoji}</div>
        <span className="eyebrow">{s.eyebrow}</span>
        <h1 style={{ marginTop: 'var(--sp-2)', fontSize: 'var(--fs-h1)' }}>{s.title}</h1>
        <p className="muted" style={{ marginTop: 'var(--sp-3)' }}>{s.text}</p>

        <div className="onb__dots" role="tablist">
          {SLIDES.map((_, idx) => (
            <span key={idx} className={`onb__dot ${idx === i ? 'active' : ''}`} />
          ))}
        </div>

        <Button
          size="lg"
          block
          onClick={() => (last ? navigate('/login') : setI(i + 1))}
        >
          {last ? 'Começar agora' : 'Continuar'}
        </Button>
      </Card>

      <div className="onb__footlinks">
        <button onClick={() => navigate('/partner/login')}>🤝 Área do parceiro</button>
        <span aria-hidden>·</span>
        <button onClick={() => navigate('/admin/login')}>🛠️ Painel administrativo</button>
      </div>
    </div>
  )
}
