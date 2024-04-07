

$(document).ready(async function(){ 
    const tableRow = document.querySelectorAll('tr[bgcolor="#DCDCDC"], tr[bgcolor="#C0C0C0"]');
    const newDiv = document.createElement('div');

    profCache = [];
    // Structure for the rating Popup on hover
    // will have to do this process for EVERY teacher it sees, could load some to memory

    for (let i = 0; i < tableRow.length; i++){
        if (tableRow[i].children.length == 12){
            if(tableRow[i].children[11].innerText !== ""){
                
                teacherName = tableRow[i].children[11].innerText;
                //console.log(teacherName);


                const teacherData = await getProf(teacherName); //API CALL
                
                //Replace teachernames with a-Tag hyperlinks to the RMP website
                if (teacherData.legacyId == null){ //teacher has no profile on RMP
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
                    aTag.href = `https://www.ratemyprofessors.com/professor/${teacherData.legacyId}`;
                    aTag.target = '_blank';
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
                    if (rate >= 3.7){ //green
                        var circleRate = `<span class="circle" style="background-color: #32CD32;">${newrate}</span>`;
                    } else if(rate >= 3.6){ //orange
                        var circleRate = `<span class="circle" style="background-color: yellow;">${newrate}</span>`;
                    } else if (rate >= 2.0){ //yellow
                        var circleRate = `<span class="circle" style="background-color: orange;">${newrate}</span>`;
                    } else if (rate >= 0){ //red
                        var circleRate = `<span class="circle" style="background-color: red;">${newrate}</span>`;
                    }
                    tableRow[i].children[10].innerHTML = circleRate;
                }
                
            }
        }
    }
});

//change varnames
const getProf = async (name) => {
    try {
        const newName = encodeURIComponent(name);
        const response = await fetch(`http://localhost:3300/api/getProf/${newName}`, { cache:"force-cache" });
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

const profDiv = async (name, rating, difficulty, id, numRatings) => {
    if (rating === "0"){
        //then no rating
        return div = `<div class="popup">
                        <span>
                        <div class="teacher-title">${name}</div>
                            <div class="rating">
                            <span class="avgRating">No Rating</span>
                            <span class="avgDiff">${newDiff}%</span>
                            </div>
                        <div class="numRatings">0 votes</div>
                        </span>
                    </div>`; 
    }
    else{
        newDiff = (difficulty * 5)/100;
        return div = `<div class="popup">
                        <span>
                        <div class="teacher-title">${name}</div>
                            <div class="rating">
                            <span class="avgRating">${rating}/5</span>
                            <span class="avgDiff">${newDiff}%</span>
                            </div>
                        <div class="numRatings">In ${numRatings} votes</div>
                        </span>
                    </div>`; 
    }
}



