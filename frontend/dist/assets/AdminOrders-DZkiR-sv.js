import{c as D,u as N,a as k,b as d,ab as A,ac as F,j as e,D as E,e as z,T as M,C as O,ad as I,ae as U,af as H,ag as V,ah as Z,ai as q}from"./index-B1hlff39.js";import{A as G,a as B}from"./AdminLayout-Bl0RXXR1.js";import{T as C,C as T}from"./truck-BuK98KOb.js";import{L as y}from"./loader-circle-D6ooxpu_.js";import{C as Y}from"./chevron-up-CBSjD7ff.js";import"./users-OgFm2q9l.js";const K=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],P=D("printer",K),S=["En cours","Confirmé","Livré","Annulé"],_={"En cours":"bg-blue-500/10 text-blue-500",Confirmé:"bg-yellow-500/10 text-yellow-500",Livré:"bg-emerald-500/10 text-emerald-500",Annulé:"bg-destructive/10 text-destructive"},L={ville:"Ville",sud:"Sud",nord:"Nord",petite_terre:"Petite Terre"},$=(t,c=[])=>{const i=t.shipping_info||{},r=c.length>0?c:t.order_items||t.items||t.orderItems||[],m=t.id||"",o=m.slice(-8).toUpperCase(),p=t.created_at?new Date(t.created_at).toLocaleDateString("fr-FR"):"—",n=t.total_price||0,u=t.tax_price||0,x=t.shipping_price||0,h=t.delivery_zone?L[t.delivery_zone]||t.delivery_zone:"—",f=r.map((a,b)=>`
      <tr>
        <td>${b+1}</td>
        <td>${a.title||a.name||a.product_name||"Produit"}</td>
        <td class="center">${a.quantity??1}</td>
        <td class="right">${(a.price||0).toLocaleString("fr-FR",{minimumFractionDigits:2})}</td>
        <td class="right">${((a.price||0)*(a.quantity??1)).toLocaleString("fr-FR",{minimumFractionDigits:2})}</td>
        <td class="center">${a.tva_rate??"—"}</td>
      </tr>`).join(""),g=`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Proforma #${o}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #111; padding: 24px 28px; max-width: 800px; margin: 0 auto; }
    .header-grid { display: grid; grid-template-columns: 1fr auto; align-items: start; margin-bottom: 14px; }
    .company-name { font-size: 17px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; }
    .doc-title { font-size: 22px; font-weight: 900; text-transform: uppercase; text-align: right; letter-spacing: 1px; border-bottom: 3px solid #111; padding-bottom: 4px; }
    .company-info { font-size: 10px; color: #444; margin-top: 4px; line-height: 1.5; }
    hr.separator { border: none; border-top: 1px solid #aaa; margin: 10px 0; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10px; }
    .meta-table th { background: #111; color: #fff; padding: 4px 8px; text-align: center; font-weight: 700; letter-spacing: 0.5px; }
    .meta-table td { padding: 4px 8px; text-align: center; border: 1px solid #ccc; }
    .address-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
    .address-box { border: 1px solid #ccc; padding: 8px 10px; font-size: 10px; }
    .address-box .label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #666; margin-bottom: 4px; letter-spacing: 0.5px; }
    .address-box .name { font-weight: 700; font-size: 11px; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .items-table th { background: #111; color: #fff; padding: 5px 8px; font-weight: 700; font-size: 10px; letter-spacing: 0.4px; }
    .items-table td { padding: 5px 8px; border-bottom: 1px solid #e5e5e5; font-size: 10px; }
    .items-table tr:nth-child(even) td { background: #f9f9f9; }
    .items-table .total-row td { background: #f0f0f0; font-weight: 700; font-size: 11px; border-top: 2px solid #111; }
    .center { text-align: center; } .right { text-align: right; }
    .totals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 10px; }
    .tva-table { width: 100%; border-collapse: collapse; font-size: 10px; }
    .tva-table th { background: #555; color: #fff; padding: 3px 6px; font-size: 9.5px; font-weight: 700; }
    .tva-table td { padding: 3px 6px; border-bottom: 1px solid #ddd; }
    .summary-box { border: 1px solid #ccc; padding: 10px; font-size: 11px; }
    .summary-row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #eee; }
    .summary-row:last-child { border-bottom: none; }
    .summary-row.total { font-weight: 900; font-size: 13px; padding-top: 6px; border-top: 2px solid #111; margin-top: 4px; }
    .footer { margin-top: 16px; font-size: 9px; color: #777; text-align: center; border-top: 1px solid #ccc; padding-top: 8px; }
    @media print { body { padding: 10px 14px; } @page { margin: 10mm; size: A4; } }
  </style>
</head>
<body>
  <div class="header-grid">
    <div>
      <div class="company-name">ETS HOUSSENI</div>
      <div class="company-info">Route Nationale Kaweni BP674, 97600 MAYOTTE<br/>Tél : +262 639 28 37 68</div>
    </div>
    <div class="doc-title">${t.paid_at?"FACTURE":"PROFORMA"}</div>
  </div>
  <hr class="separator"/>
  <table class="meta-table">
    <thead><tr><th>Numéro</th><th>Date</th><th>Client</th><th>Zone livraison</th><th>Feuillet</th></tr></thead>
    <tbody>
      <tr>
        <td><strong>${o}</strong></td>
        <td>${p}</td>
        <td>${i.full_name||"—"}</td>
        <td>${h}</td>
        <td>1 / 1</td>
      </tr>
    </tbody>
  </table>
  <div class="address-grid">
    <div class="address-box">
      <div class="label">ADRESSE DE LIVRAISON</div>
      <div class="name">${i.full_name||"—"}</div>
      <div>${i.address||""}</div>
      <div>${[i.city,i.state].filter(Boolean).join(" ")}</div>
      <div>${i.phone||""}</div>
    </div>
  </div>
  <table class="items-table">
    <thead>
      <tr><th>N°</th><th>Désignation</th><th class="center">Quantité</th><th class="right">P.U. net H.T</th><th class="right">Montant H.T</th><th class="center">TVA</th></tr>
    </thead>
    <tbody>
      ${r.length>0?f:'<tr><td colspan="6" style="text-align:center;color:#999;padding:12px;">Aucun article</td></tr>'}
      <tr class="total-row">
        <td colspan="4" class="right">Total H.T.</td>
        <td class="right">${n.toLocaleString("fr-FR",{minimumFractionDigits:2})} €</td>
        <td></td>
      </tr>
    </tbody>
  </table>
  <div class="totals-grid">
    <div>
      <table class="tva-table">
        <thead><tr><th>Réf.</th><th>Base</th><th>Taux TVA</th><th>Montant TVA</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>—</td><td>20,00 %</td><td>0,00 €</td></tr>
          <tr><td>4</td><td class="right">${n.toLocaleString("fr-FR",{minimumFractionDigits:2})} €</td><td>0,00 %</td><td class="right">0,00 €</td></tr>
        </tbody>
      </table>
      <div style="margin-top:8px; font-size:9px; color:#777;">
        N° commande : ${m}<br/>Date : ${p}<br/>
        Mode de règlement : ${t.paid_at?"Payé":"En attente"}<br/>
        Zone de livraison : ${h}
      </div>
    </div>
    <div class="summary-box">
      <div class="summary-row"><span>Total H.T.</span><span>${n.toLocaleString("fr-FR",{minimumFractionDigits:2})} €</span></div>
      <div class="summary-row"><span>T.V.A.</span><span>${u.toLocaleString("fr-FR",{minimumFractionDigits:2})} €</span></div>
      <div class="summary-row"><span>Livraison (${h})</span><span>${x.toLocaleString("fr-FR",{minimumFractionDigits:2})} €</span></div>
      <div class="summary-row total"><span>Total T.T.C.</span><span>${(n+x+u).toLocaleString("fr-FR",{minimumFractionDigits:2})} €</span></div>
    </div>
  </div>
  <div class="footer">Proforma n° ${o} du ${p} — Document non contractuel, valable 30 jours.</div>
  <script>window.onload = () => { window.print(); };<\/script>
</body>
</html>`,s=window.open("","_blank","width=900,height=700");s&&(s.document.write(g),s.document.close())},Q=({order:t})=>{const c=N(),{shippingRates:i}=k(s=>s.admin),[r,m]=d.useState(t.delivery_zone||""),[o,p]=d.useState(t.shipping_price??0),[n,u]=d.useState(!1),[x,h]=d.useState(!1);d.useEffect(()=>{m(t.delivery_zone||""),p(t.shipping_price??0)},[t.delivery_zone,t.shipping_price]);const f=async s=>{m(s),u(!0);const a=await c(Z({id:t.id,delivery_zone:s||null}));a.payload?.shipping_price!==void 0&&p(a.payload.shipping_price),u(!1)},g=async()=>{h(!0),await c(q({id:t.id,shipping_price:Number(o)})),h(!1)};return e.jsxs("div",{className:"border border-border rounded-lg p-4 bg-secondary/20",children:[e.jsxs("p",{className:"font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-1.5",children:[e.jsx(C,{className:"w-3.5 h-3.5"})," Zone & frais de livraison"]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-3 mb-3",children:[e.jsx("label",{className:"font-ui text-xs text-muted-foreground",children:"Zone :"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("select",{value:r,onChange:s=>f(s.target.value),disabled:n,className:"input-base text-sm py-1.5",children:[e.jsx("option",{value:"",children:"— Non renseignée —"}),e.jsxs("option",{value:"ville",children:["Ville — ",i.ville," €"]}),e.jsxs("option",{value:"sud",children:["Sud — ",i.sud," €"]}),e.jsxs("option",{value:"nord",children:["Nord — ",i.nord," €"]}),e.jsxs("option",{value:"petite_terre",children:["Petite Terre — ",i.petite_terre," €"]})]}),n&&e.jsx(y,{className:"w-4 h-4 animate-spin text-primary"})]}),r&&e.jsxs("span",{className:"flex items-center gap-1 text-xs font-ui font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md",children:[e.jsx(z,{className:"w-3 h-3"}),L[r]," · ",i[r]," €"]})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx("label",{className:"font-ui text-xs text-muted-foreground",children:"Prix livraison (€) :"}),e.jsx("input",{type:"number",min:"0",step:"0.01",value:o,onChange:s=>p(s.target.value),className:"input-base text-sm py-1.5 w-28"}),e.jsxs("button",{onClick:g,disabled:x,className:"flex items-center gap-1.5 font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border border-primary/40 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50",children:[x?e.jsx(y,{className:"w-3.5 h-3.5 animate-spin"}):e.jsx(T,{className:"w-3.5 h-3.5"}),"Mettre à jour"]})]})]})},J=()=>{const t=N(),{shippingRates:c}=k(n=>n.admin),[i,r]=d.useState({...c}),[m,o]=d.useState(!1);d.useEffect(()=>{r({...c})},[c]);const p=async()=>{o(!0),await t(U(i)),o(!1)};return e.jsxs("div",{className:"card-base p-5 mb-6",children:[e.jsxs("h3",{className:"font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4 flex items-center gap-2",children:[e.jsx(C,{className:"w-4 h-4 text-primary"}),"Tarifs de livraison globaux"]}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4",children:[{key:"ville",label:"Ville"},{key:"sud",label:"Sud"},{key:"nord",label:"Nord"},{key:"petite_terre",label:"Petite Terre"}].map(({key:n,label:u})=>e.jsxs("div",{children:[e.jsx("label",{className:"font-ui text-xs text-muted-foreground tracking-widest uppercase block mb-1.5",children:u}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"number",min:"0",value:i[n]??"",onChange:x=>r({...i,[n]:Number(x.target.value)}),className:"input-base w-full text-sm py-1.5 pr-8"}),e.jsx("span",{className:"absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-ui",children:"€"})]})]},n))}),e.jsxs("button",{onClick:p,disabled:m,className:"flex items-center gap-2 font-ui font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50",children:[m?e.jsx(y,{className:"w-3.5 h-3.5 animate-spin"}):e.jsx(T,{className:"w-3.5 h-3.5"}),"Enregistrer les tarifs"]})]})},W=({order:t,onDelete:c})=>{const i=N(),[r,m]=d.useState(!1),[o,p]=d.useState(t.order_status||"En cours"),[n,u]=d.useState(!1),[x,h]=d.useState(!1),f=async l=>{u(!0),p(l),await i(H({id:t.id,status:l})),u(!1)},g=async()=>{window.confirm("Marquer cette commande comme payée ?")&&(h(!0),await i(V(t.id)),h(!1))},s=t.shipping_info||{},a=t.order_items||[],b=t.id||"",w=b.slice(-8).toUpperCase(),j=o||t.order_status||"En cours",v=t.delivery_zone?L[t.delivery_zone]:null;return e.jsxs("div",{className:"card-base overflow-hidden mb-3",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3 px-5 py-4 hover:bg-secondary/30 transition-colors",children:[e.jsxs("button",{onClick:()=>m(!r),className:"flex items-center gap-4 min-w-0 flex-1 text-left",children:[e.jsxs("div",{className:"hidden sm:block min-w-0",children:[e.jsxs("p",{className:"font-ui font-bold text-foreground text-xs tracking-widest uppercase",children:["#",w]}),e.jsx("p",{className:"text-muted-foreground text-xs",children:t.created_at?new Date(t.created_at).toLocaleDateString("fr-FR"):"—"})]}),e.jsx("span",{className:`font-ui font-bold text-xs px-2.5 py-1 rounded-md tracking-wide shrink-0 ${_[j]||_["En cours"]}`,children:j}),e.jsxs("span",{className:"font-ui font-bold text-primary text-sm hidden sm:block",children:[(t.total_price||0).toLocaleString("fr-MG")," €"]}),v&&e.jsxs("span",{className:"hidden md:flex items-center gap-1 text-xs font-ui font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded",children:[e.jsx(z,{className:"w-3 h-3"})," ",v]}),s.full_name&&e.jsx("span",{className:"text-muted-foreground text-xs hidden md:block truncate max-w-[140px]",children:s.full_name}),t.paid_at?e.jsx("span",{className:"text-emerald-500 text-xs font-ui font-semibold hidden lg:block",children:"✓ Payé"}):e.jsx("span",{className:"text-yellow-500 text-xs font-ui font-semibold hidden lg:block",children:"En attente"})]}),e.jsxs("div",{className:"flex items-center gap-2 shrink-0",children:[e.jsx("button",{onClick:()=>$(t,a),className:"p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors",title:"Imprimer proforma",children:e.jsx(P,{className:"w-4 h-4"})}),e.jsx("button",{onClick:()=>c(t.id),className:"p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors",title:"Supprimer",children:e.jsx(M,{className:"w-4 h-4"})}),e.jsx("button",{onClick:()=>m(!r),className:"p-1",children:r?e.jsx(Y,{className:"w-4 h-4 text-muted-foreground"}):e.jsx(O,{className:"w-4 h-4 text-muted-foreground"})})]})]}),r&&e.jsxs("div",{className:"border-t border-border p-5 animate-fade-up space-y-5",children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2",children:"Commande"}),e.jsxs("p",{className:"text-foreground text-xs font-ui break-all",children:["#",b]}),e.jsx("p",{className:"text-muted-foreground text-xs",children:t.created_at?new Date(t.created_at).toLocaleString("fr-FR"):"—"}),e.jsxs("p",{className:"text-muted-foreground text-xs mt-1",children:["Taxe :"," ",t.tax_price!==void 0?`${t.tax_price} €`:"—"]})]}),(s.full_name||s.address)&&e.jsxs("div",{children:[e.jsx("p",{className:"font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2",children:"Livraison"}),e.jsx("p",{className:"text-foreground text-sm font-ui font-semibold",children:s.full_name}),e.jsx("p",{className:"text-muted-foreground text-xs",children:s.address}),e.jsxs("p",{className:"text-muted-foreground text-xs",children:[s.city," ",s.state]}),e.jsx("p",{className:"text-muted-foreground text-xs",children:s.phone})]}),e.jsxs("div",{children:[e.jsx("p",{className:"font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2",children:"Total"}),e.jsxs("p",{className:"font-ui font-bold text-primary text-lg",children:[(t.total_price||0).toLocaleString("fr-MG")," €"]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["Livraison :"," ",(t.shipping_price||0).toLocaleString("fr-MG")," €",v&&` (${v})`]}),e.jsxs("p",{className:"text-xs font-ui font-bold text-foreground mt-1",children:["Total TTC :"," ",(Number(t.total_price||0)+Number(t.shipping_price||0)+Number(t.tax_price||0)).toLocaleString("fr-MG")," ","€"]})]})]}),a.length>0&&e.jsxs("div",{children:[e.jsxs("p",{className:"font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2",children:["Articles (",a.length,")"]}),e.jsx("div",{className:"space-y-2",children:a.map((l,R)=>e.jsxs("div",{className:"flex items-center justify-between py-2 border-b border-border last:border-0 text-sm",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[l.image&&e.jsx("img",{src:l.image,alt:"",className:"w-9 h-9 rounded border border-border object-cover bg-secondary"}),e.jsx("span",{className:"font-ui text-foreground",children:l.title||"Produit"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("span",{className:"text-muted-foreground font-ui",children:["×",l.quantity]}),e.jsxs("span",{className:"font-ui font-bold text-primary",children:[((l.price||0)*l.quantity).toLocaleString("fr-MG")," ","€"]})]})]},R))})]}),e.jsx(Q,{order:t}),e.jsxs("div",{className:"flex items-center gap-3 flex-wrap",children:[e.jsx("label",{className:"font-ui text-xs text-muted-foreground tracking-widest uppercase",children:"Statut :"}),e.jsx("select",{value:j,onChange:l=>f(l.target.value),disabled:n,className:"input-base text-sm py-1.5 pr-8",children:S.map(l=>e.jsx("option",{value:l,children:l},l))}),n&&e.jsx(y,{className:"w-4 h-4 animate-spin text-primary"}),!t.paid_at&&e.jsxs("button",{onClick:g,disabled:x,className:"flex items-center gap-2 font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 transition-colors disabled:opacity-50",children:[x?e.jsx(y,{className:"w-3.5 h-3.5 animate-spin"}):e.jsx(T,{className:"w-3.5 h-3.5"}),"Marquer comme payé"]}),e.jsxs("button",{onClick:()=>$(t,a),className:"ml-auto flex items-center gap-2 font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors",children:[e.jsx(P,{className:"w-3.5 h-3.5"}),"Imprimer proforma"]})]})]})]})},re=()=>{const t=N(),{orders:c,loading:i}=k(s=>s.admin),[r,m]=d.useState(""),[o,p]=d.useState("all"),[n,u]=d.useState("all"),[x,h]=d.useState(!1);d.useEffect(()=>{t(A()),t(F())},[t]);const f=s=>{window.confirm("Supprimer cette commande ?")&&t(I(s))},g=c.filter(s=>{const a=s.id||"",b=s.shipping_info?.full_name||"",w=!r||a.toLowerCase().includes(r.toLowerCase())||b.toLowerCase().includes(r.toLowerCase()),j=o==="all"||s.order_status===o,v=n==="all"||(n==="paid"?!!s.paid_at:!s.paid_at);return w&&j&&v});return e.jsxs(G,{children:[e.jsx(B,{title:"Commandes"}),e.jsxs("main",{className:"flex-1 p-6",children:[e.jsx("div",{className:"flex justify-end mb-4",children:e.jsxs("button",{onClick:()=>h(s=>!s),className:"flex items-center gap-2 font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors",children:[e.jsx(C,{className:"w-3.5 h-3.5"}),x?"Masquer les tarifs":"Gérer les tarifs de livraison"]})}),x&&e.jsx(J,{}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6",children:S.map(s=>e.jsxs("div",{onClick:()=>p(o===s?"all":s),className:`card-base p-4 text-center cursor-pointer transition-colors ${o===s?"border-primary":""}`,children:[e.jsx("div",{className:`font-display text-2xl ${_[s]?.split(" ")[1]||"text-foreground"}`,children:c.filter(a=>a.order_status===s).length}),e.jsx("div",{className:"font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5",children:s})]},s))}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-3 mb-5",children:[e.jsxs("div",{className:"relative flex-1",children:[e.jsx(E,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),e.jsx("input",{type:"text",placeholder:"ID commande, nom client...",value:r,onChange:s=>m(s.target.value),className:"input-base w-full pl-9 text-sm py-2"})]}),e.jsxs("select",{value:n,onChange:s=>u(s.target.value),className:"input-base text-sm py-2",children:[e.jsx("option",{value:"all",children:"Tous paiements"}),e.jsx("option",{value:"paid",children:"Payées"}),e.jsx("option",{value:"unpaid",children:"Non payées"})]}),e.jsx("div",{className:"flex gap-2 flex-wrap",children:["all",...S].map(s=>e.jsx("button",{onClick:()=>p(s),className:`font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border transition-colors ${o===s?"bg-primary border-primary text-white":"border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`,children:s==="all"?"Toutes":s},s))})]}),e.jsxs("div",{className:"flex items-center justify-between mb-4 text-sm",children:[e.jsxs("span",{className:"font-ui text-muted-foreground",children:[g.length," commande",g.length!==1?"s":""]}),e.jsxs("span",{className:"font-ui text-muted-foreground",children:["Payées :"," ",e.jsxs("span",{className:"text-primary font-bold",children:[g.filter(s=>s.paid_at).reduce((s,a)=>s+(Number(a.total_price)||0),0).toLocaleString("fr-MG")," ","€"]})]})]}),i?e.jsx("div",{className:"flex items-center justify-center py-16",children:e.jsx(y,{className:"w-8 h-8 text-primary animate-spin"})}):g.length===0?e.jsx("div",{className:"text-center py-16 text-muted-foreground font-ui",children:"Aucune commande trouvée"}):e.jsx("div",{children:g.map(s=>e.jsx(W,{order:s,onDelete:f},s.id))})]})]})};export{re as default};
