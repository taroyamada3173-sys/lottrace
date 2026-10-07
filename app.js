import {traceXML} from './trace.js';
const $=s=>document.querySelector(s);let current;
function render(){
  $('#error').textContent=''; $('#results').replaceChildren();$('#warnings').replaceChildren();current=null;$('#export').disabled=true;
  try{
    const out=traceXML($('#xml').value);current=out;$('#export').disabled=false;
    $('#summary').textContent=`${out.resultCount} lot results · ${out.rows.length} tenderer links · ${out.version || 'unknown version'}`;
    for(const row of out.rows){const tr=document.createElement('tr');
      for(const [value,mono] of [[row.lotID,true],[row.organizationName||'Unresolved organization',false],[row.status,true],[row.contractIDs.join(', ')||'No contract link',true]]){const td=document.createElement('td');td.textContent=value;if(mono)td.className='mono';tr.append(td);}
      const td=document.createElement('td'),details=document.createElement('details'),s=document.createElement('summary'),pre=document.createElement('pre');s.textContent='Trace IDs';pre.textContent=`${row.resultID}\n  → ${row.tenderID}\n  → ${row.partyID}\n  → ${row.organizationID}\nTender lot: ${row.tenderLotID||'absent'}\nResolved: ${row.resolved}`;details.append(s,pre);td.append(details);tr.append(td);$('#results').append(tr);}
    if(!out.rows.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=5;td.textContent='No tenderer links could be resolved from this notice.';tr.append(td);$('#results').append(tr);}
    for(const w of out.warnings){const li=document.createElement('li');li.textContent=w;$('#warnings').append(li);}$('#warnings').hidden=!out.warnings.length;
  }catch(e){$('#error').textContent=e.message;$('#summary').textContent='No result exported. Correct the XML or choose the example.';}
}
async function sample(){try{$('#xml').value=await(await fetch('./sample.xml')).text();$('#source-label').textContent='Synthetic example · three lot results, one consortium, one missing organization';render();}catch{$('#error').textContent='The example could not be loaded.';}}
$('#run').addEventListener('click',render);$('#sample').addEventListener('click',sample);
$('#file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;if(f.size>2_000_000){$('#error').textContent='This demo accepts XML up to 2 MB.';return;}$('#xml').value=await f.text();$('#source-label').textContent='Your file · processed in this browser only';render();});
$('#clear').addEventListener('click',()=>{$('#xml').value='';$('#results').replaceChildren();$('#warnings').replaceChildren();$('#warnings').hidden=true;$('#error').textContent='';$('#summary').textContent='Input cleared.';$('#source-label').textContent='Paste XML or choose a local file';current=null;$('#export').disabled=true;$('#file').value='';});
$('#export').addEventListener('click',()=>{if(!current)return;const u=URL.createObjectURL(new Blob([JSON.stringify(current,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='lottrace-results.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
sample();
