
function getCategory_info(){
  data = JSON.stringify({
    "sheet_id": sheet_id,
    "sheet_name": "Category"
  })


  data_encode = encodeURIComponent(data)

  etat = "get_all_info"

  getUrl = `${url_api}?info=${data_encode}&etat=${etat}`

  fetch(getUrl, requestOptionsGet)
  .then((response) => response.json())
  .then((get_data) => {
        allCat = get_data

    console.log(allCat)

    document.querySelector('#choose-sel_listBox').innerHTML = `<ons-select style="width:70%" id="choose-sel" onchange="changeCat(event)">`

    //mettre en minuscule
    allCat.sort((a, b) => a.id - b.id); //trier par id

    allCat.forEach((item, index) => {
      document.querySelector('#choose-sel').innerHTML += `<option value="${item.name}">${item.name}</option>`

      document.querySelector('#allCatSect').innerHTML += ` <ons-list id="cat_${item.name}" class="listBox" modifier="inset">
          <ons-list-header>${item.name}</ons-list-header>
          </ons-list>`
    })

    document.querySelector('#choose-sel_listBox').innerHTML += `</ons-select>`


  }).then(() => {
    data = JSON.stringify({
      "sheet_id": sheet_id,
      "sheet_name": "Menu"
    })


    data_encode = encodeURIComponent(data)
  
      etat = "get_all_info"
  
      getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
  
      fetch(getUrl, requestOptionsGet)
      .then((response) => response.json())
      .then((get_data) =>{
        allProd = get_data

        allProd.forEach((item, index) =>{
          document.querySelector(`#cat_${item.category}`).innerHTML += `<ons-list-item id="prod_${index}" onclick="getHtml('addProd_article', 'Modifier un produit', '${index}')">
            <div class="left">
              <img class="list-item__thumbnail" src="${item.img}">
            </div>
            <div class="center">
              <span class="list-item__title">${item.nom}</span><span class="list-item__subtitle">${item.prix} €</span>
            </div>
          </ons-list-item>`

          
        })

      

        
      }).then(() =>{

        data = JSON.stringify({
          "sheet_id": sheet_id,
          "sheet_name": "Option"
        })


        data_encode = encodeURIComponent(data)

          etat = "get_all_info"

          getUrl = `${url_api}?info=${data_encode}&etat=${etat}`

          fetch(getUrl, requestOptionsGet)
          .then((response) => response.json())
          .then((get_data) =>{
              allOption = get_data
            document.querySelector('#modalWait').hide()
          })
        
      })

    
  })


  
}






/*
function getHtml_home(div){
  document.querySelector('#mainNavigator').pushPage('getDiv.html')
    .then(() => {


      fetch('expend.html')
      .then(response => response.text())
      .then(htmlText => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;

        // Extraire l'élément #article_addProd
        const articleContent = tempDiv.querySelector(`#${div}`);

        document.querySelector(`#divPlay`).innerHTML = articleContent.innerHTML;

      })
    



      
  })



   .catch(error => {
    console.error('Erreur lors du chargement de la page:', error);
  })
}
*/


function modif_produit(index){

  update_data = {}

  document.querySelector('#selectCat select').innerHTML = "<option value=''>Selectionnez une catégorie</option>"
  
  document.querySelector('#listOptionProd').innerHTML = ""

  allCat.forEach(item => {
    document.querySelector('#selectCat select').innerHTML += `<option value="${item.name}">${item.name}</option>`
  })



  allOption.forEach((item, i) =>{
    document.querySelector('#listOptionProd').innerHTML += `<ons-list-item tappable>
        <label class="left">
          <ons-checkbox value="${item.nom}" input-id="${i}"></ons-checkbox>
        </label>
        <label for="${i}" class="center">
          ${item.nom}
        </label>
      </ons-list-item>`
    
  })


  if(index != undefined){

     old_data = {
        "creation" : allProd[index].creation,
        "id" : allProd[index].id,
        "nom" : allProd[index].nom,
        "category" : allProd[index].category,
        "description" : allProd[index].description,	
        "prix" : Number(allProd[index].prix).toFixed(2),
        "img" : allProd[index].img,
        "taxeCode" : "", //a supprimer de la sheet
        "taxeTaux" : Number(allProd[index].taxeTaux).toFixed(2), //a supprimer de la sheet
        "option" : allProd[index].option,
        "active": `${allProd[index].active}`
        }

    
    document.querySelector('#addProd_btn').setAttribute('onclick', `addProd('modif', '${index}')`)

    document.querySelector('#addProd_btn').innerText = "Modifier"

    
  document.querySelector('#preview_newProd').src = allProd[index].img
  document.querySelector('#nomProd').value = allProd[index].nom
  document.querySelector('#prixProd').value = Number(allProd[index].prix).toFixed(2)
  document.querySelector('#descriptionProd').value = allProd[index].description
    document.querySelector('#tauxProd').value = Number(allProd[index].taxeTaux).toFixed(2)


  document.querySelector('#selectCat').value = allProd[index].category

    if(allProd[index].active == true){
      document.querySelector('#check_ActiveProd').checked = true
    } else{
      document.querySelector('#check_ActiveProd').checked = false
    }

  //refaire cette section pour les options il manque ajouter les options dans la liste et les cocher si elles sont présentes dans le produit




      if(allProd[index].option != '""'){
        optionList = JSON.parse(allProd[index].option)

        document.querySelector('#checkOptionProd').checked = true
          document.querySelector('#listOptionProd').style.display = "block"

         optionList.forEach(item => {
           document.querySelector(`#listOptionProd ons-checkbox[value="${item.nom}"]`).checked = true


        })

      }


   


    
  } else if (index == undefined){
    document.querySelector('#addProd_btn').setAttribute('onclick', `addProd('new')`)

    document.querySelector('#addProd_btn').innerText = "Ajouter"

  }
  

  document.querySelector('#modalWait').hide()
}




function deployArticle() {
  document.querySelector('#allCatSect').innerHTML = ''

  document.querySelector('#choose-sel_listBox').innerHTML = `<ons-select style="width:70%" id="choose-sel" onchange="changeCat(event)">`

  //mettre en minuscule
  allCat.sort((a, b) => a.id - b.id); //trier par id

  allCat.forEach((item, index) => {
    document.querySelector('#choose-sel').innerHTML += `<option value="${item.name}">${item.name}</option>`

    document.querySelector('#allCatSect').innerHTML += ` <ons-list id="cat_${item.name}" class="listBox" modifier="inset">
        <ons-list-header>${item.name}</ons-list-header>
        </ons-list>`
  })

  document.querySelector('#choose-sel_listBox').innerHTML += `</ons-select>`


  allProd.forEach((item, index) =>{
    document.querySelector(`#cat_${item.category}`).innerHTML += `<ons-list-item id="prod_${index}" onclick="getHtml('addProd_article', 'Modifier un produit', '${index}')">
      <div class="left">
        <img class="list-item__thumbnail" src="${item.img}">
      </div>
      <div class="center">
        <span class="list-item__title">${item.nom}</span><span class="list-item__subtitle">${item.prix} €</span>
      </div>
    </ons-list-item>`


  })

  document.querySelector('#modalWait').hide()
  
  
}


function deployOptions() {
    document.querySelector('#list_allOption').innerHTML = ""
  
  allOption.forEach((item, index) => {
  getList_item = cleanRaw(item.liste)
    
    document.querySelector(`#list_allOption`).innerHTML += `<ons-list-item expandable>
      ${item.nom}
      <div class="expandable-content">
        <ons-row style="margin-bottom: 10px"  onclick="set_Option('choix',${index})">
          <ons-col><b>Choix</b></ons-col>
          <ons-col>${item.choix}</ons-col>
        </ons-row>
        <ons-row style="margin-bottom: 10px"  onclick="set_Option('max',${index})">
          <ons-col><b>Maximum</b></ons-col>
          <ons-col>${item.max}</ons-col>
        </ons-row>
        <ons-row style="margin-bottom: 10px"  onclick="set_Option('liste', ${index})">
          <ons-col><b>Liste</b></ons-col>
          <ons-col>${getList_item}</ons-col>
        </ons-row>
        </div>
    </ons-list-item>`
  })

  document.querySelector('#modalWait').hide()
  
}


function set_Option(action, index) {
  console.log(action)
  console.log(allOption[index])
  document.getElementById('selectDialog').show()
  

  
  if (action == "choix") {
    document.querySelector('#actionSelect').innerText = "Modifier le choix"
    document.querySelector('#promptSelect').style.display = "block"
    document.querySelector('#promptNumber').style.display = "none"
    document.querySelector('#promptText').style.display = "none"

    document.querySelector('#promptSelect').value = allOption[index].choix

     document.querySelector('#select_btn').setAttribute('onclick', `submitSelect('${action}', '${index}')`)



    document.querySelector('#inputName_option').value = allOption[index].nom

    document.querySelector('#inputName_option').disabled = "true"
    
  } else if (action == "max"){
    document.querySelector('#actionSelect').innerText = "Modifier le maximum"
    document.querySelector('#promptSelect').style.display = "none"
    document.querySelector('#promptNumber').style.display = "block"
    document.querySelector('#promptText').style.display = "none"

    document.querySelector('#inputmax_option').value = allOption[index].max

      document.querySelector('#select_btn').setAttribute('onclick', `submitSelect('${action}', '${index}')`)



    document.querySelector('#inputName_option').value = allOption[index].nom

    document.querySelector('#inputName_option').disabled = "true"

  } else if(action == "liste"){
    document.querySelector('#actionSelect').innerText = "Modifier la liste"

    listSelect = cleanRaw(allOption[index].liste)

    document.querySelector('#promptSelect').style.display = "none"
    document.querySelector('#promptNumber').style.display = "none"
    document.querySelector('#promptText').style.display = "block"

    document.querySelector('#inputItem_option').value = listSelect


    document.querySelector('#inputName_option').value = allOption[index].nom

    document.querySelector('#inputName_option').disabled = "true"

    document.querySelector('#select_btn').setAttribute('onclick', `submitSelect('${action}', '${index}')`)
    
  } else if(action == "ajouter"){
    document.querySelector('#actionSelect').innerText = "Ajouter une option"

    document.querySelector('#promptSelect').style.display = "block"
    document.querySelector('#promptNumber').style.display = "block"
    document.querySelector('#promptText').style.display = "block"
    document.querySelector('#inputName_option').disabled = false
    
    document.querySelector('#inputmax_option').value =  1
    document.querySelector('#inputItem_option').value =  ""
    document.querySelector('#inputName_option').value = ""
    document.querySelector('#promptSelect').value = "facultatif"

    

      document.querySelector('#select_btn').setAttribute('onclick', `submitSelect('${action}')`)
    
  }



}


function submitSelect(action, index) {

  //fetch pour modifier l'option dans la sheet

  if(action == "choix"){
    newVal_choix = document.querySelector('#promptSelect').value
    allOption[index].choix = newVal_choix

     data_new = {
       "choix" : newVal_choix,
       "id": allOption[index].id,
       "sheet_id": sheet_id
     }

    etat = "update_Option"
    
  } else if(action == "max"){
    newVal_max = document.querySelector('#inputmax_option').value
    allOption[index].max = newVal_max

     data_new = {
       "max" : newVal_max,
       "id": allOption[index].id,
       "sheet_id": sheet_id
     }

    etat = "update_Option"
    
  } else if (action == "liste"){
    newVal = document.querySelector('#inputItem_option').value
    newVal_list = formatedString(newVal)
    allOption[index].liste = newVal_list

    data_new = {
      "liste" : newVal_list,
      "id": allOption[index].id,
      "sheet_id": sheet_id
    }

    etat = "update_Option"
    
  } else if(action == "ajouter"){
    newVal_name = document.querySelector('#inputName_option').value

    newVal = document.querySelector('#inputItem_option').value
    newVal_list = formatedString(newVal)

    newVal_max = document.querySelector('#inputmax_option').value

    newVal_choix = document.querySelector('#promptSelect').value
    newVal_date = Date.now()
    
        data_new = {
        "choix" : newVal_choix,
        "creation" : newVal_date,
        "id": newVal_date,
        "liste" : newVal_list,
        "max" : newVal_max,
        "nom" : newVal_name,
        "sheet_id": sheet_id
      }

    allOption.push(data_new)

    etat = "create_Option"
    
  }

    document.getElementById('selectDialog').hide()

  document.querySelector('#modalWait').show()
  string_data = JSON.stringify(data_new)
    data_encode = encodeURIComponent(string_data)


  getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
  fetch(getUrl, requestOptionsGet)
    .then((response) => response.json())
    .then((get_data) => {
      document.querySelector('#modalWait').show().then(() =>{
        deployOptions()
      })
    })

  
}


