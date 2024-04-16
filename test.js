

$(document).ready(async function(){ 
    const tableRow = document.querySelectorAll('tr[bgcolor="#DCDCDC"], tr[bgcolor="#C0C0C0"]');

    const restrictions = document.querySelectorAll('tr');
    restrictions[10].children[9].children[0].children[0].children[0].textContent = 'Teacher Rating';
    
    console.log(restrictions[10].children[9].children[0].children[0].children[0].textContent);

    for (let i = 0; i < tableRow.length; i++){
        if (tableRow[i].children.length == 12){
            if(tableRow[i].children[11].innerText !== ""){
                
                teacherName = tableRow[i].children[11].innerText;
                console.log(teacherName);

                const teacherData = await getProf(teacherName); //API CALL
                if (teacherData == null) {
                    console.log('empty');
                }
                console.log(teacherData);

                //Replaces teachernames with a-Tag hyperlinks to the RMP website
                if (teacherData == undefined || teacherData.legacyId == null ){ //teacher has no profile on RMP
                    const aTag = document.createElement('span');
                    aTag.innerText = teacherName;
                    aTag.style.color = "black";
                    aTag.className = 'a-Tag';
                    tableRow[i].children[11].replaceWith(aTag);
                }
                else{ //Case that the professors RMP profile does exist
                    const aTag = document.createElement('a');
                    aTag.innerText = teacherData.firstName + ' ' +teacherData.lastName;
                    aTag.className = 'a-Tag';
                    //aTag.title = profDiv(teacherData.firstName, teacherData.avgRating, teacherData.avgDifficulty, teacherData.numRatings);
                    aTag.href = `https://www.ratemyprofessors.com/professor/${teacherData.legacyId}`;
                    aTag.target = '_blank';
                    tableRow[i].children[11].replaceWith(aTag);
                }
                
                //console.log(teacherData);
                


                //Create circle + rating element
                if (teacherData == undefined || teacherData.avgRating == null || teacherData.legacyId == null || teacherData.avgRating == 0) { //if no rating is found or no profile is found, display --
                    const rate = '--';
                    var circleRate = `<span class="circle" style="background-color: grey;">${rate}</span> `;
                    const newDiv = document.createElement('div');
                    tableRow[i].children[10].innerHTML = ' '; // Clear existing content
                    newDiv.innerHTML += circleRate; // Use innerHTML to append HTML string
                    tableRow[i].children[10].appendChild(newDiv); // Append newDiv to tableRow
                    
                }
                else { //if they have a rating, display rating
                    const rate = teacherData.avgRating;
                    const newrate = rate.toFixed(1);
                    if (rate >= 3.7) { //green
                        var circleRate = `<span class="circle" style="background-color: #32CD32;">${newrate}</span>`;
                    } else if (rate >= 3.6) { //orange
                        var circleRate = `<span class="circle" style="background-color: yellow;">${newrate}</span>`;
                    } else if (rate >= 2.0) { //yellow
                        var circleRate = `<span class="circle" style="background-color: orange;">${newrate}</span>`;
                    } else if (rate >= 0) { //red
                        var circleRate = `<span class="circle" style="background-color: #fc1100;">${newrate}</span>`;
                    }
                    const newDiv = document.createElement('div');
                    newDiv.className = 'circleContainer';
                    newDiv.innerHTML += circleRate; // Use innerHTML to append HTML string
                    
                    tableRow[i].children[10].innerHTML = ' '; // Clear existing content
                    tableRow[i].children[10].appendChild(newDiv); // Append newDiv to tableRow                    
                }

            }
        }
    }
});

async function getProf(name) {
    try {
        const newName = encodeURIComponent(name);
        const response = await fetch(`http://localhost:3300/api/getProf/${newName}`, { cache:"default" });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const { prof } = await response.json();
        return prof;
        
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}





