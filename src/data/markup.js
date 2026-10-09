// Marcação estática migrada do site original (HTML/CSS puro).
// Mantida como HTML (via dangerouslySetInnerHTML no App.jsx) para preservar
// fielmente o design/animações originais; a parte dinâmica (lista de
// serviços vinda do Supabase) é renderizada como JSX de verdade no meio.

export const BEFORE_SERVICE_GRID = `
<!-- ===== HEADER ===== -->
<header id="siteHeader">
  <div class="logo">OURO <span>&</span> FIO</div>
  <nav>
    <ul>
      <li><a href="#sobre">Sobre</a></li>
      <li><a href="#servicos">Serviços</a></li>
      <li><a href="#equipe">Equipe</a></li>
      <li><a href="#contato">Contato</a></li>
    </ul>
  </nav>
  <a href="#agendar" class="nav-cta">Agendar</a>
  <div class="burger" id="burger"><span></span><span></span><span></span></div>
</header>

<!-- mobile menu -->
<div id="mobileMenu" style="display:none;position:fixed;inset:0;background:var(--black);z-index:105;flex-direction:column;align-items:center;justify-content:center;gap:34px;">
  <a href="#sobre" class="mlink">Sobre</a>
  <a href="#servicos" class="mlink">Serviços</a>
  <a href="#equipe" class="mlink">Equipe</a>
  <a href="#agendar" class="mlink">Agendar</a>
  <a href="#contato" class="mlink">Contato</a>
</div>

<!-- ===== HERO ===== -->
<section class="hero">
  <div class="hero-eyebrow eyebrow">Studio de cabelo — desde 2014</div>
  <h1>Onde cada <em>fio</em> conta uma história.</h1>
  <p>Coloração, corte e tratamento com a precisão de um ateliê e o brilho de um acabamento dourado. Em Sorocaba, para quem não abre mão de detalhe.</p>
  <div class="hero-actions">
    <a href="#agendar" class="btn-gold">Agendar horário</a>
    <a href="#servicos" class="btn-outline">Ver serviços</a>
  </div>
  <svg class="thread" viewBox="0 0 340 28" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 14 C 40 0, 60 28, 100 14 S 160 0, 200 14 S 260 28, 300 14 S 320 4, 340 14"/>
  </svg>
</section>

<!-- ===== SOBRE ===== -->
<section class="about" id="sobre">
  <div class="about-copy">
    <span class="eyebrow">Nossa filosofia</span>
    <h2>Técnica de ateliê,<br>acabamento de joalheria.</h2>
    <p>Acreditamos que cabelo é o fio condutor da sua imagem — por isso tratamos cada coloração como uma peça sob medida. Nossa equipe é formada em técnicas internacionais de colorimetria e usa apenas produtos de curadoria própria, sem sulfatos agressivos.</p>
    <p>Do primeiro diagnóstico capilar ao brilho final, cada etapa é pensada para durar — na saúde do fio e na confiança de quem o carrega.</p>
    <div class="about-stats">
      <div><strong>11</strong><span>anos de studio</span></div>
      <div><strong>4.9</strong><span>avaliação média</span></div>
      <div><strong>+6mil</strong><span>atendimentos</span></div>
    </div>
  </div>
  <div class="about-art">
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#c6a15b" stroke-width="1.1">
      <circle cx="60" cy="60" r="16"/>
      <circle cx="60" cy="140" r="16"/>
      <line x1="72" y1="72" x2="170" y2="30" stroke-linecap="round"/>
      <line x1="72" y1="128" x2="170" y2="30" stroke-linecap="round"/>
      <line x1="72" y1="72" x2="46" y2="128" stroke-linecap="round"/>
      <path d="M170 30 c10 -6 22 -2 24 8 c2 10 -8 18 -18 14" stroke-linecap="round"/>
      <path d="M20 190 C 60 170, 100 210, 140 185 S 190 165, 200 190" stroke-linecap="round"/>
    </svg>
  </div>
</section>

<!-- ===== SERVIÇOS ===== -->
<section class="services" id="servicos">
  <div class="section-head">
    <span class="eyebrow">Cardápio de serviços</span>
    <h2>Serviços & valores</h2>
    <p>Preços de referência — o valor final é ajustado no diagnóstico presencial, conforme comprimento e histórico do fio.</p>
  </div>
  <div class="menu-grid">
    <div class="menu-cat">
      <h3>Cabelo</h3>
      <div class="menu-item"><span class="name">Corte feminino<small>Lavagem, corte e finalização</small></span><span class="dots"></span><span class="price">R$ 120</span></div>
      <div class="menu-item"><span class="name">Corte masculino<small>Máquina e tesoura</small></span><span class="dots"></span><span class="price">R$ 70</span></div>
      <div class="menu-item"><span class="name">Escova modelada<small>Liso ou volumoso</small></span><span class="dots"></span><span class="price">R$ 90</span></div>
      <div class="menu-item"><span class="name">Penteado para evento<small>Preso ou solto</small></span><span class="dots"></span><span class="price">R$ 180</span></div>
    </div>
    <div class="menu-cat">
      <h3>Coloração</h3>
      <div class="menu-item"><span class="name">Coloração global<small>Cobertura completa</small></span><span class="dots"></span><span class="price">R$ 220</span></div>
      <div class="menu-item"><span class="name">Mechas / Balayage<small>Técnica manual</small></span><span class="dots"></span><span class="price">R$ 380</span></div>
      <div class="menu-item"><span class="name">Loiro platinado<small>Descoloração + matização</small></span><span class="dots"></span><span class="price">R$ 450</span></div>
      <div class="menu-item"><span class="name">Retoque de raiz<small>Até 3cm</small></span><span class="dots"></span><span class="price">R$ 150</span></div>
    </div>
    <div class="menu-cat">
      <h3>Tratamentos</h3>
      <div class="menu-item"><span class="name">Hidratação profunda<small>Nutrição intensiva</small></span><span class="dots"></span><span class="price">R$ 95</span></div>
      <div class="menu-item"><span class="name">Botox capilar<small>Redução de volume</small></span><span class="dots"></span><span class="price">R$ 160</span></div>
      <div class="menu-item"><span class="name">Reconstrução de fibra<small>Cauterização</small></span><span class="dots"></span><span class="price">R$ 140</span></div>
    </div>
    <div class="menu-cat">
      <h3>Design</h3>
      <div class="menu-item"><span class="name">Sobrancelha<small>Design + henna</small></span><span class="dots"></span><span class="price">R$ 60</span></div>
      <div class="menu-item"><span class="name">Manicure & pedicure<small>Esmaltação em gel</small></span><span class="dots"></span><span class="price">R$ 85</span></div>
      <div class="menu-item"><span class="name">Barba<small>Toalha quente + navalha</small></span><span class="dots"></span><span class="price">R$ 55</span></div>
    </div>
  </div>
</section>

<!-- ===== EQUIPE ===== -->
<section class="team" id="equipe">
  <div class="section-head">
    <span class="eyebrow">Quem cuida do seu fio</span>
    <h2>Nossa equipe</h2>
  </div>
  <div class="team-grid">
    <div class="stylist"><div class="avatar">C</div><h4>Camila Duarte</h4><span>Coloração</span></div>
    <div class="stylist"><div class="avatar">R</div><h4>Rafael Nunes</h4><span>Cortes</span></div>
    <div class="stylist"><div class="avatar">B</div><h4>Bianca Alves</h4><span>Tratamentos</span></div>
    <div class="stylist"><div class="avatar">T</div><h4>Thiago Reis</h4><span>Barba & corte</span></div>
  </div>
</section>

<!-- ===== AGENDAMENTO ===== -->
<section class="booking" id="agendar">
  <div class="section-head">
    <span class="eyebrow">Reserve seu horário</span>
    <h2>Agendamento</h2>
    <p>Sistema totalmente funcional em seu navegador — sem envio de dados a servidores. Ao recarregar a página, os horários voltam ao estado inicial.</p>
  </div>

  <div class="booking-wrap">
    <div class="steps">
      <div class="step active" data-step="1"><div class="dot">1</div><label>Serviço</label></div>
      <div class="step" data-step="2"><div class="dot">2</div><label>Profissional</label></div>
      <div class="step" data-step="3"><div class="dot">3</div><label>Data & hora</label></div>
      <div class="step" data-step="4"><div class="dot">4</div><label>Seus dados</label></div>
    </div>

    <!-- STEP 1 -->
    <div class="b-panel active" data-panel="1">
      <div class="b-title">Escolha o serviço</div>
`;

export const AFTER_SERVICE_GRID = `
      <div class="b-nav"><span></span><button class="btn-gold" id="toStep2" disabled>Continuar</button></div>
    </div>

    <!-- STEP 2 -->
    <div class="b-panel" data-panel="2">
      <div class="b-title">Escolha a profissional</div>
      <div class="choice-grid" id="stylistGrid"></div>
      <div class="b-nav"><button class="b-back" data-back="1">← Voltar</button><button class="btn-gold" id="toStep3" disabled>Continuar</button></div>
    </div>

    <!-- STEP 3 -->
    <div class="b-panel" data-panel="3">
      <div class="b-title">Escolha data e horário</div>
      <div class="field">
        <label>Data</label>
        <input type="date" id="dateInput">
      </div>
      <div class="field">
        <label>Horários disponíveis</label>
        <div class="slots" id="slotsGrid"></div>
      </div>
      <div class="b-nav"><button class="b-back" data-back="2">← Voltar</button><button class="btn-gold" id="toStep4" disabled>Continuar</button></div>
    </div>

    <!-- STEP 4 -->
    <div class="b-panel" data-panel="4">
      <div class="b-title">Confirme seus dados</div>
      <div class="field"><label>Nome completo</label><input type="text" id="nameInput" placeholder="Seu nome"></div>
      <div class="field"><label>Telefone / WhatsApp</label><input type="tel" id="phoneInput" placeholder="(15) 90000-0000"></div>

      <div class="field">
        <label>Foto de referência (opcional)</label>
        <div class="camera-box" id="cameraBox">
          <div class="camera-empty" id="cameraEmpty">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c6a15b" stroke-width="1.3"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" stroke-linejoin="round"/><circle cx="12" cy="13.5" r="3.4"/></svg>
            <p>Mostre à cabeleireira o corte, cor ou inspiração que você tem em mente.</p>
            <button type="button" class="btn-outline" id="camOpenBtn">Ativar câmera</button>
          </div>

          <div class="camera-live" id="cameraLive" style="display:none;">
            <video id="camVideo" autoplay playsinline muted></video>
            <div class="camera-live-actions">
              <button type="button" class="btn-outline" id="camCancelBtn">Cancelar</button>
              <button type="button" class="btn-gold" id="camShotBtn">Capturar foto</button>
            </div>
          </div>

          <div class="camera-result" id="cameraResult" style="display:none;">
            <img id="camPhoto" alt="Foto de referência capturada">
            <div class="camera-result-actions">
              <button type="button" class="btn-outline" id="camRetakeBtn">Tirar outra</button>
              <button type="button" class="cam-remove" id="camRemoveBtn" aria-label="Remover foto">✕</button>
            </div>
          </div>
        </div>
        <canvas id="camCanvas" style="display:none;"></canvas>
      </div>

      <div style="margin:28px 0;">
        <div class="summary-row"><span>Serviço</span><span id="sumService">—</span></div>
        <div class="summary-row"><span>Profissional</span><span id="sumStylist">—</span></div>
        <div class="summary-row"><span>Data & hora</span><span id="sumDate">—</span></div>
        <div class="summary-row" id="sumPhotoRow" style="display:none;"><span>Foto de referência</span><span id="sumPhoto">Anexada</span></div>
        <div class="summary-row total"><span>Total estimado</span><span id="sumPrice">—</span></div>
      </div>
      <div class="b-nav"><button class="b-back" data-back="3">← Voltar</button><button class="btn-gold" id="confirmBtn">Confirmar agendamento</button></div>
    </div>

    <!-- CONFIRMATION -->
    <div class="b-panel" data-panel="5">
      <div class="b-confirm">
        <div class="seal">✓</div>
        <h3>Agendamento confirmado</h3>
        <p id="confirmText">Seu horário foi reservado com sucesso. Enviaremos um lembrete por WhatsApp na véspera.</p>
        <div class="confirm-code" id="confirmCode">#OF-0000</div>
        <div><button class="btn-outline" id="newBooking">Novo agendamento</button></div>
      </div>
    </div>
  </div>
</section>

<!-- ===== DEPOIMENTOS ===== -->
<section class="testimonials">
  <div class="section-head" style="margin-bottom:40px;">
    <span class="eyebrow">Quem já passou por aqui</span>
    <h2>Depoimentos</h2>
  </div>
  <div class="t-wrap" id="tWrap"></div>
  <div class="t-dots" id="tDots"></div>
</section>

<!-- ===== FOOTER / CONTATO ===== -->
<footer id="contato">
  <div class="footer-grid">
    <div>
      <div class="f-logo">OURO <span>&</span> FIO</div>
      <p>Studio de cabelo em Sorocaba dedicado a coloração, cortes e tratamentos com acabamento de precisão.</p>
      <div class="socials">
        <a href="#" aria-label="Instagram">IG</a>
        <a href="#" aria-label="WhatsApp">WA</a>
        <a href="#" aria-label="Facebook">FB</a>
      </div>
    </div>
    <div>
      <h5>Studio</h5>
      <ul>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#servicos">Serviços</a></li>
        <li><a href="#equipe">Equipe</a></li>
        <li><a href="#agendar">Agendar</a></li>
      </ul>
    </div>
    <div>
      <h5>Horários</h5>
      <ul>
        <li>Ter – Sex: 9h às 19h</li>
        <li>Sábado: 9h às 17h</li>
        <li>Domingo e segunda: fechado</li>
      </ul>
    </div>
    <div>
      <h5>Contato</h5>
      <ul>
        <li>Rua das Palmeiras, 214 — Centro</li>
        <li>Sorocaba, SP</li>
        <li>(15) 3222-0000</li>
        <li>contato@ouroefio.com.br</li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 Ouro & Fio Studio de Cabelo. Todos os direitos reservados.</span>
    <span>Site institucional — sem coleta ou armazenamento de dados em servidor.</span>
  </div>
</footer>

<div id="toast"></div>

`;
