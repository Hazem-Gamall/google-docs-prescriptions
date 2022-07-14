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

import {insertTable, insertText, alignment, direction} from './modules/doc_update_utils.js'

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
    let gender_line = {};
    gender_line.text = `${gender} / ${name}\n`;
    gender_line.startIndex = last_index + 1
    gender_line.endIndex = gender_line.startIndex + gender_line.text.length

    let date_line = {}
    date_line.text = `${date}\n`
    date_line.startIndex = gender_line.endIndex + 1
    date_line.endIndex = date_line.startIndex + date_line.text.length

    let diagnosis_line = {}
    diagnosis_line.text = `Diagnosis: ${diagnosis}\n`
    diagnosis_line.startIndex = date_line.endIndex
    diagnosis_line.endIndex = diagnosis_line.startIndex + diagnosis_line.text.length

    let monthly_med_line = {}
    monthly_med_line.text = 'علاج شهري\n';
    monthly_med_line.startIndex = diagnosis_line.endIndex
    monthly_med_line.endIndex = monthly_med_line.startIndex + monthly_med_line.text.length

    let monthly_med_table = {}
    monthly_med_table.col1 = monthly_med
    monthly_med_table.col2 = monthly_med_freq
    monthly_med_table.startIndex = monthly_med_line.endIndex


    console.log('gender line', gender_line)
    console.log('date line', date_line)
    console.log('diagnosis line', diagnosis_line);
    console.log('monthly med table', monthly_med_table);

    let edits = [
        {
            updateDocumentStyle: {
                documentStyle: {
                    pageSize: {
                        height: {
                            magnitude: 595.2755905511812,
                            unit: "PT"
                        },
                        width: {
                            magnitude: 419.52755905511816,
                            unit: "PT"
                        }
                    },
                    marginTop: {
                        magnitude: 70.56,
                        unit: "PT"
                    },
                    marginBottom: {
                        magnitude: 72,
                        unit: "PT"
                    },
                    marginRight: {
                        magnitude: 56.88,
                        unit: "PT"
                    },
                    marginLeft: {
                        magnitude: 56.88,
                        unit: "PT"
                    }
                },
                fields: "pageSize,marginTop,marginBottom,marginRight,marginLeft"

            }
        },

        {
            insertPageBreak: {
                location: {
                    index: last_index
                }
            }
        },

        {
            insertText: {
                text: gender_line.text,
                location: {
                    index: gender_line.startIndex, // Modified
                },
            }

        },

        {
            updateParagraphStyle: {
                paragraphStyle: {
                    direction: "RIGHT_TO_LEFT",
                    alignment: "CENTER"
                },
                fields: "direction, alignment",
                range: {
                    startIndex: gender_line.startIndex,
                    endIndex: gender_line.endIndex
                }
            }
        },
        {
            updateTextStyle: {
                textStyle: {
                    bold: true,
                    fontSize: {
                        magnitude: 12.0,
                        unit: "PT"
                    }
                },
                fields: "bold,fontSize",
                range: {
                    startIndex: gender_line.startIndex,
                    endIndex: gender_line.endIndex
                }
            }
        },

        {
            insertText: {
                text: date_line.text,
                location: {
                    index: date_line.startIndex, // Modified
                },
            },
        },

        {
            updateParagraphStyle: {
                paragraphStyle: {
                    namedStyleType: "HEADING_2",
                    direction: "RIGHT_TO_LEFT",
                    alignment: "START"
                },
                fields: "namedStyleType, direction, alignment",
                range: {
                    startIndex: date_line.startIndex,
                    endIndex: date_line.endIndex
                }
            }
        },

        {
            updateTextStyle: {
                textStyle: {
                    bold: true,
                    fontSize: {
                        magnitude: 12.0,
                        unit: "PT"
                    },
                    weightedFontFamily: {
                        fontFamily: "Times New Roman"
                    },
                    backgroundColor: {
                        color: {
                            rgbColor: {
                                red: 255,
                                green: 255,
                                blue: 255
                            }
                        }
                    }
                },
                fields: "bold, weightedFontFamily, fontSize",
                range: {
                    startIndex: date_line.startIndex,
                    endIndex: date_line.endIndex
                }
            }

        },
        {
            insertText: {
                text: diagnosis_line.text,
                location: {
                    index: diagnosis_line.startIndex, // Modified
                },
            }

        },

        {
            updateTextStyle: {
                textStyle: {
                    fontSize: {
                        magnitude: 12.0,
                        unit: "PT"
                    },
                    weightedFontFamily: {
                        fontFamily: "Times New Roman"
                    }
                },
                fields: "fontSize, weightedFontFamily",
                range: {
                    startIndex: diagnosis_line.startIndex,
                    endIndex: diagnosis_line.endIndex
                }
            }

        },

        {
            updateParagraphStyle: {
                paragraphStyle: {
                    alignment: "CENTER"
                },
                fields: "alignment",
                range: {
                    startIndex: diagnosis_line.startIndex,
                    endIndex: diagnosis_line.endIndex
                }
            }
        },

        {
            insertText: {
                text: monthly_med_line.text,
                location: {
                    index: monthly_med_line.startIndex, // Modified
                },
            }
        },

        {
            updateParagraphStyle: {
                paragraphStyle: {
                    alignment: "START",
                    direction: "RIGHT_TO_LEFT",

                },
                fields: "alignment, direction",
                range: {
                    startIndex: monthly_med_line.startIndex,
                    endIndex: monthly_med_line.endIndex
                }
            }
        },

        {
            updateTextStyle: {
                textStyle: {
                    bold: true,
                    underline: true,
                    fontSize: {
                        magnitude: 12.0,
                        unit: "PT"
                    },
                    weightedFontFamily: {
                        fontFamily: "Times New Roman"
                    }
                },
                fields: "fontSize, weightedFontFamily, bold, underline",
                range: {
                    startIndex: monthly_med_line.startIndex,
                    endIndex: monthly_med_line.endIndex
                }
            }

        },

    ]
    let table_arr,curr_index
    ({table_arr, curr_index} = insertTable(monthly_med_table))
    edits = edits.concat(table_arr);
    console.log(curr_index)

    let text_ob = insertText({startIndex:curr_index+2,text:'علاج مؤقت\n'}, {bold:true, underline:true, alignment:alignment.start, direction:direction.right_to_left})

    edits = edits.concat(text_ob.text_arr);

    let temp_med_table = {}
    temp_med_table.col1 = temp_med
    temp_med_table.col2 = temp_med_freq
    temp_med_table.startIndex = text_ob.curr_index

    

    let ob = insertTable(temp_med_table);
    edits = edits.concat(ob.table_arr);
    console.log(ob.curr_index)
    console.log(ob.table_arr)

    text_ob = insertText({startIndex:ob.curr_index+2,text:'المطلوب:\n\nالتحاليل الاتية:\n'}, {bold:true, underline:true, alignment:alignment.start, direction:direction.right_to_left})

    edits = edits.concat(text_ob.text_arr);

    let required_tests_table = {}
    required_tests_table.col1 = required_tests.slice(0,required_tests.length/2)
    required_tests_table.col2 = required_tests.slice(required_tests.length/2)
    required_tests_table.startIndex = text_ob.curr_index

    ob = insertTable(required_tests_table);
    edits = edits.concat(ob.table_arr);
    console.log(ob.curr_index)
    console.log(ob.table_arr)

    text_ob = insertText({startIndex:ob.curr_index+2,text:'الاشعات الاتية:\n'}, {bold:true, underline:true, alignment:alignment.start, direction:direction.right_to_left})
    edits = edits.concat(text_ob.text_arr);


    let required_scans_table = {}
    required_scans_table.col1 = required_scans
    required_scans_table.col2 = required_scans_arabic
    required_scans_table.startIndex = text_ob.curr_index

    ob = insertTable(required_scans_table);
    edits = edits.concat(ob.table_arr);
    console.log(ob.curr_index)
    console.log(ob.table_arr)


    text_ob = insertText({startIndex:ob.curr_index+2,text:'ملاحظات:\n'}, {bold:true, underline:true, alignment:alignment.start, direction:direction.right_to_left})

    edits = edits.concat(text_ob.text_arr);

    text_ob = insertText({startIndex:text_ob.curr_index,text:notes}, {direction:direction.right_to_left, alignment:alignment.start})

    edits = edits.concat(text_ob.text_arr);

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