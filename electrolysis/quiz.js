// Parse each term, keeping ionic charge signs distinct from addition signs.
function parseHalfEquation(answer) {
  const clean = answer.normalize('NFKC').replace(/[−–]/g, '-').replace(/[\[\]]/g,'')
    .replace(/\((?:aq|s|l|g)\)/g, '').replace(/[\s^]/g, '');
  const sides = clean.split(/->|→/);
  if (sides.length !== 2) return null;
  const terms = new Map();
  for (const [index, side] of sides.entries()) {
    const pieces = side.match(/(?:\d+)?(?:e-|[A-Z][A-Za-z0-9]*(?:[+-](?=\+|$))?)(?:\+|$)/g);
    if (!pieces || pieces.join('') !== side) return null;
    for (const [i, piece] of pieces.entries()) {
      const term = i === pieces.length - 1 ? piece : piece.slice(0, -1);
      const [, coefficient, species] = term.match(/^(\d*)(.+)$/);
      const count = Number(coefficient || 1);
      if (!Number.isSafeInteger(count) || count <= 0) return null;
      const key = index + '/' + species;
      terms.set(key, (terms.get(key) || 0) + count);
    }
  }
  return terms;
}

function equivalent(answer, model) {
  const actual = parseHalfEquation(answer);
  const expected = parseHalfEquation(model);
  if (!actual || !expected || actual.size !== expected.size) return false;
  const [first, unit] = expected.entries().next().value;
  const multiple = actual.get(first);
  return multiple > 0 && [...expected].every(([species, n]) =>
    actual.get(species) * unit === n * multiple);
}

const earned=new Map(), assisted=new Set(), mistakes=new Map(), awards=new Map(), revealed=new Set();
const progressKey='electrolysis-quiz-progress-v2';
const retained=key=>!key.startsWith('pt-complex/') && !key.startsWith('au-complex/');
try {
  const previous=JSON.parse(sessionStorage.getItem(progressKey) || 'null');
  const answers=previous?.answers ?? JSON.parse(sessionStorage.getItem('electrolysis-answers')||'[]');
  for(const [key,answer] of answers) if(retained(key)) earned.set(key,answer);
  for(const key of previous?.assisted ?? JSON.parse(sessionStorage.getItem('electrolysis-assisted')||'[]')) if(retained(key)) assisted.add(key);
  for(const [key,count] of previous?.mistakes || []) mistakes.set(key,count);
  for(const [key,points] of previous?.awards || []) awards.set(key,points);
  for(const key of previous?.revealed || []) revealed.add(key);
  // Previously completed questions keep the one point originally awarded.
  for(const key of earned.keys()) if(!awards.has(key)) awards.set(key,1);
} catch { /* Practice still works when storage is unavailable. */ }

function persistProgress() {
  try {
    sessionStorage.setItem(progressKey,JSON.stringify({answers:[...earned],assisted:[...assisted],
      mistakes:[...mistakes],awards:[...awards],revealed:[...revealed]}));
  } catch {}
}
const pointsLabel=n=>n+(n===1?' point':' points');
function updateCheckButton(form) {
  const key=form.dataset.question, count=mistakes.get(key)||0;
  const submit=form.querySelector('[type=submit]');
  submit.disabled=earned.has(key)||revealed.has(key);
  submit.textContent=submit.disabled?'Completed':assisted.has(key)?'Check practice answer':
    count>=3?'Show worked solution (attempt 4)':`Check attempt ${count+1} · ${pointsLabel(3-count)}`;
}

function workedSteps(data,side) {
  const p=data[side];
  const electronCount=Number(p.eq.match(/(\d*)e⁻/)[1] || 1);
  let atoms, charge;
  if (p.kind==='metal') {
    const ion=p.eq.split(' + ')[0];
    atoms=`Write ${ion} → ${p.formula}. One ion gives one metal atom, so the atoms already balance.`;
    charge=`The ion has charge +${electronCount} and the atom has charge 0. Add ${electronCount===1?'one electron':electronCount+' electrons'} on the left to bring the total charge to 0.`;
  } else if (p.eq.startsWith('2H₂O')) {
    atoms='Start with H₂O → H₂ + OH⁻. Put 2 before H₂O and OH⁻. Each side now has four H atoms and two O atoms.';
    charge='Two OH⁻ ions give the right side charge −2. Add two electrons on the left so that side also totals −2.';
  } else if (p.eq.startsWith('4OH⁻')) {
    atoms='Write OH⁻ → O₂ + H₂O. Use 4OH⁻ on the left and 2H₂O on the right. With one O₂, both sides have four O and four H atoms.';
    charge='Four OH⁻ ions have total charge −4. Put four electrons on the right with the neutral products to balance the charge.';
  } else {
    const ion=p.eq.split(/ → | \+ /)[0].replace(/^2/,'');
    atoms=`One ${p.formula} molecule contains two ${p.formula.replace('₂','')} atoms. Put 2 before ${ion} on the left to supply both atoms.`;
    charge=side==='cat'
      ? 'Two H⁺ ions have total charge +2. Put two electrons on the left. Their charges cancel, matching neutral H₂.'
      : `The two ions have a combined charge of −${electronCount}. Put ${electronCount} electrons on the right with neutral ${p.formula}. Both sides now total −${electronCount}.`;
  }
  return [p.rule,atoms,charge,p.eq];
}

const boards = new WeakMap();
const laneNames = ['Reactants','Products'];

function modelAnswers(data,side) {
  const product=data[side], models=[product.eq];
  if(product.formula==='H₂') models.push('2H⁺ + 2e⁻ → H₂','2H₂O + 2e⁻ → H₂ + 2OH⁻');
  if(product.formula==='O₂' && state.mode==='aqueous') models.push('2H₂O → O₂ + 4H⁺ + 4e⁻');
  return [...new Set(models)];
}

function readBlocks(model) {
  return model.split(' → ').map(half=>new Map(half.split(' + ').map(term=>{
    const [,n,species]=term.match(/^(\d*)(.+)$/);
    return [species,Number(n||1)];
  })));
}

function equationFrom(lanes) {
  return lanes.map(lane=>[...lane].map(([symbol,count])=>(count===1?'':count)+symbol).join(' + ')).join(' → ');
}

function tally(lane) {
  const atoms=new Map();
  let charge=0;
  for(const [symbol,count] of lane) {
    const ion=symbol.match(/([²³]?)([⁺⁻])$/);
    if(ion) charge+=count*(ion[2]==='⁺'?1:-1)*Number(ion[1].normalize('NFKC')||1);
    const formula=symbol.replace(/[²³]?[⁺⁻]$/,'').normalize('NFKC');
    for(const [,atom,digits] of formula.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
      atoms.set(atom,(atoms.get(atom)||0)+count*Number(digits||1));
    }
  }
  return {atoms,charge};
}

function answerHint(lanes,models,side) {
  const empty=lanes.findIndex(lane=>lane.size===0);
  if(empty!==-1) return 'Add a block to '+laneNames[empty]+' first.';
  const electronSide=side==='cat'?0:1;
  if(lanes[1-electronSide].has('e⁻')) return side==='cat'?'Reduction uses electrons. Move e⁻ to Reactants.':'Oxidation releases electrons. Move e⁻ to Products.';
  const alternatives=models.map(readBlocks);
  const distance=reference=>lanes.reduce((sum,lane,i)=>sum+
    [...lane.keys()].filter(s=>!reference[i].has(s)).length+
    [...reference[i].keys()].filter(s=>!lane.has(s)).length,0);
  const target=alternatives.sort((a,b)=>distance(a)-distance(b))[0];
  for(const [i,lane] of lanes.entries()) for(const symbol of lane.keys()) {
    if(!target[i].has(symbol)) return target[1-i].has(symbol)
      ? 'Move '+symbol+' to '+laneNames[1-i]+'.'
      : 'Check the '+symbol+' block. Which species actually takes part at this electrode?';
  }
  for(const [i,reference] of target.entries()) for(const symbol of reference.keys()) {
    if(!lanes[i].has(symbol)) return 'A block is missing from '+laneNames[i]+'. '+(symbol==='e⁻'
      ? (side==='cat'?'Reduction uses electrons from the cathode.':'The reacting ions release electrons here.')
      : 'Include '+symbol+' on this side.');
  }
  const [left,right]=lanes.map(tally);
  for(const atom of new Set([...left.atoms.keys(),...right.atoms.keys()])) {
    const a=left.atoms.get(atom)||0,b=right.atoms.get(atom)||0;
    if(a!==b) return 'Count '+atom+' atoms: '+a+' on the left and '+b+' on the right. Adjust the coefficients to match.';
  }
  if(left.charge!==right.charge) return 'The atoms balance. Total charge is '+left.charge+' on the left and '+right.charge+' on the right. Adjust the number of e⁻ blocks.';
  return 'Check the ratios of the blocks against the reaction at this electrode.';
}

function button(label,onClick) {
  const node=document.createElement('button');
  node.type='button';node.textContent=label;node.addEventListener('click',onClick);
  return node;
}

function celebrateAnswer(form) {
  form.classList.add('celebrating');
  form.querySelector('.quiz-fireworks')?.remove();
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const burst=document.createElement('span');
  burst.className='quiz-fireworks';
  burst.setAttribute('aria-hidden','true');
  const colours=['#ffe47a','#6cebc0','#8ce6ff','#f9a0bd','#c7a7ff'];
  for(let i=0;i<34;i++) {
    const spark=document.createElement('i');
    const angle=2*Math.PI*(i%17)/17, radius=36+(i*19)%58;
    spark.style.left=i<17?'24%':'76%';
    spark.style.setProperty('--dx',Math.cos(angle)*radius+'px');
    spark.style.setProperty('--dy',Math.sin(angle)*radius-18+'px');
    spark.style.setProperty('--delay',i<17?'0s':'.2s');
    spark.style.backgroundColor=colours[i%colours.length];
    burst.append(spark);
  }
  form.append(burst);
  setTimeout(()=>burst.remove(),1550);
}

function changeBlock(board,side,symbol,delta) {
  if(board.locked) return;
  const lane=board.lanes[side],next=(lane.get(symbol)||0)+delta;
  if(next>0) lane.set(symbol,next); else lane.delete(symbol);
  board.feedback.textContent='';
  board.form.classList.remove('celebrating');
  paintBoard(board);
}

function draggable(node,board,symbol,source) {
  node.draggable=!board.locked;
  node.addEventListener('dragstart',event=>{
    event.dataTransfer.setData('application/x-electrolysis-block',JSON.stringify({key:board.key,symbol,source}));
  });
}

function paintBoard(board) {
  for(const [i,zone] of board.zones.entries()) {
    const target=zone.querySelector('.lane-select');
    target.setAttribute('aria-pressed',String(board.active===i));
    zone.classList.toggle('selected',board.active===i);
    const blocks=zone.querySelector('.placed');
    blocks.replaceChildren();
    for(const [symbol,count] of board.lanes[i]) {
      if(blocks.children.length) blocks.append(document.createTextNode(' + '));
      const tile=button((count===1?'':count)+symbol,()=>changeBlock(board,i,symbol,-1));
      tile.setAttribute('aria-label','Remove one '+symbol+' from '+laneNames[i]);
      tile.title='Tap to remove one, or drag to the other side';
      tile.disabled=board.locked;
      draggable(tile,board,symbol,i);
      blocks.append(tile);
    }
    if(!blocks.children.length) blocks.textContent='Place blocks here';
  }
}

function buildBoard(form,data,key) {
  const root=form.querySelector('.builder');
  root.replaceChildren();
  const side=form.dataset.side, saved=earned.get(key);
  const model=revealed.has(key)?data[side].eq:saved && modelAnswers(data,side).find(m=>equivalent(saved.replace(/=>|=/g,'→'),m));
  const board={form,key,active:0,zones:[],lanes:model?readBlocks(model):[new Map(),new Map()],
    locked:earned.has(key)||revealed.has(key),feedback:form.querySelector('[role=status]')};
  boards.set(form,board);
  const layout=document.createElement('div');layout.className='lane-layout';root.append(layout);
  const bank=document.createElement('div');bank.className='block-bank';root.append(bank);
  const symbols=new Set([...data.ions,...data.ions.flatMap(s=>s.match(/[A-Z][a-z]?/g)),data.cat.formula,data.an.formula,'e⁻']);
  if(state.mode==='aqueous') symbols.add('H₂O');
  for(const [i,name] of laneNames.entries()) {
    if(i) {const arrow=document.createElement('b');arrow.className='lane-arrow';arrow.textContent='→';layout.append(arrow);}
    const zone=document.createElement('div');zone.className='drop-lane';
    const select=button(name,()=>{board.active=i;paintBoard(board);});select.className='lane-select';
    const placed=document.createElement('div');placed.className='placed';
    zone.append(select,placed);layout.append(zone);board.zones.push(zone);
    zone.addEventListener('click',e=>{if(!e.target.closest('button'))select.click();});
    zone.addEventListener('dragover',e=>{if(!board.locked)e.preventDefault();});
    zone.addEventListener('drop',e=>{
      e.preventDefault();if(board.locked)return;
      let payload;
      try{payload=JSON.parse(e.dataTransfer.getData('application/x-electrolysis-block'));}catch{return;}
      if(payload.key!==key||!symbols.has(payload.symbol)||payload.source===i)return;
      const from=payload.source, symbol=payload.symbol;
      if(from!==null && from!==0 && from!==1)return;
      const count=from===null?1:board.lanes[from].get(symbol);
      if(!count)return;
      if(from!==null)board.lanes[from].delete(symbol);
      board.active=i;changeBlock(board,i,symbol,count);
    });
  }
  for(const symbol of symbols) {
    const tile=button(symbol,()=>changeBlock(board,board.active,symbol,1));
    tile.disabled=board.locked;draggable(tile,board,symbol,null);bank.append(tile);
  }
  paintBoard(board);
}

function setupQuestion(form) {
  const details=document.createElement('details');
  details.className='worked-help';
  const summary=document.createElement('summary');
  summary.textContent="I don't know the half-equation";
  const steps=document.createElement('ol');
  details.append(summary,steps);
  form.append(details);
  details.addEventListener('toggle',()=>{
    if(!details.open || earned.has(form.dataset.question) || revealed.has(form.dataset.question)) return;
    assisted.add(form.dataset.question);
    persistProgress();updateCheckButton(form);
    form.querySelector('[role=status]').textContent='Worked example opened. You can still practise this answer.';
  });
}

function refreshQuiz(preserveDrafts=false) {
  const total=[...awards.values()].reduce((sum,n)=>sum+n,0);
  document.querySelector('#points').textContent=total+(total===1?' point':' points');
  for(const form of document.querySelectorAll('[data-side]')) {
    const data=current(), side=form.dataset.side, key=data.id+'/'+side;
    const details=form.querySelector('details');
    if(form.dataset.question!==key || !preserveDrafts || ((earned.has(key)||revealed.has(key)) && !boards.get(form)?.locked)) {
      details.open=revealed.has(key);form.classList.remove('celebrating');form.dataset.question=key;
      buildBoard(form,data,key);
      details.querySelector('ol').replaceChildren(...workedSteps(data,side).map(text=>{
        const li=document.createElement('li');li.textContent=text;return li;
      }));
      form.querySelector('[role=status]').textContent=revealed.has(key)?'Worked solution · no points awarded':earned.has(key)?'✓ Balanced · '+pointsLabel(awards.get(key))+' earned':assisted.has(key)?'Worked example · practice question':'';
      updateCheckButton(form);
    }
  }
}

for(const form of document.querySelectorAll('[data-side]')) {
  setupQuestion(form);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const board=boards.get(form), side=form.dataset.side;
    if(board.locked)return;
    const models=modelAnswers(current(),side),answer=equationFrom(board.lanes);
    const practice=assisted.has(board.key)||form.querySelector('details').open;
    const count=mistakes.get(board.key)||0;
    if(!practice && count>=3) {
      revealed.add(board.key);persistProgress();refreshQuiz(true);return;
    }
    if(!models.some(model=>equivalent(answer,model))) {
      if(!practice){mistakes.set(board.key,count+1);persistProgress();updateCheckButton(form);}
      board.feedback.textContent=answerHint(board.lanes,models,side);return;
    }
    if(!practice) {
      earned.set(board.key,answer);
      awards.set(board.key,3-count);persistProgress();
      refreshQuiz(true);
    }
    board.feedback.textContent=practice?'★ Correct! Practice complete.':'★ Correct! +'+pointsLabel(3-count);
    celebrateAnswer(form);
  });
}

document.querySelector('#reset-points').addEventListener('click',()=>{
  document.querySelectorAll('.quiz-fireworks').forEach(burst=>burst.remove());
  earned.clear();assisted.clear();mistakes.clear();awards.clear();revealed.clear();
  persistProgress();
  refreshQuiz();
});
