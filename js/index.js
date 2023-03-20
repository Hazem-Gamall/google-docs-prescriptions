import { DocHandler } from './modules/doc_update_utils.js'
import { handleAuthClick } from './auth.js';
document.querySelector('#file-name').addEventListener('input', async function () {
    console.log(this.value)
    let files;
    try {
        files = await listFiles(this.value, 'name', 5);
    }catch(e){
        if(e.status == 401 || e.status == 403){
            handleAuthClick();
        }
    }
    console.log('files', files)
    let file_search_list = document.querySelector('#file-search-list')
    file_search_list.innerHTML = ''
    if (files !== false)
        files.forEach((file) => file_search_list.innerHTML += `<option value="${file.name}"></option>`)

})


document.querySelector('#dialog-ok').onclick = beginDocCreation;

let dialog = document.querySelector('dialog');
async function beginDocCreation() {

    dialog.querySelector('.container').innerHTML = '<p>Loading...</p>'
    let documentId = await createDoc(document.querySelector('#file-name').value);
    let doc_handler = new DocHandler()
    await editDoc(documentId, [doc_handler.updateDocumentStyle()]);
    closeDialog();
    moveToFileEdit(documentId, true);
}

function openDialog() {
    dialog.showModal();
}
function closeDialog() {
    dialog.close();
}

function moveToFileEdit(documentId, newDoc) {
    let params = new URLSearchParams(`file_id=${documentId}`);
    if (newDoc)
        params.set('new_doc', true);
    // console.log('params get', params.get('file_id'))
    console.log('params', params.toString());
    let new_url = new URL(`${location.origin}/file_edit.html`);
    new_url.search = params.toString();
    // console.log('new url', new_url)
    // console.log('new url string', new_url.toString())
    location.href = new_url;
}


document.querySelectorAll('.close-dialog').forEach((btn) => btn.onclick = closeDialog)

document.querySelector('#file-name-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    let checkListFilesResult = (documentId) => {
        console.log('doc id', documentId)
        if(documentId === false){
            openDialog();
        }else{
            let id = documentId[0].id
            console.log('id', id)
            moveToFileEdit(id);
        }
        
    }
    let file_name = document.querySelector('#file-name').value
    try {
        checkListFilesResult(await listFiles(file_name, 'id', 1))

    } catch (e) {
        if (e.status == 401 || e.status == 403) {
            await handleAuthClick(async () => {
                checkListFilesResult(await listFiles(file_name, 'id', 1))
            });
        }
        console.log(e)

    }
})