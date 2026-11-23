const DATA={
  aqueous:[
    {id:'nacl',name:'Sodium chloride · NaCl(aq)',ions:['Na⁺','Cl⁻','H⁺','OH⁻'],cat:{name:'Hydrogen',formula:'H₂',kind:'gas',eq:'2H₂O + 2e⁻ → H₂ + 2OH⁻',desc:'Hydrogen gas forms because sodium is more reactive than hydrogen.',rule:'In aqueous NaCl, water is reduced instead of Na⁺ because sodium is above hydrogen in the reactivity series.'},an:{name:'Chlorine',formula:'Cl₂',kind:'gas',eq:'2Cl⁻ → Cl₂ + 2e⁻',desc:'Chloride ions lose electrons to form chlorine gas.',rule:'In this brine model, chloride ions discharge at the anode to form chlorine.'}},
    {id:'cucl2',name:'Copper(II) chloride · CuCl₂(aq)',ions:['Cu²⁺','Cl⁻','H⁺','OH⁻'],cat:{name:'Copper',formula:'Cu',kind:'metal',colour:'#c77445',eq:'Cu²⁺ + 2e⁻ → Cu',desc:'Copper metal coats the cathode as Cu²⁺ ions gain electrons.',rule:'Copper is less reactive than hydrogen, so Cu²⁺ is discharged and copper is deposited.'},an:{name:'Chlorine',formula:'Cl₂',kind:'gas',eq:'2Cl⁻ → Cl₂ + 2e⁻',desc:'Chloride ions are oxidised to chlorine gas.',rule:'Halide ions are discharged in preference to OH⁻.'}},
    {id:'cuso4',name:'Copper(II) sulfate · CuSO₄(aq)',ions:['Cu²⁺','SO₄²⁻','H⁺','OH⁻'],cat:{name:'Copper',formula:'Cu',kind:'metal',colour:'#c77445',eq:'Cu²⁺ + 2e⁻ → Cu',desc:'A pink-brown layer of copper coats the cathode.',rule:'Copper is below hydrogen in the reactivity series, so copper is deposited.'},an:{name:'Oxygen',formula:'O₂',kind:'gas',eq:'4OH⁻ → O₂ + 2H₂O + 4e⁻',desc:'Oxygen forms from hydroxide ions in the water.',rule:'Sulfate ions remain in solution; OH⁻ is discharged to form oxygen.'}},
    {id:'agno3',name:'Silver nitrate · AgNO₃(aq)',ions:['Ag⁺','NO₃⁻','H⁺','OH⁻'],cat:{name:'Silver',formula:'Ag',kind:'metal',colour:'#d9e2e7',eq:'Ag⁺ + e⁻ → Ag',desc:'Silver metal forms a bright coating on the cathode.',rule:'Silver is less reactive than hydrogen, so Ag⁺ gains electrons.'},an:{name:'Oxygen',formula:'O₂',kind:'gas',eq:'4OH⁻ → O₂ + 2H₂O + 4e⁻',desc:'Oxygen gas bubbles from the anode.',rule:'Nitrate ions remain in solution; OH⁻ forms oxygen.'}},
    {id:'kbr',name:'Potassium bromide · KBr(aq)',ions:['K⁺','Br⁻','H⁺','OH⁻'],cat:{name:'Hydrogen',formula:'H₂',kind:'gas',eq:'2H₂O + 2e⁻ → H₂ + 2OH⁻',desc:'Water is reduced to hydrogen gas.',rule:'Potassium is more reactive than hydrogen, so hydrogen forms instead.'},an:{name:'Bromine',formula:'Br₂',kind:'dissolved',eq:'2Br⁻ → Br₂ + 2e⁻',desc:'Orange-brown bromine forms at the anode.',rule:'Bromide is a halide ion, so it is discharged at the anode.'}},
    {id:'ki',name:'Potassium iodide · KI(aq)',ions:['K⁺','I⁻','H⁺','OH⁻'],cat:{name:'Hydrogen',formula:'H₂',kind:'gas',eq:'2H₂O + 2e⁻ → H₂ + 2OH⁻',desc:'Water is reduced to hydrogen gas.',rule:'Potassium is more reactive than hydrogen, so hydrogen forms instead.'},an:{name:'Iodine',formula:'I₂',kind:'dissolved',eq:'2I⁻ → I₂ + 2e⁻',desc:'Iodine colours the solution brown around the anode.',rule:'Iodide ions lose electrons and form iodine.'}},
    {id:'na2so4',name:'Sodium sulfate · Na₂SO₄(aq)',ions:['Na⁺','SO₄²⁻','H⁺','OH⁻'],cat:{name:'Hydrogen',formula:'H₂',kind:'gas',eq:'2H₂O + 2e⁻ → H₂ + 2OH⁻',desc:'Hydrogen gas forms at the cathode.',rule:'Sodium is more reactive than hydrogen, so water is reduced.'},an:{name:'Oxygen',formula:'O₂',kind:'gas',eq:'4OH⁻ → O₂ + 2H₂O + 4e⁻',desc:'Oxygen gas forms at the anode.',rule:'Sulfate remains in solution; OH⁻ is oxidised.'}},
    {id:'znso4',name:'Zinc sulfate · ZnSO₄(aq)',ions:['Zn²⁺','SO₄²⁻','H⁺','OH⁻'],cat:{name:'Hydrogen',formula:'H₂',kind:'gas',eq:'2H₂O + 2e⁻ → H₂ + 2OH⁻',desc:'Hydrogen forms instead of zinc at GCSE level.',rule:'Zinc is more reactive than hydrogen, so hydrogen is produced.'},an:{name:'Oxygen',formula:'O₂',kind:'gas',eq:'4OH⁻ → O₂ + 2H₂O + 4e⁻',desc:'Oxygen gas forms at the anode.',rule:'Sulfate remains in solution; OH⁻ is oxidised.'}},
    {id:'hcl',name:'Hydrochloric acid · HCl(aq)',ions:['H⁺','Cl⁻'],cat:{name:'Hydrogen',formula:'H₂',kind:'gas',eq:'2H⁺ + 2e⁻ → H₂',desc:'Hydrogen ions gain electrons to form hydrogen gas.',rule:'H⁺ ions are attracted to the cathode and are reduced.'},an:{name:'Chlorine',formula:'Cl₂',kind:'gas',eq:'2Cl⁻ → Cl₂ + 2e⁻',desc:'Chloride ions lose electrons to form chlorine gas.',rule:'Cl⁻ ions are attracted to the anode and are oxidised.'}},
    {id:'h2so4',name:'Sulfuric acid · H₂SO₄(aq)',ions:['H⁺','SO₄²⁻','OH⁻'],cat:{name:'Hydrogen',formula:'H₂',kind:'gas',eq:'2H⁺ + 2e⁻ → H₂',desc:'Hydrogen ions are reduced to hydrogen gas.',rule:'H⁺ gains electrons at the cathode.'},an:{name:'Oxygen',formula:'O₂',kind:'gas',eq:'4OH⁻ → O₂ + 2H₂O + 4e⁻',desc:'Oxygen gas forms at the anode.',rule:'Sulfate remains in solution; water/OH⁻ forms oxygen.'}},
    {id:'hno3',name:'Nitric acid · HNO₃(aq)',ions:['H⁺','NO₃⁻','OH⁻'],cat:{name:'Hydrogen',formula:'H₂',kind:'gas',eq:'2H⁺ + 2e⁻ → H₂',desc:'Hydrogen ions are reduced to hydrogen gas.',rule:'H⁺ gains electrons at the cathode.'},an:{name:'Oxygen',formula:'O₂',kind:'gas',eq:'4OH⁻ → O₂ + 2H₂O + 4e⁻',desc:'Oxygen forms while nitrate ions remain in solution.',rule:'Nitrate is not discharged; water/OH⁻ forms oxygen.'}},
    {id:'naoh',name:'Sodium hydroxide · NaOH(aq)',ions:['Na⁺','OH⁻','H⁺'],cat:{name:'Hydrogen',formula:'H₂',kind:'gas',eq:'2H₂O + 2e⁻ → H₂ + 2OH⁻',desc:'Water gains electrons to form hydrogen gas.',rule:'Sodium is too reactive to be deposited from water.'},an:{name:'Oxygen',formula:'O₂',kind:'gas',eq:'4OH⁻ → O₂ + 2H₂O + 4e⁻',desc:'Hydroxide ions lose electrons to form oxygen gas.',rule:'OH⁻ ions are oxidised at the anode.'}},
    {id:'koh',name:'Potassium hydroxide · KOH(aq)',ions:['K⁺','OH⁻','H⁺'],cat:{name:'Hydrogen',formula:'H₂',kind:'gas',eq:'2H₂O + 2e⁻ → H₂ + 2OH⁻',desc:'Water gains electrons to form hydrogen gas.',rule:'Potassium is too reactive to be deposited from water.'},an:{name:'Oxygen',formula:'O₂',kind:'gas',eq:'4OH⁻ → O₂ + 2H₂O + 4e⁻',desc:'Hydroxide ions lose electrons to form oxygen gas.',rule:'OH⁻ ions are oxidised at the anode.'}}
  ],
  molten:[
    {id:'nacl-m',name:'Molten sodium chloride · NaCl(l)',ions:['Na⁺','Cl⁻'],cat:{name:'Sodium',formula:'Na',kind:'metal',colour:'#c9d4da',eq:'Na⁺ + e⁻ → Na',desc:'Molten sodium metal forms at the cathode.',rule:'Only Na⁺ and Cl⁻ are present. Na⁺ gains electrons.'},an:{name:'Chlorine',formula:'Cl₂',kind:'gas',eq:'2Cl⁻ → Cl₂ + 2e⁻',desc:'Chlorine gas forms at the anode.',rule:'Cl⁻ loses electrons to form chlorine.'}},
    {id:'pbbr2-m',name:'Molten lead(II) bromide · PbBr₂(l)',ions:['Pb²⁺','Br⁻'],cat:{name:'Lead',formula:'Pb',kind:'metal',colour:'#9ea6a8',eq:'Pb²⁺ + 2e⁻ → Pb',desc:'Molten lead metal forms on the cathode.',rule:'Pb²⁺ is reduced because it is the only positive ion.'},an:{name:'Bromine',formula:'Br₂',kind:'gas',eq:'2Br⁻ → Br₂ + 2e⁻',desc:'Orange-brown bromine forms at the anode.',rule:'Br⁻ is oxidised because it is the only negative ion.'}},
    {id:'al2o3-m',name:'Molten aluminium oxide · Al₂O₃(l)',ions:['Al³⁺','O²⁻'],cat:{name:'Aluminium',formula:'Al',kind:'metal',colour:'#cbd6dc',eq:'Al³⁺ + 3e⁻ → Al',desc:'Molten aluminium forms as Al³⁺ gains electrons.',rule:'Al³⁺ is the only cation, so it is reduced.'},an:{name:'Oxygen',formula:'O₂',kind:'gas',eq:'2O²⁻ → O₂ + 4e⁻',desc:'Oxide ions form oxygen gas at an inert anode.',rule:'O²⁻ ions lose electrons and form oxygen.'}},
    {id:'cucl2-m',name:'Molten copper(II) chloride · CuCl₂(l)',ions:['Cu²⁺','Cl⁻'],cat:{name:'Copper',formula:'Cu',kind:'metal',colour:'#c77445',eq:'Cu²⁺ + 2e⁻ → Cu',desc:'Copper coats the cathode.',rule:'Cu²⁺ is the only cation and gains electrons.'},an:{name:'Chlorine',formula:'Cl₂',kind:'gas',eq:'2Cl⁻ → Cl₂ + 2e⁻',desc:'Chlorine gas forms at the anode.',rule:'Cl⁻ ions lose electrons.'}},
    {id:'zncl2-m',name:'Molten zinc chloride · ZnCl₂(l)',ions:['Zn²⁺','Cl⁻'],cat:{name:'Zinc',formula:'Zn',kind:'metal',colour:'#aebabc',eq:'Zn²⁺ + 2e⁻ → Zn',desc:'Zinc metal coats the cathode.',rule:'Zn²⁺ is reduced because no water is present.'},an:{name:'Chlorine',formula:'Cl₂',kind:'gas',eq:'2Cl⁻ → Cl₂ + 2e⁻',desc:'Chlorine gas forms at the anode.',rule:'Cl⁻ ions are oxidised.'}},
    {id:'mgcl2-m',name:'Molten magnesium chloride · MgCl₂(l)',ions:['Mg²⁺','Cl⁻'],cat:{name:'Magnesium',formula:'Mg',kind:'metal',colour:'#ccd4d6',eq:'Mg²⁺ + 2e⁻ → Mg',desc:'Magnesium metal forms at the cathode.',rule:'Mg²⁺ gains electrons in the absence of water.'},an:{name:'Chlorine',formula:'Cl₂',kind:'gas',eq:'2Cl⁻ → Cl₂ + 2e⁻',desc:'Chlorine gas forms at the anode.',rule:'Cl⁻ ions lose electrons.'}},
    {id:'cacl2-m',name:'Molten calcium chloride · CaCl₂(l)',ions:['Ca²⁺','Cl⁻'],cat:{name:'Calcium',formula:'Ca',kind:'metal',colour:'#c7d0d2',eq:'Ca²⁺ + 2e⁻ → Ca',desc:'Calcium metal forms at the cathode.',rule:'Ca²⁺ gains electrons because no water is present.'},an:{name:'Chlorine',formula:'Cl₂',kind:'gas',eq:'2Cl⁻ → Cl₂ + 2e⁻',desc:'Chlorine gas forms at the anode.',rule:'Cl⁻ ions lose electrons.'}},
    {id:'ki-m',name:'Molten potassium iodide · KI(l)',ions:['K⁺','I⁻'],cat:{name:'Potassium',formula:'K',kind:'metal',colour:'#cbd3d5',eq:'K⁺ + e⁻ → K',desc:'Potassium metal forms at the cathode.',rule:'K⁺ is the only cation and gains electrons.'},an:{name:'Iodine',formula:'I₂',kind:'iodine',eq:'2I⁻ → I₂ + 2e⁻',desc:'Purple iodine vapour forms at the anode.',rule:'I⁻ ions lose electrons to form iodine.'}}
  ]
};

const aqaPaper={label:'AQA GCSE Chemistry · June 2023 · Q7.3',url:'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2023/june/AQA-84621F-QP-JUN23.PDF#page=20'};
const ocrPaper={label:'OCR GCSE Combined Science · June 2024 · Q12',url:'https://www.ocr.org.uk/Images/727738-question-paper-paper-9.pdf#page=10'};
for(const [id,name,metal,halogen,source] of [
  ['mgbr2-m','Molten magnesium bromide · MgBr₂(l)','mgcl2-m','pbbr2-m',aqaPaper],
  ['kcl-m','Molten potassium chloride · KCl(l)','ki-m','nacl-m',aqaPaper],
  ['kbr-m','Molten potassium bromide · KBr(l)','ki-m','pbbr2-m',ocrPaper]
]) {
  const c=DATA.molten.find(d=>d.id===metal), a=DATA.molten.find(d=>d.id===halogen);
  DATA.molten.push({id,name,ions:[c.ions[0],a.ions[1]],cat:c.cat,an:a.an,source});
}
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={mode:'aqueous',running:false,speed:1,time:0,deposit:0,last:performance.now(),ions:[],products:[]};
const svgNS='http://www.w3.org/2000/svg';
const el={app:$('#app'),select:$('#electrolyte'),status:$('#status span'),power:$('#power'),speed:$('#speed'),speedOut:$('#speed-out'),liquid:$('#liquid'),ionLayer:$('#ion-layer'),productLayer:$('#product-layer'),electronLayer:$('#electron-layer'),coat:$('#metal-coat')};
const current=()=>DATA[state.mode].find(x=>x.id===el.select.value)||DATA[state.mode][0];
const positive = label => label.includes('⁺');

function liquidMetalProduct(product) {
  return state.mode==='molten' && product.kind==='metal' && product.formula!=='Cu';
}

function populate(){
  el.select.replaceChildren(...DATA[state.mode].map(item=>new Option(item.name,item.id)));
  if(state.mode==='molten') el.select.value='pbbr2-m';
  updateExperiment(true);
}
function updateExperiment(reset=true){
  const d=current();
  $('#hydrogen-note').textContent = d.note || (d.cat.eq.startsWith('2H₂O') ? 'For hydrogen formation, the animation uses the GCSE H⁺ model. Water supplies the hydrogen.' : '');
  const citation=$('#exam-paper');
  citation.hidden=!d.source;
  if(d.source){citation.href=d.source.url;citation.textContent=d.source.label;}
  $('#stage-title').textContent=state.mode==='molten'?'Molten electrolysis':'Aqueous electrolysis';
  el.liquid.setAttribute('fill',state.mode==='molten'?'url(#melt)':'url(#aq)');
  $('#cathode-name').textContent=`${d.cat.name} (${d.cat.formula})`;$('#cathode-desc').textContent=d.cat.desc;
  $('#anode-name').textContent=`${d.an.name} (${d.an.formula})`;$('#anode-desc').textContent=d.an.desc;
  $('#cathode-rule').textContent=d.cat.rule;$('#anode-rule').textContent=d.an.rule;
  $('#explanation-title').textContent=`Electrolysis of ${el.select.selectedOptions[0].textContent.split(' · ')[0]}`;
  $('#explanation-text').textContent=`At the cathode: ${d.cat.name} (${d.cat.formula}) forms by reduction. At the anode: ${d.an.name} (${d.an.formula}) forms by oxidation.`;
  el.coat.setAttribute('fill',d.cat.colour||'#c87845');
  const liquidMetal=liquidMetalProduct(d.cat);
  $('#liquid-metal').style.display=liquidMetal?'':'none';
  if(liquidMetal) {
    $('#metal-film').setAttribute('fill',d.cat.colour);
    $('#cathode-desc').textContent=`A film of liquid ${d.cat.name.toLowerCase()} thickens on the cathode and slowly feeds a continuous layer at its base.`;
    $('#hydrogen-note').textContent=d.cat.formula==='Pb'
      ? 'Liquid lead collects beneath the cathode. The layers are enlarged to show their movement.'
      : 'Liquid collection is shown schematically at the cathode. The actual metal level depends on temperature and density.';
    if(d.cat.formula==='Na') $('#hydrogen-note').textContent+=' In a sodium cell the liquid sodium floats.';
  } else if(state.mode==='molten' && d.cat.formula==='Cu') {
    $('#cathode-desc').textContent='Copper atoms build a solid coating on the cathode.';
    $('#hydrogen-note').textContent='At the temperature modelled here, copper(II) chloride is molten and copper metal stays solid.';
  }
  refreshQuiz();
  if(reset) resetAnimation();
}
function resetAnimation(){resetMetalFilm();transferStages.clear();$('#transfer-layer').replaceChildren();state.time=0;state.deposit=0;state.products=[];el.productLayer.innerHTML='';el.electronLayer.innerHTML='';el.coat.setAttribute('opacity','0');el.coat.setAttribute('x','234');el.coat.setAttribute('width','36');createIons()}
// Sample many ions moving through the liquid. Only the particles in the
// separate surface reaction undergo discharge; the rest retain their charge.
function createIons() {
  const data=current();
  state.ions=[];
  el.ionLayer.replaceChildren();
  for(let i=0;i<38;i++) {
    const label=data.ions[i%data.ions.length];
    const cation=positive(label);
    const outside=i%5===0;
    const start=outside?(cation?139:781):(cation?623:297);
    const end=outside?(cation?214:706):(cation?292:628);
    const node=ionDisc(label,'mobile-ion');
    node.dataset.species=label;
    const ion={node,start,end,progress:(.05+i*.61803398875)%1,
      row:290+((i*77)%184),speed:(10+(i*11)%9)/Math.abs(end-start),offset:i*2.4,
      heading:Math.random()*2*Math.PI,turnIn:Math.random()};
    state.ions.push(ion);
    el.ionLayer.append(node);
    moveIon(ion,0,0);
  }
  showTransfers(data,0);
}

function moveIon(ion,dt,time) {
  if (state.running) {
    ion.progress=(ion.progress+dt*ion.speed)%1;
  } else {
    ion.turnIn-=dt;
    if(ion.turnIn<=0) {
      ion.heading+=(Math.random()-.5)*Math.PI*1.5;
      ion.turnIn=.25+Math.random()*.9;
    }
    const p=ion.progress+dt*15*Math.cos(ion.heading)/(ion.end-ion.start);
    const y=ion.row+dt*15*Math.sin(ion.heading);
    if(p<0 || p>1) ion.heading=Math.PI-ion.heading;
    if(y<289 || y>476) ion.heading=-ion.heading;
    ion.progress=clampUnit(p);
    ion.row=Math.max(289,Math.min(476,y));
  }
  const x=lerp(ion.start,ion.end,ion.progress);
  const y=ion.row+6*Math.sin(time*.75+ion.offset)+3*Math.sin(ion.progress*8);
  place(ion.node,x,y);
  // Fade at the ends of the sampled track, before the electrode surface.
  ion.node.setAttribute('opacity',state.running?Math.min(1,ion.progress/.07,(1-ion.progress)/.12):1);
}
function togglePower(on=!state.running){state.running=on;el.app.classList.toggle('running',on);el.power.setAttribute('aria-pressed',String(on));el.power.title=on?'Switch off':'Switch on';el.status.textContent=on?'Electrolysis running':'Power off'}
function makeSvg(tag,attrs={}){const n=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n}
const gasTints = {
  'Cl₂':['#ccd95f','#e1ed8c'],
  'Br₂':['#aa4f2e','#ed976a'],
  'I₂':['#9859c6','#d2a0ed']
};

function spawnProduct(side,product) {
  if(product.kind==='metal') return;
  const x=(side==='cat'?252:668)+(Math.random()<.5?-1:1)*(21+Math.random()*10);
  const dissolved=product.kind==='dissolved';
  const y=dissolved?380+Math.random()*70:470-Math.random()*112;
  const node=dissolved
    ? makeSvg('ellipse',{class:'dissolved-halogen',cx:x,cy:y,rx:7+Math.random()*8,ry:4+Math.random()*7})
    : makeSvg('circle',{class:'bubble',cx:x,cy:y,r:6+Math.random()*4});
  const tint=gasTints[product.formula];
  if(!dissolved && tint) {
    node.style.fill=tint[0];
    node.style.fillOpacity='.54';
    node.style.stroke=tint[1];
  }
  el.productLayer.append(node);
  state.products.push({node,x,y,life:0,kind:dissolved?'dissolved':'gas'});
}
const transferStages = new Map();
const clampUnit = n => Math.min(1, Math.max(0, n));
const lerp = (a, b, t) => a + (b-a)*t;
const interval = (phase, start, end) => clampUnit((phase-start)/(end-start));
const place = (node,x,y) => node.setAttribute('transform', `translate(${x} ${y})`);
// Use one visual identity for an element in the liquid, at the electrode
// and in the product. Charge is conveyed by its symbol and electron markers.
const palette = {
  H:'#f2f5ff', O:'#ff9991', Cl:'#9cd577', Br:'#ea965e', I:'#cb9fe9',
  Cu:'#e3996e', Ag:'#d9e2e7', Na:'#f0d78f', K:'#c0b6ef', Pb:'#a9b3bf',
  Zn:'#aebabc', Al:'#cbd6dc', Mg:'#afe1d5', Ca:'#bfd69a',
  'SO₄':'#f0d295', 'NO₃':'#a9c4fa'
};
const speciesBase = label => label.replace(/[⁺⁻²³]+$/u,'');
const particleRadius = label => ({H:11,'SO₄':19,'NO₃':19}[speciesBase(label)] || 15);

function ionDisc(label,className) {
  if(label!=='OH⁻') return disc(label,particleRadius(label),palette[speciesBase(label)],className);
  // Draw hydroxide with the same O and H spheres later seen in O₂ and H₂O.
  const node=makeSvg('g',{class:className});
  const oxygen=disc('O',particleRadius('O'),palette.O,'');
  const hydrogen=disc('H',particleRadius('H'),palette.H,'');
  place(hydrogen,-12,10);
  const charge=makeSvg('text',{x:11,y:-9,fill:'white','font-size':19,'font-weight':800,
    stroke:'#142738','stroke-width':2,'paint-order':'stroke'});
  charge.textContent='⁻';
  node.append(oxygen,hydrogen,charge);
  return node;
}

function disc(label, radius, fill, className) {
  const node = makeSvg('g',{class:className});
  const circle = makeSvg('circle',{r:radius,fill,stroke:'#f4fbff','stroke-width':1});
  const text = makeSvg('text',{'text-anchor':'middle','dominant-baseline':'central',
    fill:'#102332','font-weight':800,'font-size':radius>10?13:9});
  text.textContent=label;
  node.append(circle,text);
  return node;
}

function reactingSpecies(product) {
  return product.formula==='H₂' ? '2H⁺' : product.eq.split(/ → | \+ /)[0];
}

function buildTransfer(product, cathode) {
  const [,coefficient,species]=reactingSpecies(product).match(/^(\d*)(.+)$/);
  const count=Number(coefficient||1);
  const perIon=Number(product.eq.match(/(\d*)e⁻/)[1]||1)/count;
  const electrodeX=cathode?252:668;
  const sign=cathode?1:-1;
  const group=makeSvg('g',{'data-electrode':cathode?'cathode':'anode'});
  const ions=[], atoms=[], electrons=[];
  for(let i=0;i<count;i++) {
    const y=355+(i-(count-1)/2)*44;
    const ion=ionDisc(species,'reacting-ion');
    const ring=makeSvg('circle',{r:particleRadius(species)+5,fill:'none',stroke:'#fff5a6','stroke-width':2.3,'stroke-dasharray':'5 2',class:'reaction-ring'});
    ion.prepend(ring);
    group.append(ion);
    ions.push({node:ion,y});
    const element=product.formula.replace('₂','');
    const elements=species==='OH⁻'?['O','H']:[element];
    for(const symbol of elements) {
      const atom=disc(symbol,particleRadius(symbol),palette[symbol],'neutral-atom');
      group.append(atom);
      atoms.push({node:atom,symbol,origin:i});
    }
    for(let j=0;j<perIon;j++) {
      const marker=disc('e⁻',8,'#b8f2ff','electron');
      group.append(marker);
      electrons.push({marker,i,j,perIon});
    }
  }
  $('#transfer-layer').append(group);
  const path=$(cathode?'#electronLeft':'#electronRight');
  return {product,cathode,electrodeX,sign,ions,atoms,electrons,species,path,length:path.getTotalLength()};
}

function drawElectrons(stage,phase,ionX,surface) {
  const {electrons,ions,cathode,sign,electrodeX,path,length}=stage;
  for(const [index,{marker,i,j,perIon}] of electrons.entries()) {
    const row=ions[i].y+(j-(perIon-1)/2)*9;
    const contact=ionX-sign*(particleRadius(stage.species)-2);
    // The approaching anion carries its electrons. Only the final two SVG units
    // between touching outlines represent transfer across the interface.
    const t=phase-index*.012;
    let x,y;
    if(cathode && t<.22 || !cathode && t>=.47) {
      const distance=cathode?interval(t,0,.22):interval(t,.47,.73);
      const point=path.getPointAtLength(length*distance);
      x=point.x; y=point.y;
    } else if(cathode && t<.31 || !cathode && t>=.39) {
      const a=cathode?interval(t,.22,.31):1-interval(t,.39,.47);
      x=electrodeX; y=lerp(324,row,a);
    } else {
      const a=cathode?interval(t,.31,.36):1-interval(t,.34,.39);
      const b=cathode?interval(t,.36,.39):1-interval(t,.31,.34);
      x=lerp(lerp(electrodeX,surface,a),contact,b);
      y=row;
    }
    place(marker,x,y);
    const visible=cathode?interval(t,0,.025)*(1-interval(t,.39,.41)):1-interval(t,.71,.74);
    marker.setAttribute('opacity',visible);
  }
}

function drawAtoms(stage,phase,ionX,surface) {
  const {product,sign,ions,atoms,species}=stage;
  const join=interval(phase,.53,.72);
  const away=interval(phase,.75,.98);
  const fade=1-interval(phase,.91,1);
  const hydroxide=species==='OH⁻';
  for(const {node,symbol,origin} of atoms) {
    const startY=ions[origin].y+(hydroxide && symbol==='H'?10:0);
    const startX=ionX+(hydroxide && symbol==='H'?12*sign:0);
    let x,y;
    if(product.kind==='metal') {
      x=lerp(ionX,surface-sign*9,interval(phase,.58,.85));
      y=startY;
    } else {
      // Four OH⁻ yield one O₂ and two H₂O. Each sphere retains its identity.
      const water=hydroxide && (symbol==='H' || origin>=2);
      const waterIndex=symbol==='H'?Math.floor(origin/2):origin-2;
      const centreY=water?396+waterIndex*45:344;
      const offsetX=water && symbol==='H'?(origin%2?11:-11):0;
      const offsetY=water?(symbol==='H'?9:0):(origin===0?-1:1)*(symbol==='H'?8:11);
      const centreX=surface+sign*(water?68:47);
      x=lerp(startX,centreX+offsetX,join)+sign*away*(water||product.kind==='dissolved'?55:19);
      y=lerp(startY,centreY+offsetY,join)-away*(water||product.kind==='dissolved'?14:106);
    }
    place(node,x,y);
    const finish=product.kind==='metal'?1-interval(phase,.72,.86):fade;
    node.setAttribute('opacity',interval(phase,.44,.48)*finish);
  }
}

function showTransfers(data,time) {
  const phase=(time%7)/7;
  for(const side of ['cat','an']) {
    if(!transferStages.has(side)) transferStages.set(side,buildTransfer(data[side],side==='cat'));
    const stage=transferStages.get(side);
    const {electrodeX,sign,ions,product}=stage;
    const width=liquidMetalProduct(product)?14+filmThickness():product.kind==='metal' && state.deposit>0 ? 18+7.5*state.deposit : 14;
    const surface=electrodeX+sign*width;
    const ionX=surface+sign*(particleRadius(stage.species)+62*(1-interval(phase,0,.22)));
    for(const {node,y} of ions) {
      place(node,ionX,y);
      node.setAttribute('opacity',1-interval(phase,.44,.48));
    }
    drawElectrons(stage,phase,ionX,surface);
    drawAtoms(stage,phase,ionX,surface);
  }
}
// The electrode film and the layer at its foot share one continuous outline.
const film={onCathode:0,drained:0};
function resetMetalFilm() {
  film.onCathode=0;
  film.drained=0;
  $('#metal-film').removeAttribute('d');
  $('#film-sheen').removeAttribute('d');
}
function filmThickness() {
  return 5*(1-Math.exp(-film.onCathode));
}
function advanceMetalFilm(dt,forming) {
  if(forming) film.onCathode+=dt*.65;
  if(film.onCathode===0) return;
  // A thin wetting film remains on the immersed surface after power is removed.
  const moved=Math.max(0,film.onCathode-.16)*(1-Math.exp(-dt*.17));
  film.onCathode-=moved;
  film.drained+=moved;
  const thick=filmThickness();
  const left=238-thick, right=266+thick;
  const front=clampUnit(film.drained/.28);
  const base=487+15*front;
  const spread=1-Math.exp(-Math.max(0,film.drained-.28)/2.6);
  const halfWidth=14+thick+99*spread;
  const depth=1+14*spread;
  const edgeL=252-halfWidth, edgeR=252+halfWidth;
  const shape=[
    `M ${left} 269 Q ${left} 265 241 265 H 263 Q ${right} 265 ${right} 269`,
    `V 449 C ${right} 472 ${right+thick} ${base-depth-4} ${right+thick} ${base-depth}`,
    `C ${right+thick} ${base-1} ${edgeR} ${base-depth*.65} ${edgeR} ${base}`,
    `H ${edgeL} C ${edgeL} ${base-depth*.65} ${left-thick} ${base-1} ${left-thick} ${base-depth}`,
    `C ${left-thick} ${base-depth-4} ${left} 472 ${left} 449 Z`
  ];
  $('#metal-film').setAttribute('d',shape.join(' '));
  $('#metal-film').setAttribute('opacity',Math.min(.94,.96*(1-Math.exp(-film.onCathode*4))));
  $('#film-sheen').setAttribute('d',`M ${right-2} 278 V 448 Q ${right-2} 475 ${right+thick-2} ${base-depth-2}`);
  $('#film-sheen').setAttribute('opacity',Math.min(.48,film.onCathode));
}

function advanceProducts(dt) {
  state.products=state.products.filter(p=>{
    p.life+=dt;
    if(p.kind==='gas') {
      p.y-=dt*(24+p.life*4);
      p.x+=Math.sin(p.life*3)*dt*4;
      p.node.setAttribute('cx',p.x);
    } else {
      p.y-=dt*10;
      p.node.setAttribute('opacity',Math.max(0,.8-p.life*.16));
    }
    p.node.setAttribute('cy',p.y);
    if(p.y>264 && (p.kind==='gas' || p.life<5)) return true;
    p.node.remove();
    return false;
  });
}

function animate(now){
  const dt=Math.min(.05,(now-state.last)/1000)*state.speed;state.last=now;
  for(const ion of state.ions) moveIon(ion,dt,state.time);
  if(state.running){state.time+=dt;const d=current();
    if(state.time>5 && Math.floor(state.time*5)!==Math.floor((state.time-dt)*5)){spawnProduct('cat',d.cat);spawnProduct('an',d.an)}
    showTransfers(d, state.time);
    if(d.cat.kind==='metal' && !liquidMetalProduct(d.cat) && state.time%7>4.9 && state.time%7<6.1){state.deposit=Math.min(1,state.deposit+dt*.16);const w=36+state.deposit*15;el.coat.setAttribute('x',252-w/2);el.coat.setAttribute('width',w);el.coat.setAttribute('opacity',.12+state.deposit*.86)}
  }
  if(state.mode==='molten' && liquidMetalProduct(current().cat)) {
    const t=state.time%7;
    advanceMetalFilm(dt,state.running && t>4.9 && t<6.1);
  }
  advanceProducts(dt);
  requestAnimationFrame(animate)
}

$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.mode;$$('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));populate()}));
el.select.addEventListener('change',()=>updateExperiment(true));el.power.addEventListener('click',()=>togglePower());$('#reset').addEventListener('click',()=>{togglePower(false);resetAnimation()});el.speed.addEventListener('input',()=>{state.speed=+el.speed.value;el.speedOut.textContent=`${state.speed}×`});
$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>{$$('[data-tab]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-selected',String(x===b))});$('#products-panel').classList.toggle('hidden',b.dataset.tab!=='products');$('#rules-panel').classList.toggle('hidden',b.dataset.tab!=='rules')}));
populate();togglePower(false);requestAnimationFrame(animate);
