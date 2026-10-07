// MIT. Pure browser XML reference traversal; no network requests.
const NS = {
  e:'http://data.europa.eu/p27/eforms-ubl-extension-aggregate-components/1',
  b:'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  a:'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2'
};
const kids=(n,k,name)=>[...(n?.children||[])].filter(x=>x.namespaceURI===NS[k]&&x.localName===name);
const one=(n,k,name)=>kids(n,k,name)[0];
const val=(n,k,name)=>one(n,k,name)?.textContent.trim()||'';
const id=n=>val(n,'b','ID');
const path=(n,...parts)=>parts.reduce((x,p)=>one(x,...p.split(':')),n);
export function traceXML(xml) {
  if (xml.length>2_000_000) throw Error('This demo accepts XML up to 2 MB.');
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw Error('DTD and entity declarations are not supported.');
  const doc=new DOMParser().parseFromString(xml,'application/xml');
  if(doc.querySelector('parsererror')) throw Error('The XML is not well formed.');
  if(doc.documentElement.localName!=='ContractAwardNotice' || doc.documentElement.namespaceURI!=='urn:oasis:names:specification:ubl:schema:xsd:ContractAwardNotice-2') throw Error('Use an eForms UBL ContractAwardNotice XML. Other notice types are outside this demo.');
  const version=val(doc.documentElement,'b','CustomizationID');
  const warnings=[]; const rows=[];
  if(version!=='eforms-sdk-1.16') warnings.push('Tested against an SDK 1.16 example only; this version is not verified: '+(version||'not declared'));
  const all=(k,n)=>[...doc.getElementsByTagNameNS(NS[k],n)];
  const nr=all('e','NoticeResult');
  if(nr.length!==1) throw Error('Exactly one NoticeResult is required. No mapping was inferred.');
  const result=nr[0];
  const index=(items,getId,label)=>{const m=new Map();for(const item of items){const key=getId(item);if(!key)throw Error(label+' definition has no ID.');if(m.has(key))throw Error('Ambiguous duplicate '+label+' ID: '+key);m.set(key,item);}return m;};
  const tenders=index(kids(result,'e','LotTender'),id,'tender');
  const parties=index(kids(result,'e','TenderingParty'),id,'tendering party');
  const contracts=index(kids(result,'e','SettledContract'),id,'contract');
  const orgs=index(all('e','Organizations').flatMap(n=>kids(n,'e','Organization')).map(n=>one(n,'e','Company')).filter(Boolean),n=>id(one(n,'a','PartyIdentification')),'organization');
  const resultList=kids(result,'e','LotResult');
  const lookup=(map,key,label)=>{const n=map.get(key);if(!n)warnings.push('Unresolved '+label+' reference: '+(key||'(empty)'));return n;};
  index(resultList,id,'result');
  for(const r of resultList){
    const resultID=id(r), lotID=id(one(r,'e','TenderLot')), status=val(r,'b','TenderResultCode');
    if(!lotID)warnings.push(resultID+': no lot reference.');
    const refs=kids(r,'e','LotTender');
    if(!refs.length)warnings.push(resultID+': no tender references; no tenderer inferred.');
    if(status!=='selec-w')warnings.push(resultID+': result status '+(status||'missing')+'; referenced tenderers must not be treated as winners.');
    const contractRefs=kids(r,'e','SettledContract').map(id);
    for(const c of contractRefs)lookup(contracts,c,'contract');
    for(const ref of refs){
      const tenderID=id(ref);const tender=lookup(tenders,tenderID,'tender');if(!tender)continue;
      const partyRefs=kids(tender,'e','TenderingParty');
      if(!partyRefs.length)warnings.push(tenderID+': no tendering party reference.');
      for(const pr of partyRefs){
        const partyID=id(pr),party=lookup(parties,partyID,'party');if(!party)continue;
        const members=kids(party,'e','Tenderer');
        if(!members.length)warnings.push(partyID+': no Tenderer references.');
        const contractIDs=contractRefs.filter(cid=>kids(contracts.get(cid),'e','LotTender').some(t=>id(t)===tenderID));
        for(const member of members){
          const organizationID=id(member),org=lookup(orgs,organizationID,'organization');
          const organizationName=org?kids(org,'a','PartyName').map(n=>val(n,'b','Name')).filter(Boolean).join(' / '):'';
          if(org&&!organizationName)warnings.push(organizationID+': organization name is absent.');
          rows.push({resultID,lotID,status,tenderID,tenderLotID:id(one(tender,'e','TenderLot')),partyID,organizationID,organizationName,contractIDs,resolved:!!org});
        }
      }
    }
  }
  if(!resultList.length)warnings.push('No LotResult elements found; no mapping was inferred.');
  return {version,resultCount:resultList.length,rows,warnings:[...new Set(warnings)],notice:'Reference traversal only; not a schema validator or legal determination of award. Subcontractors are excluded.'};
}
