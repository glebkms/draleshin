const R=8.314462618,F=96485.33212;
const electrodes={
  zn:{name:"Zn²⁺ / Zn",short:"Zn",ion:"Zn²⁺",charge:2,e0:-0.76,color:"#9aaab1",solution:"#9daeb1",half:"Zn²⁺(aq) + 2e⁻ ⇌ Zn(s)",redReact:"Zn²⁺(aq)",redProd:"Zn(s)"},
  cu:{name:"Cu²⁺ / Cu",short:"Cu",ion:"Cu²⁺",charge:2,e0:0.34,color:"#d78954",solution:"#3ba9d8",half:"Cu²⁺(aq) + 2e⁻ ⇌ Cu(s)",redReact:"Cu²⁺(aq)",redProd:"Cu(s)"},
  ag:{name:"Ag⁺ / Ag",short:"Ag",ion:"Ag⁺",charge:1,e0:0.80,color:"#dce8eb",solution:"#d6e6ee",half:"Ag⁺(aq) + e⁻ ⇌ Ag(s)",redReact:"Ag⁺(aq)",redProd:"Ag(s)"},
  pb:{name:"Pb²⁺ / Pb",short:"Pb",ion:"Pb²⁺",charge:2,e0:-0.13,color:"#7d8a91",solution:"#c3d4da",half:"Pb²⁺(aq) + 2e⁻ ⇌ Pb(s)",redReact:"Pb²⁺(aq)",redProd:"Pb(s)"},
  sn:{name:"Sn²⁺ / Sn",short:"Sn",ion:"Sn²⁺",charge:2,e0:-0.14,color:"#a9b8bd",solution:"#cbdde2",half:"Sn²⁺(aq) + 2e⁻ ⇌ Sn(s)",redReact:"Sn²⁺(aq)",redProd:"Sn(s)"},
  ni:{name:"Ni²⁺ / Ni",short:"Ni",ion:"Ni²⁺",charge:2,e0:-0.25,color:"#9da9a7",solution:"#72bb87",half:"Ni²⁺(aq) + 2e⁻ ⇌ Ni(s)",redReact:"Ni²⁺(aq)",redProd:"Ni(s)"},
  fe:{name:"Fe²⁺ / Fe",short:"Fe",ion:"Fe²⁺",charge:2,e0:-0.44,color:"#89969b",solution:"#8fbf8e",half:"Fe²⁺(aq) + 2e⁻ ⇌ Fe(s)",redReact:"Fe²⁺(aq)",redProd:"Fe(s)"},
  al:{name:"Al³⁺ / Al",short:"Al",ion:"Al³⁺",charge:3,e0:-1.66,color:"#c8d3d6",solution:"#d8e9ed",half:"Al³⁺(aq) + 3e⁻ ⇌ Al(s)",redReact:"Al³⁺(aq)",redProd:"Al(s)"},
  mg:{name:"Mg²⁺ / Mg",short:"Mg",ion:"Mg²⁺",charge:2,e0:-2.37,color:"#c6d2d4",solution:"#d3e5ec",half:"Mg²⁺(aq) + 2e⁻ ⇌ Mg(s)",redReact:"Mg²⁺(aq)",redProd:"Mg(s)"},
  na:{name:"Na⁺ / Na · reference only",short:"Na",ion:"Na⁺",charge:1,e0:-2.71,color:"#d4dde0",solution:"#d8e9ed",half:"Na⁺(aq) + e⁻ ⇌ Na(s)",redReact:"Na⁺(aq)",redProd:"Na(s)",warning:"Reference value only: sodium metal reacts vigorously with water, so this aqueous half-cell cannot be constructed as drawn."},
  ca:{name:"Ca²⁺ / Ca · reference only",short:"Ca",ion:"Ca²⁺",charge:2,e0:-2.87,color:"#cbd8dc",solution:"#d8e9ed",half:"Ca²⁺(aq) + 2e⁻ ⇌ Ca(s)",redReact:"Ca²⁺(aq)",redProd:"Ca(s)",warning:"Reference value only: calcium metal reacts with water, so this aqueous half-cell is not experimentally viable."},
  k:{name:"K⁺ / K · reference only",short:"K",ion:"K⁺",charge:1,e0:-2.93,color:"#d8e0e2",solution:"#d8e9ed",half:"K⁺(aq) + e⁻ ⇌ K(s)",redReact:"K⁺(aq)",redProd:"K(s)",warning:"Reference value only: potassium metal reacts violently with water, so this aqueous half-cell cannot be constructed as drawn."},
  she:{name:"H⁺ / H₂ (Pt)",short:"Pt",ion:"H⁺",charge:2,e0:0,color:"#9aa3a9",solution:"#c7e8ef",half:"2H⁺(aq) + 2e⁻ ⇌ H₂(g)",redReact:"2H⁺(aq)",redProd:"H₂(g)",she:true}
};
const $=id=>document.getElementById(id);
const state={left:"zn",right:"cu",leftConc:1,rightConc:1,leftPressure:1,rightPressure:1,temp:298.15,speed:1,paused:false,load:false,motionVoltage:1.1,motionActive:false};
const ids=["leftSelect","rightSelect"];
ids.forEach(id=>Object.entries(electrodes).forEach(([key,e])=>$(id).add(new Option(`${e.name}   E° ${fmtSign(e.e0,2)} V`,key))));
$("leftSelect").value=state.left;$("rightSelect").value=state.right;

function fmtSign(v,d=3){return `${v>=0?"+":"−"}${Math.abs(v).toFixed(d)}`}
function fmtConc(v){return v>=0.01?v.toFixed(2):v.toExponential(1).replace("e-"," × 10⁻")}
function electrodePotential(e,c,p,T){return e.she?e.e0+(R*T/F)*Math.log(c)-(R*T/(2*F))*Math.log(p):e.e0+(R*T/(e.charge*F))*Math.log(c)}
function gcd(a,b){while(b)[a,b]=[b,a%b];return a}
function lcm(a,b){return a*b/gcd(a,b)}
function sideData(side){const e=electrodes[state[side]],c=state[`${side}Conc`],p=state[`${side}Pressure`];return {e,c,p,E:electrodePotential(e,c,p,state.temp)}}
function coefTerm(coef,term){return `${coef===1?"":coef}${term}`}

function reactionText(anode,cathode){
  const n=lcm(anode.e.charge,cathode.e.charge),oa=n/anode.e.charge,rc=n/cathode.e.charge;
  const oxidation=anode.e.she?`${coefTerm(oa,"H₂(g)")} → ${coefTerm(2*oa,"H⁺(aq)")} + ${coefTerm(n,"e⁻")}`:`${coefTerm(oa,anode.e.redProd)} → ${coefTerm(oa,anode.e.redReact)} + ${coefTerm(n,"e⁻")}`;
  const reduction=cathode.e.she?`${coefTerm(2*rc,"H⁺(aq)")} + ${coefTerm(n,"e⁻")} → ${coefTerm(rc,"H₂(g)")}`:`${coefTerm(rc,cathode.e.redReact)} + ${coefTerm(n,"e⁻")} → ${coefTerm(rc,cathode.e.redProd)}`;
  const left=anode.e.she?coefTerm(oa,"H₂(g)"):coefTerm(oa,anode.e.redProd);
  const left2=cathode.e.she?coefTerm(2*rc,"H⁺(aq)"):coefTerm(rc,cathode.e.redReact);
  const right=anode.e.she?coefTerm(2*oa,"H⁺(aq)"):coefTerm(oa,anode.e.redReact);
  const right2=cathode.e.she?coefTerm(rc,"H₂(g)"):coefTerm(rc,cathode.e.redProd);
  const same=anode.e===cathode.e;
  const net=same
    ? `${anode.e.redProd} (${anode.side} anode) + ${cathode.e.redReact} (${cathode.side} cathode) → ${anode.e.redReact} (${anode.side} anode) + ${cathode.e.redProd} (${cathode.side} cathode)`
    : `${left} + ${left2} → ${right} + ${right2}`;
  return {oxidation,reduction,net,n,same};
}

function setRole(side,role){
  const cath=role==="Cathode",neutral=role==="No net",chip=$(`${side}Chip`),badge=$(`${side}Role`);
  chip.textContent=role;chip.classList.toggle("cathode",cath);badge.classList.toggle("cathode",cath);
  badge.querySelector("text").textContent=neutral?"NO NET":cath?"CATHODE +":"ANODE −";
  badge.querySelector("rect").style.fill=neutral?"#92a9b5":"";
  if(side==="left") badge.querySelector("rect").setAttribute("width",cath?130:116);
}
function updateSide(side,data){
  const e=data.e;
  $(`${side}Title`).textContent=e.name;$(`${side}E0`).textContent=`${fmtSign(e.e0,2)} V`;$(`${side}E`).textContent=`${fmtSign(data.E)} V`;
  $(`${side}Equation`).textContent=e.half;$(`${side}Symbol`).textContent=e.short;$(`${side}SolutionLabel`).textContent=`${e.ion}(aq)`;
  $(`${side}Electrode`).style.fill=e.color;document.querySelector(`.${side}-solution`).style.fill=e.solution;
  $(`${side}SHE`).style.display=e.she?"":"none";
  $(`${side}ConcWrap`).firstChild.textContent=e.she?"H⁺ concentration ":"Ion concentration ";$(`${side}ConcOut`).textContent=fmtConc(data.c);
  $(`${side}PressureWrap`).hidden=!e.she;$(`${side}PressureOut`).textContent=data.p.toFixed(2);
  const warning=$(`${side}Warning`);warning.hidden=!e.warning;warning.textContent=e.warning||"";
}

function updateEquilibrium(side,data,role,biasLog,tie){
  const article=$(`${side}Equilibrium`),oxidised=$(`${side}Oxidised`),reduced=$(`${side}Reduced`);
  const electronTerm=data.e.charge===1?"e⁻":`${data.e.charge}e⁻`;
  oxidised.textContent=`${data.e.redReact} + ${electronTerm}`;
  reduced.textContent=data.e.redProd;
  article.classList.toggle("shift-left",!tie&&role==="anode");
  article.classList.toggle("shift-right",!tie&&role==="cathode");
  article.classList.toggle("balanced",tie);
  const strength=Math.min(1,biasLog/50),favoured=role==="anode"?oxidised:reduced;
  [oxidised,reduced].forEach(term=>{term.classList.remove("favoured");term.style.fontSize="1rem";term.style.fontWeight="550";term.style.transform="scale(1)"});
  article.querySelectorAll(".eq-arrow").forEach(a=>{a.style.setProperty("--arrow-width","1.25rem");a.style.setProperty("--arrow-thickness","2px");a.style.setProperty("--arrow-head-size","3px")});
  if(tie){
    [oxidised,reduced].forEach(term=>{term.style.fontWeight="700"});
    article.querySelectorAll(".eq-arrow").forEach(a=>{a.style.setProperty("--arrow-width","1.8rem");a.style.setProperty("--arrow-thickness","3px");a.style.setProperty("--arrow-head-size","4.5px")});
  }else{
    favoured.classList.add("favoured");favoured.style.fontWeight="950";favoured.style.fontSize=`${(1+strength*.38).toFixed(2)}rem`;favoured.style.transform=`scale(${(1+strength*.07).toFixed(3)})`;
    const active=article.querySelector(role==="anode"?".reverse":".forward");
    active.style.setProperty("--arrow-width",`${(1.5+strength*3.4).toFixed(2)}rem`);active.style.setProperty("--arrow-thickness",`${(3+strength*5).toFixed(1)}px`);active.style.setProperty("--arrow-head-size",`${(5+strength*6).toFixed(1)}px`);
  }
  $(`${side}ShiftLabel`).textContent=tie?"No preferred direction":role==="anode"?"Shift towards oxidised form · anode":"Shift towards reduced form · cathode";
}

function update(){
  const L=sideData("left"),Rr=sideData("right");updateSide("left",L);updateSide("right",Rr);
  const delta=Rr.E-L.E,tie=Math.abs(delta)<0.0005,rightCath=delta>=0;
  const cath=rightCath?{...Rr,side:"right"}:{...L,side:"left"},an=rightCath?{...L,side:"left"}:{...Rr,side:"right"};
  const volts=Math.abs(delta),rxn=reactionText(an,cath);
  const biasLog=rxn.n*F*volts/(2.303*R*state.temp);
  setRole("left",tie?"No net":rightCath?"Anode":"Cathode");setRole("right",tie?"No net":rightCath?"Cathode":"Anode");
  $("voltage").textContent=volts.toFixed(3);$("svgVoltage").textContent=`${fmtSign(delta)} V`;
  $("leftTerminal").textContent=tie?"LEFT 0":rightCath?"LEFT −":"LEFT +";$("rightTerminal").textContent=tie?"RIGHT 0":rightCath?"RIGHT +":"RIGHT −";
  $("cellCondition").textContent=tie?"No significant driving potential under these conditions":"Spontaneous direction shown · cathode is positive";
  $("directionPill").textContent=tie?"No net electron flow":`Electrons: ${an.side} → ${cath.side}`;
  $("liveSummary").textContent=tie?"The adjusted half-cell potentials are effectively equal.":`${an.e.short} is oxidised; ${cath.e.name} is reduced.`;
  $("oxidationEq").textContent=rxn.oxidation;$("reductionEq").textContent=rxn.reduction;$("netEq").textContent=tie?"No net reaction predicted":rxn.net;
  $("reactionTitle").textContent=rxn.same?`${an.e.short} concentration cell`:`${an.e.short}–${cath.e.short} spontaneous cell`;
  updateEquilibrium("left",L,rightCath?"anode":"cathode",biasLog,tie);
  updateEquilibrium("right",Rr,rightCath?"cathode":"anode",biasLog,tie);
  $("equilibriumScale").textContent=tie?"K/Q = 1 under the selected conditions · no thermodynamic shift":`Current-condition equilibrium shift: log₁₀(K/Q) = ${biasLog.toFixed(1)} · visual weight scales up to 50 decades`;
  state.motionVoltage=volts;state.motionActive=state.load&&!tie;
  $("speedOut").textContent=`${(state.speed*volts).toFixed(1)}×`;
  updateWorking(L,Rr,delta,rxn.n);updateLamp(volts,tie);renderParticles(rightCath,tie,!state.load);
}

function updateWorking(L,Rr,delta,n){
  const metalLine=(label,d)=>d.e.she?`${label}: E = 0 + (RT/F) ln[H⁺] − (RT/2F) ln(pH₂) = ${fmtSign(d.E)} V`:`${label}: E = E° + (RT/${d.e.charge}F) ln[${d.e.ion}] = ${fmtSign(d.E)} V`;
  $("working").innerHTML=`<p>${metalLine("Left",L)}</p><p>${metalLine("Right",Rr)}</p><p>E<sub>cell</sub> = E<sub>cathode</sub> − E<sub>anode</sub> = ${Math.abs(delta).toFixed(3)} V</p><p>T = ${state.temp.toFixed(2)} K · R = 8.314 J mol⁻¹ K⁻¹ · F = 96485 C mol⁻¹</p><p>The balanced overall reaction transfers ${n} mol e⁻ per reaction as written.</p>`;
}
function updateLamp(volts,tie){
  const connected=state.load,plausible=connected&&!tie&&volts>=1.5;
  $("lampGraphic").classList.toggle("on",plausible);$("lampCard").classList.toggle("active",plausible);
  $("circuitSwitch").classList.toggle("closed",connected);
  $("switchBlade").setAttribute("d",connected?"M724 82 L788 82":"M724 82 L779 54");
  $("loadSwitch").setAttribute("aria-pressed",String(connected));
  $("loadSwitch").querySelector(".load-button-main").textContent=connected?"TURN OFF":"TURN ON";
  $("loadSwitch").querySelector(".load-button-sub").textContent=connected?"Stop electron & ion flow":"Start electron & ion flow";
  if(!connected){$("lampState").textContent="Lamp disconnected";$("lampNote").textContent="The voltmeter is reading open-circuit EMF; no lamp current is implied.";$("lampLabel").textContent="LOAD OPEN";}
  else if(plausible){$("lampState").textContent="Glow is plausible (illustrative)";$("lampNote").textContent="Voltage clears this model’s 1.5 V indicator threshold, but actual brightness and current cannot be predicted here.";$("lampLabel").textContent="LOAD CLOSED";}
  else{$("lampState").textContent="Below indicator threshold";$("lampNote").textContent="The load is closed, but the model does not predict a glow below 1.5 V. Real current also depends on resistance and kinetics.";$("lampLabel").textContent="LOAD CLOSED";}
  $("lampGraphic").setAttribute("aria-label",$("lampState").textContent);
}

function renderParticles(rightCath,tie,openCircuit){
  const g=$("particles");g.replaceChildren();if(tie||openCircuit)return;
  const ns="http://www.w3.org/2000/svg",reverse=!rightCath;
  const electronPath=reverse?[[940,130],[940,82],[260,82],[260,170]]:[[260,170],[260,82],[940,82],[940,130]];
  // These points follow the salt bridge centreline, including its cubic bends.
  // Keeping each ion centred on this path prevents the particle circles from
  // cutting across the glass wall or appearing outside the bridge.
  const bridgeLeft=[[600,230],[518,230],[473.3,235.3],[438.6,250.6],[415.8,276],[405,312],[405,350]];
  const bridgeRight=[[600,230],[682,230],[726.7,235.3],[761.4,250.6],[784.2,276],[795,312],[795,350]];
  const cathodePath=rightCath?bridgeRight:bridgeLeft,anodePath=rightCath?bridgeLeft:bridgeRight;
  const leftOut=[[286,350],[310,365],[330,395],[345,430]],rightOut=[[914,350],[890,365],[870,395],[855,430]];
  const anodeSide=rightCath?"left":"right",cathodeSide=rightCath?"right":"left";
  const anodeElectrode=electrodes[state[anodeSide]],cathodeElectrode=electrodes[state[cathodeSide]];
  const oxidationPath=anodeSide==="left"?leftOut:rightOut;
  const reductionPath=(cathodeSide==="left"?leftOut:rightOut).slice().reverse();
  const cathodeSurface=cathodeSide==="left"?[286,350]:[914,350];
  for(let i=0;i<8;i++) makeParticle(g,ns,"e⁻","particle-electron",electronPath,i/8,10);
  for(let i=0;i<4;i++){makeParticle(g,ns,"K⁺","particle-cation",cathodePath,i/4,14,{fade:"ends"});makeParticle(g,ns,"NO₃⁻","particle-anion",anodePath,i/4,17,{fade:"ends"})}
  for(let i=0;i<3;i++){
    makeParticle(g,ns,anodeElectrode.ion,"particle-metal-ion",oxidationPath,i/3,13,{fade:"ends",fill:anodeElectrode.solution,reaction:"oxidation"});
    makeParticle(g,ns,cathodeElectrode.ion,"particle-metal-ion",reductionPath,i/3,13,{fade:"ends",fill:cathodeElectrode.solution,reaction:"reduction"});
    makeDeposit(g,ns,cathodeSurface,cathodeElectrode.color,i/3);
  }
}
function makeParticle(g,ns,label,cls,path,offset,r,options={}){
  const group=document.createElementNS(ns,"g"),c=document.createElementNS(ns,"circle"),t=document.createElementNS(ns,"text");c.setAttribute("r",r);c.setAttribute("class",cls);if(options.fill)c.style.fill=options.fill;t.setAttribute("class","particle-text");t.textContent=label;group.append(c,t);group.dataset.path=JSON.stringify(path);group.dataset.offset=offset;if(options.fade)group.dataset.fade=options.fade;if(options.reaction)group.dataset.reaction=options.reaction;g.append(group);
}
function makeDeposit(g,ns,[x,y],color,offset){
  const group=document.createElementNS(ns,"g"),c=document.createElementNS(ns,"circle");c.setAttribute("r",8);c.setAttribute("class","deposit-flash");c.style.fill=color;group.append(c);group.dataset.deposit="true";group.dataset.x=x;group.dataset.y=y;group.dataset.offset=offset;g.append(group);
}
let start=performance.now();
function edgeOpacity(phase){const fadeIn=Math.min(1,phase/.16),fadeOut=Math.min(1,(1-phase)/.2);return Math.max(0,Math.min(fadeIn,fadeOut))}
function animate(now){
  if(!state.paused&&state.motionActive){const t=(now-start)/1000*state.speed*state.motionVoltage;document.querySelectorAll("#particles>g").forEach(el=>{const phase=(t/3+Number(el.dataset.offset))%1;if(el.dataset.deposit){const p=Math.max(0,(phase-.76)/.24),opacity=p>0?Math.sin(Math.PI*p):0,scale=.55+.75*p;el.style.opacity=opacity.toFixed(3);el.setAttribute("transform",`translate(${el.dataset.x} ${el.dataset.y}) scale(${scale.toFixed(3)})`);return}const path=JSON.parse(el.dataset.path);let lengths=[],total=0;for(let i=1;i<path.length;i++){const d=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);lengths.push(d);total+=d}let target=phase*total,idx=0;while(target>lengths[idx]&&idx<lengths.length-1){target-=lengths[idx];idx++}const q=target/lengths[idx],x=path[idx][0]+(path[idx+1][0]-path[idx][0])*q,y=path[idx][1]+(path[idx+1][1]-path[idx][1])*q;el.setAttribute("transform",`translate(${x} ${y})`);el.style.opacity=el.dataset.fade?edgeOpacity(phase).toFixed(3):"1"})}
  if(!state.paused){const bubbleTime=(now-start)/2300;document.querySelectorAll(".she-visual .bubble").forEach((bubble,i)=>{const phase=(bubbleTime+i*.17)%1,drift=Math.sin((phase+i*.13)*Math.PI*2)*4,rise=phase*82;bubble.setAttribute("transform",`translate(${drift.toFixed(1)} ${(-rise).toFixed(1)})`);bubble.style.opacity=String(Math.sin(Math.PI*phase).toFixed(2))})}
  requestAnimationFrame(animate)
}requestAnimationFrame(animate);

function bindRange(id,key,out,transform=x=>x){$(id).addEventListener("input",e=>{state[key]=transform(Number(e.target.value));if(out&&key!=="speed")$(out).textContent=state[key].toFixed(key==="temp"?2:1);update()})}
$("leftSelect").addEventListener("change",e=>{state.left=e.target.value;update()});$("rightSelect").addEventListener("change",e=>{state.right=e.target.value;update()});
bindRange("temperature","temp","tempOut");bindRange("speed","speed","speedOut");
["left","right"].forEach(side=>{bindRange(`${side}Conc`,`${side}Conc`,null,x=>10**x);bindRange(`${side}Pressure`,`${side}Pressure`,null,x=>10**x)});
$("loadSwitch").addEventListener("click",()=>{state.load=!state.load;update()});
$("pauseBtn").addEventListener("click",()=>{state.paused=!state.paused;document.body.classList.toggle("motion-paused",state.paused);$("pauseBtn").textContent=state.paused?"Resume motion":"Pause motion";$("pauseBtn").setAttribute("aria-pressed",state.paused)});
$("toggleWorking").addEventListener("click",()=>{const show=$("working").hidden;$("working").hidden=!show;$("toggleWorking").textContent=show?"Hide Nernst working":"Show Nernst working";$("toggleWorking").setAttribute("aria-expanded",show)});
$("explainBtn").addEventListener("click",()=>$("explainDialog").showModal());$("closeDialog").addEventListener("click",()=>$("explainDialog").close());
$("resetBtn").addEventListener("click",()=>{Object.assign(state,{left:"zn",right:"cu",leftConc:1,rightConc:1,leftPressure:1,rightPressure:1,temp:298.15,speed:1,paused:false,load:false,motionVoltage:1.1,motionActive:false});document.body.classList.remove("motion-paused");$("leftSelect").value="zn";$("rightSelect").value="cu";["leftConc","rightConc","leftPressure","rightPressure"].forEach(id=>$(id).value=0);$("temperature").value=298.15;$("speed").value=1;$("tempOut").textContent="298.15";$("pauseBtn").textContent="Pause motion";$("pauseBtn").setAttribute("aria-pressed","false");update()});
update();
