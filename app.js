const {useState,useEffect,useMemo}=React;const ce=(t,p,...c)=>{if(p&&typeof p.style==='string'){p={...p,style:Object.fromEntries(p.style.split(';').filter(x=>x.trim()).map(s=>{const i=s.indexOf(':');return[s.slice(0,i).trim().replace(/-([a-z])/g,(_,x)=>x.toUpperCase()),s.slice(i+1).trim()]}))}}return React.createElement(t,p,...c)};
const h=htm.bind(ce);
/* ---- Mock data layer (replace with REST calls to Spring Boot later) ---- */
const KEY='fts-v4';let HOD='',DBU=[];
const dt=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const today=()=>dt(0);
const mkU=(username,pw,role,name,title,dept,hod)=>({username,pw,role,name,title,dept,hod,demo:1});
const SEEDU=[mkU('admin','admin123','admin','Admin Supervisor','Admin / Supervisor'),
mkU('hod.it','hodit123','admin','Dr. Lakshmi Devi','Head of Department','IT',true),
mkU('hod.maintenance','hodmaint123','admin','Dr. Ramesh Babu','Head of Department','Maintenance',true),
mkU('hod.facilities','hodfac123','admin','Dr. Sunitha Rao','Head of Department','Facilities',true),
mkU('hod.electrical','hodelec123','admin','Dr. Venkat Reddy','Head of Department','Electrical',true),
mkU('hod.academic','hodacad123','admin','Dr. Kavitha Nair','Head of Department','Academic Support',true),
mkU('ravi','staff123','staff','Ravi Kumar','Technician','IT'),mkU('arjun','tech123','staff','Arjun Kumar','Technician','IT'),
mkU('priya','tech123','staff','Priya Sharma','Technician','Maintenance'),mkU('meena','tech123','staff','Meena Rao','Technician','Electrical')];
const DEPTS=['IT','Maintenance','Facilities','Electrical','Academic Support','Other'];
let STAFF=[];
const PRI=['Low','Medium','High','Urgent'];
const CODES={admin:'ADMIN-2026',hod:'HOD-2026'}; // prototype registration codes
const mk=(n,title,desc,dept,pri,due,status,by,to,loc,hist)=>({id:'FT-'+n,title,desc,dept,pri,created:dt(-6),due,status,by,to,loc,notes:'',hist:[{t:dt(-6),x:'Ticket created by '+by},...hist]});
const seed=()=>({users:SEEDU,tickets:[
mk(1001,'Projector not working in Room 204','Projector shows no signal during lectures.','IT','High',dt(2),'IN_PROGRESS','Dr. Ananya','Ravi Kumar','Room 204',[{t:dt(-5),x:'Assigned to IT Department'},{t:dt(-5),x:'Assigned to Ravi Kumar'},{t:dt(-2),x:'Status changed to In Progress'}]),
mk(1002,'AC not working in Seminar Hall','AC not cooling before tomorrow\'s seminar.','Maintenance','Medium',dt(5),'OPEN','Dr. Ananya','','Seminar Hall',[]),
mk(1003,'Computer system not starting in Lab 3','System 12 does not power on.','IT','Urgent',dt(-3),'OPEN','Dr. Ananya','Ravi Kumar','Lab 3',[{t:dt(-5),x:'Assigned to IT Department'},{t:dt(-5),x:'Assigned to Ravi Kumar'},{t:dt(-4),x:'Deadline updated'}]),
mk(1004,'Broken classroom light','Tube light flickering in Room 110.','Electrical','Low',dt(-1),'COMPLETED','Prof. Suresh','Meena Rao','Room 110',[{t:dt(-5),x:'Assigned to Meena Rao'},{t:dt(-3),x:'Status changed to In Progress'},{t:dt(-2),x:'Status changed to Completed'}]),
mk(1005,'Wi-Fi connectivity issue in Block B','Wi-Fi drops frequently on 2nd floor.','IT','High',dt(3),'OPEN','Dr. Ananya','Arjun Kumar','Block B',[{t:dt(-4),x:'Assigned to IT Department'},{t:dt(-4),x:'Assigned to Arjun Kumar'}])],
notifs:[{r:'staff',d:'IT',u:'Ravi Kumar',m:'Ticket FT-1001 has been assigned to you.'},{r:'staff',d:'IT',u:'Ravi Kumar',m:'Ticket FT-1003 is overdue.'},{r:'faculty',m:'Ticket FT-1002 is due in 5 days.'},{r:'faculty',m:'Ticket FT-1003 is overdue.'},{r:'admin',m:'Ticket FT-1003 is overdue.'},{r:'admin',m:'Ticket FT-1004 has been completed.'}]});
const load=()=>{try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.tickets)return s}catch(e){}return seed()};
const save=d=>{try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}};
const eff=t=>t.status!=='COMPLETED'&&t.due&&t.due<today()?'OVERDUE':t.status;
const mineS=(u,t)=>t.to===u.name||(!t.to&&t.dept===u.dept);const SL={OPEN:'○ Open',IN_PROGRESS:'◐ In Progress',COMPLETED:'✓ Completed',OVERDUE:'⚠ Overdue'};
/* ---- UI atoms ---- */
const Ic=({d,s=22})=>h`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${d}/></svg>`;
const P={home:'M3 12l9-9 9 9M5 10v10h14V10',list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',plus:'M12 5v14M5 12h14',bell:'M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4',user:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8',out:'M9 21H5V3h4M16 17l5-5-5-5M21 12H9',grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',logo:'M3 9a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 000 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a2 2 0 000-4z'};
const SB=({s})=>h`<span class=${'badge '+s}>${SL[s]}</span>`;
const PB=({p})=>h`<span class=${'badge pri '+p}>${p.toUpperCase()}</span>`;
const Fld=({l,c,children})=>h`<div class="fld"><label>${l}</label>${children}</div>`;
const Modal=({title,onClose,children})=>h`<div class="ov" onClick=${onClose}><div class="modal" role="dialog" aria-modal="true" aria-label=${title} onClick=${e=>e.stopPropagation()}><h2>${title}</h2>${children}</div></div>`;
const NAV={faculty:[['dash','Dashboard','home'],['mine','My Tickets','list'],['new','Create Ticket','plus'],['notif','Notifications','bell'],['prof','Profile','user']],
staff:[['dash','Dashboard','home'],['mine','Assigned Tickets','list'],['notif','Notifications','bell'],['prof','Profile','user']],
admin:[['dash','Dashboard','home'],['all','All Tickets','list'],['depts','Departments','grid'],['notif','Notifications','bell'],['prof','Profile','user']]};
/* ---- Login ---- */
function Login({users,onLogin,onReg}){const[mode,setMode]=useState('staff');const[e,setE]=useState('');const[p,setP]=useState('');const[err,setErr]=useState('');const[ld,setLd]=useState(false);const[fn,setFn]=useState('Dr. Ananya');const[r,setR]=useState({name:'',username:'',pw:'',dept:'IT',role:'technician',code:''});
const go=ev=>{ev.preventDefault();setLd(true);setTimeout(()=>{const u=users.find(x=>x.username===e.trim().toLowerCase()&&x.pw===p);if(u)onLogin(u);else{setErr('Invalid email or password.');setLd(false)}},400)};
const reg=ev=>{ev.preventDefault();const em=r.username.trim().toLowerCase().replace(/\s+/g,'');if(em.length<3)return setErr('Username must be at least 3 characters.');if(users.some(x=>x.username===em))return setErr('This username is already taken.');if(r.pw.length<6)return setErr('Password must be at least 6 characters.');if(r.role!=='technician'&&r.code.trim()!==CODES[r.role])return setErr('Invalid registration code.');if(r.role==='hod'&&users.some(x=>x.hod&&x.dept===r.dept))return setErr('This department already has a HOD.');const nm=r.name.trim();onReg(r.role==='technician'?{username:em,pw:r.pw,role:'staff',name:nm,title:'Technician',dept:r.dept}:r.role==='hod'?{username:em,pw:r.pw,role:'admin',hod:true,name:nm,title:'Head of Department',dept:r.dept}:{username:em,pw:r.pw,role:'admin',name:nm,title:'Admin / Supervisor'});setErr('');setE(em);setP('');setMode('staff')};
const q=k=>x=>setR({...r,[k]:x.target.value});
return h`<div style="min-height:100vh;display:grid;place-items:center;padding:16px"><div class="card" style="max-width:460px;width:100%">
<div style="text-align:center;margin-bottom:12px"><div style="color:var(--pr)"><${Ic} d=${P.logo} s=${44}/></div><h1>Faculty Ticketing System</h1><div class="mu sm">Report and track college service requests</div></div>
<div class="row" style="margin-bottom:12px">${[['faculty','Faculty / Staff'],['staff','Admin · HOD · Technician'],['reg','Register']].map(([k,l])=>h`<button type="button" key=${k} class=${'btn s'+(mode===k?' p':'')} style="flex:1;min-width:120px" onClick=${()=>{setMode(k);setErr('')}}>${l}</button>`)}</div>
${err&&h`<div role="alert" class="OVERDUE sm" style="margin-bottom:8px">⚠ ${err}</div>`}
${mode==='faculty'&&h`<form onSubmit=${ev=>{ev.preventDefault();onLogin({role:'faculty',name:fn.trim(),title:'Faculty / Staff',email:''})}}><div class="sm mu" style="margin-bottom:8px">Open access: no password needed. Any faculty or staff member can raise a complaint.</div><${Fld} l="Your name"><input required value=${fn} onInput=${x=>setFn(x.target.value)}/><//><button class="btn p" style="width:100%">Continue to Faculty Module</button></form>`}
${mode==='staff'&&h`<form onSubmit=${go}><${Fld} l="Username"><input required value=${e} onInput=${x=>setE(x.target.value)} autocomplete="username" autocapitalize="none"/><//><${Fld} l="Password"><input type="password" required value=${p} onInput=${x=>setP(x.target.value)} autocomplete="current-password"/><//>
<div class="row sp sm" style="margin-bottom:12px"><label style="font-weight:400;margin:0"><input type="checkbox" style="width:auto;min-height:0;margin-right:6px"/>Remember me</label><a href="#" onClick=${x=>{x.preventDefault();alert('Prototype: password reset email would be sent here.')}}>Forgot password?</a></div>
<button class="btn p" style="width:100%" disabled=${ld}>${ld?'Signing in…':'Login'}</button>
<div class="sm" style="margin-top:16px;padding:12px;background:var(--prt);border-radius:10px"><b>Demo accounts</b> (tap to fill)${users.filter(x=>x.demo).map(u=>h`<div key=${u.username}><a href="#" onClick=${x=>{x.preventDefault();setE(u.username);setP(u.pw)}}>${u.username}</a> / ${u.pw} <span class="mu">· ${u.hod?'HOD '+u.dept:u.title+(u.dept?' '+u.dept:'')}</span></div>`)}</div></form>`}
${mode==='reg'&&h`<form onSubmit=${reg}><div class="sm mu" style="margin-bottom:8px">Create your own account. Admin and HOD need a registration code (prototype codes: ADMIN-2026 / HOD-2026).</div>
<${Fld} l="Register as"><select value=${r.role} onChange=${q('role')}><option value="technician">Technician</option><option value="hod">HOD (Head of Department)</option><option value="admin">Admin / Supervisor</option></select><//>
<${Fld} l="Full name"><input required value=${r.name} onInput=${q('name')}/><//>
<${Fld} l="Choose a username"><input required value=${r.username} onInput=${q('username')} autocapitalize="none"/><//>
${r.role!=='admin'&&h`<${Fld} l="Department"><select value=${r.dept} onChange=${q('dept')}>${DEPTS.slice(0,5).map(d=>h`<option>${d}</option>`)}</select><//>`}
${r.role!=='technician'&&h`<${Fld} l="Registration code"><input required value=${r.code} onInput=${q('code')}/><//>`}
<${Fld} l="Password (min 6)"><input type="password" required value=${r.pw} onInput=${q('pw')}/><//>
<button class="btn p" style="width:100%">Create account</button></form>`}
</div></div>`}
/* ---- Lists ---- */
function Filters({f,setF,admin}){const s=k=>x=>setF({...f,[k]:x.target.value});
return h`<div class="card grid f2" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))"><div style="grid-column:1/-1"><input aria-label="Search tickets" placeholder="Search by ID, title, department or person" value=${f.q} onInput=${s('q')}/></div>
<select aria-label="Status" value=${f.st} onChange=${s('st')}><option value="">All statuses</option><option value="OPEN">Open</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="OVERDUE">Overdue</option></select>
<select aria-label="Priority" value=${f.pr} onChange=${s('pr')}><option value="">All priorities</option>${PRI.map(x=>h`<option>${x}</option>`)}</select>
${admin&&h`<select aria-label="Department" value=${f.dp} onChange=${s('dp')}><option value="">All departments</option>${DEPTS.map(x=>h`<option>${x}</option>`)}</select>
<select aria-label="Assigned staff" value=${f.as} onChange=${s('as')}><option value="">All staff</option>${STAFF.map(x=>h`<option>${x}</option>`)}</select>
<input type="date" aria-label="Due date" value=${f.du} onChange=${s('du')}/>`}
<select aria-label="Sort" value=${f.so} onChange=${s('so')}><option value="new">Newest first</option><option value="old">Oldest first</option><option value="due">Due date</option></select></div>`}
const F0={q:'',st:'',pr:'',dp:'',as:'',du:'',so:'new'};
const filt=(ts,f)=>{const q=f.q.toLowerCase();return ts.filter(t=>(!q||[t.id,t.title,t.dept,t.to].join(' ').toLowerCase().includes(q))&&(!f.st||eff(t)===f.st)&&(!f.pr||t.pri===f.pr)&&(!f.dp||t.dept===f.dp)&&(!f.as||t.to===f.as)&&(!f.du||t.due===f.du)).sort((a,b)=>f.so==='due'?(a.due||'9').localeCompare(b.due||'9'):f.so==='old'?a.id.localeCompare(b.id):b.id.localeCompare(a.id))};
function TicketList({ts,role,act,nav}){if(!ts.length)return h`<div class="card empty">No tickets found.</div>`;
const A=t=>h`<div class="row" onClick=${e=>e.stopPropagation()}><button class="btn s" onClick=${()=>nav('t/'+t.id)}>View</button>
${role==='staff'&&t.status==='OPEN'&&h`<button class="btn s p" onClick=${()=>act('start',t)}>Start Work</button>`}
${role==='staff'&&t.status==='IN_PROGRESS'&&h`<button class="btn s p" onClick=${()=>act('done',t)}>Mark Completed</button>`}
${role==='admin'&&h`<button class="btn s" onClick=${()=>act('assign',t)}>Assign</button><button class="btn s" onClick=${()=>act('edit',t)}>Edit</button>${!HOD&&h`<button class="btn s d" onClick=${()=>act('del',t)}>Delete</button>`}`}</div>`;
return h`<div><div class="cards">${ts.map(t=>h`<div class="tc" key=${t.id} onClick=${()=>nav('t/'+t.id)}><div class="row sp"><b>${t.id}</b><${SB} s=${eff(t)}/></div><div style="margin:4px 0"><b>${t.title}</b></div><div class="row sm mu"><${PB} p=${t.pri}/><span>${t.dept}</span><span>Due ${t.due||'—'}</span></div><div class="sm mu" style="margin:4px 0">${role==='admin'?'By '+t.by+' · ':''}Assigned: ${t.to||'Unassigned'}</div>${A(t)}</div>`)}</div>
<div class="card" style="overflow-x:auto"><table class="tbl"><thead><tr><th>Ticket ID</th><th>Title</th><th>Department</th><th>Priority</th>${role!=='staff'&&h`<th>Created By</th>`}<th>Assigned To</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead><tbody>${ts.map(t=>h`<tr key=${t.id}><td><b>${t.id}</b></td><td>${t.title}</td><td>${t.dept}</td><td><${PB} p=${t.pri}/></td>${role!=='staff'&&h`<td>${t.by}</td>`}<td>${t.to||'Unassigned'}</td><td>${t.due||'—'}</td><td><${SB} s=${eff(t)}/></td><td>${A(t)}</td></tr>`)}</tbody></table></div></div>`}
/* ---- Dashboard ---- */
const Stats=({ts})=>{const c=k=>ts.filter(t=>eff(t)===k).length;return h`<div class="grid g5" style="margin-bottom:16px">${[['Total Tickets',ts.length,''],['Open',c('OPEN'),'OPEN'],['In Progress',c('IN_PROGRESS'),'IN_PROGRESS'],['Completed',c('COMPLETED'),'COMPLETED'],['Overdue',c('OVERDUE'),'OVERDUE']].map(([l,n,k])=>h`<div class="stat" key=${l}><span class="sm mu">${l}</span><b class=${k}>${n}</b></div>`)}</div>`};
const Bars=({title,items})=>{const m=Math.max(1,...items.map(i=>i[1]));return h`<div class="card"><h2>${title}</h2>${items.map(([l,n])=>h`<div class="row" style="margin-bottom:8px;flex-wrap:nowrap"><span class="sm" style="width:110px">${l}</span><div class="bar" role="img" aria-label=${l+': '+n}><i style=${'width:'+(n/m*100)+'%'}></i></div><b style="width:24px;text-align:right">${n}</b></div>`)}</div>`};
function Dash({u,ts,act,nav}){const[f,setF]=useState(F0);const mine=u.role==='faculty'?ts.filter(t=>t.by===u.name):u.role==='staff'?ts.filter(t=>mineS(u,t)):ts;
const ov=mine.filter(t=>eff(t)==='OVERDUE');
return h`<div><h1>${u.role==='faculty'?'Welcome, '+u.name:u.role==='staff'?'My Assigned Tickets':(HOD?HOD+' HOD Dashboard':'Admin Dashboard')}</h1><p class="mu" style="margin-top:0">${new Date().toDateString()}</p>
<${Stats} ts=${mine}/>
${u.role==='faculty'&&h`<button class="btn p" style="margin-bottom:16px" onClick=${()=>nav('new')}>+ Create New Ticket</button>`}
${u.role==='admin'&&h`<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))"><${Bars} title="Tickets by Status" items=${['OPEN','IN_PROGRESS','COMPLETED','OVERDUE'].map(k=>[SL[k],ts.filter(t=>eff(t)===k).length])}/><${Bars} title="Tickets by Department" items=${DEPTS.slice(0,5).map(d=>[d,ts.filter(t=>t.dept===d).length])}/><${Bars} title="Priority Distribution" items=${PRI.map(p=>[p,ts.filter(t=>t.pri===p).length])}/></div>
<div class="card warn"><h2 class="OVERDUE">⚠ Overdue Tickets (${ov.length})</h2>${ov.length?ov.map(t=>h`<div class="row sp" key=${t.id} style="padding:6px 0;border-top:1px solid var(--bd)"><span><b>${t.id}</b> ${t.title}<div class="sm mu">${t.dept} · ${t.to||'Unassigned'} · due ${t.due}</div></span><button class="btn s" onClick=${()=>nav('t/'+t.id)}>View</button></div>`):h`<div class="mu">No overdue tickets.</div>`}</div>`}
${u.role!=='admin'&&h`<h2>${u.role==='faculty'?'Recent Tickets':'Work Queue'}</h2><${Filters} f=${f} setF=${setF}/><${TicketList} ts=${filt(mine,f).slice(0,u.role==='faculty'?10:50)} role=${u.role} act=${act} nav=${nav}/>`}</div>`}
function ListPage({u,ts,act,nav,title}){const[f,setF]=useState(F0);const base=u.role==='faculty'?ts.filter(t=>t.by===u.name):u.role==='staff'?ts.filter(t=>mineS(u,t)):ts;
return h`<div><h1>${title}</h1><${Filters} f=${f} setF=${setF} admin=${u.role==='admin'}/><${TicketList} ts=${filt(base,f)} role=${u.role} act=${act} nav=${nav}/></div>`}
/* ---- Create ---- */
function Create({u,onCreate}){const[v,setV]=useState({title:'',desc:'',dept:'IT',pri:'Medium',loc:'',due:'',notes:'',file:''});const s=k=>x=>setV({...v,[k]:x.target.value});
return h`<div><h1>Create Ticket</h1><form class="card" onSubmit=${e=>{e.preventDefault();onCreate(v)}}><div class="grid f2">
<div style="grid-column:1/-1"><${Fld} l="Ticket Title *"><input required value=${v.title} onInput=${s('title')}/><//></div>
<div style="grid-column:1/-1"><${Fld} l="Problem Description *"><textarea required rows="4" value=${v.desc} onInput=${s('desc')}></textarea><//></div>
<${Fld} l="Category / Department *"><select value=${v.dept} onChange=${s('dept')}>${DEPTS.map(d=>h`<option>${d}</option>`)}</select><//>
<${Fld} l="Priority *"><select value=${v.pri} onChange=${s('pri')}>${PRI.map(d=>h`<option>${d}</option>`)}</select><//>
<${Fld} l="Location / Room"><input value=${v.loc} onInput=${s('loc')}/><//>
<${Fld} l="Due Date"><input type="date" min=${today()} value=${v.due} onChange=${s('due')}/><//>
<${Fld} l="Attachment (file name only in prototype)"><input type="file" onChange=${x=>setV({...v,file:x.target.files[0]?.name||''})}/><//>
<${Fld} l="Additional Notes"><input value=${v.notes} onInput=${s('notes')}/><//></div>
<button class="btn p">Submit Ticket</button></form></div>`}
/* ---- Details ---- */
function Detail({id,u,ts,act,nav}){const t=ts.find(x=>x.id===id);if(!t)return h`<div class="card empty">Ticket not found.</div>`;const e=eff(t);const order=['OPEN','IN_PROGRESS','COMPLETED'];const idx=order.indexOf(t.status);
const R=([k,v])=>h`<div key=${k}><div class="sm mu">${k}</div><div>${v}</div></div>`;
return h`<div><button class="btn s" onClick=${()=>history.back()} style="margin-bottom:12px">← Back</button>
<div class="card ${e==='OVERDUE'?'warn':''}"><div class="row sp"><h1>${t.id} · ${t.title}</h1><${SB} s=${e}/></div>${e==='OVERDUE'&&h`<div class="OVERDUE" role="alert"><b>⚠ OVERDUE</b> — due date ${t.due} has passed.</div>`}
<p>${t.desc}</p><div class="grid f2">${[['Created By',t.by],['Department',t.dept],['Assigned To',t.to||'Unassigned'],['Priority',h`<${PB} p=${t.pri}/>`],['Created Date',t.created],['Due Date',t.due||'—'],['Location',t.loc||'—'],['Attachment',t.file||'None'],['Notes',t.notes||'—']].map(R)}</div>
<div class="row" style="margin-top:14px">${u.role==='staff'&&mineS(u,t)&&t.status==='OPEN'&&h`<button class="btn p" onClick=${()=>act('start',t)}>Start Work</button>`}${u.role==='staff'&&t.to===u.name&&t.status==='IN_PROGRESS'&&h`<button class="btn p" onClick=${()=>act('done',t)}>Mark Completed</button>`}${u.role==='admin'&&h`<button class="btn p" onClick=${()=>act('assign',t)}>Assign</button><button class="btn" onClick=${()=>act('edit',t)}>Edit</button>${!HOD&&h`<button class="btn d" onClick=${()=>act('del',t)}>Delete</button>`}`}</div></div>
<div class="grid f2"><div class="card"><h2>Status Timeline</h2><div class="tl">${order.map((k,i)=>h`<div class=${i<=idx?'on':''}>${i<=idx?'✓':'○'} ${SL[k].slice(2)}${i===idx&&e==='OVERDUE'?' — ⚠ OVERDUE':''}</div>`)}</div></div>
<div class="card"><h2>Activity History</h2>${[...t.hist].reverse().map((a,i)=>h`<div key=${i} style="padding:6px 0;border-top:1px solid var(--bd)">${a.x}<div class="sm mu">${a.t}</div></div>`)}</div></div></div>`}
/* ---- Assign / Edit modal ---- */
function AssignModal({t,edit,onSave,onClose}){const st=d=>DBU.filter(x=>x.role==='staff'&&x.dept===d).map(x=>x.name);const[v,setV]=useState({dept:t.dept,to:(t.to&&st(t.dept).includes(t.to)?t.to:st(t.dept)[0])||'',due:t.due||dt(3),pri:t.pri});const s=k=>x=>setV({...v,[k]:x.target.value});
return h`<${Modal} title=${(edit?'Edit ':'Assign ')+t.id} onClose=${onClose}><form onSubmit=${e=>{e.preventDefault();onSave(v)}}><div class="grid f2"><${Fld} l="Department"><select value=${v.dept} onChange=${x=>setV({...v,dept:x.target.value,to:st(x.target.value)[0]||''})}>${(HOD?[HOD]:DEPTS).map(d=>h`<option>${d}</option>`)}</select><//><${Fld} l="Assigned Technician"><select required value=${v.to} onChange=${s('to')}>${st(v.dept).length?st(v.dept).map(d=>h`<option>${d}</option>`):h`<option value="">No technicians registered</option>`}</select><//><${Fld} l="Due Date"><input type="date" required value=${v.due} onChange=${s('due')}/><//><${Fld} l="Priority"><select value=${v.pri} onChange=${s('pri')}>${PRI.map(d=>h`<option>${d}</option>`)}</select><//></div><div class="row"><button class="btn p">Save Assignment</button><button type="button" class="btn" onClick=${onClose}>Cancel</button></div></form><//>`}
/* ---- Assistant (rule-based prototype, not a real AI) ---- */
function Chat({u,ts}){const[open,setOpen]=useState(false);const[q,setQ]=useState('');const[msgs,setMsgs]=useState([{b:1,t:'Hi '+u.name+'! I am the ticket assistant. Ask about a ticket status, overdue tickets, counts, or how to use the system.'}]);
useEffect(()=>{const e=document.getElementById('chatlog');if(e)e.scrollTop=e.scrollHeight},[msgs,open]);
const mine=u.role==='faculty'?ts.filter(t=>t.by===u.name):u.role==='staff'?ts.filter(t=>mineS(u,t)):ts;
const line=t=>t.id+' · '+t.title+' ['+SL[eff(t)].slice(2)+', '+t.pri+', due '+(t.due||'—')+', '+(t.to||'unassigned')+']';
const reply=m=>{const s=m.toLowerCase();const id=s.match(/ft-?\s?(\d{4})/);
if(id){const t=mine.find(x=>x.id==='FT-'+id[1]);return t?line(t):'I could not find FT-'+id[1]+' in your tickets.'}
if(/overdue|late|delay/.test(s)){const o=mine.filter(t=>eff(t)==='OVERDUE');return o.length?'Overdue tickets:\n'+o.map(line).join('\n'):'Good news, there are no overdue tickets.'}
if(/how many|count|summary|status|stats|total/.test(s)){const c=k=>mine.filter(t=>eff(t)===k).length;return 'Total '+mine.length+' · Open '+c('OPEN')+' · In Progress '+c('IN_PROGRESS')+' · Completed '+c('COMPLETED')+' · Overdue '+c('OVERDUE')}
if(/create|raise|new ticket|complain|report/.test(s))return u.role==='faculty'?'Open "Create Ticket" from the menu, fill title, description, department and priority, then press Submit Ticket. The status starts as OPEN.':'Faculty and staff raise tickets from the Faculty / Staff tab on the login page.';
if(/assign|deadline|due date|priority/.test(s))return u.role==='admin'?'Open All Tickets, press Assign (or Edit) on a ticket, choose department, technician, due date and priority, then Save Assignment.':'Admins and HODs assign tickets and set deadlines.';
if(/register|technician/.test(s))return 'Technicians register from the "Technician Register" tab on the login page by choosing a username and their department.';
if(/notif|bell/.test(s))return 'Tap the bell in the top bar. Technicians of the department, its HOD and Admin are notified when a ticket is raised.';
if(/my ticket|assigned|pending|open|work/.test(s)){const o=mine.filter(t=>eff(t)!=='COMPLETED').slice(0,6);return o.length?'Pending tickets:\n'+o.map(line).join('\n'):'No pending tickets.'}
if(/^(hi|hello|hey)/.test(s))return 'Hello! Try "status of FT-1001" or "show overdue tickets".';
return 'I can help with ticket status (e.g. FT-1001), overdue tickets, counts, pending tickets, and how to create or assign tickets.'};
const send=m=>{m=m.trim();if(!m)return;setMsgs(x=>[...x,{t:m},{b:1,t:reply(m)}]);setQ('')};
return h`<div><button class="fab" aria-label="Open ticket assistant" onClick=${()=>setOpen(!open)}>${open?'✕':'💬'}</button>
${open&&h`<div class="card chat" role="dialog" aria-label="Ticket assistant"><header><b>✳ Ticket Assistant</b><button aria-label="Close" onClick=${()=>setOpen(false)}>✕</button></header>
<div id="chatlog" aria-live="polite">${msgs.map((x,i)=>h`<div key=${i} class=${'m '+(x.b?'b':'u')}>${x.t}</div>`)}</div>
<div class="chips">${['Overdue tickets','Ticket summary','Pending tickets','How to create a ticket'].map(c=>h`<button key=${c} onClick=${()=>send(c)}>${c}</button>`)}</div>
<form class="row" style="padding:8px 12px;flex-wrap:nowrap;border-top:1px solid var(--bd)" onSubmit=${e=>{e.preventDefault();send(q)}}><input aria-label="Message" placeholder="Ask about a ticket…" value=${q} onInput=${x=>setQ(x.target.value)}/><button class="btn p s">Send</button></form>
<div class="sm mu" style="text-align:center;padding:0 8px 6px">Prototype assistant (rule-based, not a real AI)</div></div>`}</div>`}
/* ---- App ---- */
function App(){const[db,setDb]=useState(load);const[u,setU]=useState(null);
const[rt,setRt]=useState(location.hash.slice(2)||'dash');const[toast,setToast]=useState('');const[m,setM]=useState(null);const[bell,setBell]=useState(false);
useEffect(()=>{const f=()=>{setRt(location.hash.slice(2)||'dash');setBell(false)};addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
useEffect(()=>save(db),[db]);
const nav=p=>{location.hash='/'+p};const say=x=>{setToast(x);setTimeout(()=>setToast(''),2600)};
const login=x=>{try{sessionStorage.setItem('fts-u4',JSON.stringify(x))}catch(e){}setU(x);nav('dash')};
const reg=x=>{setDb(d=>({...d,users:[...d.users,x],notifs:x.role==='staff'?[...d.notifs,{r:'admin',m:'Technician '+x.name+' registered for '+x.dept+'.'},{r:'hod',d:x.dept,m:'Technician '+x.name+' registered for your department.'}]:d.notifs}));say('Account created! Please login.')};const logout=()=>{try{sessionStorage.removeItem('fts-u4')}catch(e){}setU(null);nav('dash')};
const upd=(id,patch,log,note)=>setDb(d=>({...d,tickets:d.tickets.map(t=>t.id===id?{...t,...patch,hist:[...t.hist,...log.map(x=>({t:today(),x}))]}:t),notifs:note?[...d.notifs,...[].concat(note)]:d.notifs}));
const act=(a,t)=>{if(a==='start'){upd(t.id,{status:'IN_PROGRESS',to:t.to||u.name},[...(t.to?[]:['Assigned to '+u.name+' (accepted by technician)']),'Status changed to In Progress'],{r:'faculty',u:t.by,m:'Ticket '+t.id+' is now In Progress.'});say(t.id+' is now In Progress')}
else if(a==='done'){upd(t.id,{status:'COMPLETED'},['Status changed to Completed'],[{r:'faculty',u:t.by,m:'Ticket '+t.id+' has been completed.'},{r:'admin',m:'Ticket '+t.id+' has been completed.'},{r:'hod',d:t.dept,m:'Ticket '+t.id+' has been completed.'}]);say(t.id+' marked Completed')}
else setM({a,t})};
const create=v=>{const n=Math.max(1000,...db.tickets.map(t=>+t.id.slice(3)))+1;const t={id:'FT-'+n,title:v.title,desc:v.desc,dept:v.dept,pri:v.pri,created:today(),due:v.due,status:'OPEN',by:u.name,to:'',loc:v.loc,notes:v.notes,file:v.file,hist:[{t:today(),x:'Ticket created by '+u.name}]};
setDb(d=>({...d,tickets:[t,...d.tickets],notifs:[...d.notifs,{r:'admin',m:'New ticket '+t.id+' ('+t.dept+') needs assignment.'},{r:'hod',d:t.dept,m:'New ticket '+t.id+' raised for your department.'},{r:'staff',d:t.dept,m:'New ticket '+t.id+' ('+t.title+') raised for your department.'}]}));say('Ticket '+t.id+' submitted successfully (status: OPEN)');nav('mine')};
const save2=v=>{const t=m.t,log=[];if(v.dept!==t.dept||!t.to)log.push('Assigned to '+v.dept+' Department');if(v.to!==t.to)log.push('Assigned to '+v.to);if(v.due!==t.due)log.push('Deadline updated to '+v.due);if(v.pri!==t.pri)log.push('Priority changed to '+v.pri);
upd(t.id,{dept:v.dept,to:v.to,due:v.due,pri:v.pri},log.length?log:['Ticket edited'],[{r:'staff',d:v.dept,u:v.to,m:'Ticket '+t.id+' has been assigned to you.'},{r:'faculty',u:t.by,m:'Ticket '+t.id+' assigned to '+v.to+' ('+v.dept+').'}]);setM(null);say('Assignment saved for '+t.id)};
DBU=db.users;STAFF=db.users.filter(x=>x.role==='staff').map(x=>x.name);if(!u)return h`<${Login} users=${db.users} onLogin=${login} onReg=${reg}/>`;
HOD=u.hod?u.dept:'';const ts=u.hod?db.tickets.filter(t=>t.dept===u.dept):db.tickets,nv=NAV[u.role],page=rt.split('/')[0];
const k=u.hod?'hod':u.role;const my=db.notifs.filter(n=>n.r===k&&(!n.d||k==='admin'||k==='faculty'||n.d===u.dept)&&(!n.u||n.u===u.name)).reverse();const od=ts.filter(t=>eff(t)==='OVERDUE'&&(u.role==='admin'||t.to===u.name||t.by===u.name));
const allN=[...od.map(t=>'Ticket '+t.id+' is overdue.'),...my.map(n=>n.m)].filter((x,i,a)=>a.indexOf(x)===i);
const link=([k,l,ic])=>h`<a key=${k} class=${page===k||(k==='mine'&&page==='t')&&0?'on':page===k?'on':''} tabindex="0" role="link" onClick=${()=>nav(k)} onKeyDown=${e=>e.key==='Enter'&&nav(k)}><${Ic} d=${P[ic]}/><span>${l}</span></a>`;
let body;
if(page==='t')body=h`<${Detail} id=${rt.split('/')[1]} u=${u} ts=${ts} act=${act} nav=${nav}/>`;
else if(page==='new'&&u.role==='faculty')body=h`<${Create} u=${u} onCreate=${create}/>`;
else if(page==='mine'||page==='all')body=h`<${ListPage} u=${u} ts=${ts} act=${act} nav=${nav} title=${u.role==='admin'?'All Tickets':u.role==='staff'?'Assigned Tickets':'My Tickets'}/>`;
else if(page==='depts')body=h`<div><h1>Departments</h1><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${(HOD?[HOD]:DEPTS).map(d=>{const x=ts.filter(t=>t.dept===d);return h`<div class="card" key=${d}><h2>${d}</h2><div>${x.length} tickets · ${x.filter(t=>eff(t)==='OVERDUE').length} overdue</div><div class="sm mu">Open: ${x.filter(t=>t.status==='OPEN').length} · In progress: ${x.filter(t=>t.status==='IN_PROGRESS').length} · Done: ${x.filter(t=>t.status==='COMPLETED').length}</div></div>`})}</div></div>`;
else if(page==='notif')body=h`<div><h1>Notifications</h1><div class="card">${allN.length?allN.map((n,i)=>h`<div key=${i} style="padding:10px 0;border-top:${i?'1px solid var(--bd)':'0'}">🔔 ${n}</div>`):h`<div class="empty">No notifications.</div>`}</div></div>`;
else if(page==='prof')body=h`<div><h1>Profile</h1><div class="card"><h2>${u.name}</h2><div class="mu">${u.username?'Username: '+u.username:''}</div><div>Role: ${u.title}${u.dept?' · '+u.dept+' Department':''}</div><div class="sm mu" style="margin-top:8px">Prototype data is stored in this browser only (localStorage).</div><div class="row" style="margin-top:12px"><button class="btn d" onClick=${()=>{try{localStorage.removeItem(KEY)}catch(e){}setDb(seed());say('Demo data reset')}}>Reset demo data</button></div></div></div>`;
else body=h`<${Dash} u=${u} ts=${ts} act=${act} nav=${nav}/>`;
return h`<div><aside class="side"><div class="row" style="padding:8px 12px 16px;color:var(--pr)"><${Ic} d=${P.logo}/><b>✳ Faculty Tickets</b></div><nav class="nav" aria-label="Main">${nv.map(link)}<a tabindex="0" role="link" onClick=${logout} onKeyDown=${e=>e.key==='Enter'&&logout()}><${Ic} d=${P.out}/><span>Logout</span></a></nav></aside>
<div class="wrap"><header class="top"><div class="row lg" style="color:var(--pr)"><${Ic} d=${P.logo}/><b>✳ Faculty Tickets</b></div><div class="sm mu" style="display:none"></div><div class="row" style="margin-left:auto;position:relative"><span class="sm mu">${u.name}</span>
<button class="btn s" aria-label=${'Notifications ('+allN.length+')'} onClick=${()=>setBell(!bell)}><${Ic} d=${P.bell} s=${18}/> ${allN.length}</button><button class="btn s lg" onClick=${logout} aria-label="Logout"><${Ic} d=${P.out} s=${18}/></button>
${bell&&h`<div class="card dr"><b>Notifications</b>${allN.slice(0,6).map((n,i)=>h`<div key=${i} class="sm" style="padding:6px 0;border-top:1px solid var(--bd)">${n}</div>`)||''}<a href="#/notif" class="sm">View all</a></div>`}</div></header>
<main class="main">${body}</main></div>
<nav class="bn" aria-label="Mobile">${nv.slice(0,4).map(link)}<a tabindex="0" role="link" onClick=${logout}><${Ic} d=${P.out}/><span>Logout</span></a></nav>
${m&&(m.a==='assign'||m.a==='edit')&&h`<${AssignModal} t=${m.t} edit=${m.a==='edit'} onSave=${save2} onClose=${()=>setM(null)}/>`}
${m&&m.a==='del'&&h`<${Modal} title="Delete ticket?" onClose=${()=>setM(null)}><p>Delete <b>${m.t.id}</b> — ${m.t.title}? This cannot be undone.</p><div class="row"><button class="btn d" onClick=${()=>{setDb(d=>({...d,tickets:d.tickets.filter(t=>t.id!==m.t.id)}));setM(null);say('Ticket deleted');if(page==='t')nav('all')}}>Delete</button><button class="btn" onClick=${()=>setM(null)}>Cancel</button></div><//>`}
<${Chat} key=${u.name} u=${u} ts=${ts}/>${toast&&h`<div class="toast" role="status">${toast}</div>`}</div>`}
ReactDOM.createRoot(document.getElementById('root')).render(h`<${App}/>`);
