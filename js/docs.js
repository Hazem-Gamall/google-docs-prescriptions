
/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 */
async function listFiles(file_name) {
    let response;
    console.log('before response')
    response = await gapi.client.drive.files.list({
        'fields': 'files(id)',
        'q': `name="${file_name}"`
    });
    console.log('response success', response)

    const files = response.result.files;
    if (!files || files.length == 0) {
        return false;
    }
    const output = files.reduce(
        (str, file) => `${str}${file.name} (${file.id}\n`,
        'Files:\n');
    const file_id = files[0].id
    document.getElementById('content').innerText = file_id;
    return file_id;
}


async function createDoc(doc_name) {
    let response = await gapi.client.docs.documents.create(
        {
            title: doc_name,

        }
    );
    console.log(response);
    if (response.error !== undefined) {
        throw (response);
    }
    let documentId = response.result.documentId;
    console.log(documentId);
    return documentId;
}

async function getDoc(doc_id) {
    let response = await gapi.client.docs.documents.get({
        documentId: doc_id
    })
    return response.result
}

async function getDocLastIndex(doc_id) {
    let doc = await getDoc(doc_id);
    console.log('doc', doc)
    console.log('last content', doc.body.content.at(-1));
    let body_end_index = doc.body.content.at(-1).endIndex - 1
    console.log(body_end_index)
    return body_end_index;
}

async function editDoc(doc_id, edits) {
    console.log('edits', edits)
    try {
        let response = await gapi.client.docs.documents.batchUpdate(
            {
                documentId: doc_id,
                resource:{
                    requests: edits
                }

            }
        )
        console.log('batchUpdate success', response)
    } catch (e) {
        console.log('batchUpdate error', e)
    }
}


async function printDocTitle(doc_id) {
    try {
        const response = await gapi.client.docs.documents.get({
            documentId: doc_id,
        });
        const doc = response.result;
        const output = `Document ${doc.title} successfully found.\n`;
        console.log(doc)
        document.getElementById('content').innerText = output;
    } catch (err) {
        if (err.status == 401 || err.status == 403) {
            handleAuthClick(authCallback);
            return;
        }
    }
}