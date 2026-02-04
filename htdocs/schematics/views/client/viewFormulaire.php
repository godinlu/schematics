<main>
	<!--première ligne composé de type installation et de la description de l'affaire-->
	<div class="flex">

		<!--partie type installation-->
		<div class="rectangle">
			<p>Module de chauffage</p>
			<select data-field="typeInstallation">
				<option value="SC1Z">SC1Z</option>
				<option value="SC1">SC1</option>
				<option value="SC2" selected>SC2</option>
				<option value="SC1K">SC1K</option>
				<option value="SC2K">SC2K</option>
				<option value="HydrauBox 1">HydrauBox 1</option>
				<option value="HydrauBox 2">HydrauBox 2</option>
			</select>
		</div>
		<!--menue déroulant pour la description de l'affaire-->
		<div>
			<button type="button" class="accordion" id="AC_descriptionAffaire">Description de l'affaire</button>
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
		<button type="button" class="accordion" id="AC_ballon">Ballons ECS / Tampon</button>
		<div class="panel">
			<div id="PartieBallon">
				<!--tableau ballonECS-->
				<table>
					<tr>
						<td>Ballon ECS : </td>
						<td>
							<select data-field="ballonECS">
								<option value="ballon ECS 2 échangeurs" selected>ballon ECS 2 échangeurs</option>
								<option value="ballon ECS 2 échangeurs avec bouclage sanitaire">ballon ECS 2 échangeurs avec bouclage sanitaire</option>
								<option value="ballon ECS et ballon appoint en série">ballon ECS et ballon appoint en série</option>
								<option value="ballon ECS et ballon appoint en série avec bouclage sanitaire">ballon ECS et ballon appoint en série avec bouclage sanitaire</option>
								<option value="ballon ECS tank in tank">ballon ECS tank in tank</option>
								<option value="ballon d'eau chaude sur échangeur">ballon d'eau chaude sur échangeur</option>
								<option value="ballon elec en sortie ballon solaire avec bouclage sanitaire">ballon elec en sortie ballon solaire avec bouclage sanitaire</option>
								<option value="Ballon hygiénique avec 1 echangeur">Ballon hygiénique avec 1 echangeur</option>
								<option value="Ballon hygiénique avec 2 echangeurs">Ballon hygiénique avec 2 echangeurs</option>
								<option value="Aucun">Aucun</option>
							</select>
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
							<select data-field="ballonTampon">
								<option value="Ballon tampon" selected>Ballon tampon</option>
								<option value="2 ballons tampons en série">2 ballons tampons en série</option>
								<option value="3 ballons tampons en série">3 ballons tampons en série</option>
								<option value="ballon tampon en eau chaude sanitaire">ballon tampon en eau chaude sanitaire</option>
								<option value="Aucun">Aucun</option>
							</select>
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
							<select data-field="appoint1">
								<option value="Chaudière fioul" selected>Chaudière fioul</option>
								<option value="Chaudière gaz">Chaudière gaz</option>
								<option value="Chaudière condensation fioul">Chaudière condensation fioul</option>
								<option value="Chaudière condensation gaz">Chaudière condensation gaz</option>
								<option value="Electrique">Electrique</option>
								<option value="Pompe à chaleur">Pompe à chaleur</option>
								<option value="Bois granulés sur T16">Bois granulés sur T16</option>
								<option value="Bois sur T16">Bois sur T16</option>
								<option value="Aucun">Aucun</option>
							</select>
						</td>
						<td>Précision :</td>
						<td><input type="text" data-field="puissanceApp1"></td>
						<td>
							<select data-field="Zone">
								<option value="Zone non chauffée" selected>Zone non chauffée</option>
								<option value="Zone chauffée">Zone chauffée</option>
							</select>

						</td>

					</tr>
				</table>
				<table>
					<tr>
						<td>Raccordement hydraulique :</td>
						<td>
							<select data-field="raccordementHydraulique">
								<option value="Appoint simple" selected>Appoint simple</option>
								<option value="Appoint sur casse pression">Appoint sur casse pression</option>
								<option value="Appoint sur échangeur">Appoint sur échangeur</option>
								<option value="Appoint simple T16">Appoint simple T16</option>
								<option value="Appoint sur casse pression T16">Appoint sur casse pression T16</option>
								<option value="Appoint sur échangeur T16">Appoint sur échangeur T16</option>
								<option value="Appoint sur tampon avec échangeur T16 S10">Appoint sur tampon avec échangeur T16 S10</option>
								<option value="Appoint double en cascade sur casse pression">Appoint double en cascade sur casse pression</option>
								<option value="Appoint double en cascade sur casse pression T16">Appoint double en cascade sur casse pression T16</option>
								<option value="Appoint sur casse pression et réchauffeur de boucle">Appoint sur casse pression et réchauffeur de boucle</option>
								<option value="Appoint sur casse pression et réchauffeur de boucle T16">Appoint sur casse pression et réchauffeur de boucle T16</option>
								<option value="Appoint sur échangeur et réchauffeur de boucle">Appoint sur échangeur et réchauffeur de boucle</option>
								<option value="Appoint sur échangeur et réchauffeur de boucle T16">Appoint sur échangeur et réchauffeur de boucle T16</option>
								<option value="Appoint double sur échangeur">Appoint double sur échangeur</option>
								<option value="Appoint double sur échangeur T16">Appoint double sur échangeur T16</option>
								<option value="Appoint double">Appoint double</option>
								<option value="En direct">En direct</option>
							</select>
						</td>
						<td><label data-field-label="Gauche_droite">Position par rapport a la casse Pression :</label></td>
						<td>
							<select data-field="Gauche_droite">
								<option value="Gauche" selected>Gauche</option>
								<option value="Droite">Droite</option>

							</select>
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
							<input type="radio" name="locAppoint2" data-field="locAppoint2" value="cascade" id="cascade">
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
						<td><label data-field-label="puissanceApp1Multiple">Puissance (kW):</label> </td>
						<td><label data-field-label="ZoneMultiple">Zone:</label></td>
					</tr>
					<tr>
						<td>Précision appoint 2 : </td>
						<td>
							<select data-field="appoint2">
								<option value="Electrique">Electrique</option>
								<option value="Gaz">Gaz</option>
								<option value="Gaz condensation">Gaz condensation</option>
								<option value="Fioul">Fioul</option>
								<option value="Fioul condensation">Fioul condensation</option>
								<option value="PAC">PAC</option>
								<option value="Granulé">Granulé</option>
								<option value="Granulé condensation">Granulé condensation</option>
								<option value="Bois">Bois</option>
								<option value="Appoint bois">Appoint bois</option>
								<option value="Appoint granulé">Appoint granulé</option>
								<option value="Appoint multiple">Appoint multiple</option>
								<option value="Aucun" selected>Aucun</option>
							</select>
						</td>
						<td><input type="text" data-field="puissanceApp1Multiple"></td>
						<td>
							<select data-field="ZoneMultiple">
								<option value="Zone non chauffée" selected>Zone non chauffée</option>
								<option value="Zone chauffée">Zone chauffée</option>
							</select>
						</td>
					</tr>
				</table>
				<table>

					<tr>
						<td><label data-field-label="RH_appoint2">Raccordement hydraulique</label></td>
						<td>
							<select data-field="RH_appoint2">
								<option value="simple" selected>simple</option>
								<option value="sur casse pression">sur casse pression</option>
								<option value="sur échangeur">sur échangeur</option>
							</select>
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
						<select data-field="champCapteur">
							<option value="1 champ capteurs" selected>1 champ capteurs</option>
							<option value="2 champs capteurs en série">2 champs capteurs en série</option>
							<option value="2 champs capteurs en parallèle">2 champs capteurs en parallèle</option>
							<option value="1 champ capteurs découplé sur casse pression sur T16">1 champ capteurs découplé sur casse pression sur T16</option>
							<option value="1 champ capteurs découplé sur échangeur sur T16">1 champ capteurs découplé sur échangeur sur T16</option>
							<option value="1 champ capteurs sur double circulateur sur échangeur sur T16">1 champ capteurs sur double circulateur sur échangeur sur T16</option>
							<option value="1 champ capteurs découplé sur casse pression sur T15">1 champ capteurs découplé sur casse pression sur T15</option>
							<option value="1 champ capteurs découplé sur échangeur sur T15">1 champ capteurs découplé sur échangeur sur T15</option>
							<option value="2 champs capteurs sur V3V">2 champs capteurs sur V3V</option>
							<option value="2 champs capteurs découplés sur casse pression">2 champs capteurs découplés sur casse pression</option>
							<option value="2 champs capteurs découplés sur échangeur">2 champs capteurs découplés sur échangeur</option>
							<option value="Aucun">Aucun</option>
						</select>
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
						<select data-field="circulateurC1">
							<option value="Plancher chauffant" selected>Plancher chauffant</option>
							<option value="Plancher chauffant sur V3V">Plancher chauffant sur V3V</option>
							<option value="Radiateurs">Radiateurs</option>
							<option value="Radiateurs sur échangeur à plaques">Radiateurs sur échangeur à plaques</option>
							<option value="Radiateurs sur casse pression">Radiateurs sur casse pression</option>
							<option value="Piscine sur échangeur multi tubulaire">Piscine sur échangeur multi tubulaire</option>
							<option value="Piscine sur échangeur à plaques">Piscine sur échangeur à plaques</option>
							<option value="Ventilo convecteur">Ventilo convecteur</option>
							<option value="Décharge sur zone">Décharge sur zone</option>
							<option value="Décharge sur zone PC">Décharge sur zone PC</option>
							<option value="Multi zones radiateurs">Multi zones radiateurs</option>
							<option value="Multi zones PC sur V3V">Multi zones PC sur V3V</option>
							<option value="Multi zones PC">Multi zones PC</option>
							<option value="Process">Process</option>
							<option value="Process sur échangeur V3V">Process sur échangeur V3V</option>
							<option value="Aucun">Aucun</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>Zone 2 (circulateur 2)</td>
					<td>
						<select data-field="circulateurC2">
							<option value="Plancher chauffant">Plancher chauffant</option>
							<option value="Radiateurs">Radiateurs</option>
							<option value="Radiateurs sur échangeur à plaques">Radiateurs sur échangeur à plaques</option>
							<option value="Radiateurs sur casse pression">Radiateurs sur casse pression</option>
							<option value="Piscine sur échangeur multi tubulaire">Piscine sur échangeur multi tubulaire</option>
							<option value="Piscine sur échangeur à plaques">Piscine sur échangeur à plaques</option>
							<option value="Ventilo convecteur">Ventilo convecteur</option>
							<option value="Décharge sur zone">Décharge sur zone</option>
							<option value="Décharge sur zone PC">Décharge sur zone PC</option>
							<option value="Multi zones radiateurs">Multi zones radiateurs</option>
							<option value="Multi zones PC">Multi zones PC</option>
							<option value="Process">Process</option>
							<option value="Process sur échangeur V3V">Process sur échangeur V3V</option>
							<option value="Idem zone N-1">Idem zone N-1</option>
							<option value="Aucun" selected>Aucun</option>
						</select>
					</td>
				</tr>
				<tr id="ligne_circulateurC3">
					<td>Zone 3 (circulateur 3)</td>
					<td>
						<select data-field="circulateurC3">
							<option value="Plancher chauffant">Plancher chauffant</option>
							<option value="Radiateurs">Radiateurs</option>
							<option value="Radiateurs sur échangeur à plaques">Radiateurs sur échangeur à plaques</option>
							<option value="Radiateurs sur casse pression">Radiateurs sur casse pression</option>
							<option value="Piscine sur échangeur multi tubulaire">Piscine sur échangeur multi tubulaire</option>
							<option value="Piscine sur échangeur à plaques">Piscine sur échangeur à plaques</option>
							<option value="Ventilo convecteur">Ventilo convecteur</option>
							<option value="Décharge sur zone">Décharge sur zone</option>
							<option value="Décharge sur zone PC">Décharge sur zone PC</option>
							<option value="Multi zones radiateurs">Multi zones radiateurs</option>
							<option value="Multi zones PC">Multi zones PC</option>
							<option value="Process">Process</option>
							<option value="Process sur échangeur V3V">Process sur échangeur V3V</option>
							<option value="Idem zone N-1">Idem zone N-1</option>
							<option value="Aucun" selected>Aucun</option>
						</select>
					</td>

				</tr>
				<tr>
					<td>Zone <span id="label_last_zone">4</span> (circulateur 7)<span id="affichage_appoint2"> / Appoint 2</span></td>
					<td>
						<select data-field="circulateurC7">
							<option value="Plancher chauffant">Plancher chauffant</option>
							<option value="Radiateurs">Radiateurs</option>
							<option value="Radiateurs sur échangeur à plaques">Radiateurs sur échangeur à plaques</option>
							<option value="Radiateurs sur casse pression">Radiateurs sur casse pression</option>
							<option value="Piscine sur échangeur multi tubulaire">Piscine sur échangeur multi tubulaire</option>
							<option value="Piscine sur échangeur à plaques">Piscine sur échangeur à plaques</option>
							<option value="Ventilo convecteur">Ventilo convecteur</option>
							<option value="Décharge sur zone">Décharge sur zone</option>
							<option value="Décharge sur zone PC">Décharge sur zone PC</option>
							<option value="Multi zones radiateurs">Multi zones radiateurs</option>
							<option value="Multi zones PC">Multi zones PC</option>
							<option value="Process">Process</option>
							<option value="Process sur échangeur V3V">Process sur échangeur V3V</option>
							<option value="Idem zone N-1">Idem zone N-1</option>
							<option value="Appoint bois">Appoint bois</option>
							<option value="Appoint granulé">Appoint granulé</option>
							<option value="Appoint multiple">Appoint multiple</option>
							<option value="Aucun" selected>Aucun</option>
						</select>
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
						<td><select data-field="optionS10">
								<option value="V3V bypass appoint 1">V3V bypass appoint 1</option>
								<option value="V3V retour bouclage sanitaire solaire">V3V retour bouclage sanitaire solaire</option>
								<option value="Piscine déportée T15">Piscine déportée T15</option>
								<option value="Piscine déportée T6">Piscine déportée T6</option>
								<option value="Activable par case à cocher">Activable par case à cocher</option>
								<option value="Décharge sur zone 1">Décharge sur zone 1</option>
								<option value="ON en mode solaire">ON en mode solaire</option>
								<option value="Sortie Idem C4">Sortie Idem C4</option>
								<option value="V3V décharge zone 1">V3V décharge zone 1</option>
								<option value="Electrovanne Appoint 1 ou Flow Switch">Electrovanne Appoint 1 ou Flow Switch</option>
								<option value="Horloge ON de 5h à 8h, 11h30 à 14h et 16h30 à 23h">Horloge ON de 5h à 8h, 11h30 à 14h et 16h30 à 23h</option>
								<option value="Sortie Idem C1">Sortie Idem C1</option>
								<option value="Sortie Idem C2">Sortie Idem C2</option>
								<option value="Sortie Idem C3">Sortie Idem C3</option>
								<option value="ON en mode excédent d'énergie l'été">ON en mode excédent d'énergie l'été</option>
								<option value="Circulateur chaudière 1">Circulateur chaudière 1</option>
								<option value="Circulateur chaudière 2">Circulateur chaudière 2</option>
								<option value="Sortie Idem C5">Sortie Idem C5</option>
								<option value="Sortie Idem C6">Sortie Idem C6</option>
								<option value="Sortie Idem C7">Sortie Idem C7</option>
								<option value="Sortie Idem S11">Sortie Idem S11</option>
								<option value="CESI déportée sur T15">CESI déportée sur T15</option>
								<option value="ON buches en demande">ON buches en demande</option>
								<option value="Free Cooling Zone 1">Free Cooling Zone 1</option>
								<option value="Free Cooling Zone 2">Free Cooling Zone 2</option>
								<option value="Free Cooling Zone 3">Free Cooling Zone 3</option>
								<option value="Free Cooling Zone 4">Free Cooling Zone 4</option>
								<option value="Horloge ON de 7h à 10h et 18h à 22h">Horloge ON de 7h à 10h et 18h à 22h</option>
								<option value="recharge nappes goethermiques sur T15 sur serpentin BTC">recharge nappes goethermiques sur T15 sur serpentin BTC</option>
								<option value="recharge nappes goethermiques sur T15 sur échangeur BTC">recharge nappes goethermiques sur T15 sur échangeur BTC</option>
								<option value="Aquastat différentiel ON si T15 > T5">Aquastat différentiel ON si T15 > T5</option>
								<option value="charge BTC si excédent APP1 sur T16 & T6 > T5">charge BTC si excédent APP1 sur T16 & T6 > T5</option>
								<option value="charge BTC si excédent APP1 sur T16 & T6 < T5">charge BTC si excédent APP1 sur T16 & T6 < T5</option>
								<option value="Aucun" selected>Aucun</option>
							</select></td>
					</tr>
					<tr>
						<td>Option S11 : </td>
						<td>
							<select data-field="optionS11">
								<option value="V3V bypass appoint 1">V3V bypass appoint 1</option>
								<option value="V3V retour bouclage sanitaire solaire">V3V retour bouclage sanitaire solaire</option>
								<option value="Activable par case à cocher">Activable par case à cocher</option>
								<option value="Décharge sur zone 1">Décharge sur zone 1</option>
								<option value="ON en mode solaire">ON en mode solaire</option>
								<option value="Sortie Idem C4">Sortie Idem C4</option>
								<option value="V3V décharge zone 1">V3V décharge zone 1</option>
								<option value="Electrovanne Appoint 1 ou Flow Switch">Electrovanne Appoint 1 ou Flow Switch</option>
								<option value="CESI déportée sur T16">CESI déportée sur T16</option>
								<option value="Horloge ON de 5h à 8h, 11h30 à 14h et 16h30 à 23h">Horloge ON de 5h à 8h, 11h30 à 14h et 16h30 à 23h</option>
								<option value="Sortie Idem C1">Sortie Idem C1</option>
								<option value="Sortie Idem C2">Sortie Idem C2</option>
								<option value="Sortie Idem C3">Sortie Idem C3</option>
								<option value="ON en mode excédent d'énergie l'été">ON en mode excédent d'énergie l'été</option>
								<option value="Circulateur chaudière 1">Circulateur chaudière 1</option>
								<option value="Circulateur chaudière 2">Circulateur chaudière 2</option>
								<option value="Sortie Idem C5">Sortie Idem C5</option>
								<option value="Sortie Idem C6">Sortie Idem C6</option>
								<option value="Sortie Idem C7">Sortie Idem C7</option>
								<option value="Sortie Idem S10">Sortie Idem S10</option>
								<option value="ON buches en demande">ON buches en demande</option>
								<option value="Free Cooling Zone 1">Free Cooling Zone 1</option>
								<option value="Free Cooling Zone 2">Free Cooling Zone 2</option>
								<option value="Free Cooling Zone 3">Free Cooling Zone 3</option>
								<option value="Free Cooling Zone 4">Free Cooling Zone 4</option>
								<option value="Horloge ON de 7h à 10h et 18h à 22h">Horloge ON de 7h à 10h et 18h à 22h</option>
								<option value="recharge nappes goethermiques sur T15 sur serpentin BTC">recharge nappes goethermiques sur T15 sur serpentin BTC</option>
								<option value="recharge nappes goethermiques sur T15 sur échangeur BTC">recharge nappes goethermiques sur T15 sur échangeur BTC</option>
								<option value="Aquastat différentiel ON si T15 > T5">Aquastat différentiel ON si T15 > T5</option>
								<option value="charge BTC si excédent APP1 sur T16 & T6 > T5">charge BTC si excédent APP1 sur T16 & T6 > T5</option>
								<option value="charge BTC si excédent APP1 sur T16 & T6 < T5">charge BTC si excédent APP1 sur T16 & T6 < T5</option>
								<option value="Aucun" selected>Aucun</option>
							</select>
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
							<select data-field="divers">
								<option value="deshu sur appoint 1">deshu sur appoint 1</option>
								<option value="radiateur sur appoint 1">radiateur sur appoint 1</option>
								<option value="pompe double gauche">pompe double gauche</option>
								<option value="pompe double droite">pompe double droite</option>
								<option value="Aucun" selected>Aucun</option>
							</select>
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