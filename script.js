const url_api = "https://script.google.com/macros/s/AKfycbzQBHptF66yaBXNuJEb5xXElwuh9d5tSM0ekMhy_ehTGvVfC1bmKAlOXHDnwDosi2_9/exec"


let user_info = []
let sheet_id = "1yJpv2N15fNkjhGpmO6FgR7aOTNmOF97eb7oJxxIQZWI"
let folder_id = ""
let resto_info = []
let allPrsl = []
let allProd = []
let allCat = []
let allOption = []
let table = []
let assets = []
let base64Image = []
let manager = []
let equipier = []
let allCmd = []
let dataTag = []
let dayList = []
let message_lus = []
let message_non_lus = []

let instruction = ""

let update_data = {}

let toDay = formatDate(Date.now())


const requestOptionsGet = {
  method: "GET",
  redirect: "follow"
};


const urlGetData = `https://spreadsheets.google.com/feeds/list/${sheet_id}/9/public/values?alt=json`;








ons.ready(() => {
  ons.platform.select('android'); // force Material Design



  document.addEventListener('init', function(event) {

    
    aaa = event
    if (event.target.id === 'login') {
      // 🎯 Appelle ta fonction spécifique ici
      //loadHomeData(); // par exemple

      if (localStorage.getItem("user_infos") != null) {
        document.querySelector('#modalWait').show()
        user_info = JSON.parse(localStorage.getItem("user_infos"));

        document.getElementById('mainNavigator').pushPage('mainApp.html').then(() => {
          document.querySelector('#nom_user').innerText = user_info.info_user_sheet[0].nom
          document.querySelector('#role_user').innerText = user_info.info_user_sheet[0].role
          document.querySelector('#logo_user').src = user_info.info_user_sheet[0].logo

          document.querySelector('#modalWait').hide()

        })

      }
    } else if (event.target.id === 'getDiv') {
      setTimeout(function(){

      if(document.querySelector('ons-page #divPlay #name_table')){
console.log("searchInput")
      /*document.getElementById("searchInput").addEventListener("input", function (e) {
        container = document.getElementById("produits");
         query = e.target.value.toLowerCase();
        let results = [];

        for (let cat in allProd) {
          const produits = allProd[cat];
          produits.forEach(item => {
            if (item.name.toLowerCase().includes(query)) {
              results.push({ ...item, categorie: cat }); // ajoute la catégorie pour info
            }
          });
        }

        searchInput_change(results, query)

          //console.log(query)


      })*/
          
          document.getElementById("searchInput").addEventListener("input", function (e) {
            var input = document.getElementById("searchInput");
          var resultsContainer = document.getElementById("produits");

          
            var query = document.getElementById("searchInput").value.toLowerCase();

            var filtered = allProd.filter(prod => prod.nom.toLowerCase().includes(query));

            resultsContainer.innerHTML = ""; // Clear previous results

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

            if(query == ""){
                resultsContainer.innerHTML = ""
              }

        });




        
      }

      }, 1000)

    }
  });


  

document.querySelector('#mainNavigator').addEventListener('postpop', function(event) {

   page = document.getElementById('content').page;

    console.log("⬅️ Retour sur la page :", page);

  if(page == "article.html"){

    deployArticle()
 
  /*  
   
    if(update_data.action == "modif"){

      if(update_data.data.nom){
        allProd[update_data.index].nom = update_data.data.nom
      document.querySelector(`#prod_${update_data.index} .list-item__title`).innerText = update_data.data.nom }

      if(update_data.data.prix){
        allProd[update_data.index].prix = update_data.data.prix
      document.querySelector(`#prod_${update_data.index} .list-item__subtitle`).innerText = `${update_data.data.prix} €` } 

      if(update_data.data.img){
        allProd[update_data.index].img = update_data.data.img
      document.querySelector(`#prod_${update_data.index} .list-item__thumbnail`).src = update_data.data.img
      }
      console.log(update_data)
      
    } else if(update_data.action == "ajouter"){
      allProd.push(update_data.data)
      index = allProd.length - 1

      document.querySelector(`#cat_${update_data.data.category}`).innerHTML += `<ons-list-item id="prod_${index}" onclick="getHtml('addProd_article', 'Modifier un produit', '${index}')">
            <div class="left">
              <img class="list-item__thumbnail" src="${update_data.data.img}">
            </div>
            <div class="center">
              <span class="list-item__title">${update_data.data.nom}</span><span class="list-item__subtitle">${update_data.data.prix} €</span>
            </div>
          </ons-list-item>`

      
    }

    */

  } else if(page == "recu.html"){
    setTimeout(() => {
    
    dateInput = document.getElementById("date-picker");
    formattedDate = formatDateToPicker(toDay)
    dateInput.value = formattedDate;

      document.querySelector('#recuTemplate').style.display = 'block'; document.querySelector('#getScan_recu').style.display = 'none';
document.getElementById('recuBox_fab').style.visibility = 'visible'

      deployRecu(toDay)
      }, 50)
  } else if(page == "getDiv.html"){
    console.log("getDiv.html")
  }

    // Exemple : afficher avec un toast
    ons.notification.toast(`Retour sur la page : ${page}`, { timeout: 2000 });
  });



});



function login() {
  // Tu peux ici faire une vérification (ex: fetch vers un serveur)
  // Puis charger l'application principale avec le splitter

  document.querySelector('#modalWait').show()

  emailCo = document.querySelector('#emailCo').value.trim()
  passwordCo = document.querySelector('#passwordCo').value.trim()

  if (emailCo == "" || passwordCo == "") {
    ons.notification.alert("Veuillez remplir tous les champs.");
  } else {
    document.querySelector('#modalWait').show();

    data = JSON.stringify({
      "email": emailCo,
      "password": passwordCo
    })

    data_encode = encodeURIComponent(data)

    etat = "get_userFirebase_info"
    getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
    fetch(getUrl, requestOptionsGet)
      .then((response) => response.json())
      .then((get_data) => {
        //console.log(user_info = get_data)

        if (get_data.success == true) {
          console.log(get_data)
          localStorage.setItem("user_infos", JSON.stringify(get_data));
          user_info = get_data

          document.querySelector('#modalWait').hide()

          document.getElementById('mainNavigator').pushPage('mainApp.html').then(() => {
            document.querySelector('#nom_user').innerText = get_data.info_user_sheet[0].nom
            document.querySelector('#role_user').innerText = get_data.info_user_sheet[0].role
            document.querySelector('#logo_user').src = get_data.info_user_sheet[0].logo


          })
        }

      })

  }




}


function logout(){
  localStorage.removeItem('user_infos');
  document.getElementById('mainNavigator').pushPage('login.html');
  
}

//show or hide password
function togglePassword() {
  const input = document.getElementById("passwordCo");
  const icon = document.getElementById("eyeIcon");
  const label = document.getElementById("eyeLabel");

  if (input.type === "password") {
    input.type = "text";
    icon.setAttribute("icon", "fa-eye-slash");
    label.textContent = " Masquer";
  } else {
    input.type = "password";
    icon.setAttribute("icon", "fa-eye");
    label.textContent = " Afficher";
  }
}



function goToRegister() {
  document.getElementById('mainNavigator').pushPage('register.html');
}

function goToForgotPassword() {
  document.getElementById('mainNavigator').pushPage('forgot-password.html');
}



function loadPage(page) {
  document.getElementById('content').load(page);
  document.getElementById('menu').close();

  console.log("➡️ Chargement de la page :", page);

  if (page == "article.html") {
    document.querySelector('#modalWait').show()

    if (allProd.length > 0) {
      setTimeout(() => {
        deployArticle()
      }, 1000)
      
    } else {
    getCategory_info()
    }
  
  } else if(page == "recu.html"){
      document.querySelector('#modalWait').show()

    setTimeout(() => {
      dateInput = document.getElementById("date-picker").value = formatDateToPicker(toDay)
    }, 50)

      if (allCmd.length > 0) {
        setTimeout(() => {
          deployRecu(toDay)
        }, 1000)

      } else {
        console.log("getRecu_info")
      getRecu_info()
      }


    
  
  } else if(page == "newCmd.html"){
      document.querySelector('#modalWait').show()
      setTimeout(() =>{
        deployMenu_cmd()
      }, 50)
  }


  
}



function backHome(divId, box) {
  document.querySelectorAll('.allDivs').forEach(el => el.style.display = 'none');

  document.querySelector(`#${divId}`).style.display = 'block';
  document.querySelector(`#${box}_fab`).style.display = 'inline-block ';
}



// Fonction pour charger le contenu d'un fichier HTML dans une div spécifique
function getHtml(divEx, title, index) {

  console.log(index)
  document.querySelector('#mainNavigator').pushPage('getDiv.html')
    .then(() => {
      document.querySelector('#modalWait').show()

      document.querySelector('#divTitle').innerText = title


      fetch('expend.html')
        .then(response => response.text())
        .then(htmlText => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = htmlText;

          // Extraire l'élément #article_addProd
          const articleContent = tempDiv.querySelector(`#${divEx}`);

          if (articleContent) {
            document.querySelector(`#divPlay`).innerHTML = articleContent.innerHTML;


            /*
            if(divEx == 'addProd_article'){
              changeImgProd();
            }
            */


          } else {
            console.warn(`${divEx} non trouvé dans expend.html`);
          }
        }).then(() => {
          if (divEx == 'managers') {

            if(allPrsl = []){
              call_personnel("manager")
            } else if (allPrsl.length > 0){
              putManager_template()
            }

            
          } else if (divEx == 'equipiers') {
            
            if(allPrsl = []){
              call_personnel("equipier")
            } else if (allPrsl.length > 0){
              putEquipier_template()
            }

            
          } else if (divEx == 'gallery') {

            if(assets = []){
              call_assets()
            } else if (assets.length > 0){
              putAssets_template()
            }

            
          } else if (divEx == 'addProd_article'/* && index != undefined*/) {
            modif_produit(index)

            
          } else if (divEx == 'modifCat_article') {
              modifCat_template()

          } else if (divEx == 'get_option') {
                deployOptions()

          } else if(divEx == "getRecu"){
            getRecu_template(index)
            
          } else if(divEx == "newCommande"){
              //document.querySelector('ons-page').id = "newcmd"
              deployMenu_cmd()
          } else if(divEx == "qrCode"){
            deploy_qrCode()
          } else if(divEx == "get_table"){

            if(table.length == 0){
              getAll_table('table')
            } else {
              deploy_table()
            }
            
          } else {
            document.querySelector('#modalWait').hide()
          }

        })
        .catch(err => {
          console.error('Erreur lors du chargement de expend.html:', err);
        });


    })
}




/***** Articles ********/


// Fonction pour déplacer un tag Catégorie vers le haut
function moveUp(button) {
  const item = button.closest('ons-list-item');
  const prev = item.previousElementSibling;
  if (prev) {
    item.parentElement.insertBefore(item, prev);
  }
}

// Fonction pour déplacer un tag Catégorie vers le bas
function moveDown(button) {
  const item = button.closest('ons-list-item');
  const next = item.nextElementSibling;
  if (next) {
    item.parentElement.insertBefore(next, item);
  }

}

// Fonction pour obtenir l'ordre actuel des tags Catégorie
function getCurrentTagOrder() {
  const items = document.querySelectorAll('#tagsContainer ons-list-item .tag');
  return Array.from(items).map(tag => tag.dataset.tag);
}


//afficher ou cacher la liste des options
function checkOptionProd(event) {
  const isChecked = event.target.checked;
  console.log(isChecked);


  if (isChecked == true) {
    document.getElementById('listOptionProd').style.display = "block";
  } else {
    document.getElementById('listOptionProd').style.display = "none";
  }

}



//function obselète
/*
function changeImgProd(event){
//document.getElementById('newImgProd').addEventListener('change', //function(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('preview_newProd').src = e.target.result;
    };
    reader.readAsDataURL(file); // Convertit l'image en base64
  } else {
    alert("Veuillez sélectionner une image valide.");
  }
//});
}
*/



//onChange dans expend.html > #gallery > #newImage > input
function newImage(event) {

  var files = event.target.files;
  for (let file of files) {
    if (file.type.startsWith('image/')) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var get_base64 = e.target.result;
        var get_fileName = file.name;
        var get_fileType = file.type;

        var getVal = { get_base64, get_fileName, get_fileType }

        base64Image.push(getVal);
        document.getElementById('get_all_newImg').innerHTML += `
            <img onclick="supp_one_Img('${get_base64}')" src="${e.target.result}" style="width:100px;margin:5px;">
          `;
      };
      reader.readAsDataURL(file);
    }
  }


}



//supprimer une image selectionnée mais pas encore téléchargée
function supp_one_Img(get_base64) {

  ons.notification.confirm({
    buttonLabels: ["Annuler", "Supprimer"],
    message: "Voulez-vous supprimer cette image ?",
    title: "Supprimer l'image",
  }).then(function(index) {
    if (index === 1) {

      base64Image = base64Image.filter(img => img.get_base64 !== get_base64);
      var imgElement = document.querySelector(`img[src="${get_base64}"]`);

      imgElement.remove();
    }
  })

}


//ajouter image à Assets dans google sheet
function addImg() {
  //faire un fetch pour ajouter les images dans le drive => fait
  //faire un fetch pour ajouter les images dans la sheet

  document.querySelector('#modalWait').show();
  document.querySelector('#progress_waiting').style.display = "block";

  adding_compteur = 0

  base64Image.forEach(item => {

    adding_compteur++

    matches = item.get_base64.match(/^data:(.+);base64,(.+)$/);

    postData = {
      "sheet_id": "1yJpv2N15fNkjhGpmO6FgR7aOTNmOF97eb7oJxxIQZWI", //sheet_id,
      "base64": matches[2],
      "file_name": item.get_fileName,
      "file_type": item.get_fileType,
      "folder_id": "1yBcQmj4HSEacSY_7RyHMv-LeOgRlPI8U" //folder_id
    }

    formBody = new URLSearchParams(postData).toString();

    fetch(url_api, {
      method: 'POST', // Utilise la méthode POST
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody
    }).then(res => res.json())
      .then((get_data) => {
        bbb = get_data
        console.log(get_data)

        if (get_data.success == true) {
          
            assets.push(get_data.message)
            document.querySelector('#assets_container').innerHTML += `<div class="image-container" data-id="${get_data.message.id}" onclick="toggleSelection(this)">   <img class="img_gallery" src="${get_data.message.url }">
        <div class="checkmark">✓</div> </div>`
          
          console.log("Image ajoutée avec succès.")

          if (adding_compteur == base64Image.length) {
            document.querySelector('#modalWait').hide();
            ons.notification.alert("Les images ont été ajoutées avec succès.");


            document.querySelector('#newImage').style.display = "none";
            document.querySelector('#image-gallery').style.display = "flex";

          } else if (adding_compteur < base64Image.length) {
            document.querySelector('#progress_waiting').innerText = `Images téléchargés : ${adding_compteur} sur ${base64Image.length}`
          }


        }

      })
      .catch(error => {
        console.error("Erreur lors de l'ajout de l'image:", error);
      })





  })

}


// afficher ou cacher le checkmark en fonction de la sélection pour les images dans la gallery
function toggleSelection(container) {
  container.classList.toggle('selected');
}



//supprimer image en bulk dans la galery + faire un fetch pour supprimer dans le drive
function supprimerImages() {
  const selectedImages = document.querySelectorAll('.image-container.selected');
  const selectedIds = [];

  selectedImages.forEach(div => {
    const id = div.dataset.id;
    selectedIds.push(id);
  });

  if (selectedIds.length === 0) {
    ons.notification.alert("Aucune image sélectionnée.");
  } else {
    ons.notification.alert("Images sélectionnées : " + selectedIds.join(', '));
  }
}


function getAll_Assets() {
  document.querySelector('#modalWait').show().then(() => {

    if(assets.length > 0){
      document.querySelector('#modalWait').hide()
      document.querySelector('#modalPic').show().then(() => {
        document.querySelector('#image-gallery_modalPic').innerHTML = ""

        assets.forEach((item, index) => {
          document.querySelector('#image-gallery_modalPic').innerHTML += `<div class="image-container" data-id="${item.id}" onclick="selection_img(this)">
        <img src="${item.url}">
        <div class="checkmark">✓</div>
        </div>`


        })
        
      })
    }


    data = JSON.stringify({
      "sheet_name": "Assets",
      "sheet_id": "1yJpv2N15fNkjhGpmO6FgR7aOTNmOF97eb7oJxxIQZWI" //user_info.info_user_sheet[0].sheet_id
    })


    data_encode = encodeURIComponent(data)

    etat = "get_all_info"
    getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
    fetch(getUrl, requestOptionsGet)
      .then((response) => response.json())
      .then((get_data) => {
        document.querySelector('#modalWait').hide()
        document.querySelector('#modalPic').show().then(() => {
          document.querySelector('#image-gallery_modalPic').innerHTML = ""
          assets = get_data

          assets.forEach((item, index) => {
            document.querySelector('#image-gallery_modalPic').innerHTML += `<div class="image-container" data-id="${item.id}" onclick="selection_img(this)">
          <img src="${item.url}">
          <div class="checkmark">✓</div>
        </div>`


          })


        })

      })

  })
}




//selectionner une image dans la gallery quand tu ajoute ou modifie un produit
function selection_img(e) {
  document.querySelector('#preview_newProd').src = e.querySelector('img').src

  document.querySelector('#modalPic').hide()
}


//ajouter ou modifier un produit
function addProd(action, index){
  //faire un fetch pour ajouter ou modifier un produit

  document.querySelector('#modalWait').show()

  new_img = document.querySelector('#preview_newProd').src
  new_cat = document.querySelector('#selectCat').value
  new_nom = document.querySelector('#nomProd').value
  new_prix = document.querySelector('#prixProd').value
  new_desc = document.querySelector('#descriptionProd').value
  new_taux = document.querySelector('#tauxProd').value
  new_active = document.querySelector('#check_ActiveProd').checked
  new_option = []

  date_now = Date.now()
  if (document.querySelector('#checkOptionProd').checked == true){

    document.querySelectorAll('#listOptionProd ons-checkbox').forEach(item =>{
      if(item.checked == true){
        allOption.forEach(opt =>{
          if(opt.nom == item.value){
            new_option.push(opt)
          }
        })

      }
    })

    
  } else if(document.querySelector('#checkOptionProd').checked == false){
      new_option = ""
  }

  new_option = JSON.stringify(new_option)
  

    new_data = {
    "creation" : date_now,
    "id" : date_now,
    "nom" : new_nom,
    "category" : new_cat,
    "description" : new_desc,	
    "prix" : Number(new_prix).toFixed(2),
    "img" : new_img,
    "taxeCode" : "", //a supprimer de la sheet
    "taxeTaux" : Number(new_taux).toFixed(2), //a supprimer de la sheet
    "option" : new_option,
    "active": `${new_active}`,
    "sheet_id": sheet_id
    }



  const champsObligatoires = ['creation', 'id', 'nom', 'category', 'description', 'prix', 'img', 'taxeTaux', 'active'];

  var champsManquants = champsObligatoires.filter(key => {
    var val = new_data[key];
    return val === null || val === undefined || val === '';
  });

  if (champsManquants.length > 0) {
    console.warn("⚠️ Champs manquants :", champsManquants);
    return  ons.notification.alert('Renseignez les champs obligatoires.') //false
  } else {
    console.log("✅ Tous les champs obligatoires sont renseignés.");
  }


 

  
  
  if(action == "new"){
    //console.log(new_data)

    stringify_data = JSON.stringify(new_data)

    data_encode = encodeURIComponent(stringify_data)

    etat = "create_article"
    getUrl = `${url_api}?info=${data_encode}&etat=${etat}`
    fetch(getUrl, requestOptionsGet)
      .then((response) => response.json())
      .then((get_data) => {
        console.log(get_data)
        update_data = {action: "ajouter", data: new_data }

        document.querySelector('#modalWait').hide()
      })
    
  } else if(action == "modif"){
     post_newData = {};

    for (let key in new_data) {
      if (new_data[key] !== old_data[key] && key != "id" && key != "creation") {
        post_newData[key] = new_data[key];
      }
    }

    post_newData.id = old_data.id;


    stringify_update_data = JSON.stringify(post_newData)

    data_encode_update = encodeURIComponent(stringify_update_data)

    etat = "updateInfo_produit"
    getUrl = `${url_api}?info=${data_encode_update}&etat=${etat}`
    fetch(getUrl, requestOptionsGet)
      .then((response) => response.json())
      .then((get_data) => {
        console.log(get_data)
        update_data = {action: "modif", data: post_newData, index: index}
        document.querySelector('#modalWait').hide()
      })

    //console.log(post_newData);
    
  }


  
  
}
