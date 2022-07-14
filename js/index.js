


let dialog = document.querySelector('dialog');
async function beginDocCreation() {
    dialog.querySelector('.container').innerHTML = '<p>Loading...</p>'
    let documentId = await createDoc(document.querySelector('#file-name').value);
    closeDialog();
    moveToFileEdit(documentId);
}

function openDialog(){
    dialog.showModal();
}
function closeDialog() {
    dialog.close();
}

function moveToFileEdit(documentId){
    let params = new URLSearchParams(`file_id=${documentId}`);
    params.set('token', JSON.stringify(gapi.client.getToken()))
    // console.log('params get', params.get('file_id'))
    console.log('params', params.toString());
    let new_url = new URL(`${location.origin}/file_edit.html`);
    new_url.search = params.toString();
    // console.log('new url', new_url)
    // console.log('new url string', new_url.toString())
    location.href = new_url;
}

document.querySelectorAll('.close-dialog').forEach((btn)=>btn.onclick=closeDialog)

document.querySelector('#file-name-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    let checkListFilesResult = (documentId) => {
        if(!documentId){
            openDialog();
        }else{
            moveToFileEdit(documentId);
        }
    }
    let file_name = document.querySelector('#file-name').value
    try {
        checkListFilesResult(await listFiles(file_name))
        
    } catch (e) {
        await handleAuthClick(async () => {
            checkListFilesResult(await listFiles(file_name))
        });

    }
})
