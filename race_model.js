const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'database-1.cdslovauoxkg.eu-north-1.rds.amazonaws.com',
  database: 'RaceDB',
  password: 'Sm3gh3ad',
  port: 5432,
  rejectUnauthorized: false,
  ssl: {
    rejectUnauthorized: false,
  }
});



const getSplits= () => {
    return new Promise(function(resolve, reject) {
      const sql = 'SELECT row_number() over (order by \'\') as id, array_agg(("SplitTime" - "LastSplitTime")) as splits ,bibnumber, first_name, last_name FROM splits group by bibnumber,first_name, last_name';
      
      console.log(sql);

      pool.query(sql, (error, results) => {
    
        if (error) {
          reject(error)
        }
        

        newData = reorderData(results.rows)
        resolve(newData);
      })
    }) 
  }


  function correctData(data){
    for(row in data){
      jsonObject = {};
      let timeIs =0
      data[row]["Position"] =  parseInt(row) + 1;
      if(data[row]["split"]["minutes"]  ===  undefined){
        timeIs = 0;
    }else{
      timeIs = data[row]["split"]["minutes"]
    }

      data[row]["finishTime"] =   timeIs + ":" + data[row]["split"]["seconds"]
      currentRow = data[row];
      console.log(currentRow)

    }

  }
  function reorderData(data){
    myObject = []
    for(row in data){
      jsonObject = {};

      currentRow = data[row];
      console.log(currentRow)
      currentRowSplits = currentRow["splits"]
      for( splitCount in currentRowSplits){
        splitLabel = "split" + (splitCount)
        
      
        currentSplitTime = currentRowSplits[splitCount]
        let mins = 0
        if(currentSplitTime["minutes"] ===  undefined){
            timeIs = 0;
        }else{
          timeIs = currentSplitTime["minutes"]
        }
        jsonObject[splitLabel] = timeIs + ":" + currentSplitTime["seconds"];
        jsonObject["bibNumber"] = currentRow["bibnumber"]
        jsonObject["first_name"] = currentRow["first_name"]
        jsonObject["last_name"] = currentRow["last_name"]
        jsonObject["id"] = currentRow["id"]
        
      }
      myObject.push(jsonObject);

    }
    return myObject;
  }
    

  const getResults= (raceid) => {
  return new Promise(function(resolve, reject) {
    const sql = 'SELECT row_number() over (order by \'\') as id, bibnumber,"first_name","last_name", SUM(("SplitTime" - "LastSplitTime")) as split FROM splits where raceid = '+ raceid+' group BY bibnumber,first_name, last_name order by split ASC'
    pool.query(sql, (error, results) => {
    
      if (error) {
        reject(error)
      }
      
      correctData(results.rows);
     
      resolve(results.rows);
    })
  })
}

  const getRaces= () => {
    return new Promise(function(resolve, reject) {
      const sql = 'SELECT * FROM "Race"'
    pool.query(sql, (error, results) => {
    
      if (error) {
        reject(error)
      }
     
      resolve(results.rows);
    })
    })
  }

  module.exports = {
    getSplits,getResults,getRaces
  }