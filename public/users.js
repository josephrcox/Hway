const getUserSheet = async () => {
    document.getElementById("users-page-body").innerHTML = ""
    const response = await fetch('/api/get/all_users/')
    const data = await response.json()
    console.log(data)

    var table = document.createElement('table')
    var header = table.insertRow(0)
    var h0 = header.insertCell(0)
    var h1 = header.insertCell(1)
    var h2 = header.insertCell(2)

    h0.setAttribute('class','usersheet-header')
    h1.setAttribute('class','usersheet-header')
    h2.setAttribute('class','usersheet-header')

    h0.innerHTML = 'Name of user'
    h1.innerHTML = 'Total score (comments and posts)'
    h2.innerHTML = 'Origin'
    

    table.setAttribute('class', 'usersheet-table')
    for (i=0;i<data.length;i++) {
        var row = table.insertRow(i+1)
        row.setAttribute('class','usersheet-row')
        var name = row.insertCell(0)
        var score = row.insertCell(1)
        var location = row.insertCell(2)
        
        name.setAttribute('class','usersheet-name')
        score.setAttribute('class','usersheet-score')
        location.setAttribute('class','usersheet-location')

        name.innerHTML = data[i].Name
        score.innerHTML = data[i].Score
        location.innerHTML = data[i].Location

        name.style.border = '1px solid black'
        score.style.border = '1px solid black'
        location.style.border = '1px solid black'
    }
    document.getElementById('users-page-body').appendChild(table)
    
}

getUserSheet()
