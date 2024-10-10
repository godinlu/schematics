<!-- formulaire avec toute les informations -->
<form id="formulaire" action="" method="post">
	<!--première ligne composé de type installation et de la description de l'affaire-->
	<div class="flex">
		
		<!--partie type installation-->
		<div class="rectangle">
			<p>Module de chauffage</p>
			<select id="typeInstallation" name="typeInstallation" class="desc" >
			</select>
		</div>
		<!--menue déroulant pour la description de l'affaire-->
		<div>
			<button  type="button" class="accordion" id="AC_descriptionAffaire">Description de l'affaire</button>
			<div class="panel">
				<table>

						<tr>
							<th colspan="2">Description Installateur</th>
						</tr>
						<tbody id="form_installateur">
							<tr>
								<td>Installateur : </td>
								<td>
									<div class="autocomplete" style="width:200px;">
										<input type="text" class="info autocomplete" id="installateur" name="installateur" required>
									</div>
								</td>
							</tr>
							<tr>
								<td>Prénom/nom : </td>
								<td><input type="text" class="info" id="Prénom/nom" name="Prénom/nom" required></td>
							</tr>
							<tr>
								<td>Adresse mail : </td>
								<td><input type="email" class="info" id="adresse_mail" name="adresse_mail" placeholder="exemple@gmail.com" required></td>
							</tr>
							<tr>
								<td>Commercial : </td>
								<td><input type="text" class="info" id="commercial" name="commercial" required></td>
							</tr>
						</tbody>

						<tr>
							<th colspan="2">Description Client</th>
						</tr>
						<tr>
							<td>Nom : </td>
							<td><input type="text" class="info" id="nom_client" name="nom_client" value=""></td>
						</tr>
						<tr>
							<td>Prénom : </td>
							<td><input type="text" class="info" id="prenom_client" name="prenom_client" value=""></td>
						</tr>
						<tr>
							<td>Adresse : </td>
							<td><input type="text" class="info" id="adresse_client" name="adresse_client" value=""></td>
						</tr>
						<tr>
							<td>Code postal : </td>
							<td><input type="text" class="info" id="code_postale_client" name="code_postale_client" value=""></td>
						</tr>
						<tr>
							<td>Ville : </td>
							<td><input type="text" class="info" id="ville_client" name="ville_client" value=""></td>
						</tr>
						<tr>
							<td>Téléphone : </td>
							<td><input type="text" class="info" id="tel_client" name="tel_client" value=""></td>
						</tr>
						<tr>
							<td>Adress Email : </td>
							<td><input type="email" class="info" id="mail_client" name="mail_client" value=""></td>
						</tr>
						
						
				</table>
			</div>
		</div>
		
	</div>
	
	<!--menue déroulant pour ballon ECS / tampon-->
	<div>
		<button  type="button" class="accordion" id="AC_ballon">Ballons ECS / Tampon</button>
		<div class="panel">
		<div id="PartieBallon">
				<!--tableau ballonECS-->
				<table>
					<tr>
						<td>Ballon ECS : </td>
						<td><select id="ballonECS" class="index bigSelect" name="ballonECS"></select></td>
					</tr>
					<tr>
						
						<td><label for="resistanceElectriqueBECS">Résistance électrique : </label></td>
						<td><input type="checkbox" name="resistanceElectriqueBECS" id="resistanceElectriqueBECS"></td>
					</tr>
				
				</table>
				<!--tableau ballonTampon-->
				<table>
					<tr>
						<td>Ballon tampon : </td>
						<td><select id="ballonTampon" class="index bigSelect" name="ballonTampon" title="Nécessite un SC2"></select></td>
					</tr>
					<tr>
						<td><label for="resistanceElectriqueBT" class="ballonTampon" title="Nécessite un Ballon tampon">Résistance électrique : </label></td>
						<td><input type="checkbox" name="resistanceElectriqueBT" id="resistanceElectriqueBT" title="Nécessite un Ballon tampon" class="ballonTampon"></td>
					</tr>
					<tr>
						<td><label for="EchangeurDansBT" class="ballonTampon" title="Nécessite un Ballon tampon">Échangeur : </label></td>
						<td><input type="checkbox" name="EchangeurDansBT" id="EchangeurDansBT" class="ballonTampon" title="Nécessite un Ballon tampon"></td>
					</tr>
				</table>
			</div>
		</div>

	</div>
	
	<!--menue déroulant pour appoint et raccordement hydraulique-->
	<div>
		<button  type="button" class="accordion" id="AC_appRH">Appoints et raccordement hydraulique</button>
		<div class="panel">
			<!--partie pour l'appoint 1-->
			<fieldset>
				<legend>Appoint 1</legend>
				<table>
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td>Type:</td>
						<td class="precisionAppoint1">Puissance (kW):</td>
						<td class="precisionAppoint1">Zone:</td>
					</tr>
					<tr>
					
						<td>Appoint 1 : </td>
						<td><select id="appoint1" name="appoint1" class="desc bigSelect"></select></td>
						<td>Précision :</td>
						<td>
							<select id="typeAppoint1" class="desc" name="typeAppoint1" title='Nécessite un appoint 1 sur "Autre"'>
							</select>
						</td>
						<td><input type="text" id="puissanceApp1" name="puissanceApp1" class="precisionAppoint1 verif info"></td>
						<td>
							<select class="precisionAppoint1" id="Zone" name="Zone" >
								<option value="Zone non chauffée" selected>Zone non chauffée</option>
								<option value="Zone chauffée" >Zone chauffée</option>
							</select>
					
						</td>
		
					</tr>
				</table>
				<table>
					<tr>
						<td>Raccordement hydraulique :</td>
						<td><select id="raccordementHydraulique" name="raccordementHydraulique" title="Nécessite un appoint 1" class="sonde bigSelect"></select></td>
						<td class="rechauffeur">Position par rapport a la casse Pression :</td>
						<td><select class="rechauffeur" id="Gauche_droite" name="Gauche_droite" >
							<option value="Gauche">Gauche</option>
							<option value="Droite">Droite</option>

						</select></td>
					</tr>
					
				</table>
				<table>
					<tr>
						<td><label for="RDH_appoint1" class="RDH_appoint1" title="nécessite un raccordement hydraulique compatible (échangeur, casse presssion)">Réhaussement des retours sur App 1</label></td>
						<td><input type="checkbox" class="RDH_appoint1" name="RDH_appoint1" id="RDH_appoint1" ></td>
					</tr>
				</table>
			</fieldset>
			<fieldset>
				<legend>Appoint 2</legend>
				<table>
					<tr id="locAppoint2">
						<td>Appoint 2 : </td>
						<td>	
							<input type="radio" name="locAppoint2" value="cascade" id="cascade">
							<label for="cascade">En cascade d'appoint 1</label>
						</td>
						<td>
							<input type="radio" name="locAppoint2" value="C7" id="C7">
							<label for="C7">Circulateur C7</label>
						</td>
						<td>
							<input type="radio" name="locAppoint2" value="Aucun" id="Aucun" checked>
							<label for="Aucun">Aucun</label>								
						</td>
					</tr>
				</table>
				<table>
					<tr>
						<td></td>
						<td>Type:</td>
						<td class="precisionAppoint2">Puissance (kW):</td>
						<td class="precisionAppoint2">Zone:</td>
					</tr>
					<tr>
						<td>Précision appoint 2 : </td>
						<td><select id="appoint2" name="appoint2" title="Nécessite un appoint 2" class="bigSelect"></select></td>
						<td><input type="text" id="puissanceApp1Multiple" name="puissanceApp1Multiple" class="precisionAppoint2"></td>
						<td>
							<select class="precisionAppoint2" id="ZoneMultiple" name="ZoneMultiple">
								<option value="Zone non chauffée" selected>Zone non chauffée</option>
								<option value="Zone chauffée">Zone chauffée</option>
							</select>
						</td>
					</tr>
				</table>
				<table>
					
					<tr>
						<td class="div_RH_appoint2">Raccordement hydraulique</td>
						<td class="div_RH_appoint2"><select id="RH_appoint2" name="RH_appoint2" title="Nécessite un appoint 2 sur C7"></select></td>
						<td><label for="RDH_appoint2" class="RDH_appoint2" title="nécessite un appoint 2 en cascade et un raccordement hydraulique sur 'Appoint double'">Réhaussement des retours sur App 2</label></td>
						<td><input type="checkbox" class="RDH_appoint2" name="RDH_appoint2" id="RDH_appoint2"></td>
					</tr>
				</table>
			</fieldset>
			
			
		</div>
	</div>
	<!--menue déroulant pour champs capteur-->
	<div>
		<button  type="button" class="accordion" id="AC_champCapteur">Panneaux Solaires</button>
		<div class="panel">
		<table>
				<tr>
					<td>Champs capteurs :</td>
					<td><select id="champCapteur" name="champCapteur" class="sonde bigSelect"></select></td>
				</tr>
				
			</table>
			<table>
				<tr>
					<td>Surface (m²) :</td>
					<td><input type="text" class="verif" id="champCapteur_surface" name="champCapteur_surface" value="10"></td>
				</tr>
			</table>
		</div>
	</div>

	<!--menue déroulant pour les zones de chauffages-->
	<div>
		<button  type="button" class="accordion" id="AC_circulateur">Zones de Chauffage</button>
		<div class="panel">
			<table>
				<tr>
					<td>Zone 1 (circulateur 1)</td>
					<td><select id="circulateurC1" name="circulateurC1" class="circulateur desc bigSelect"></select></td>
				</tr>
				<tr>
					<td>Zone 2 (circulateur 2)</td>
					<td><select id="circulateurC2" name="circulateurC2" class="circulateur desc bigSelect"></select></td>
				</tr>
				<tr id ="ligne_circulateurC3">
					<td>Zone 3 (circulateur 3)</td>
					<td><select id="circulateurC3" name="circulateurC3" class="circulateur desc bigSelect"></select></td>
					
				</tr>
				<tr>
					<td>Zone <span id="label_last_zone">4</span> (circulateur 7)<span id="affichage_appoint2"> / Appoint 2</span></td>
					<td><select id="circulateurC7" name="circulateurC7" class="circulateur desc bigSelect sonde"></select></td>
				</tr>
				
			</table>
		</div>
	</div>
	<div class="flex">
		<!--menue déroulant pour options-->
		<div>
			<button  type="button" class="accordion" id="AC_options">Options</button>
			<div class="panel">
				<table>
					<tr>
						<td>Option S10 : </td>
						<td><select id="optionS10" name="optionS10" class="sonde bigSelect"></select></td>
					</tr>
					<tr>
						<td>Option S11 : </td>
						<td><select id="optionS11" name="optionS11" class="sonde bigSelect"></select></td>
					</tr>
				</table>
			</div>
		</div>

		<!--menue déroulant pour divers-->
		<div>
			<button  type="button" class="accordion" id="AC_divers">Divers</button>
			<div class="panel" >
				
				<table>
					<tr>
						<td colspan="2">
							<input type="checkbox" name="D3" id="D3">
							<label for="D3">comptage energétique utile solaire D3</label>
						</td>
						
					</tr>
					<tr>
						<td colspan="2">
							<input type="checkbox" name="D5" id="D5">
							<label for="D5" title="Nécessite un appoint 1">comptage energétique utile appoint D5</label>
						</td>
					</tr>
					<tr>
						<td>Divers sur appoint 1 : </td>
						<td>
							<select name="divers" id="divers" title="Nécessite un appoint 1"></select>
						</td>
					</tr>
				</table>
			</div>
		</div>

	</div>

	<div id="partieDescription">
		<table >
			<tr>
				<td>Date: </td>
				<td id="date"></td>
			</tr>
			<tr>
				<td>Description: </td>
				<td id="description"></td>
			</tr>
		</table>
	</div>

	<input type="hidden" name="description">
</form>
<script>
	const formulaire = <?= json_encode($formulaire) ?>;
	const data_list = <?= $data_list?>;
	const DATA_LIST = data_list.listInfo;
    const DATA_DEFAULT_INDEX = data_list.defaultIndex;
    const DATA_MSG = data_list.forbidMessage;
</script>

	
