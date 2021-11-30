const serialNumberSpan = document.getElementById("serial-number")
const getSerialNumberBtn = document.getElementById('get-serial-number')
const psInput = document.getElementById('ps-input')
const psSearchBtn = document.getElementById('ps-search')
const psClearBtn = document.getElementById('ps-clear')
const psResultTable = document.getElementById('ps-result')

getSerialNumberBtn.addEventListener('click',() => {
    window.electron.getSerialNumber((err,serialNumber) => {
        if(err){
            console.error(err)
            return
        }
        serialNumberSpan.innerText = serialNumber
    })
})

const createPSTableHeader = () => {
    const head = document.createElement('thead');
    ['PID', 'Command', 'PPID'].forEach(heading => {
        const cell = document.createElement('th');
        cell.innerText = heading;
        head.appendChild(cell);
    })
    return head
}

psSearchBtn.addEventListener('click', () => {
    const command = psInput.value;
    psResultTable.innerHTML = "";

    if(!command){
        psResultTable.innerHTML = "Please input a command to search";
        return
    }
    window.electron.psSearch(command, (resultList) => {
        if(resultList.length === 0){
            psResultTable.innerHTML = "No results found";
        }
        const thead = createPSTableHeader();
        const tbody = document.createElement('tbody');
        resultList.forEach(result => {
            const row = document.createElement('tr');
            ['pid', 'command', 'ppid'].forEach(key => {
                const cell = document.createElement('td');
                cell.innerText = result[key];
                row.appendChild(cell);
            })
            tbody.appendChild(row);
        })
        psResultTable.appendChild(thead);
        psResultTable.appendChild(tbody);
    })
})

psClearBtn.addEventListener('click',() => {
    psResultTable.innerHTML = ""
})