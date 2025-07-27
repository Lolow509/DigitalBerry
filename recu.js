function getRecu_info(){
  data = JSON.stringify({
    "sheet_id": sheet_id,
    "sheet_name": "Commande"
  })
  
  data_encode = encodeURIComponent(data)

  etat = "get_all_info"

  getUrl = `${url_api}?info=${data_encode}&etat=${etat}`

  fetch(getUrl, requestOptionsGet)
  .then((response) => response.json())

  .then((get_data) =>{
    allCmd = get_data
    console.log(allCmd)

    deployRecu(toDay)

    /*
    allCmd.forEach ((item, index) =>{
      var get_date = formatDate(item.creation)

      if(get_date == toDay){
        document.querySelector('#').innerHTML = `<ons-list-item modifier="chevron" tappable onclick="getHtml('getRecu', 'Commande N° ${item.creation}')">
          <div class="left">
            <img class="list-item__thumbnail" src="https://cdn-icons-png.flaticon.com/512/7591/7591479.png">
          </div>
          <div class="center">
            <span class="list-item__title">Commande N°${item.numero_CMD}</span><span class="list-item__subtitle">${item.prix} €</span>
          </div>
        </ons-list-item>`
      }

      
      
    })
    
    document.querySelector('#modalWait').hide()*/
  })
}



function deployRecu(want_day){
  dayList = []
  document.querySelector('#recuToday').innerHTML = ""
  allCmd.forEach ((item, index) =>{
    var get_date = formatDate(item.creation)

    if(get_date == want_day){
      //{"index": index; "creation": item}
      item.index = index
      dayList.push(item)
    }
    

  })


  if(dayList.length > 0){

    document.querySelector('#length_daySelect').innerText = `Jour du ${want_day} ( ${dayList.length} commande(s) )`

    dayList.forEach((item, index) =>{
    document.querySelector('#recuToday').innerHTML += `<ons-list-item modifier="chevron" tappable onclick="getHtml('getRecu', 'Commande N° ${item.numero_CMD}', ${item.index} )">
      <div class="left">
        <img class="list-item__thumbnail" src="https://cdn-icons-png.flaticon.com/512/7591/7591479.png">
      </div>
      <div class="center">
        <span class="list-item__title">N° ${item.numero_CMD}</span><span class="list-item__subtitle">${item.montant} €</span>
      </div>
    </ons-list-item>`
    })

    
  } else if(dayList.length == 0){
    document.querySelector('#recuToday').innerHTML = '<ons-list-item modifier="" tappable> Pas de commande disponible </<ons-list-item>'

    document.querySelector('#length_daySelect').innerText = `Jour du ${want_day} ( 0 commande )`
  }
  document.querySelector('#modalWait').hide()
}





function datePickerChange(e){
  //pickerToFormatDate(e.value)

  //12/02/2025
  tttt = e.value
  

  frDate = pickerToFormatDate(e.value)
  console.log(frDate)

  deployRecu(frDate)
  
}



function retrieveOne_Cmd(){
  ons.notification.prompt('Numéro de commande', {
    title: "Recherche"
  })
  .then(function(input) {
    var nb_cmd = input ? input.trim() : 'Entered nothing!';
    

    if(!nb_cmd.includes('cmd_') ){
      nb_cmd = `cmd_${nb_cmd}`
    }

    index = allCmd.findIndex(item => item.numero_CMD === nb_cmd);

    console.log(index)
    
    if(index != -1) {
      getHtml('getRecu', `Commande N° ${nb_cmd}`, index )
    } else {
      ons.notification.alert('Numéro de commande introuvable.')
    }
    


    
  });
}



function go_scan_cmd(){


  document.querySelector('#recuTemplate').style.display = 'none'; document.querySelector('#getScan_recu').style.display = 'block'; document.getElementById('recuBox_fab').removeAttribute('open'); document.getElementById('recuBox_fab').style.visibility = 'hidden'

  var resultBox = document.getElementById("result");
  var scanner = new Html5Qrcode("load_reader");

  Html5Qrcode.getCameras().then(cameras => {
    if (cameras && cameras.length) {
      let cameraId = cameras[0].id;
      scanner.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        (decodedText, decodedResult) => {
          nb_cmd = decodedText;


          index = allCmd.findIndex(item => item.numero_CMD === nb_cmd);

          console.log(index)

          if(index != -1) {
            getHtml('getRecu', `N° ${nb_cmd}`, index )
          } else {
            ons.notification.alert('Numéro de commande introuvable.')
          }



          
          scanner.stop();


          
        },
        errorMessage => {
          // Erreur non fatale, on ignore
        }
      );
    }
  }).catch(err => {
    alert("Erreur caméra : " + err);
  });
  
}




/***** Prise de commande ******/

function add_instruction (){
  ons.notification.prompt('Ajouter une instruction',{
    titre : "Instruction",
    cancelable:true
  }).then (function(input) {
        if(input != null){
          document.querySelector('#get_instruction').innerText = input.trim()
          instruction = input.trim()
          document.querySelector('#div_instruction').style.display="block"
        }
  })

}

function supp_instruction (){
  ons.notification.confirm("Supprimer l'instruction",{
    titre : "Supprimer",
    cancelable:true,
    buttonLabels: ["Annuler", "Supprimer"]
  }).then (function(ind) {
        if(ind == 1){
          document.querySelector('#get_instruction').innerText = ""
          
          instruction = ""
            document.querySelector('#div_instruction').style.display="none"
        }
  })

}


function deployMenu_cmd(){
  //document.querySelector('#modalWait').hide()
  document.querySelector('#catSelect').style.visibility = "hidden"

  if(allProd.length == 0){

    data = JSON.stringify({
      "sheet_id": sheet_id,
    })


    data_encode = encodeURIComponent(data)
    etat = "get_info_menu"

      getUrl = `${url_api}?info=${data_encode}&etat=${etat}`

      fetch(getUrl, requestOptionsGet)
      .then((response) => response.json())
      .then((get_data) =>{
        allProd = get_data.menu
        allCat = get_data.categorie

        document.querySelector('#catSelect select').innerHTML = '<option value="">-- Sélectionner une catégorie --</option>'

        allCat.forEach(item =>{
          document.querySelector('#catSelect select').innerHTML += `<option value="${item.name}">${item.name}</option>`
        })

        document.querySelector('#catSelect').style.visibility = "visible"

        document.querySelector('#modalWait').hide()
        
      })

    
    
  } else if(allProd.length > 0){
    document.querySelector('#catSelect select').innerHTML = '<option value="">-- Sélectionner une catégorie --</option>'

    allCat.forEach(item =>{
      document.querySelector('#catSelect select').innerHTML += `<option value="${item.name}">${item.name}</option>`
    })

    document.querySelector('#modalWait').hide()

    document.querySelector('#catSelect').style.visibility = "visible"
    
  }


}



function onchange_searchInput(e){
  //var input = document.getElementById("searchInput");
       resultsContainer = document.getElementById("produits");


         query = document.getElementById("searchInput").value.toLowerCase();

         filtered = allProd.filter(prod => prod.nom.toLowerCase().includes(query));

        resultsContainer.innerHTML = ""; // Clear previous results


      if(query == ""){
        resultsContainer.innerHTML = ""
        return
      }

      
  
        if (filtered.length === 0) {
          resultsContainer.innerHTML = "<p>Aucun produit trouvé.</p>";
          return;
        }

        filtered.forEach((item, idex) => {
          index = allProd.indexOf(filtered[idex]);
          resultsContainer.innerHTML += `<ons-card data-option='${item.option || []}' onclick='ajouterAuPanier(${index}, this)'>
            <div style="font-weight: 600;">${item.nom}</div>
            <div style="color: #4B5563;font-size: 14px; line-height: 20px" >${item.prix.toFixed(2)} €</div>
          </ons-card>`;
        });










}




/*
const produitsParCategorie = {
  entrées: [
    { name: "Salade", price: 5.52 },
    { name: "Soupe", price: 4.0 }
  ],
  plats: [
    { name: "Steak frites", price: 12.51 },
    {
      name: "Menu Steak frites",
      price: 22.5,
      option: [
        { nom: "Plat", choix: "obligatoire", max: 1, liste: ["wings", "poulet", "thon"] },
        { nom: "Boisson", choix: "obligatoire", max: 1, liste: ["coca", "fanta", "eau"] },
        { nom: "Dessert", choix: "obligatoire", max: 1, liste: ["flan", "tarte", "glace"] },
        { nom: "Accompagnement", choix: "facultative", max: 2, liste: ["riz", "pâte", "pomme de terre"] }
      ]
    },
    { name: "Poulet rôti", price: 11.0 }
  ],
  desserts: [
    { name: "Tarte", price: 4.5 },
    { name: "Mousse", price: 3.8 }
  ]
};
*/

let panier = [];
let get_total = 0

let produitsAffiches = []; // les produits à filtrer (par catégorie)


function selectCategory(cat) {
     let container = document.getElementById("produits");
      container.innerHTML = "";

        allProd.forEach((item, index) => {
        //option = JSON.stringify(item.option)

          if(item.category == cat){

        container.innerHTML += `
          <ons-card data-option='${item.option || []}' onclick='ajouterAuPanier(${index}, this)'>
            <div style="font-weight: 600;">${item.nom}</div>
            <div style="color: #4B5563;font-size: 14px; line-height: 20px" >${item.prix.toFixed(2)} €</div>
          </ons-card>
        `;
          }
      });


}



function supp_produit(index){

  ons.notification.confirm({ message: 'Supprimer ?', buttonLabels: ["Annuler", "Supprimer"], title: 'Confirmez' })
  .then(function(input) {
        if(input == 1){ 
          var name = allProd[index].nom
          var i = panier.findIndex(item => item.nom === name);
          panier.splice(i, 1);
          renderPanier();
        }
  })

  
}

/*

(nom, prix, element, cat)
ajouterAuPanier(${JSON.stringify(item.nom)}, ${item.prix}, this, ${JSON.stringify(cat)})

*/


function ajouterAuPanier(i, element){
 //var options = JSON.parse(element.getAttribute("data-option"));
  console.log(i);
  nom = allProd[i].nom
  prix = allProd[i].prix
  cat = allProd[i].category
  options = JSON.parse(allProd[i].option)

  


  if (options.length > 0) {
    // Afficher le formulaire de sélection
    //showOptionSelector(nom, prix, options, cat);
      showOptionSelector(i, cat)

  } else {
    panier.push({ nom, prix, qty: 1, checkOption: [] });

    console.log(panier)

    renderPanier();
  }


}



function renderPanier() {
  get_total = 0
  var panierDiv = document.getElementById("panier");
      panierDiv.innerHTML = "";

  panier.forEach((item, index) => {
        let optText = "";



        if(item.checkOption.length > 0){
          item.checkOption.forEach (opt =>{
            optText += `<p class="text-xs-gray-ml">- ${opt.category} : ${opt.selectes}</p>`;
          })

}
          
          
        

        panierDiv.innerHTML += `
          <div onclick="supp_produit(${index})" class="bordered-padding">
            <div class="spacebetween">
              <strong>${item.qty}x ${item.nom}</strong>
              <span>${item.prix.toFixed(2)} €</span>
            </div>
            ${optText}
          </div>`;

    get_total = get_total + item.prix
      });

  console.log(get_total)
  document.querySelector('#get_total').innerText = get_total.toFixed(2)
}




//showOptionSelector(nom, prix, options, cat)
function showOptionSelector(i, cat) {
  nom = allProd[i].nom
  prix = allProd[i].prix
  options = JSON.parse(allProd[i].option)
  
  let html = `<div class="bg-white p-4 rounded shadow">
    <h2 style="margin-bottom: 0.5rem; font-weight: 700;">Options pour ${nom}</h2>`;

  options.forEach(opt => {
    html += `<label style="margin-top: 1rem; font-weight: 600; display: block;">${opt.nom} (max : ${opt.max})</label> <ons-list>`;

    if (opt.max > 1) {
      // Choix multiple (checkboxes)
      opt.liste.forEach((item, i) => {
        html += `
        <ons-list-item tappable>
          <label class="left">
            <ons-checkbox value="${item}" name="${opt.nom}" input-id="checkbox-${opt.nom}-${i}"></ons-checkbox>
          </label>
          <label for="checkbox-${opt.nom}-${i}" class="center">
            ${item}
          </label>
        </ons-list-item>
          `;

        
      });
    } else {
      // Choix unique (radio)
      opt.liste.forEach((item, i) => {
        html += `
          <ons-list-item tappable>
          <label class="left">
            <ons-radio value="${item}" name="${opt.nom}" input-id="radio-${opt.nom}-${i}"></ons-radio>
          </label>
          <label for="radio-${opt.nom}-${i}" class="center">
            ${item}
          </label>
        </ons-list-item>
          `;
      });
    }
  });

  html += `</ons-list> <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;"> 
  <button onclick="document.getElementById('categories').style.display ='grid';document.getElementById('produits').style.display = 'grid'; document.getElementById('select_option_div').style.display = 'none'; document.getElementById('searchInput').value ='' " class="btn-cancel">Annuler</button>  
    <button onclick='validerOptions(${i})'
      class="my-button-valide">Valider</button>
      </div>
  </div>`;


   document.getElementById("select_option_div").innerHTML = html

  document.getElementById("produits").style.display = "none" //grid
  document.getElementById("select_option_div").style.display = "block"

  document.getElementById("categories").style.display = "none"
}



//validerOptions(nom, prix, options, cat)
function validerOptions(i) {
  nom = allProd[i].nom
  prix = allProd[i].prix
  cat = allProd[i].category
  options = JSON.parse(allProd[i].option)
  

  let checkOption = [];
  let valid = true;
  let errorMessage = "";

  options.forEach(opt => {
    let name = opt.nom;
    let choix = opt.choix;
    let max = opt.max;

    let selectedElements = document.querySelectorAll(`[name="${name}"]:checked`);
    let values = Array.from(selectedElements).map(el => el.value);

    if (choix === "obligatoire" && values.length === 0) {
      valid = false;
      errorMessage = `Veuillez choisir une option pour "${name}".`;
    }

    if (values.length > max) {
      valid = false;
      errorMessage = `Trop d'options sélectionnées pour "${name}". Maximum autorisé : ${max}.`;
    }

    val = values

    
    if (values.length === 1) {
      //checkOption[name] = values[0]; // radio ou single checkbox

        checkOption.push({
          category: name,
          selectes: values[0],
          qty: 1
        });


      
    } else if (values.length > 1) {
      //checkOption[name] = values.join(', ');

        checkOption.push({
          category: name,
          selectes: values.join(', '),
          qty: 1
        });

      
    }
    
/*
    values.forEach(value => {
      checkOption.push({
        category: name,
        selectes: value,
        qty: 1
      });
    });
*/



    
  });

  if (!valid) {
    ons.notification.alert(errorMessage);
    return;
  }

  panier.push({ nom, prix, qty: 1, checkOption });
  renderPanier();
  selectCategory(cat); // Retour à la liste

  document.getElementById("categories").style.display = "grid";
  document.getElementById("produits").style.display = "grid";
  document.getElementById("select_option_div").style.display = "none";
  document.getElementById("searchInput").value = ""
}




//mettre message en non lu
function message_lu(index){

  console.log("message lu")

  //upadate message en fetch
  //upadate message
    // => message_lus.push(message_non_lus[index])
    // => message_non_lus.splice(index, 1)
  
  

 
}


/*
document.addEventListener("DOMContentLoaded", function () {
   input = document.getElementById("searchInput");
  if (input) {
    input.addEventListener("input", function (e) {
       value = e.target.value;
      console.log("Recherche :", value);
    });
  }
});
*/




function name_table(){
  
  if(table.length == 0){
    document.querySelector('#modalWait').show()
    getAll_table('cmd')
  } else if (table.length > 0){
    console.log("table")
    
    document.querySelector('#modalWait').hide()

    document.getElementById('my-dialog').show()
      .then (() => {
      document.querySelector('#choose-table-sel select').innerHTML = ""

      table.forEach(item =>{
        document.querySelector('#choose-table-sel select').innerHTML += `<option id="${item.nom}">${item.nom}</option>`
      })

      document.querySelector('#getDial_btn').innerHTML += `
          <ons-button modifier="outline" onclick="document.getElementById('my-dialog').hide()">Annuler</ons-button> 
          <ons-button onclick="select_table()">Confirmer</ons-button> `


      //document.querySelector('#modalWait').hide()
      
    })

    
  }


  
}




function select_table(){
  nom = document.querySelector('#choose-table-sel').value

  document.querySelector('#name_table').innerText = nom
  document.querySelector('#name_table').setAttribute('data-nom', nom)
  document.getElementById('my-dialog').hide()
}





function envoyerCommande() {
      document.querySelector('#modalWait').show()
      var table = document.getElementById("name_table").innerText;
  
      if (!table || panier.length === 0) {
        ons.notification.alert("Merci de sélectionner une table et ajouter des produits !");
        return;
      }

  timeStamp = Date.now()
  get_string_produits_select = JSON.stringify(panier)
  

    let commande = {
        sheet_id : sheet_id,
        nb_Table : table,
        produits: get_string_produits_select,
        creation: timeStamp,
        numero_CMD: `cmd_${timeStamp}`,
        montant: get_total.toFixed(2),
        instruction : instruction,
        serveur_id : user_info.uid,
        statut_Commande : "Envoyer en cuisine",
      };

      //console.log("🧾 Commande envoyée :", commande);


  stringify_data = JSON.stringify(commande)

  data_encode = encodeURIComponent(stringify_data)
  etat = "create_cmd"

  getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
  fetch(getUrl, requestOptionsGet)
    .then((response) => response.json())
    .then((get_data) => {
      if(get_data.success == true){
        document.querySelector('#modalWait').hide()
        ons.notification.alert("Commande envoyée en cuisine !");
        allCmd.push(commande)
        //document.getElementById("back_btn").click();
        loadPage('recu.html')
      }

    })



  

      // 🔔 Simuler envoi en cuisine (à remplacer par un fetch vers votre backend)
     // ons.notification.alert("Commande envoyée en cuisine !");
    }

