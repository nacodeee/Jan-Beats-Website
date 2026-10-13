import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ShoppingBag, Play, Pause, SlidersHorizontal, X, Plus, ArrowUpRight, Headphones, ShieldCheck, Download, Globe2, Mail, Music2 } from 'lucide-react';
import './style.css';

const copy = {
 es: {navBeats:'Beats',navLic:'Licencias',navAbout:'Sobre JAN',navContact:'Contacto',eyebrow:'INSTRUMENTALES ORIGINALES · 2026',headline:'TU PRÓXIMO TEMA\nEMPIEZA AQUÍ.',sub:'Beats con identidad para artistas que quieren sonar diferente.',explore:'Explorar beats',featured:'SELECCIÓN JAN',featuredSub:'Nuevos sonidos. Nuevas historias.',all:'Todos',genres:'Géneros',search:'Buscar por nombre o mood…',allGenres:'Todos los géneros',bpm:'BPM',sort:'Ordenar',newest:'Más recientes',low:'Precio: menor a mayor',high:'Precio: mayor a menor',empty:'No hay beats con esos filtros.',licenses:'LICENCIAS',licSub:'Elige cómo quieres lanzar tu próximo tema.',basic:'MP3 LEASE',premium:'WAV LEASE',trackout:'TRACKOUT LEASE',unlimited:'UNLIMITED LEASE',exclusive:'EXCLUSIVE',buy:'Añadir al carrito',details:'Elegir licencia',about:'HECHO PARA SONAR',aboutText:'Producción con carácter, desde la primera melodía hasta el último bounce. Encuentra el beat que encaja con tu visión.',contact:'¿TIENES UN PROYECTO EN MENTE?',contactSub:'Para beats exclusivos, producción a medida o cualquier consulta.',email:'Tu email',message:'Cuéntame qué tienes en mente…',send:'Preparar email',cart:'Tu carrito',cartEmpty:'Todavía no has añadido ningún beat.',subtotal:'Subtotal',checkout:'Continuar al pago',payNote:'Los pagos están desactivados. Conecta una pasarela antes de vender. La exclusiva no se considera vendida hasta que el pago esté confirmado.',remove:'Eliminar',footer:'Todos los derechos reservados.',rights:'Uso sujeto a la licencia adquirida.',play:'Reproducir preview',language:'ES',licenseItems:['Archivo MP3 de alta calidad','Licencia no exclusiva','Hasta 50.000 streams'],premiumItems:['Archivos WAV + MP3','Licencia no exclusiva','Hasta 150.000 streams'],trackItems:['WAV + MP3 + stems separados','Licencia no exclusiva','Hasta 500.000 streams'],unlimitedItems:['WAV + MP3 + stems separados','Licencia no exclusiva','Streams ilimitados según contrato'],exclusiveItems:['Venta exclusiva del beat','Se retira de futuras ventas tras pago confirmado','Derechos y usos sujetos a contrato'],licenseFine:'Los límites y derechos deben detallarse en el contrato de licencia.',exclusiveNote:'La licencia exclusiva requiere un contrato completo. Las licencias no exclusivas vendidas anteriormente deben respetarse según sus condiciones.'},
 en: {navBeats:'Beats',navLic:'Licenses',navAbout:'About JAN',navContact:'Contact',eyebrow:'ORIGINAL INSTRUMENTALS · 2026',headline:'YOUR NEXT RECORD\nSTARTS HERE.',sub:'Distinctive beats for artists ready to sound different.',explore:'Explore beats',featured:'JAN SELECTS',featuredSub:'New sounds. New stories.',all:'All',genres:'Genres',search:'Search by name or mood…',allGenres:'All genres',bpm:'BPM',sort:'Sort by',newest:'Newest',low:'Price: low to high',high:'Price: high to low',empty:'No beats match these filters.',licenses:'LICENSES',licSub:'Choose how you want to release your next record.',basic:'MP3 LEASE',premium:'WAV LEASE',trackout:'TRACKOUT LEASE',unlimited:'UNLIMITED LEASE',exclusive:'EXCLUSIVE',buy:'Add to cart',details:'Choose license',about:'MADE TO SOUND DIFFERENT',aboutText:'Character-driven production, from the first melody to the final bounce. Find the beat that fits your vision.',contact:'GOT A PROJECT IN MIND?',contactSub:'For exclusive beats, custom production or any questions.',email:'Your email',message:'Tell me what you have in mind…',send:'Prepare email',cart:'Your cart',cartEmpty:'You have not added any beats yet.',subtotal:'Subtotal',checkout:'Continue to checkout',payNote:'Payments are disabled. Connect a payment provider before selling. An exclusive is not considered sold until payment is confirmed.',remove:'Remove',footer:'All rights reserved.',rights:'Use is subject to the purchased license.',play:'Play preview',language:'EN',licenseItems:['High-quality MP3 file','Non-exclusive license','Up to 50,000 streams'],premiumItems:['WAV + MP3 files','Non-exclusive license','Up to 150,000 streams'],trackItems:['WAV + MP3 + separated stems','Non-exclusive license','Up to 500,000 streams'],unlimitedItems:['WAV + MP3 + separated stems','Non-exclusive license','Unlimited streams subject to contract'],exclusiveItems:['Exclusive beat sale','Removed from future sales after confirmed payment','Rights and usage subject to contract'],licenseFine:'Limits and rights must be detailed in the license agreement.',exclusiveNote:'An exclusive license requires a complete agreement. Previously sold non-exclusive licenses must be honored under their terms.'}
};
const beats = [

{
  id: 1,
  title: 'NOS MATAMOS',
  genre: 'Reggaetón',
  bpm: 88,
  key: 'A# minor',
  mood: 'Perreo oscuro',
  price: 29.99,
  art: 'art3',
  date: 7,
  preview: '/beats/nos-matamos.mp3',
  coverImage: '/covers/nos-matamos.jpg'
},

{
  id: 2,
  title: 'VIENES',
  genre: 'Reggaetón',
  bpm: 86,
  key: 'B minor',
  mood: 'Perreo oscuro',
  price: 29.99,
  art: 'art3',
  date: 7,
  preview: '/beats/vienes.mp3',
  coverImage: '/covers/+++.jpg'
},

];
const licenses = (t) => [
 {id:'mp3',name:t.basic,price:19.99,items:t.licenseItems,exclusive:false},
 {id:'wav',name:t.premium,price:29.99,items:t.premiumItems,exclusive:false},
 {id:'trackout',name:t.trackout,price:59.99,items:t.trackItems,exclusive:false},
 {id:'unlimited',name:t.unlimited,price:99.99,items:t.unlimitedItems,exclusive:false},
 {id:'exclusive',name:t.exclusive,price:249.99,items:t.exclusiveItems,exclusive:true}
];
function money(n, lang){return new Intl.NumberFormat(lang==='es'?'es-ES':'en-IE',{style:'currency',currency:'EUR'}).format(n)}
function App(){
 const [lang,setLang]=useState('es'), [genre,setGenre]=useState('Todos'), [query,setQuery]=useState(''), [sort,setSort]=useState('newest'), [cart,setCart]=useState([]), [cartOpen,setCartOpen]=useState(false), [playing,setPlaying]=useState(null), [license,setLicense]=useState({}), [mobileMenu,setMobileMenu]=useState(false);
 const t=copy[lang]; const audioRef=useRef(null);
 const filtered=useMemo(()=>beats.filter(b=>(genre==='Todos'||genre==='All'||b.genre===genre)&&(`${b.title} ${b.genre} ${b.mood} ${b.key}`.toLowerCase().includes(query.toLowerCase()))).sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:b.date-a.date),[genre,query,sort]);
 const total=cart.reduce((s,i)=>s+i.price,0);
 const [currentBeat, setCurrentBeat] = useState(null);
 const [licenseBeat, setLicenseBeat] = useState(null);
 const [currentTime, setCurrentTime] = useState(0);
 const [duration, setDuration] = useState(0);
 const [volume, setVolume] = useState(0.8);
 

function play(b) {
  if (!b.preview) {
    alert(lang === 'es' ? 'Este beat todavía no tiene preescucha.' : 'This beat does not have a preview yet.');
    return;
  }
  if (playing === b.id && audioRef.current) {
    audioRef.current.pause();
    setPlaying(null);
    return;
  }
  if (audioRef.current) audioRef.current.pause();
  const audio = new Audio(b.preview);
  audio.volume = volume;
  audioRef.current = audio;
  setCurrentBeat(b);
  setCurrentTime(0);
  setDuration(0);
  setPlaying(b.id);
  audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
  audio.onloadedmetadata = () => setDuration(audio.duration || 0);
  audio.onended = () => {
    setPlaying(null);
    setCurrentTime(0);
    audioRef.current = null;
  };
  audio.onerror = () => {
    setPlaying(null);
    setCurrentTime(0);
    audioRef.current = null;
    alert(lang === 'es' ? 'No se ha podido cargar la preescucha.' : 'Could not load this preview.');
  };
  audio.play().catch(() => setPlaying(null));
}

function changeVolume(value) {
  const nextVolume = Math.max(0, Math.min(1, Number(value)));
  setVolume(nextVolume);
  if (audioRef.current) audioRef.current.volume = nextVolume;
}

function seekAudio(value) {
  const audio = audioRef.current;
  if (!audio || !Number.isFinite(audio.duration)) return;
  audio.currentTime = Number(value);
  setCurrentTime(audio.currentTime);
}

function add(b, licenseId) {
  const selected = licenses(t).find(item => item.id === licenseId) || licenses(t)[1];
  if (cart.some(item => item.id === b.id && (item.licenseId === 'exclusive' || selected.exclusive))) {
    alert(lang === 'es' ? 'La licencia exclusiva de este beat ya está en tu carrito.' : 'The exclusive license for this beat is already in your cart.');
    setCartOpen(true);
    return;
  }
  setCart(prev => [...prev, {
    key: `${b.id}-${selected.id}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    id: b.id,
    title: b.title,
    licenseId: selected.id,
    license: selected.name,
    price: selected.price,
    exclusive: selected.exclusive
  }]);
  setCartOpen(true);
}

 function jump(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMobileMenu(false)}
 return <div className="app">
  <div className="topline"><span>JAN SOUND SYSTEM</span><span>INDEPENDENT PRODUCTION · EST. 2026</span><span>AVAILABLE WORLDWIDE ↗</span></div>
  <header className="header"><a className="logo" href="#" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})}}>JAN<span>®</span></a>
   <nav className={mobileMenu?'nav open':'nav'}><button onClick={()=>jump('beats')}>{t.navBeats}</button><button onClick={()=>jump('licenses')}>{t.navLic}</button><button onClick={()=>jump('about')}>{t.navAbout}</button><button onClick={()=>jump('contact')}>{t.navContact}</button></nav>
   <div className="headerActions"><button className="lang" onClick={()=>setLang(lang==='es'?'en':'es')}><Globe2 size={15}/>{t.language}</button><button className="cartButton" onClick={()=>setCartOpen(true)} aria-label={t.cart}><ShoppingBag size={18}/><span>{cart.length}</span></button><button className="menuButton" onClick={()=>setMobileMenu(!mobileMenu)}><SlidersHorizontal size={20}/></button></div>
  </header>
  <main>
   <section className="hero"><div className="heroShade"></div><div className="heroContent"><p className="eyebrow">{t.eyebrow}</p><h1>{t.headline.split('\n').map((x,i)=><React.Fragment key={x}>{i>0&&<br/>}{x}</React.Fragment>)}</h1><p className="heroSub">{t.sub}</p><button className="primary" onClick={()=>jump('beats')}>{t.explore}<ArrowUpRight size={17}/></button><div className="heroMeta"><span><Headphones size={15}/> Curated sound</span><span><ShieldCheck size={15}/> Clear licenses</span><span><Download size={15}/> Instant delivery*</span></div><small>*After checkout integration is enabled.</small></div><div className="heroStamp">JAN<br/><span>PRODUCER</span><b>001 — 026</b></div></section>
   <section className="ticker"><div>TRAP <i>✳</i> REGGAETÓN <i>✳</i> R&B <i>✳</i> BUILT FOR ARTISTS <i>✳</i> TRAP <i>✳</i> REGGAETÓN <i>✳</i> R&B <i>✳</i></div></section>
   <section className="section beatsSection" id="beats"><div className="sectionHead"><div><p className="eyebrow">01 / THE CATALOG</p><h2>{t.featured}</h2><p className="muted">{t.featuredSub}</p></div><div className="catalogCount">{String(filtered.length).padStart(2,'0')} <span>BEATS</span></div></div>
    <div className="filters"><div className="searchBox"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/>{query&&<button onClick={()=>setQuery('')}><X size={14}/></button>}</div><div className="genreFilters">{['Todos','Trap','Reggaetón','R&B'].map(g=><button key={g} className={genre===g?'active':''} onClick={()=>setGenre(g)}>{g==='Todos'?t.all:g}</button>)}</div><select aria-label={t.sort} value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">{t.newest}</option><option value="low">{t.low}</option><option value="high">{t.high}</option></select></div>
    <div className="beatGrid">{filtered.map((b,i)=><article className="beatCard" key={b.id}>
      

    <div className={`cover ${b.art}`}>
      {b.coverImage && (
        <img
          className="beatCoverImage"
          src={b.coverImage}
          alt={`Portada de ${b.title}`}
        />
      )}

      <span className="coverIndex">
        JAN / {String(b.id).padStart(2, '0')}
      </span>

      <button
        className="playButton"
        onClick={() => play(b)}
        aria-label={t.play + ' ' + b.title}
      >
        {playing === b.id
          ? <Pause size={21} fill="currentColor" />
          : <Play size={21} fill="currentColor" />}
      </button>

      <span className="coverGenre">{b.genre}</span>
      <div className="coverTitle">{b.title}</div>
    </div>

      <div className="beatInfo"><div><h3>{b.title}</h3><p>{b.bpm} BPM <span>·</span> {b.key}</p></div><strong>{money((licenses(t).find(item => item.id === (license[b.id] || 'wav')) || licenses(t)[1]).price,lang)}</strong></div><div className="beatBottom"><span>{b.mood}</span><span className="selectedLicensePrice">{(licenses(t).find(item => item.id === (license[b.id] || 'wav')) || licenses(t)[1]).name}</span></div>
     
<div className="licenseQuick">
  <button
    className="addLicenseButton"
    onClick={() => setLicenseBeat(b)}
  >
    {t.details}
    <Plus size={15} />
  </button>
</div>
</article>)}</div>

    {filtered.length===0&&<div className="empty">{t.empty}</div>}
   </section>
   <section className="manifesto" id="about"><div className="manifestoMark">J<span>A</span>N</div><div><p className="eyebrow">02 / THE APPROACH</p><h2>{t.about}</h2><p>{t.aboutText}</p></div><div className="manifestoSide">SOUND<br/>IS A<br/><em>FEELING.</em></div></section>
   <section className="section licenseSection" id="licenses"><div className="sectionHead"><div><p className="eyebrow">03 / YOUR RIGHTS</p><h2>{t.licenses}</h2><p className="muted">{t.licSub}</p></div></div><div className="licenseGrid">{licenses(t).map((l,i)=><article className={`licenseCard ${i===1?'popular':''} ${l.exclusive?'exclusiveCard':''}`} key={l.id}><div className="licenseTop"><span>0{i+1} / LICENSE</span>{i===1&&<b>POPULAR</b>}{l.exclusive&&<b>{lang==='es'?'EXCLUSIVA':'EXCLUSIVE'}</b>}</div><h3>{l.name}</h3><div className="licensePrice">{money(l.price,lang)}</div><ul>{l.items.map(item=><li key={item}><span>↗</span>{item}</li>)}</ul><button className={i===1?'primary':'secondary'} onClick={()=>{setLicense(prev=>({...prev,...Object.fromEntries(beats.map(beat=>[beat.id,l.id]))}));setCartOpen(false);jump('beats')}}>{lang==='es'?'Elegir en catálogo':'Choose in catalog'}<ArrowUpRight size={16}/></button><p className="licenseFine">{t.licenseFine}</p></article>)}</div><p className="legalNote">{t.exclusiveNote}</p></section>
   <section className="contactSection" id="contact"><div><p className="eyebrow">04 / LET'S WORK</p><h2>{t.contact}</h2><p className="muted">{t.contactSub}</p></div><form onSubmit={e=>{e.preventDefault();const d=new FormData(e.currentTarget);window.location.href=`mailto:hello@janbeats.com?subject=${encodeURIComponent('JAN — '+d.get('email'))}&body=${encodeURIComponent(d.get('message'))}`}}><label>{t.email}<input name="email" type="email" required placeholder="artist@email.com"/></label><label>{t.message}<textarea name="message" rows="3" required placeholder={t.message}/></label><button className="primary" type="submit">{t.send}<ArrowUpRight size={16}/></button><small>Replace hello@janbeats.com with your real contact email.</small></form></section>
  </main>

{currentBeat && (
  <div className="bottomPlayer">
    
    <div className={`playerArtwork ${currentBeat.art}`}>
      {currentBeat.coverImage && (
        <img src={currentBeat.coverImage} alt="" />
      )}
      <span>JAN</span>
    </div>


    <div className="playerTrack">
      <strong>{currentBeat.title}</strong>
      <span>{currentBeat.genre} · {currentBeat.bpm} BPM</span>
    </div>

    <div className="playerControls">
      <button onClick={() => play(currentBeat)}>
        {playing === currentBeat.id ? 'Ⅱ' : '▶'}
      </button>

      <div className="playerProgress">
        <span>
          {Math.floor(currentTime / 60)}:
          {String(Math.floor(currentTime % 60)).padStart(2, '0')}
        </span>


      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(currentTime, duration || 0)}
        disabled={!duration}
        onInput={e => seekAudio(e.currentTarget.value)}
        onChange={e => seekAudio(e.currentTarget.value)}
      />


        <span>
          {Math.floor(duration / 60)}:
          {String(Math.floor(duration % 60)).padStart(2, '0')}
        </span>
      </div>
    </div>

    <div className="playerVolume">
      <span>VOL</span>
      
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={volume}
      onInput={e => changeVolume(e.currentTarget.value)}
      onChange={e => changeVolume(e.currentTarget.value)}
      aria-label="Volumen"
    />

    </div>

    <button
      className="playerClose"
      onClick={() => {
        if (audioRef.current) audioRef.current.pause();
        audioRef.current = null;
        setPlaying(null);
        setCurrentBeat(null);
      }}
    >
      ×
    </button>
  </div>
)}

  <footer className="footer"><a className="logo" href="#">JAN<span>®</span></a><p>Independent sound for the next wave.</p>
<div className="socials">
  <a href="https://instagram.com/" target="_blank" rel="noreferrer">IG</a>
  <a href="https://youtube.com/" target="_blank" rel="noreferrer">YT</a>
  <a href="https://soundcloud.com/" target="_blank" rel="noreferrer">
    <Music2 size={18}/>
  </a>
  <a href="https://tiktok.com/" target="_blank" rel="noreferrer">TT</a>
  <a href="mailto:tuemail@gmail.com">
    <Mail size={18}/>
  </a>
</div>
</footer>


{licenseBeat && (
  <div
    className="overlay licenseOverlay"
    onMouseDown={e => {
      if (e.target === e.currentTarget) setLicenseBeat(null);
    }}
  >
    <section
      className="licenseModal"
      role="dialog"
      aria-modal="true"
      aria-label={t.details}
    >
      <div className="drawerHead">
        <div>
          <p className="eyebrow">JAN / LICENSE SELECT</p>
          <h2>{licenseBeat.title}</h2>
          <p className="muted">
            {lang === 'es'
              ? 'Elige la licencia para tu proyecto.'
              : 'Choose the license for your project.'}
          </p>
        </div>
        <button onClick={() => setLicenseBeat(null)} aria-label="Cerrar">
          <X />
        </button>
      </div>

      <div className="licenseModalRow">
        {licenses(t).map((l, i) => (
          <article
            className={`licenseOption ${i === 1 ? 'popular' : ''}`}
            key={l.id}
          >
            <span className="licenseOptionIndex">0{i + 1} / LICENSE</span>
            <h3>{l.name}</h3>
            <div className="licensePrice">{money(l.price, lang)}</div>

            <ul>
              {l.items.map(item => <li key={item}>{item}</li>)}
            </ul>

            <button
              className={i === 1 ? 'primary' : 'secondary'}
              onClick={() => {
                setLicense(prev => ({
                  ...prev,
                  [licenseBeat.id]: l.id
                }));
                add(licenseBeat, l.id);
                setLicenseBeat(null);
              }}
            >
              {lang === 'es' ? 'Elegir licencia' : 'Choose license'}
            </button>
          </article>
        ))}
      </div>

      <p className="licenseFine">{t.licenseFine}</p>
    </section>
  </div>
)}
{cartOpen&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setCartOpen(false)}}><aside className="cartDrawer"><div className="drawerHead"><div><p className="eyebrow">JAN / CHECKOUT</p><h2>{t.cart} <span>({cart.length})</span></h2></div><button onClick={()=>setCartOpen(false)}><X/></button></div>{cart.length===0?<div className="cartEmpty"><ShoppingBag size={34}/><p>{t.cartEmpty}</p><button className="secondary" onClick={()=>{setCartOpen(false);jump('beats')}}>{t.explore}</button></div>:<><div className="cartItems">{cart.map(item=><div className="cartItem" key={item.key}><div className="miniCover"><Music2/></div><div className="cartItemInfo"><strong>{item.title}</strong><span>{item.license}</span><button onClick={()=>setCart(cart.filter(x=>x.key!==item.key))}>{t.remove}</button></div><b>{money(item.price,lang)}</b></div>)}</div><div className="cartTotal"><span>{t.subtotal}</span><strong>{money(total,lang)}</strong></div><p className="payNote">{t.payNote}</p><button className="primary full" disabled>{t.checkout}<ArrowUpRight size={16}/></button></>}</aside></div>}
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
