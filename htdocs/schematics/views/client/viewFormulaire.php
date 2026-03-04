<main>
	<!--première ligne composé de type installation et de la description de l'affaire-->
	<div class="flex">

		<!--partie type installation-->
		<div class="rectangle">
			<p>Module de chauffage</p>
			<select data-field="typeInstallation"></select>
		</div>
		<!--menue déroulant pour la description de l'affaire-->
		<div>
			<button type="button" class="accordion" id="AC_descriptionAffaire">Description de l'affaire</button>
			<div class="panel">
				<table>

					<tr>
						<th colspan="2">Description Installateur</th>
					</tr>
					<tr>
						<td>Installateur : </td>
						<td><input type="text" data-field="installateur"></td>
					</tr>
					<tr>
						<td>Prénom/nom : </td>
						<td><input type="text" data-field="Prénom/nom"></td>
					</tr>
					<tr>
						<td>Adresse mail : </td>
						<td><input type="text" data-field="adresse_mail" placeholder="exemple@gmail.com"></td>
					</tr>
					<tr>
						<td>Commercial : </td>
						<td><input type="text" data-field="commercial"></td>
					</tr>
					<tr>
						<th colspan="2">Description Client</th>
					</tr>
					<tr>
						<td>Nom : </td>
						<td><input type="text" data-field="nom_client"></td>
					</tr>
					<tr>
						<td>Prénom : </td>
						<td><input type="text" data-field="prenom_client"></td>
					</tr>
					<tr>
						<td>Adresse : </td>
						<td><input type="text" data-field="adresse_client"></td>
					</tr>
					<tr>
						<td>Code postal : </td>
						<td><input type="text" data-field="code_postale_client"></td>
					</tr>
					<tr>
						<td>Ville : </td>
						<td><input type="text" data-field="ville_client"></td>
					</tr>
					<tr>
						<td>Téléphone : </td>
						<td><input type="text" data-field="tel_client"></td>
					</tr>
					<tr>
						<td>Adress Email : </td>
						<td><input type="text" data-field="mail_client"></td>
					</tr>
				</table>
			</div>
		</div>

	</div>

	<!--menue déroulant pour ballon ECS / tampon-->
	<div>
		<button type="button" class="accordion" id="AC_ballon">Ballons ECS / Tampon</button>
		<div class="panel">
			<div id="PartieBallon">
				<!--tableau ballonECS-->
				<table>
					<tr>
						<td>Ballon ECS : </td>
						<td>
							<select data-field="ballonECS"></select>
						</td>
					</tr>
					<tr>

						<td><label for="resistanceElectriqueBECS">Résistance électrique : </label></td>
						<td><input type="checkbox" data-field="resistanceElectriqueBECS" id="resistanceElectriqueBECS"></td>
					</tr>

				</table>
				<!--tableau ballonTampon-->
				<table>
					<tr>
						<td>Ballon tampon : </td>
						<td>
							<select data-field="ballonTampon"></select>
						</td>
					</tr>
					<tr>
						<td><label for="resistanceElectriqueBT">Résistance électrique : </label></td>
						<td><input type="checkbox" data-field="resistanceElectriqueBT" id="resistanceElectriqueBT"></td>
					</tr>
					<tr>
						<td><label for="EchangeurDansBT">Échangeur : </label></td>
						<td><input type="checkbox" data-field="EchangeurDansBT" id="EchangeurDansBT" checked></td>
					</tr>
				</table>
			</div>
		</div>

	</div>

	<!--menue déroulant pour appoint et raccordement hydraulique-->
	<div>
		<button type="button" class="accordion" id="AC_appRH">Appoints et raccordement hydraulique</button>
		<div class="panel">
			<!--partie pour l'appoint 1-->
			<fieldset>
				<legend>Appoint 1</legend>
				<table>
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td><label data-field-label="puissanceApp1">Puissance (kW):</label> </td>
						<td><label data-field-label="Zone">Zone:</label></td>
					</tr>
					<tr>

						<td>Appoint 1 : </td>
						<td>
							<select data-field="appoint1"></select>
						</td>
						<td>Précision :</td>
						<td><input type="text" data-field="puissanceApp1"></td>
						<td>
							<select data-field="Zone"></select>

						</td>

					</tr>
				</table>
				<table>
					<tr>
						<td>Raccordement hydraulique :</td>
						<td>
							<select data-field="raccordementHydraulique"></select>
						</td>
						<td><label data-field-label="Gauche_droite">Position par rapport a la casse Pression :</label></td>
						<td>
							<select data-field="Gauche_droite"></select>
						</td>
					</tr>

				</table>
				<table>
					<tr>
						<td><label for="RDH_appoint1">Réhaussement des retours sur App 1</label></td>
						<td><input type="checkbox" id="RDH_appoint1" data-field="RDH_appoint1"></td>
					</tr>
				</table>
			</fieldset>
			<fieldset>
				<legend>Appoint 2</legend>
				<table>
					<tr id="locAppoint2">
						<td>Appoint 2 : </td>
						<td>
							<select data-field="locAppoint2"></select>
						</td>
					</tr>
				</table>
				<table>
					<tr>
						<td></td>
						<td>Type:</td>
						<td><label data-field-label="puissanceApp1Multiple">Puissance (kW):</label> </td>
						<td><label data-field-label="ZoneMultiple">Zone:</label></td>
					</tr>
					<tr>
						<td>Précision appoint 2 : </td>
						<td>
							<select data-field="appoint2"></select>
						</td>
						<td><input type="text" data-field="puissanceApp1Multiple"></td>
						<td>
							<select data-field="ZoneMultiple"></select>
						</td>
					</tr>
				</table>
				<table>

					<tr>
						<td><label data-field-label="RH_appoint2">Raccordement hydraulique</label></td>
						<td>
							<select data-field="RH_appoint2"></select>
						</td>
						<td><label for="RDH_appoint2">Réhaussement des retours sur App 2</label></td>
						<td><input type="checkbox" data-field="RDH_appoint2" id="RDH_appoint2"></td>
					</tr>
				</table>
			</fieldset>


		</div>
	</div>
	<!--menue déroulant pour champs capteur-->
	<div>
		<button type="button" class="accordion" id="AC_champCapteur">Panneaux Solaires</button>
		<div class="panel">
			<table>
				<tr>
					<td>Champs capteurs :</td>
					<td>
						<select data-field="champCapteur"></select>
					</td>
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
		<button type="button" class="accordion" id="AC_circulateur">Zones de Chauffage</button>
		<div class="panel">
			<table>
				<tr>
					<td>Zone 1 (circulateur 1)</td>
					<td>
						<select data-field="circulateurC1"></select>
					</td>
				</tr>
				<tr>
					<td>Zone 2 (circulateur 2)</td>
					<td>
						<select data-field="circulateurC2"></select>
					</td>
				</tr>
				<tr id="ligne_circulateurC3">
					<td>Zone 3 (circulateur 3)</td>
					<td>
						<select data-field="circulateurC3"></select>
					</td>

				</tr>
				<tr>
					<td>Zone <span id="label_last_zone">4</span> (circulateur 7)<span id="affichage_appoint2"> / Appoint 2</span></td>
					<td>
						<select data-field="circulateurC7"></select>
					</td>
				</tr>

			</table>
		</div>
	</div>
	<div class="flex">
		<!--menue déroulant pour options-->
		<div>
			<button type="button" class="accordion" id="AC_options">Options</button>
			<div class="panel">
				<table>
					<tr>
						<td>Option S10 : </td>
						<td>
							<select data-field="optionS10"></select>
						</td>
					</tr>
					<tr>
						<td>Option S11 : </td>
						<td>
							<select data-field="optionS11"></select>
						</td>
					</tr>
				</table>
			</div>
		</div>

		<!--menue déroulant pour divers-->
		<div>
			<button type="button" class="accordion" id="AC_divers">Divers</button>
			<div class="panel">

				<table>
					<tr>
						<td colspan="2">
							<input type="checkbox" data-field="D3" id="D3">
							<label for="D3">comptage energétique utile solaire D3</label>
						</td>

					</tr>
					<tr>
						<td colspan="2">
							<input type="checkbox" data-field="D5" id="D5">
							<label for="D5">comptage energétique utile appoint D5</label>
						</td>
					</tr>
					<tr>
						<td>Divers sur appoint 1 : </td>
						<td>
							<select data-field="divers"></select>
						</td>
					</tr>
				</table>
			</div>
		</div>

	</div>

	<div id="partieDescription">
		<table>
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
</main>