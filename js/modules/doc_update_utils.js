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

    return {table_arr,curr_index};
}


const alignment = {
    start:"START",
    center:"CENTER",
    end:"END",
    justified:"JUSTIFIED"
}

const direction = {
    left_to_right:"LEFT_TO_RIGHT",
    right_to_left:"RIGHT_TO_LEFT"
}


function insertText({startIndex, text},{alignment, direction, bold, underline}){
    let text_arr = [   {
        insertText: {
            text: text,
            location: {
                index: startIndex, // Modified
            },
        }
    },

    {
        updateParagraphStyle: {
            paragraphStyle: {
                alignment: alignment,
                direction: direction,

            },
            fields: "alignment, direction",
            range: {
                startIndex: startIndex,
                endIndex: startIndex + text.length
            }
        }
    },

    {
        updateTextStyle: {
            textStyle: {
                bold: bold,
                underline: underline,
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
                startIndex: startIndex,
                endIndex: startIndex + text.length
            }
        }

    }]


    return {text_arr,curr_index:startIndex + text.length};

}

export {insertTable, insertText, alignment, direction}