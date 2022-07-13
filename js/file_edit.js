function addTableRow(table_id){
    let table = document.getElementById(table_id);
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = '<input class="form-control" type="search" list="mylist">';

    
        
    cell2.innerHTML = '<input class="form-control ar-input" type="search" list="mylist">';
}

function removeTableRow(table_id){
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