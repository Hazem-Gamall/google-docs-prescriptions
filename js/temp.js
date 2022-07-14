function getFormData(e) {
    e.preventDefault();
    {
        gender: this.elements['gender'].value
        name: this.elements['name'].value
        date: this.elements['date'].value
        diagnosis: this.elements['diagnosis'].value
        monthly_med: Array.from(this.elements['monthly-med']).map((element) => element.value)
        monthly_med_freq: Array.from(this.elements['monthly-med-freq']).map((element) => element.value)
        temp_med: Array.from(this.elements['temp-med']).map((element) => element.value)
        temp_med_freq: Array.from(this.elements['temp-med-freq']).map((element) => element.value)
        required_tests: Array.from(this.elements['required-tests']).map((element) => element.value)
        required_scans: Array.from(this.elements['required-scans']).map((element) => element.value)
        required_scans_ar: Array.from(this.elements['required-scans-ar']).map((element) => element.value)
    }
}

function getFormData(e) {
    e.preventDefault();

    let gender = this.elements['gender'].value
    let name = this.elements['name'].value
    let date = this.elements['date'].value
    let diagnosis = this.elements['diagnosis'].value
    let monthly_med = Array.from(this.elements['monthly-med']).map((element) => element.value)
    let monthly_med_freq = Array.from(this.elements['monthly-med-freq']).map((element) => element.value)
    let temp_med = Array.from(this.elements['temp-med']).map((element) => element.value)
    let temp_med_freq = Array.from(this.elements['temp-med-freq']).map((element) => element.value)
    let required_tests = Array.from(this.elements['required-tests']).map((element) => element.value)
    let required_scans = Array.from(this.elements['required-scans']).map((element) => element.value)
    let required_scans_ar = Array.from(this.elements['required-scans-ar']).map((element) => element.value)



}
//first row
//first cell = table_index + 4
//second cell = first cell + first_cell_size + 2 
//second row
//first cell = r1_second_cell + r1_second_cell_size + 3
//second cell = first_cell + first_cell_size + 2

/*
{
    col1:[],
    col2:[]
}
*/
function insertTable( {col1, col2, startIndex}) {

    let table_arr = []
    table_arr.push(
        {
            insertTable: {
                rows: col1.length,
                columns: 2,
                location: {
                    index: startIndex
                },

            }
        },
    )

    let curr_index = startIndex
    for(let i  = 0; i < col1.length; i++){
        curr_index += i==0?4:3;
        table_arr.push(
            {
                insertText: {
                    text: col1[i],
                    location: {
                        index: curr_index, // Modified
                    },
                }
            },
        )

        curr_index += col1[i].length + 2

        table_arr.push(
            {
                insertText: {
                    text: col2[i],
                    location: {
                        index: curr_index, // Modified
                    },
                }
            },
        )
        curr_index += col2[i].length

    }
    curr_index+=5

    return {table_arr,curr_index};
}

[
    {
        insertText: {
            text: "gamed gedan",
            location: {
                index: monthly_med_table.startIndex + 4, // Modified
            },
        }
    },
    {
        insertText: {
            text: "gamed gedan",
            location: {
                index: monthly_med_table.startIndex + 4 + 2 + "gamed gedan".length, // Modified
            },
        }
    },
    {
        insertText: {
            text: "gamed",
            location: {
                index: monthly_med_table.startIndex + 4 + 2 + ("gamed gedan".length * 2) + 3, // Modified
            },
        }
    },

    {
        insertText: {
            text: "gamed",
            location: {
                index: monthly_med_table.startIndex + 4 + 2 + ("gamed gedan".length * 2) + 3 + "gamed".length + 2, // Modified
            },
        }
    },
    {
        insertText: {
            text: "gamed",
            location: {
                index: monthly_med_table.startIndex + 4 + 2 + ("gamed gedan".length * 2) + 3 + ("gamed".length * 2) + 2 + 3, // Modified
            },
        }
    },
]