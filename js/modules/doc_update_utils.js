function DocHandler(index){
    this.curr_index = index
    this.insertTable = insertTable
    this.insertPageBreak = insertPageBreak
    this.insertText = insertText
    this.updateDocumentStyle = updateDocumentStyle
}


function insertTable({ col1, col2, startIndex }) {
    console.log('col1', col1)
    console.log('col2', col2)
    console.log('startIndex', startIndex)

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
    for (let i = 0; i < col1.length; i++) {
        curr_index += i == 0 ? 4 : 3;
        table_arr = table_arr.concat(
            insertText({ startIndex: curr_index, text: col1[i] }, { bold: false, underline: false }).text_arr
        )

        curr_index += col1[i].length + 2

        table_arr = table_arr.concat(
            insertText({ startIndex: curr_index, text: col2[i] }, { bold: false, underline: false }).text_arr
        )
        curr_index += col2[i].length

    }
    // console.log('table arr', table_arr)
    return { table_arr, curr_index };
}


const alignment = {
    start: "START",
    center: "CENTER",
    end: "END",
    justified: "JUSTIFIED"
}

const direction = {
    left_to_right: "LEFT_TO_RIGHT",
    right_to_left: "RIGHT_TO_LEFT"
}

const namedStyleType = {
    normal_text: "NORMAL_TEXT",
    title: "TITLE",
    subtitle: "SUBTITLE",
    heading_1: "HEADING_1",
    heading_2: "HEADING_2",
    heading_3: "HEADING_3",
    heading_4: "HEADING_4",
    heading_5: "HEADING_5",
    heading_6: "HEADING_6"
}


function insertText({ startIndex, text }, { alignment, direction, bold, underline, namedStyleType }) {
    let text_arr = [{
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
                namedStyleType: namedStyleType,
                alignment: alignment,
                direction: direction,

            },
            fields: "alignment, direction" + (namedStyleType ? ", namedStyleType" : ""),
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

    // console.log(text_arr)
    return { text_arr, curr_index: startIndex + text.length };

}

function insertPageBreak(index) {
    let page_break = {
        insertPageBreak: {
            location: {
                index: index
            }
        }
    }

    return page_break;
}

function updateDocumentStyle() {
    let document_style = {
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
    }

    return document_style
}

export {
    DocHandler,
    insertTable,
    insertText,
    insertPageBreak,
    updateDocumentStyle,
    alignment,
    direction,
    namedStyleType
}