console.log(location.search)
let url_params = new URLSearchParams(location.search)
let file_id = url_params.get('file_id')
if (file_id) {
    console.log('file_id', file_id)
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

document.querySelectorAll('table').forEach((table) => addTableRow(table.id))
document.body.append(scans_datalist);

function getFormData(e) {
    e.preventDefault();

    let gender = this.elements['gender'].value
    let name = this.elements['name'].value
    let date = this.elements['date'].value
    let diagnosis = this.elements['diagnosis'].value
    let file_id = this.elements['file_id'].value
    let notes = this.elements['notes'].value

    let monthly_med_arr = Array.from(this.elements['monthly-med'], (element) => element.value);
    console.log('monhtly med arr', monthly_med_arr)
    let monthly_med = monthly_med_arr.length ? monthly_med_arr : [this.elements['monthly-med'].value]

    let monthly_med_freq_arr = Array.from(this.elements['monthly-med-freq'], (element) => element.value)
    let monthly_med_freq = monthly_med_freq_arr.length ? monthly_med_freq_arr : [this.elements['monthly-med-freq'].value]
    let temp_med_arr = Array.from(this.elements['temp-med'], (element) => element.value)
    let temp_med = temp_med_arr.length ? temp_med_arr : [this.elements['temp-med'].value]

    let temp_med_freq_arr = Array.from(this.elements['temp-med-freq'], (element) => element.value)
    let temp_med_freq = temp_med_freq_arr.length ? temp_med_freq_arr : [this.elements['temp-med-freq'].value]
    let required_tests_arr = Array.from(this.elements['required-tests'], (element) => element.value)
    let required_tests = required_tests_arr.length ? required_tests_arr : [this.elements['required-tests'].value]

    let required_scans_array = Array.from(this.elements['required-scans'], (element) => element.value)
    let required_scans = required_scans_array.length ? required_scans_array : [this.elements['required-scans'].value]
    let required_scans_arabic_arr = Array.from(this.elements['required-scans-ar'], (element) => element.value)
    let required_scans_arabic = required_scans_arabic_arr.length ? required_scans_arabic_arr : [this.elements['required-scans-ar'].value]

    let ob = {
        gender, name, date, diagnosis,
        monthly_med, monthly_med_freq,
        temp_med, temp_med_freq, notes,
        required_tests, file_id,
        required_scans, required_scans_arabic
    }


    for (const field in ob) {
        console.log(field, ob[field])
    }

    prepareDocumentEdits(ob);


}


document.querySelector('form').onsubmit = getFormData

import {insertTable, insertText, insertPageBreak, alignment, direction, namedStyleType, DocHandler} from './modules/doc_update_utils.js'

async function prepareDocumentEdits(fields) {
    let {
        gender, name, date, diagnosis,
        monthly_med, monthly_med_freq,
        temp_med, temp_med_freq, notes,
        required_tests, file_id,
        required_scans, required_scans_arabic
    } = fields
    let last_index = await getDocLastIndex(file_id)
    
    date = date.replaceAll('-', '/');

    let edits = []
    let index;
    let doc_handler = new DocHandler(1);
    console.log('doc_handler', doc_handler)
    let text_ob;
    edits = edits.concat(
        insertPageBreak(last_index),

        );

    text_ob = insertText({startIndex:last_index+1,text:`${gender} / ${name}\n`}, {bold:true, alignment:alignment.center, direction:direction.right_to_left});
    edits.push(...text_ob.text_arr);

    text_ob = insertText({startIndex:text_ob.curr_index, text:`${date}\n`}, {bold:true, direction:direction.right_to_left, alignment:alignment.start, namedStyleType:namedStyleType.heading_2});
    edits.push(...text_ob.text_arr);

    text_ob = insertText({startIndex:text_ob.curr_index,text:`Diagnosis: ${diagnosis}\n`}, {alignment:alignment.center, direction:direction.left_to_right})
    edits.push(...text_ob.text_arr);

    text_ob = insertText({startIndex:text_ob.curr_index,text:'\nعلاج شهري'}, {bold:true, underline:true, alignment:alignment.start, direction:direction.right_to_left})
    edits.push(...text_ob.text_arr);


    let table_arr,curr_index
    ({table_arr, curr_index} = insertTable({col1:monthly_med, col2:monthly_med_freq, startIndex:text_ob.curr_index}))
    edits.push(...table_arr);
    

    text_ob = insertText({startIndex:curr_index+2,text:'\nعلاج مؤقت'}, {bold:true, underline:true, alignment:alignment.start, direction:direction.right_to_left})

    edits.push(...text_ob.text_arr);


    let ob = insertTable({col1:temp_med, col2:temp_med_freq, startIndex:text_ob.curr_index});
    edits.push(...ob.table_arr);

    text_ob = insertText({startIndex:ob.curr_index+2,text:'\nالمطلوب:\n\nالتحاليل الاتية:'}, {bold:true, underline:true, alignment:alignment.start, direction:direction.right_to_left})

    edits.push(...text_ob.text_arr);

    ob = insertTable({col1:required_tests.slice(0,required_tests.length/2), col2:required_tests.slice(required_tests.length/2), startIndex:text_ob.curr_index});
    edits.push(...ob.table_arr);

    text_ob = insertText({startIndex:ob.curr_index+2,text:'\nالاشعات الاتية:'}, {bold:true, underline:true, alignment:alignment.start, direction:direction.right_to_left})
    edits.push(...text_ob.text_arr);


    ob = insertTable({col1:required_scans, col2:required_scans_arabic, startIndex:text_ob.curr_index});
    edits.push(...ob.table_arr);

    text_ob = insertText({startIndex:ob.curr_index+2,text:'\nملاحظات:\n'}, {bold:true, underline:true, alignment:alignment.start, direction:direction.right_to_left})

    edits.push(...text_ob.text_arr);

    text_ob = insertText({startIndex:text_ob.curr_index,text:notes}, {direction:direction.right_to_left, alignment:alignment.start})

    edits.push(...text_ob.text_arr);
    console.log(edits)
    editDoc(file_id, edits)


    console.log('last_index', last_index);


}

function getInputFieldData(table_id) {

    let list_id1, list_id2
    let name1, name2;

    switch (table_id) {
        case "monthly-med":
            list_id1 = 'monthly-med-list'
            list_id2 = 'monthly-med-freq-list'
            name1 = `monthly-med`
            name2 = `monthly-med-freq`
            break;
        case "temp-med":
            list_id1 = 'temp-med-list'
            list_id2 = 'temp-med-freq-list'
            name1 = 'temp-med'
            name2 = 'temp-med-freq'
            break;

        case "required-tests":
            list_id1 = list_id2 = 'required-tests-list'
            name1 = name2 = 'required-tests'
            break;
        case "required-scans":
            list_id1 = 'required-scans-list'
            name1 = 'required-scans'
            name2 = 'required-scans-ar'
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