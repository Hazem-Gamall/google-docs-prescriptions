console.log(location.search)
let url_params = new URLSearchParams(location.search)
let file_id = url_params.get('file_id')
if (file_id) {
    console.log('file_id', file_id)


    // console.log('hello document');
    document.querySelector('[name="name"]').onclick = async function () {
        let { name: file_name } = await getFile(file_id, 'name');
        console.log('file_name', file_name)
        this.value = file_name
    }


    let file_id_input = document.createElement('input');

    file_id_input.name = 'file_id'
    file_id_input.value = file_id
    file_id_input.hidden = true
    document.querySelector('form').append(file_id_input)

}

var scans_lookup = {
    "Echo": "إیكو على القلب",
    "ECG": "رسم قلب عادى",
    "Ex-ECG": "رسم قلب بالمجھود",
    "TEE": "إیكو على القلب بالمنظار"
}
let scans_datalist = document.createElement('datalist');
scans_datalist.id = 'required-scans-list'
Object.keys(scans_lookup).forEach((scan) => {
    let option = document.createElement('option')
    option.value = scan
    scans_datalist.append(option)
})

// document.querySelectorAll('table').forEach((table) => addTableRow(table.id))
document.body.append(scans_datalist);

let dialog = document.querySelector('dialog');

document.querySelectorAll('.close-dialog').forEach((btn) => btn.onclick = closeDialog)


function openDialog() {
    dialog.showModal();
}
function closeDialog() {
    dialog.close();
}

function editDialog(header, html) {
    document.querySelector('#dialog-header').textContent = header
    document.querySelector('#dialog-text').innerHTML = html
}



async function getFormData(e) {
    e.preventDefault();

    let form_data = {
        text: {
            date: "", diagnosis: "",
            file_id: "", gender: "",
            name: "", notes: "",
        },
        arrays: {
            monthly_med: "", monthly_med_freq: "",
            required_scans: "", required_scans_ar: "",
            temp_med: "", temp_med_freq: "",
            required_tests: "",
        }
    }

    console.log('form elements', this.elements)
    const elements = this.elements
    for (const name in form_data.text) {
        console.log('name:', name)
        console.log('value:', elements[name].value)
        form_data.text[name] = elements[name].value || ' '
    }
    for (const name in form_data.arrays) {
        const element = elements[name]
        console.log('name:', name)
        console.log('array:', elements[name])
        form_data.arrays[name] = element && (element.length ? Array.from(element, (el) => el.value) : [element.value])
    }

    console.log('form data after loops', form_data)

    openDialog();
    editDialog("", "Loading...")
    try {
        await prepareDocumentEdits(form_data);
        editDialog("Document", `<iframe width="800" height="1000" src=https://docs.google.com/document/d/${file_id}></iframe>`)

    } catch (e) {
        console.log(e)
        if (e.status === 401 || e.status === 403) {
            handleAuthClick(async () => {
                console.log('de7kawy')
                await prepareDocumentEdits(form_data);
                editDialog("Document", `<iframe width="800" height="1000" src=https://docs.google.com/document/d/${file_id}></iframe>`)
            }
            );

        } else {
            console.log('error', e)
            editDialog("Error", e.result.error.message)
        }
    }


}



document.querySelector('form').onsubmit = getFormData

import { alignment, direction, namedStyleType, DocHandler } from './modules/doc_update_utils.js'

async function prepareDocumentEdits(form_data) {
    let { monthly_med, monthly_med_freq,
        required_scans, required_scans_ar: required_scans_arabic,
        temp_med, temp_med_freq,
        required_tests } = form_data.arrays

    let { date, diagnosis,
        file_id, gender,
        name, notes } = form_data.text
    let last_index = await getDocLastIndex(file_id)


    date = date.replaceAll('-', '/');


    let doc_handler = new DocHandler(last_index);
    let reduce_counter = 1
    let required_tests_string = required_tests.reduce(
        (test_string, curr_test) => test_string + `   ${curr_test}`)

    let edits = [].concat(
        doc_handler.insertPageBreak(),
        doc_handler.insertText(`${gender} / ${name}\n`, { bold: true, alignment: alignment.center, direction: direction.right_to_left }),
        doc_handler.insertText(`${date}\n`, { bold: true, direction: direction.right_to_left, alignment: alignment.start, namedStyleType: namedStyleType.heading_2 }),
        doc_handler.insertText(`Diagnosis: ${diagnosis}\n`, { alignment: alignment.center, direction: direction.left_to_right }),
        monthly_med && doc_handler.insertText('\nعلاج شهري', { bold: true, underline: true, alignment: alignment.start, direction: direction.right_to_left }),
        monthly_med && doc_handler.insertTable({ col1: monthly_med, col2: monthly_med_freq }),
        temp_med && doc_handler.insertText('\nعلاج مؤقت', { bold: true, underline: true, alignment: alignment.start, direction: direction.right_to_left }),
        temp_med && doc_handler.insertTable({ col1: temp_med, col2: temp_med_freq }),
        (required_tests || required_scans) && doc_handler.insertText('\nالمطلوب:', { bold: true, underline: true, alignment: alignment.start, direction: direction.right_to_left }),
        required_tests && doc_handler.insertText('\nالتحاليل الاتية:\n', { bold: true, underline: true, alignment: alignment.start, direction: direction.right_to_left }),
        required_tests && doc_handler.insertText(required_tests_string + '\n', { alignment: alignment.start, direction: direction.left_to_right }),
        // required_tests && doc_handler.insertTable({ col1: required_tests.slice(0, required_tests.length / 2), col2: required_tests.slice(required_tests.length / 2) }),
        required_scans && doc_handler.insertText('\nالاشعات الاتية:\n', { bold: true, underline: true, alignment: alignment.start, direction: direction.right_to_left }),
        required_scans && doc_handler.insertTable({ col1: required_scans, col2: required_scans_arabic }),
        doc_handler.insertText('\nملاحظات:\n', { bold: true, underline: true, alignment: alignment.start, direction: direction.right_to_left }),
        doc_handler.insertText(notes, { direction: direction.right_to_left, alignment: alignment.start })
    )

    console.log('edits', edits)
    await editDoc(file_id, edits)


    console.log('last_index', last_index);


}

function getInputFieldData(table_id) {

    let list_id1, list_id2
    let name1, name2;

    switch (table_id) {
        case "monthly-med":
            list_id1 = 'monthly-med-list'
            list_id2 = 'monthly-med-freq-list'
            name1 = `monthly_med`
            name2 = `monthly_med_freq`
            break;
        case "temp-med":
            list_id1 = 'temp-med-list'
            list_id2 = 'temp-med-freq-list'
            name1 = 'temp_med'
            name2 = 'temp_med_freq'
            break;

        case "required-tests":
            list_id1 = list_id2 = 'required-tests-list'
            name1 = name2 = 'required_tests'
            break;
        case "required-scans":
            list_id1 = 'required-scans-list'
            name1 = 'required_scans'
            name2 = 'required_scans_ar'
            break;

    }

    return { name1, name2, list_id1, list_id2 };
}

function addTableRow(table_id) {
    let table = document.getElementById(table_id);
    var row = table.insertRow(-1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    let { list_id1, list_id2, name1, name2 } = getInputFieldData(table_id)
    let num_of_rows = table.rows.length

    cell1.innerHTML = `<input name="${name1}" class="form-control" type="search" list="${list_id1}">`;
    cell2.innerHTML = `<input name="${name2}" class="form-control ar-input" type="search" list="${list_id2}">`;
    if (table_id === 'required-scans') {
        requiredScanCellLookup(cell1, cell2);
    }
}

function requiredScanCellLookup(cell1, cell2) {
    let cell1_input = cell1.querySelector('input');
    let cell2_input = cell2.querySelector('input');
    cell1_input.addEventListener('input', () => {
        if (scans_lookup[cell1_input.value]) {
            console.log('input value', cell1_input.value)
            console.log('lookup value', scans_lookup[cell1_input.value]);
            cell2_input.value = scans_lookup[cell1_input.value]
        }
    })
}


function removeTableRow(table_id) {
    let table = document.getElementById(table_id);
    table.deleteRow(-1)
}

document.querySelectorAll('.add-row-btn').forEach((btn) => {
    let table_id = btn.attributes.getNamedItem('table-id').value;
    btn.addEventListener('click', () => addTableRow(table_id))
})

document.querySelectorAll('.remove-row-btn').forEach((btn) => {
    console.log('btn')
    let table_id = btn.attributes.getNamedItem('table-id').value;
    btn.addEventListener('click', () => removeTableRow(table_id))
})