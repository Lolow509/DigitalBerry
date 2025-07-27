function call_get(data, etat, action){

document.querySelector('#modalWait').show()
  string_data = JSON.stringify(data)
  data_encode = encodeURIComponent(string_data)

  
  getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
  fetch(getUrl, requestOptionsGet)
    .then((response) => response.json())
    .then((get_data) => {
      console.log(get_data)

      if(action == "assets"){
        putAssets_template(get_data)
      } else if(action == "manager"){
        putManager_template(get_data)
      } else if(action == "equipier"){
        putEquipier_template(get_data)
      } else if(action == "category"){
        putCategory_template(get_data)
      }/* else if(action == "option"){
        putOption_template(get_data)
      }*/ else if(action == "option"){
        
        document.querySelector('#modalWait').show().then(() =>{
          deployOptions()
        })
      } else if(action == "produit"){
        allProd = get_data
      }
        
        
 

    })
  
}





function call_personnel(role){
  data = {
    "sheet_name": "Personnel",
    "sheet_id": user_info.info_user_sheet[0].sheet_id
  }

  etat = "get_all_info"

  string_data = JSON.stringify(data)
  data_encode = encodeURIComponent(string_data)
  
  getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
  fetch(getUrl, requestOptionsGet)
    .then((response) => response.json())
    .then((get_data) => {
      allPrsl =  get_data

      allPrsl.forEach (item =>{
        if(item.role == "Manager"){
          manager.push(item)
        }  else if (item.role == "Equipier"){
          equipier.push(item)
        }
        
      })

      if(role == "manager"){
        putManager_template()
      } else if(role == "equipier"){
        putEquipier_template()
      }
      
    })
}




function call_assets(){
  data = {
    "sheet_name": "Assets",
    "sheet_id": user_info.info_user_sheet[0].sheet_id
  }

  etat = "get_all_info"

  string_data = JSON.stringify(data)
  data_encode = encodeURIComponent(string_data)

  getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
  fetch(getUrl, requestOptionsGet)
    .then((response) => response.json())
    .then((get_data) => {
        assets =  get_data
      
        putAssets_template()
      

    })
}





function call_newValue(data, etat) {
  sh = {"sheet_id": sheet_id}
  merge_data = { ...data, ...sh };
    

  stringify_data = JSON.stringify(merge_data)

  data_encode = encodeURIComponent(stringify_data)

  getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
  fetch(getUrl, requestOptionsGet)
    .then((response) => response.json())
    .then((get_data) => {
      if(get_data.success == true){
        return true
      }
      console.log(get_data)
      //update_data = {action: "ajouter", data: new_data }
    })
  
}



function formatDate(timestamp) {
  var now = new Date(timestamp);

  var jour = String(now.getDate()).padStart(2, '0');
  var mois = String(now.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
  var annee = now.getFullYear();

  var dateFormatee = jour + '/' + mois + '/' + annee;
  return dateFormatee  // Exemple : 05/07/2025
}



//JJ/MM/AAAA => AAAA-MM-JJ
function formatDateToPicker(wrongFormat){
  const parts = wrongFormat.split('/'); // ["07", "07", "2025"]
  const correctFormat = `${parts[2]}-${parts[1]}-${parts[0]}`; // "2025-07-07"

  return correctFormat
}


//AAAA-MM-JJ => JJ/MM/AAAA
function pickerToFormatDate(wrongFormat){
  const parts = wrongFormat.split('-'); // ["2025", "07", "07"]
  const correctFormat = `${parts[2]}/${parts[1]}/${parts[0]}`; // "07/07/2025"

  return correctFormat
}




function cleanRaw(raw) {
  return raw.replace(/[{}"]/g, '').split(',').map(s => s.trim()).join(', ');
}



function formatedString(string) {
  return '{' + string
    .split(',')
    .map(item => `"${item.trim()}"`)
    .join(',') + '}';
}
