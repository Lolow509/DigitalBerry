
function putManager_template(){
   template = document.querySelector('#manager_template');
   container = document.querySelector('#manager_container')
  

      manager.forEach((item, index) => {
        if(item.role == "Manager"){
         clone = template.content.cloneNode(true),

          
        clone.querySelector('.managerCard').setAttribute('onclick', "ons.notification.alert('Service en cours de développement')"), 
           //('onclick',`suppAdmin('${index}', 'manager')`),

           //Mettre tout en minuscule
        clone.querySelector('.manager_name').innerText = item.nom,
        clone.querySelector('.manager_uid').innerText = item.id,
        clone.querySelector('.manager_role').innerText = item.role,
        clone.querySelector('.manager_email').innerText = item.email,
        clone.querySelector('.manager_num').innerText = item.numero,
        clone.querySelector('.manager_date').innerText = item.creation,
        clone.querySelector('.manager_valid').innerText = item.parrain,
                                         container.appendChild(clone)
      }

       })

    document.querySelector('#modalWait').hide()
   
  
}



function putEquipier_template(){
  
   template = document.querySelector('#equipier_template');
    container = document.querySelector('#equipier_container')

      equipier.forEach((item, index) => {
        if(item.role == "Equipier"){ 

     clone = template.content.cloneNode(true),

            clone.querySelector('.equipierCard').setAttribute('onclick', "ons.notification.alert('Service en cours de développement')"),
       //('onclick',`suppAdmin('${index}', 'equipier')`),
          
    clone.querySelector('.equipier_name').innerText = item.nom,
    clone.querySelector('.equipier_uid').innerText = item.id,
    clone.querySelector('.equipier_role').innerText = item.role,
    clone.querySelector('.equipier_email').innerText = item.email,
    clone.querySelector('.equipier_num').innerText = item.numero,
    clone.querySelector('.equipier_date').innerText = item.creation,
    clone.querySelector('.equipier_valid').innerText = item.parrain,
                                     container.appendChild(clone)

          }


      })

    document.querySelector('#modalWait').hide()


}





function putAssets_template(){


  template = document.querySelector('#assets_template');
  container = document.querySelector('#assets_container')


   assets.forEach((item, index) => {
     clone = template.content.cloneNode(true),

       console.log(item)


    clone.querySelector('.image-container').dataset.id = item.id,
    clone.querySelector('.img_gallery').src =  item.url,

                                     container.appendChild(clone)


   })

      document.querySelector('#modalWait').hide()



}



function modifCat_template(){

  template = document.querySelector('#modifCat_template');
  container = document.querySelector('#list_category_modif')


     allCat.forEach((item, index) => {
     clone = template.content.cloneNode(true),

       console.log(item)


    clone.querySelector('.tag').dataset.tag = item.name,
    clone.querySelector('.tag').innerText =  item.name,
    clone.querySelector('.tag').setAttribute("onclick", `suppCat(${index})`),
    clone.querySelector('.getId').setAttribute("id", `tagId_${item.creation}`),

                                     container.appendChild(clone)


   })


      document.querySelector('#modalWait').hide()


  
}





function add_newCat(){
  ons.notification.prompt({ 
    message: "Nouvelle Catégorie",
  title:"Catégorie",
    buttonLabels : ["Annuler", "Ajouter"]
  })
  .then(function(name) {

    document.querySelector('#modalWait').show()
    get_name = name.trim()
      if(get_name != ""){
        
        existe = allCat.some(item => item.name === get_name);


        if(existe == true){

          ons.notification.alert("Cette catégorie existe déjà.")
        } else {
            //faire un fetch pour ajouter la catégorie dans la sheet
          get_creation = Date.now()
          data_new = {"creation": get_creation ,"name": get_name, "id": allCat.length}

        //call =  call_newValue(data_new, "create_Category") 

          sh = {"sheet_id": sheet_id}
          merge_data = { ...data_new, ...sh };


          stringify_data = JSON.stringify(merge_data)

          data_encode = encodeURIComponent(stringify_data)
          etat = "create_Category"

          getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
          fetch(getUrl, requestOptionsGet)
            .then((response) => response.json())
            .then((get_data) => {
              if(get_data.success == true){

          
            allCat.push(data_new)

          document.querySelector('#list_category_modif').innerHTML += `<ons-list-item id="tagId_${get_creation}">
          <div class="tag center" data-tag="${get_name}">
            ${get_name}
          </div>
          <div class="right">
            <button onclick="moveUp(this)">▲</button>
          <button onclick="moveDown(this)">▼</button>
          </div>
        </ons-list-item>`
              document.querySelector('#modalWait').hide()
              }
            })
        }

        
      }
  });
  
}




function updateCat(){
  document.querySelector('#modalWait').show()
  dataTag = []
  tagChange = "pas de changement"

  allTag = document.querySelectorAll('#list_category_modif .tag')
  


  allTag.forEach((item, index) =>{
    tagID = document.querySelectorAll('#list_category_modif ons-list-item')[index].id

    tagID =  tagID.split('_')[1]
    dataTag.push({"creation": tagID, "id": index, "name": item.innerText})
  })

console.log(dataTag)

  
  merge_data = {"sheet_id": sheet_id, "sheet_name": "Category", "data": dataTag}


  stringify_data = JSON.stringify(merge_data)

  data_encode = encodeURIComponent(stringify_data)
  etat = "updateInfo_Category"

  getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
  fetch(getUrl, requestOptionsGet)
    .then((response) => response.json())
    .then((get_data) => {
      if(get_data.success == true){
        console.log(get_data)

        allCat = dataTag
        document.querySelector('#modalWait').hide()
        ons.notification.alert("Les catégories ont été mises à jour.")
      } else(
        ons.notification.alert("Une erreur est survenue.")
      )
      
      
    })

  

}


function suppCat(index) {
  allTag = document.querySelectorAll('#list_category_modif .tag')

  ons.notification.confirm({ 
    message: 'Supprimer cette catégorie ?',
    buttonLabels : ["Annuler", "Supprimer"]
    })
  .then(function(chx) {
    if(chx == 1){
      //faire un fetch pour supprimer la catégorie dans la sheet
      
      document.querySelector(`#tagId_${item.creation}`).remove()
      allCat.splice(index, 1)

    }
  });
  
}





/**** Reçu ******/
function getRecu_template(index){
  produits = JSON.parse(allCmd[index].produits)
  produits.forEach((item,index) => {


    document.querySelector('#get_order').innerHTML += `
      <ons-list-item expandable modifier="nodivider">
        <div class="left">x${item.qty}</div>
        <div class="center">
          <span class="list-item__title">${item.nom}</span><br>
          <span class="list-item__subtitle">${item.prix}€</span>
        </div>
        <div id="optionsHTML_${index}" class="expandable-content" style="margin-left:50px;">
          
        </div>
      </ons-list-item>
    `;
  });


  produits.forEach((item, index) => {
    //let optionsHTML = '';
    if(item.checkOption.length > 0){


      for(let i = 0; i < item.checkOption.length; i++){
        opt = item.checkOption[i]
          document.querySelector(`#optionsHTML_${index}`).innerHTML += `
          <ons-row>
            <ons-col width="50px">x${opt.qty}</ons-col>
            <ons-col>${opt.selectes}</ons-col>
          </ons-row>
        `;
      }


    } else {
      //document.querySelectorAll(`#get_order ons-list-item div div`)[2].remove()
      orderdiv = document.querySelectorAll(`#get_order ons-list-item`)[index]
      
      orderdiv.removeAttribute("expandable")
      orderdiv.classList.remove("list-item--expandable");
      orderdiv.querySelectorAll(`div div`)[3].remove()
    }
    
  })

  document.querySelector('#numero_CMD').innerText = allCmd[index].numero_CMD
  
  document.querySelector('#date_CMD').innerText = formatDate(allCmd[index].creation)
  
  document.querySelector('#montant_CMD').innerText = allCmd[index].montant
  
  document.querySelector('#nom_CMD').innerText = allCmd[index].nom_Client
  
  document.querySelector('#email_CMD').innerText = allCmd[index].email_Client
  
  document.querySelector('#statut_CMD').innerText = allCmd[index].statut_Commande
  
  document.querySelector('#nomServeur_CMD').innerText = allCmd[index].nomServeur
  
  document.querySelector('#instruction_CMD').innerText = allCmd[index].instruction
  


  document.querySelector('#modalWait').hide()

}



//call all table
function getAll_table(action){
  document.querySelector('#modalWait').show()
  data = {
    "sheet_name": "Table",
    "sheet_id": user_info.info_user_sheet[0].sheet_id
  }

  etat = "get_all_info"

  string_data = JSON.stringify(data)
  data_encode = encodeURIComponent(string_data)

  getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
  fetch(getUrl, requestOptionsGet)
    .then((response) => response.json())
    .then((get_data) => {
        table =  get_data

      if( action == "qrcode"){
          deploy_qrCode()
      } else if(action == "table"){
        deploy_table()
      } else if (action == "cmd"){
        name_table()
      }


    })

   
  
}

//Générateur de qr Code
function deploy_qrCode(){
  if (table.length == 0 ){
      document.querySelector('#alt_qrCode').innerHTML = `<p>Vous n'avez pas de table.</p>`
  } else if (table.length > 0){
      document.querySelector('#alt_qrCode').innerHTML = ""

    table.forEach((item, index) => {

     document.querySelector('#alt_qrCode').innerHTML += ` <div class="container_item_qr">
      <div class="main-boxr_item_qr">
        <img onclick="ask_dld_img(${index})" id="img_qr_${index}" src="https://api.qrserver.com/v1/create-qr-code/?data=https://www.google.com/search?q=${item.nom}&size=130x130" alt="${item.nom}">

      </div>
      <div class="label-boxr_item_qr">${item.nom} </div>
    </div>`
    })

      
  }


  document.querySelector('#modalWait').hide()
}


function deploy_table(){
  document.querySelector('#alt_table').innerHTML = ""

  table.forEach((item, index) => {
  document.querySelector('#alt_table').innerHTML += ` <ons-list modifier="inset" style="margin-bottom:20px" id="table_${index}">
    <ons-list-header>${item.nom} </ons-list-header>
    <ons-list-item onclick="change_table(${index})" modifier="longdivider">
       <div class="center" id="nomServeur_${index}">
        <span class="list-item__title">${item.nom_Serveur}</span><span class="list-item__subtitle">${item.serveur_ID}</span>
      </div>
    </ons-list-item>
    <ons-list-item modifier="longdivider" style="display:none" id="select_${index}"></ons-list-item>
  </ons-list>`
  })



  
    document.querySelector('#modalWait').hide()
}



