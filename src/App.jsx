import { useEffect, useRef, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { SERVICOS_FALLBACK, STYLISTS, HOURS } from './data/fallbackData';
import { BEFORE_SERVICE_GRID, AFTER_SERVICE_GRID } from './data/markup';

export default function App() {
  const [servicos, setServicos] = useState(SERVICOS_FALLBACK);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Estado do fluxo de agendamento (serviço/profissional/data/hora escolhidos).
  // Fica em um ref porque é lido/escrito tanto pelo JSX abaixo (seleção do
  // serviço) quanto pela lógica legada do widget (steps 2 a 5), sem precisar
  // reescrever todo o wizard como componentes controlados do React.
  const bookingState = useRef({ service: null, stylist: null, date: null, time: null });

  // ---------------------------------------------------------------
  // Passo 3 do roteiro: fluxo assíncrono de consulta no React.
  // useEffect + useState + async/await buscando a tabela "servicos"
  // diretamente do Supabase (equivalente à tabela "produtos" do roteiro).
  // ---------------------------------------------------------------
  useEffect(() => {
    async function buscarServicos() {
      try {
        setCarregando(true);
        setErro(null);

        // Requisição SELECT * na nuvem
        const { data, error } = await supabase.from('servicos').select('*');

        if (error) throw error;

        if (data && data.length > 0) {
          setServicos(
            data.map((row) => ({
              id: row.id,
              name: row.nome,
              note: row.duracao,
              price: row.preco,
            }))
          );
        }
        // Se a tabela existir mas estiver vazia, mantém o fallback local.
      } catch (err) {
        console.error('Erro na busca de serviços:', err.message);
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }

    buscarServicos();
  }, []);

  // ---------------------------------------------------------------
  // Interatividade original do site (menu mobile, wizard de agendamento,
  // câmera, carrossel de depoimentos, animações de scroll). Migrada do
  // <script> vanilla para dentro de um useEffect que roda uma vez, já
  // que reescrever o wizard inteiro como componentes controlados do
  // React estava fora do escopo desta aula (o foco é a integração com
  // o Supabase feita acima).
  // ---------------------------------------------------------------
  useEffect(() => {
    const state = bookingState.current;

    /* ========================================================
       OURO & FIO — lógica funcional, 100% em memória (sem BD)
       ======================================================== */

    // ---------- header scroll state ----------
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });

    // ---------- mobile menu ----------
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    burger.addEventListener('click', () => {
      const open = mobileMenu.style.display === 'flex';
      mobileMenu.style.display = open ? 'none' : 'flex';
    });
    document.querySelectorAll('.mlink').forEach(l => l.addEventListener('click', () => mobileMenu.style.display = 'none'));

    // ---------- toast ----------
    function toast(msg){
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.remove('show'), 2600);
    }

    // ---------- data model ----------
    // STYLISTS e HOURS vêm de src/data/fallbackData.js (parâmetros da função).
    // bookedSlots/bookingCounter ficam locais a este efeito.
    // "state" é o stateRef.current do React (compartilhado com a seleção de
    // serviço feita via JSX/onClick mais abaixo no App.jsx).
    let bookedSlots = new Set(['camila|__TODAY__|10:00','rafael|__TODAY__|14:00']);
    let bookingCounter = 128; // fake running counter for confirmation codes

    // ---------- render stylist choices ----------
    const stylistGrid = document.getElementById('stylistGrid');
    STYLISTS.forEach(s => {
      const el = document.createElement('div');
      el.className = 'choice';
      el.dataset.id = s.id;
      el.innerHTML = `<span class="cname">${s.name}<small>${s.spec}</small></span><span class="cprice">›</span>`;
      el.addEventListener('click', () => {
        document.querySelectorAll('#stylistGrid .choice').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        state.stylist = s;
        document.getElementById('toStep3').disabled = false;
        renderSlots();
      });
      stylistGrid.appendChild(el);
    });

    // ---------- date input default = today, min = today ----------
    const dateInput = document.getElementById('dateInput');
    const today = new Date();
    const isoToday = today.toISOString().split('T')[0];
    dateInput.min = isoToday;
    dateInput.value = isoToday;
    dateInput.addEventListener('change', renderSlots);

    function renderSlots(){
      const slotsGrid = document.getElementById('slotsGrid');
      slotsGrid.innerHTML = '';
      document.getElementById('toStep4').disabled = true;
      state.time = null;
      if(!state.stylist) return;

      const dateKey = dateInput.value === isoToday ? '__TODAY__' : dateInput.value;

      HOURS.forEach(h => {
        const key = `${state.stylist.id}|${dateKey}|${h}`;
        const taken = bookedSlots.has(key);
        const el = document.createElement('div');
        el.className = 'slot ' + (taken ? 'taken' : 'avail');
        el.textContent = h;
        if(!taken){
          el.addEventListener('click', () => {
            document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
            el.classList.add('selected');
            state.time = h;
            state.date = dateInput.value;
            document.getElementById('toStep4').disabled = false;
          });
        }
        slotsGrid.appendChild(el);
      });
    }

    // ---------- câmera (foto de referência) ----------
    const cameraBox = document.getElementById('cameraBox');
    const cameraEmpty = document.getElementById('cameraEmpty');
    const cameraLive = document.getElementById('cameraLive');
    const cameraResult = document.getElementById('cameraResult');
    const camVideo = document.getElementById('camVideo');
    const camPhoto = document.getElementById('camPhoto');
    const camCanvas = document.getElementById('camCanvas');
    const camOpenBtn = document.getElementById('camOpenBtn');
    const camCancelBtn = document.getElementById('camCancelBtn');
    const camShotBtn = document.getElementById('camShotBtn');
    const camRetakeBtn = document.getElementById('camRetakeBtn');
    const camRemoveBtn = document.getElementById('camRemoveBtn');
    const sumPhotoRow = document.getElementById('sumPhotoRow');

    let camStream = null;
    let capturedPhoto = null; // data URL, mantido só em memória

    function stopCamStream(){
      if(camStream){
        camStream.getTracks().forEach(t => t.stop());
        camStream = null;
      }
    }

    function showCamView(view){
      // view: 'empty' | 'live' | 'result' | 'error'
      cameraEmpty.style.display = view === 'empty' ? 'flex' : 'none';
      cameraLive.style.display = view === 'live' ? 'block' : 'none';
      cameraResult.style.display = view === 'result' ? 'block' : 'none';
      cameraBox.classList.toggle('cam-error', view === 'error');
    }

    async function openCamera(){
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        showCamView('error');
        cameraEmpty.innerHTML = '<div class="camera-error-msg">Este navegador não tem suporte a câmera. Você pode continuar sem a foto.</div>';
        showCamView('empty');
        return;
      }
      try{
        camStream = await navigator.mediaDevices.getUserMedia({
          video:{ facingMode:'user' },
          audio:false
        });
        camVideo.srcObject = camStream;
        showCamView('live');
      }catch(err){
        toast('Não foi possível acessar a câmera. Verifique a permissão do navegador.');
      }
    }

    camOpenBtn.addEventListener('click', openCamera);

    camCancelBtn.addEventListener('click', () => {
      stopCamStream();
      showCamView('empty');
    });

    camShotBtn.addEventListener('click', () => {
      const w = camVideo.videoWidth;
      const h = camVideo.videoHeight;
      if(!w || !h) return;
      camCanvas.width = w;
      camCanvas.height = h;
      const ctx = camCanvas.getContext('2d');
      // espelha o desenho para bater com o preview em modo selfie
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(camVideo, 0, 0, w, h);
      capturedPhoto = camCanvas.toDataURL('image/jpeg', 0.9);
      camPhoto.src = capturedPhoto;
      stopCamStream();
      showCamView('result');
    });

    camRetakeBtn.addEventListener('click', () => {
      capturedPhoto = null;
      openCamera();
    });

    camRemoveBtn.addEventListener('click', () => {
      capturedPhoto = null;
      showCamView('empty');
    });

    // ---------- step navigation ----------
    function goToStep(n){
      if(n !== 4) stopCamStream();
      document.querySelectorAll('.b-panel').forEach(p => p.classList.toggle('active', p.dataset.panel == n));
      document.querySelectorAll('.step').forEach(s => {
        const step = parseInt(s.dataset.step);
        s.classList.toggle('active', step === n);
        s.classList.toggle('done', step < n);
      });
    }

    document.getElementById('toStep2').addEventListener('click', () => goToStep(2));
    document.getElementById('toStep3').addEventListener('click', () => { goToStep(3); renderSlots(); });
    document.getElementById('toStep4').addEventListener('click', () => { goToStep(4); fillSummary(); });

    document.querySelectorAll('[data-back]').forEach(b => {
      b.addEventListener('click', () => goToStep(parseInt(b.dataset.back)));
    });

    function fillSummary(){
      document.getElementById('sumService').textContent = state.service.name;
      document.getElementById('sumStylist').textContent = state.stylist.name;
      const dateLabel = new Date(state.date + 'T00:00:00').toLocaleDateString('pt-BR', {day:'2-digit', month:'long'});
      document.getElementById('sumDate').textContent = `${dateLabel} às ${state.time}`;
      document.getElementById('sumPrice').textContent = `R$ ${state.service.price}`;
      sumPhotoRow.style.display = capturedPhoto ? 'flex' : 'none';
    }

    // ---------- confirm booking ----------
    document.getElementById('confirmBtn').addEventListener('click', () => {
      const name = document.getElementById('nameInput').value.trim();
      const phone = document.getElementById('phoneInput').value.trim();
      if(!name || !phone){
        toast('Preencha nome e telefone para confirmar.');
        return;
      }
      const dateKey = state.date === isoToday ? '__TODAY__' : state.date;
      const key = `${state.stylist.id}|${dateKey}|${state.time}`;
      bookedSlots.add(key); // held in memory only — resets on reload

      bookingCounter++;
      const code = '#OF-' + String(bookingCounter).padStart(4,'0');
      document.getElementById('confirmCode').textContent = code;
      const dateLabel = new Date(state.date + 'T00:00:00').toLocaleDateString('pt-BR', {day:'2-digit', month:'long'});
      document.getElementById('confirmText').textContent =
        `${name.split(' ')[0]}, seu horário de ${state.service.name.toLowerCase()} com ${state.stylist.name.split(' ')[0]} está reservado para ${dateLabel} às ${state.time}.`;

      goToStep(5);
    });

    document.getElementById('newBooking').addEventListener('click', () => {
      Object.assign(state, { service:null, stylist:null, date:null, time:null });
      document.querySelectorAll('.choice.selected').forEach(c => c.classList.remove('selected'));
      document.getElementById('nameInput').value = '';
      document.getElementById('phoneInput').value = '';
      document.getElementById('toStep2').disabled = true;
      document.getElementById('toStep3').disabled = true;
      document.getElementById('toStep4').disabled = true;
      stopCamStream();
      capturedPhoto = null;
      showCamView('empty');
      goToStep(1);
    });

    // ---------- testimonials carousel ----------
    const testimonials = [
      {text:'Saí de lá com o cabelo mais saudável que já tive. O balayage ficou impecável.', name:'Marina Costa'},
      {text:'Atendimento cuidadoso do início ao fim — parece um ateliê, não um salão qualquer.', name:'Juliana Prado'},
      {text:'O corte do Rafael mudou meu visual completamente. Recomendo de olhos fechados.', name:'Pedro Lima'},
      {text:'A hidratação da Bianca salvou meu cabelo depois da descoloração. Voltarei sempre.', name:'Ana Beatriz'},
    ];
    const tWrap = document.getElementById('tWrap');
    const tDots = document.getElementById('tDots');
    testimonials.forEach((t, i) => {
      const s = document.createElement('div');
      s.className = 't-slide' + (i === 0 ? ' active' : '');
      s.innerHTML = `<p>"${t.text}"</p><cite>${t.name}</cite>`;
      tWrap.appendChild(s);
      const d = document.createElement('span');
      if(i === 0) d.classList.add('active');
      d.addEventListener('click', () => showTestimonial(i));
      tDots.appendChild(d);
    });
    let tIndex = 0;
    function showTestimonial(i){
      document.querySelectorAll('.t-slide').forEach((s,idx) => s.classList.toggle('active', idx===i));
      document.querySelectorAll('#tDots span').forEach((d,idx) => d.classList.toggle('active', idx===i));
      tIndex = i;
    }
    setInterval(() => showTestimonial((tIndex + 1) % testimonials.length), 5000);

    // ---------- reveal-on-scroll for sections ----------
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.style.opacity = 1;
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, {threshold:0.12});
    document.querySelectorAll('section').forEach(s => {
      s.style.opacity = 0;
      s.style.transform = 'translateY(24px)';
      s.style.transition = 'opacity .8s ease, transform .8s ease';
      io.observe(s);
    });
    // hero always visible immediately
    document.querySelector('.hero').style.opacity = 1;
    document.querySelector('.hero').style.transform = 'none';

  }, []);

  function selecionarServico(servico, el) {
    document.querySelectorAll('#serviceGrid .choice').forEach((c) => c.classList.remove('selected'));
    el.classList.add('selected');
    bookingState.current.service = servico;
    const btn = document.getElementById('toStep2');
    if (btn) btn.disabled = false;
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: BEFORE_SERVICE_GRID }} />

      {/* Grade de serviços: única parte do markup renderizada de fato via
          JSX + estado do React, alimentada pelo useEffect acima. */}
      <div className="choice-grid" id="serviceGrid">
        {carregando && (
          <p style={{ color: 'var(--cream-dim)', padding: '8px 4px' }}>Carregando serviços da nuvem...</p>
        )}
        {!carregando && erro && (
          <p style={{ color: '#e07b6a', padding: '8px 4px' }}>
            Não foi possível carregar da nuvem agora — mostrando o cardápio local. ({erro})
          </p>
        )}
        {!carregando &&
          servicos.map((s) => (
            <div
              key={s.id}
              className="choice"
              data-id={s.id}
              onClick={(e) => selecionarServico(s, e.currentTarget)}
            >
              <span className="cname">
                {s.name}
                <small>{s.note}</small>
              </span>
              <span className="cprice">R$ {s.price}</span>
            </div>
          ))}
      </div>

      <div dangerouslySetInnerHTML={{ __html: AFTER_SERVICE_GRID }} />
    </>
  );
}
