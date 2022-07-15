function DocHandler(index){
    this.curr_index = index
    this.insertTable = insertTable
    this.insertPageBreak = insertPageBreak
    this.insertText = insertText
    this.updateDocumentStyle = updateDocumentStyle
}


function insertTable({ col1, col2 }) {
    console.log('col1', col1)
    console.log('col2', col2)
    console.log('this curr_index', this.curr_index)

    let table_arr = []
    table_arr.push(
        {
            insertTable: {
                rows: col1.length,
                columns: 2,
                location: {
                    index: this.curr_index
                },

            }
        },

    )


    for (let i = 0; i < col1.length; i++) {
        this.curr_index += (i == 0 ? 4 : 3);
        table_arr.push(
            ...this.insertText(col1[i] , { bold: false, underline: false })
        )

        this.curr_index +=  2

        table_arr.push(
            ...this.insertText(col2[i], { bold: false, underline: false })
        )

    }
    // console.log('table arr', table_arr)
    this.curr_index += 2
    return table_arr;
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


function insertText(text , { alignment, direction, bold, underline, namedStyleType }) {
    let text_arr = [{
        insertText: {
            text: text,
            location: {
                index: this.curr_index, // Modified
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
                startIndex: this.curr_index,
                endIndex: this.curr_index + text.length
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
                startIndex: this.curr_index,
                endIndex: this.curr_index + text.length
            }
        }

    }]

    // console.log(text_arr)
    this.curr_index += text.length ;
    return text_arr;

}

function insertPageBreak() {
    let page_break = {
        insertPageBreak: {
            location: {
                index: this.curr_index
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