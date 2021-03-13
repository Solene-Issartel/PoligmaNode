var express = require('express');
var router = express.Router();
var pool = require('../db/index');

router.get("/", (req, res, next) => {
    console.log("Communes")
    next()
})

//Route 1
router.get("/:code_insee/iris_disponibles/annee/:annee", (req, res, next) => {
    var codeInsee = req.params.code_insee;
    var annee = req.params.annee;
    console.log("test1")

    pool.query(`SELECT id,libelle,numero 
    FROM public.communes c 
    JOIN public.data d ON c.id = d.ref_id 
    JOIN public.iris i ON d.ref_id = i.commune_id
    WHERE d.table_ref_id = 3 AND c.insee_id_commune = '${codeInsee}' AND i.annee = ${annee};`, (error, results) => {
        if (error) {
            console.log("error")
            return res.status(500).json({error: error, response : `An error has occured while fetching IRIS data for ${codeInsee} from DB`})
        }
        else if(results.rows.length <= 0){
            console.log("undefined")
            return res.status(500).json({error : `No data was found for ${codeInsee}`})
        } else {
            console.log("ok")
            json1 = []
            results.rows.forEach(function(row) {
                json2 = [{libelle: row.libelle, numero: row.numero}]
                json1 = json1.concat(json2)
            });
            return res.status(200).json(json1)
        }
    })
})

//Route 2
router.get("/:code_insee/variables/:variables/annee/:annee", (req, res, next) => {
    var codeInsee = req.params.code_insee;
    var annee = req.params.annee;
    var variables = req.params.variables
    const query = `SELECT c.libelle AS libelleCommune,insee_id_commune,code, v.libelle AS libelleVariable, value 
    FROM public.communes c 
    JOIN public.data d ON c.id = d.ref_id 
    JOIN public.variables v ON d.variable_id = v.id
    WHERE d.table_ref_id = 3 AND c.insee_id_commune = '${codeInsee}' AND d.annee = ${annee} AND v.code='${variables}';`
    console.log(query)

    pool.query(query, (error, results) => {
        if (error) {
            console.log("error")
            return res.status(500).json({error: error, response : `An error has occured while fetching ${variables} data for ${codeInsee} from DB`})
        }
        else if(results.rows[0]==undefined){
            console.log("undefined")
            return res.status(500).json({error : `No data was found for ${codeInsee} for variable ${variables}`})
        } else {
            console.log("ok")
            results.rows.forEach(function(row) {
                json2 = [{
                    libelle: row.libelleCommune,
                    codeInsee: row.insee_id_commune,
                    variableCode: row.code,
                    variableLibelle: row.libelleVariable,
                    value: row.value
                }]
                json1 = json1.concat(json2)
            });
            return res.status(200).json(json1)
        }
    })
})

module.exports = router;