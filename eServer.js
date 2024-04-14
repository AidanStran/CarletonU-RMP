
const express = require('express');
const cors = require('cors');
const RMP = require('@mtucourses/rate-my-professors').default;
const app = express();

const cache = require('./routeCache');

const PORT = 3300;
app.use(cors());
app.use(express.json());



/*async function getRatings(teacher) {
    try{
        const professor = await RMP.searchTeacher(teacher, CU_ID);
        if (professor.length === 0) {
        return 'N/A';
        }
        const prof = await RMP.getTeacher(professor[0].id);
        return prof.avgDifficulty;
    } 
    catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }

}


app.get('/api/get/:teacher', async (req,res)=>{
    //console.log(await getSchool());
    const { teacher } = req.params;
    try {
        res.send(await getRatings(teacher));
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
    
});
*/

async function getProf(name) {
    try {
        const CU_ID = "U2Nob29sLTE0MjA=";
        const professors = await RMP.searchTeacher(name, CU_ID);
        if (!professors || professors.length === 0) {
            return 'N/A'; 
        }
        const prof = await RMP.getTeacher(professors[0].id);
        return prof;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

//change var names
app.get('/api/getProf/:name', cache(200), async (req, res) => {
    const { name } = req.params;
    try {
        const prof = await getProf(name);
        res.json({ prof });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})