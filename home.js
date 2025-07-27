function printQrcodeOnly() {
  var content = document.getElementById('alt_qrCode').outerHTML;

  var printWindow = window.open('', '', 'height=800,width=800');

  printWindow.document.write(`
  <html>
    <head>
      <title>Print</title>
      <style>
        body { margin: 0; padding: 20px; font-family: sans-serif; background: white; }
        #qrcode > * { page-break-inside: avoid; break-inside: avoid; margin: 10px 0; }
        .container_item_qr { display: flex; width: 200px; height: 200px; }

        .main-boxr_item_qr {
          flex: 1;
          margin:auto; }

        .label-boxr_item_qr {
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          writing-mode: vertical-rl;
          transform: rotate(180deg); /* texte lisible de bas en haut */
          color: #000; /* bleu */
          font-family: sans-serif;
          font-size: 24px;
        }
      </style>
    </head>
    <body>
      <h1>Mes tables</h1>
      ${content}

      <script>
        window.onload = function() {
          window.focus();
          window.print();
          window.close();
        }
      <\/script> <!-- 👈 Échapper ici -->
    </body>
  </html>
`);


  printWindow.document.close();



}







  function ask_dld_img(index){
    ons.notification.confirm({ message: 'Télécharger ?', buttonLabels: ["Annuler", "OK"], title: 'Confirmez' })
      .then(function(input) {
            if(input == 1){ dld_imgQR_solo(index) }
    });

  }




  async function dld_imgQR_solo(index){

    document.querySelector('#modalWait').show()
    
    img = document.querySelector(`#img_qr_${index}`)

        try {
          const response = await fetch(img.src, { mode: 'cors' });
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = img.alt  + '.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (err) {
          ons.notification.alert("Erreur lors du téléchargement : " + err.message);
        }

       document.querySelector('#modalWait').hide()

  }




//changement concernant les tables
function change_table(index){
    //table[index]

      ons.notification.confirm({ 
        message: 'Effectuer une modification', 
        buttonLabels: ["Supprimer", "Changer Serveur"], 
        title: table[index].nom,
        cancelable : true
      })
        .then(function(input) {
              if(input == 0){ supp_table(index) } //Supprimer
              else if(input == 1){ add_perso_table(index) } //
      });


  } 



//ajouter une table
function add_table(){
  ons.notification.prompt({ message: 'Nom de la table', buttonLabels: ["Ajouter"], title: 'Ajouter une table', cancelable : true })  .then (function(input) {
        if(input != null){
          get_name = input.trim()

          data = {
            "sheet_name": "Table",
            "sheet_id": user_info.info_user_sheet[0].sheet_id,
            "nom": get_name,
            "creation": Date.now()
          }

          etat = "create_table"

          string_data = JSON.stringify(data)

          data_encode = encodeURIComponent(string_data)

          getUrl = `${url_api}?info=${data_encode}&etat=${etat}`

          fetch(getUrl, requestOptionsGet)
            .then((response) => response.json())
            .then((get_data) =>{
              
              if(get_data.success == true){
                
                table.push({
                  "nom": get_name,
                  "creation": Date.now()
                })
                document.querySelector('#alt_table').innerHTML += ` <ons-list modifier="inset" style="margin-bottom:20px">
                  <ons-list-header>${get_name} </ons-list-header>
                  <ons-list-item onclick="change_table(${table.length - 1})" modifier="longdivider">
                     <div class="center">
                      <span class="list-item__title"></span><span class="list-item__subtitle"></span>
                    </div>
                  </ons-list-item>
                </ons-list>`
              }
              
            })

           .catch((error) => {
              console.error('Erreur:', error);
             ons.notification.alert("Erreur lors de l'ajout de la table : " + error.message);
            })
        }
  })
}


//update table
function add_perso_table(index){

  ons.alert("Cette fonctionnalité n'est pas disponible pour le moment.")

  /*
  => ne fonctionne pas car manager et equipier sont vides !!!!!
  
  document.querySelector(`#select_${index}`).style.display = "block"
  
  allPerso = [...manager, ...equipier]  
  document.querySelector(`#select_${index}`).innerHTML = `<ons-select id="choose-sel" data-index="${index} " onchange="editSelects_perso(event)"></ons-select>`

  allPerso.forEach((item, i) =>{
    document.querySelector(`#select_${index} select`).innerHTML += `<option value="${i}">${item.nom} </option>
    `
  })

  */
}


function editSelects_perso(event){
  document.querySelector(`#select_${index}`).style.display = "block"

  index = event.target.getAttribute('data-index') //index table
  value = event.target.value //index allPerso

  // faire un fetch pour update la table

  document.querySelector(`#nomServeur_${index}`).innerHTML = `<span class="list-item__title">${allPerso[value].nom}</span><span class="list-item__subtitle">${allPerso[value].id}</span>`

  ons.notification.toast("Table mise à jour.", { timeout: 2000 })
}



//supprimer une table
function supp_table(index){
  //faire un fetch pour supprimer la table

  document.querySelector('#modalWait').show()

  

  table.splice(index, 1)
  document.querySelector(`#table_${index}`).remove()

  ons.notification.toast("Table supprimée.", { timeout: 2000 })

  deploy_table()
}
