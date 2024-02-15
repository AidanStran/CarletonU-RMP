

$(document).ready(async function(){ 
    const tableRow = document.querySelectorAll('tr[bgcolor="#DCDCDC"], tr[bgcolor="#C0C0C0"]');
    const newDiv = document.createElement('div');

    // Structure for the rating Popup on hover
    // will have to do this process for EVERY teacher it sees, could load some to memory

    for (let i = 0; i < tableRow.length; i++){
        if (tableRow[i].children.length == 12){
            if(tableRow[i].children[11].innerText !== ""){
                
                teacherName = tableRow[i].children[11].innerText;
                //console.log(teacherName);


                const teacherData = await getProf(teacherName); //API CALL
                
                //Replace teachernames with a-Tag hyperlinks to the RMP website
                if (teacherData.legacyId == null){
                    const aTag = document.createElement('a');
                    aTag.innerText = teacherName;
                    aTag.className = 'a-Tag';
                    tableRow[i].children[11].replaceWith(aTag);
                }
                else{ //Case that the professors RMP profile does exist
                    const aTag = document.createElement('a');
                    aTag.innerText = teacherName;
                    aTag.className = 'a-Tag';
                    aTag.href = `https://www.ratemyprofessors.com/professor/${teacherData.legacyId}`;
                    tableRow[i].children[11].replaceWith(aTag); 
                    //document.createElement('popup');
                }
                
                console.log(teacherData);
                
                //Create circle + rating element
                if(teacherData.avgRating == null || teacherData.legacyId == null){ //if no rating is found or no profile is found, display --
                    const rate = '--';
                    var circleRate = `<span class="circle" style="background-color: grey;">${rate}</span> `;
                    tableRow[i].children[10].innerHTML = circleRate;
                }
                else{ //if they have a rating, display rating
                    const rate = teacherData.avgRating;
                    const newrate = rate.toFixed(1);
                    if (rate >= 4.0){ //green
                        var circleRate = `<span class="circle" style="background-color: green;">${newrate}</span>`;
                    } else if(rate >= 3.4){ //orange
                        var circleRate = `<span class="circle" style="background-color: yellow;">${newrate}</span>`;
                    } else if (rate >= 2.3){ //yellow
                        var circleRate = `<span class="circle" style="background-color: orange;">${newrate}</span>`;
                    } else if (rate >= 0){ //red
                        var circleRate = `<span class="circle" style="background-color: red;">${newrate}</span>`;
                    }
                    tableRow[i].children[10].innerHTML = circleRate;
                }
                var newElement = document.createElement('div');
                newElement.innerHTML =  `<div class="popup-${teacherName}">
                                            <div>${teacherName}</div>
                                            <div>${teacherData.avgRating}</div>
                                        </div>`;
                newElement.style.display = 'none';
                newElement.style.position = 'absolute';
                newElement.style.backgroundColor = '#ffffff';


                document.body.appendChild(newElement);
                
            }
        }

        /*.popup {
            display: none;
            position: absolute;
            background-color: #ffffff;
            border: 1px solid #cccccc;
            padding: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        */
    }
});

//change varnames
const getProf = async (name) => {
    try {
        const newName = encodeURIComponent(name);
        const response = await fetch(`http://localhost:3300/api/getProf/${newName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const { prof } = await response.json();
        //addToCache(name, prof); 
        return prof;
        
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}
