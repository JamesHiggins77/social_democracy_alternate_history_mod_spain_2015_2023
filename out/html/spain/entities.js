// People and parties mentioned in the game's text. In the browser, every
// mention in the story and sidebar is coloured by party and shows a card
// on hover: party, a badge in the party's colours, role, and wing or
// ideology. Node can load the data for tests.
(function (root) {
  'use strict';

  // Foreign and non-electoral parties (Spanish parties come from SpainUI).
  var EXTRA_PARTIES = {
    labour: ['Labour Party (UK)', '#E4003B', 'Lab'],
    ukcon: ['Conservative Party (UK)', '#0087DC', 'Con'],
    psportugal: ['Socialist Party (Portugal)', '#FF66B2', 'PS'],
    dksd: ['Social Democrats (Denmark)', '#C8102E', 'S'],
    spd: ['SPD (Germany)', '#E3000F', 'SPD'],
    cdu: ['CDU (Germany)', '#2C2C2C', 'CDU'],
    sap: ['Social Democrats (Sweden)', '#E8112D', 'S'],
    usdem: ['Democratic Party (US)', '#3333FF', 'Dem'],
    usrep: ['Republican Party (US)', '#E81B23', 'GOP'],
    lega: ['Lega (Italy)', '#008C45', 'Lega'],
    syriza: ['Syriza (Greece)', '#E2007A', 'SYR'],
    pasok: ['PASOK (Greece)', '#00843D', 'PASOK'],
    pditaly: ['Democratic Party (Italy)', '#EF1C27', 'PD'],
    lrem: ['La République En Marche (France)', '#FFB400', 'LREM'],
    psfrance: ['Socialist Party (France)', '#ED1651', 'PS'],
    unitedrussia: ['United Russia', '#1D3F94', 'UR'],
    servant: ['Servant of the People (Ukraine)', '#2A9D3E', 'SN'],
    crown: ['The Crown', '#7A5C1E', '♛'],
    morocco: ['Kingdom of Morocco', '#C1272D', 'MA'],
    polisario: ['Polisario Front', '#007A3D', 'POL'],
    bcomu: ['Barcelona en Comú', '#C4183C', 'BComú'],
    ahoramadrid: ['Ahora Madrid', '#A71F64', 'AM'],
    nonpartisan: ['No party', '#6F6A64', '—']
  };

  // name variants (longest first matters), party id, role, wing/ideology
  var PEOPLE = [

    // ministers and regional presidents the game can appoint
    [['Pablo Bustinduy', 'Bustinduy'], 'up', 'Podemos international secretary; Minister of Social Rights (2023–)', ''],
    [['Toni Roldán', 'Roldán'], 'cs', 'Ciudadanos economic spokesperson', ''],
    [['Marta Rivera de la Cruz'], 'cs', 'Ciudadanos; Madrid regional minister of culture', ''],
    [['Edmundo Bal'], 'cs', 'Ciudadanos deputy, former state attorney', ''],
    [['Francisco Igea', 'Igea'], 'cs', 'Ciudadanos; Vice-President of Castilla y León', ''],
    [['Agustín Rosety'], 'vox', 'Vox deputy, retired general', ''],
    [['Iván Espinosa de los Monteros', 'Espinosa de los Monteros'], 'vox', 'Vox spokesperson in Congress (to 2023)', ''],
    [['Trinidad Jiménez'], 'psoe', 'Former Minister of Foreign Affairs (2010–11)', 'Institutionalists'],
    [['Luz Rodríguez'], 'psoe', 'PSOE Secretary for Employment', 'Trade unionists'],
    [['Carmen Montón', 'Montón'], 'psoe', 'Valencian health minister; Minister of Health (2018)', 'Sanchismo'],
    [['Ángel Gabilondo', 'Gabilondo'], 'psoe', 'Former Minister of Education; Madrid candidate', 'Institutionalists'],
    [['Hugo Morán'], 'psoe', 'PSOE environment spokesperson', 'Regional Barons (Asturias)'],
    [['Xavier Domènech', 'Domènech'], 'up', 'Leader of En Comú Podem', ''],
    [['Carolina Bescansa', 'Bescansa'], 'up', 'Podemos co-founder', ''],
    [['Carlos Sánchez Mato'], 'iu', 'Madrid city finance councillor (IU)', 'Communist (PCE)'],
    [['Julio Rodríguez'], 'up', 'Former Chief of the Defence Staff; Podemos candidate', ''],
    [['Juantxo López de Uralde', 'López de Uralde'], 'up', 'Leader of Equo, allied to Podemos', ''],
    [['Dolors Montserrat', 'Montserrat'], 'pp', 'Minister of Health and Social Services (2016–18)', ''],
    [['Íñigo Méndez de Vigo', 'Méndez de Vigo'], 'pp', 'Minister of Education (2015–18)', ''],
    [['Ana Pastor'], 'pp', 'Minister of Public Works; President of Congress (2016–19)', ''],
    [['Juan Ignacio Zoido', 'Zoido'], 'pp', 'Minister of the Interior (2016–18)', ''],
    [['Álvaro Nadal'], 'pp', 'Minister of Energy (2016–18)', ''],
    [['Reyes Maroto'], 'psoe', 'Minister of Industry (2018–23)', 'Independent technocrat'],
    [['Luis Planas'], 'psoe', 'Minister of Agriculture (2018–)', 'Regional Barons (Andalusia)'],
    [['Pedro Duque'], 'psoe', 'Astronaut; Minister of Science (2018–21)', 'Independent'],
    [['Isabel Rodríguez'], 'psoe', 'Government spokesperson; Minister of Housing (2023–)', 'Sanchismo'],
    [['Ernest Urtasun', 'Urtasun'], 'up', 'Comuns MEP; Minister of Culture (2023–)', ''],
    [['Sira Rego'], 'iu', 'IU; Minister of Youth and Children (2023–)', 'Communist (PCE)'],
    [['Juan Carlos Girauta', 'Girauta'], 'cs', 'Ciudadanos spokesperson in Congress', ''],
    [['José Manuel Villegas', 'Villegas'], 'cs', 'Secretary-General of Ciudadanos', ''],
    [['Jorge Buxadé', 'Buxadé'], 'vox', 'Vox vice-president; MEP', ''],
    [['Macarena Olona', 'Olona'], 'vox', 'Vox spokesperson; Andalusian candidate (2022)', ''],
    [['Artur Mas', 'Mas'], 'junts', 'President of Catalonia (2010–16)', 'Convergència'],
    [['Juan Marín'], 'cs', 'Vice-President of Andalusia (2019–22)', ''],
    [['Francisco Serrano'], 'vox', 'Vox leader in Andalusia (2018–19)', ''],
    // PSOE
    [['Pedro Sánchez', 'Sánchez'], 'psoe', 'Secretary-General of the PSOE', 'Sanchismo: the members against the apparatus'],
    [['Susana Díaz'], 'psoe', 'President of Andalusia', 'Regional Barons (susanismo), the party\'s centrist establishment'],
    [['Emiliano García-Page', 'García-Page'], 'psoe', 'President of Castilla-La Mancha', 'Regional Barons, centrist and hostile to deals with nationalists'],
    [['Javier Fernández'], 'psoe', 'President of Asturias; caretaker leader in 2016', 'Regional Barons, institutionalist'],
    [['Eduardo Madina', 'Madina'], 'psoe', 'Basque deputy', 'Modernisers'],
    [['José Antonio Pérez Tapias', 'Pérez Tapias'], 'psoe', 'Leader of Izquierda Socialista; 2014 primary candidate', 'Socialist Left (Izquierda Socialista, the party\'s left current)'],
    [['Cándido Méndez'], 'psoe', 'Secretary-General of the UGT union (to 2016)', 'Trade unionists'],
    [['Pepe Álvarez'], 'psoe', 'Secretary-General of the UGT union (from 2016)', 'Trade unionists'],
    [['Antonio Pradas', 'Pradas'], 'psoe', 'Secretary of Federal Policy; read out the 17 resignations (Sept 2016)', 'Regional Barons (susanismo), Andalusian'],
    [['Micaela Navarro'], 'psoe', 'President of the PSOE (to 2016); among the 17 who resigned', 'Regional Barons (susanismo), Andalusian'],
    [['Carme Chacón', 'Chacón'], 'psoe', 'Former Defence Minister; among the 17 who resigned', 'Institutionalists (critic of Sánchez)'],
    [['Tomás Gómez'], 'psoe', 'Former Madrid socialist leader, removed by Sánchez in 2015; among the 17', 'Critic of Sánchez'],
    [['Félix Bolaños', 'Bolaños'], 'psoe', 'Secretary of the Ethics Committee (2016)', 'Sanchismo'],
    [['Inés Ayala'], 'psoe', 'MEP; member of the Ethics Committee (2016)', 'Susanismo'],
    [['Wilfredo Jurado'], 'psoe', 'Member of the Ethics Committee (2016)', 'Susanismo'],
    [['Juan Cornejo'], 'psoe', 'Andalusian deputy; a critic at the October 2016 Committee', 'Regional Barons (susanismo), Andalusian'],
    [['Idoia Mendia'], 'psoe', 'Leader of the Basque socialists (PSE-EE)', 'Sanchismo, federalist'],
    [['Luis Tudanca', 'Tudanca'], 'psoe', 'Leader of the Castile and León socialists', 'Sanchismo'],
    [['Odón Elorza'], 'psoe', 'Deputy, former mayor of San Sebastián', 'Sanchismo, progressive'],
    [['Sara Hernández'], 'psoe', 'Leader of the Madrid socialists (2015–17)', 'Sanchismo'],
    [['Patricia Hernández'], 'psoe', 'Canarian socialist leader', 'Susanismo'],
    [['Jordi Évole', 'Évole'], 'nonpartisan', 'Journalist, presenter of Salvados', 'Independent journalist'],
    [['César Alierta', 'Alierta'], 'nonpartisan', 'Chairman of Telefónica (to 2016)', 'Business'],
    [['Rafael Simancas'], 'psoe', 'Deputy; former leader of the Madrid socialists', 'Institutionalists'],
    [['Jordi Sevilla'], 'psoe', 'Economist; wrote the 2015 economic programme', 'Modernisers'],
    [['Manuel Escudero'], 'psoe', 'Economist; head of the 2016 programme', 'Modernisers'],
    [['Zaida Cantera'], 'psoe', 'Army officer and deputy (from 2015)', 'Socialist Left'],
    [['Óscar Puente'], 'psoe', 'Mayor of Valladolid', 'Sanchismo'],
    [['Toni Ferrer'], 'psoe', 'Former UGT leader; PSOE Executive (2017)', 'Trade Unionists'],
    [['Verónica Pérez'], 'psoe', 'President of the PSOE Federal Committee', 'Regional Barons (susanismo), Andalusian'],
    [['Patxi López'], 'psoe', 'Former Lehendakari; 2017 primary candidate', 'Between the camps; moderniser'],
    [['Antonio Hernando', 'Hernando'], 'psoe', 'Spokesperson of the parliamentary group', 'Institutionalists'],
    [['César Luena', 'Luena'], 'psoe', 'Secretary of Organisation (2014–16)', 'Sanchismo'],
    [['José Luis Ábalos', 'Ábalos'], 'psoe', 'Secretary of Organisation (from 2017)', 'Sanchismo'],
    [['Adriana Lastra', 'Lastra'], 'psoe', 'Deputy Secretary-General', 'Sanchismo, Socialist Left'],
    [['María Jesús Montero'], 'psoe', 'Minister of Finance', 'Regional Barons (Andalusian)'],
    [['Carmen Calvo'], 'psoe', 'Deputy Prime Minister', 'Institutionalists'],
    [['Ximo Puig'], 'psoe', 'President of Valencia', 'Regional Barons, federalist'],
    [['Guillermo Fernández Vara', 'Fernández Vara'], 'psoe', 'President of Extremadura', 'Regional Barons'],
    [['Javier Lambán', 'Lambán'], 'psoe', 'President of Aragón', 'Regional Barons, critic of Sánchez'],
    [['Francina Armengol', 'Armengol'], 'psoe', 'President of the Balearic Islands', 'Socialist Left, federalist'],
    [['Felipe González'], 'psoe', 'Prime Minister 1982–96', 'The old guard'],
    [['Alfredo Pérez Rubalcaba', 'Rubalcaba'], 'psoe', 'Secretary-General 2012–14', 'Institutionalists'],
    [['José Luis Rodríguez Zapatero', 'Zapatero'], 'psoe', 'Prime Minister 2004–11', 'Former leader; backed Susana Díaz in 2017'],
    [['Miquel Iceta', 'Iceta'], 'psoe', 'Leader of the PSC', 'Catalan socialists, federalist'],
    [['Salvador Illa', 'Illa'], 'psoe', 'PSC; Minister of Health', 'Catalan socialists'],
    [['Nadia Calviño', 'Calviño'], 'nonpartisan', 'Minister of Economic Affairs (independent, in the PSOE\'s share of the cabinet)', 'Modernisers: the government\'s technocratic wing'],
    [['Josep Borrell', 'Borrell'], 'psoe', 'Minister of Foreign Affairs', 'Federalist, pro-European'],
    [['Fernando Grande-Marlaska', 'Grande-Marlaska'], 'psoe', 'Minister of the Interior', 'Independent judge'],
    [['Margarita Robles'], 'psoe', 'Minister of Defence', 'Independent judge, institutionalist'],
    [['Dolores Delgado'], 'psoe', 'Minister of Justice', 'Prosecutor, sanchista'],
    [['Magdalena Valerio'], 'psoe', 'Minister of Labour', 'Trade unionists'],
    [['José Luis Escrivá', 'Escrivá'], 'psoe', 'Minister of Social Security', 'Independent economist'],
    [['Isabel Celaá', 'Celaá'], 'psoe', 'Minister of Education', 'Basque socialists'],
    [['Meritxell Batet', 'Batet'], 'psoe', 'Minister of Territorial Policy', 'Catalan socialists, federalist'],
    [['Teresa Ribera', 'Ribera'], 'psoe', 'Minister for the Ecological Transition', 'Green wing'],
    [['Luis de Guindos', 'Guindos'], 'pp', 'Minister of Economy', 'Liberal technocrat'],
    [['Fátima Báñez', 'Báñez'], 'pp', 'Minister of Employment', 'Author of the 2012 labour reform'],
    [['José Manuel García-Margallo', 'Margallo'], 'pp', 'Minister of Foreign Affairs', 'Pro-European, Gibraltar hawk'],
    [['Jorge Fernández Díaz'], 'pp', 'Minister of the Interior', 'Conservative Catholic'],
    [['Pedro Morenés'], 'pp', 'Minister of Defence', 'Conservative'],
    [['Rafael Catalá'], 'pp', 'Minister of Justice', 'Moderate'],
    [['Alfonso Alonso'], 'pp', 'Minister of Health', 'Basque PP, moderate'],
    [['José Ignacio Wert', 'Wert'], 'pp', 'Minister of Education', 'Conservative'],
    [['Isabel García Tejerina'], 'pp', 'Minister of Agriculture and Environment', 'Conservative'],
    [['Manuel Castells', 'Castells'], 'up', 'Minister of Universities', 'Independent sociologist'],
    [['Nacho Álvarez'], 'up', 'Podemos economic spokesperson', 'Pablismo'],
    [['Luis Garicano', 'Garicano'], 'cs', 'Ciudadanos economic spokesperson', 'Liberal economist'],
    [['Iván Redondo'], 'nonpartisan', 'Political consultant, Sánchez\'s chief of staff', 'No party; formerly worked for the PP'],
    // PP
    [['Mariano Rajoy', 'Rajoy'], 'pp', 'Prime Minister; leader of the PP', 'Conservative pragmatist'],
    [['Soraya Sáenz de Santamaría', 'Sáenz de Santamaría'], 'pp', 'Deputy Prime Minister', 'Moderate technocrat'],
    [['Pablo Casado', 'Casado'], 'pp', 'PP deputy, later leader', 'Hard right, Aznar\'s wing'],
    [['María Dolores de Cospedal', 'Cospedal'], 'pp', 'Secretary-General of the PP', 'Party apparatus'],
    [['Alberto Núñez Feijóo', 'Feijóo'], 'pp', 'President of Galicia', 'Moderate, regional baron'],
    [['Isabel Díaz Ayuso', 'Ayuso'], 'pp', 'President of Madrid', 'Populist right'],
    [['Cristina Cifuentes', 'Cifuentes'], 'pp', 'President of Madrid (2015–18)', 'Liberal wing'],
    [['Alberto Ruiz-Gallardón', 'Gallardón'], 'pp', 'Minister of Justice (to 2014)', 'Conservative'],
    [['Luis Bárcenas', 'Bárcenas'], 'pp', 'Former treasurer, at the centre of the slush-fund case', 'Gürtel and the B accounts'],
    [['Esperanza Aguirre'], 'pp', 'Former President of Madrid', 'Liberal-conservative right'],
    [['Juanma Moreno'], 'pp', 'Leader of the Andalusian PP', 'Moderate'],
    [['José María Aznar', 'Aznar'], 'pp', 'Prime Minister 1996–2004', 'Hard right'],
    [['Cristóbal Montoro', 'Montoro'], 'pp', 'Minister of Finance', 'Fiscal hawk'],
    [['Ignacio González'], 'pp', 'President of Madrid (to 2015)', 'Aguirre\'s wing'],
    [['José Ramón Bauzá', 'Bauzá'], 'pp', 'President of the Balearic Islands', 'Conservative'],
    [['Alberto Fabra'], 'pp', 'President of Valencia', 'Conservative'],
    [['Luisa Fernanda Rudi'], 'pp', 'President of Aragón', 'Conservative'],
    [['Ignacio Diego'], 'pp', 'President of Cantabria', 'Conservative'],
    [['Juan Vicente Herrera'], 'pp', 'President of Castilla y León', 'Moderate'],
    [['José Antonio Monago', 'Monago'], 'pp', 'President of Extremadura', 'Moderate'],
    [['Alberto Garre'], 'pp', 'President of Murcia', 'Conservative'],
    [['Pedro Antonio Sánchez'], 'pp', 'President of Murcia (2015–17)', 'Conservative'],
    [['José Ignacio Ceniceros'], 'pp', 'President of La Rioja', 'Conservative'],
    [['Pedro Sanz'], 'pp', 'President of La Rioja', 'Conservative'],
    // Podemos and allies
    [['Pablo Iglesias', 'Iglesias'], 'up', 'Leader of Podemos', 'Left populism (pablismo)'],
    [['Íñigo Errejón', 'Errejón'], 'up', 'Podemos co-founder; later Más País', 'Transversal populism (errejonismo)'],
    [['Irene Montero'], 'up', 'Podemos spokesperson; Minister of Equality', 'Pablismo, feminist left'],
    [['Ione Belarra', 'Belarra'], 'up', 'Secretary-General of Podemos (from 2021); Minister of Social Rights', 'Pablismo, Podemos loyalist'],
    [['Yolanda Díaz'], 'up', 'Minister of Labour; leader of Sumar', 'Communist-turned-pragmatic left'],
    [['Pablo Echenique', 'Echenique'], 'up', 'Secretary of Organisation of Podemos', 'Pablismo'],
    [['Teresa Rodríguez'], 'up', 'Podemos Andalusia', 'Anticapitalistas'],
    [['Ada Colau', 'Colau'], 'bcomu', 'Mayor of Barcelona', 'Municipalist left'],
    [['Manuela Carmena', 'Carmena'], 'ahoramadrid', 'Mayor of Madrid', 'Municipalist left'],
    // Ciudadanos
    [['Albert Rivera', 'Rivera'], 'cs', 'Leader of Ciudadanos', 'Liberal, later turned right'],
    [['Inés Arrimadas', 'Arrimadas'], 'cs', 'Ciudadanos leader in Catalonia, later national leader', 'Anti-independence liberal'],
    [['Begoña Villacís', 'Villacís'], 'cs', 'Ciudadanos, Madrid', 'Liberal'],
    // Vox
    [['Santiago Abascal', 'Abascal'], 'vox', 'Leader of Vox', 'National-conservative, hard right'],
    [['Rocío Monasterio'], 'vox', 'Vox, Madrid', 'Hard right'],
    [['Javier Ortega Smith', 'Ortega Smith'], 'vox', 'Secretary-General of Vox', 'Hard right'],
    // IU
    [['Alberto Garzón', 'Garzón'], 'iu', 'Leader of IU', 'Communist (PCE)'],
    [['Cayo Lara'], 'iu', 'Leader of IU (to 2016)', 'Communist (PCE)'],
    // Catalan and Basque parties
    [['Oriol Junqueras', 'Junqueras'], 'erc', 'Leader of ERC', 'Republican left, pro-independence'],
    [['Gabriel Rufián', 'Rufián'], 'erc', 'ERC spokesperson in Congress', 'Pro-independence left'],
    [['Pere Aragonès', 'Aragonès'], 'erc', 'President of Catalonia (from 2021)', 'Pro-independence, pragmatic'],
    [['Artur Mas'], 'junts', 'President of Catalonia (to 2016)', 'Centre-right, turned pro-independence'],
    [['Carles Puigdemont', 'Puigdemont'], 'junts', 'President of Catalonia (2016–17)', 'Hardline pro-independence'],
    [['Quim Torra', 'Torra'], 'junts', 'President of Catalonia (2018–20)', 'Hardline pro-independence'],
    [['Laura Borràs'], 'junts', 'Junts', 'Hardline pro-independence'],
    [['Iñigo Urkullu', 'Urkullu'], 'pnv', 'Lehendakari (President of the Basque Country)', 'Christian-democratic Basque nationalism'],
    [['Aitor Esteban'], 'pnv', 'PNV spokesperson in Congress', 'Basque nationalism, pragmatic'],
    [['Andoni Ortuzar'], 'pnv', 'President of the PNV', 'Basque nationalism'],
    [['Arnaldo Otegi', 'Otegi'], 'bildu', 'Leader of EH Bildu', 'Pro-independence left (abertzale)'],
    // others
    [['Paulino Rivero'], 'cc', 'President of the Canary Islands (to 2015)', 'Canarian nationalism'],
    [['Fernando Clavijo'], 'cc', 'President of the Canary Islands (2015–19)', 'Canarian nationalism'],
    [['Ana Oramas'], 'cc', 'CC deputy', 'Canarian nationalism'],
    [['Miguel Ángel Revilla', 'Revilla'], 'prc', 'President of Cantabria', 'Cantabrian regionalism'],
    [['Uxue Barkos'], 'geroa', 'President of Navarre', 'Basque nationalism in Navarre'],
    [['Yolanda Barcina'], 'upn', 'President of Navarre (to 2015)', 'Navarrese regionalist right'],
    [['Mónica Oltra'], 'compromis', 'Vice-President of Valencia', 'Valencian left'],
    [['Joan Baldoví'], 'compromis', 'Compromís deputy', 'Valencian left'],
    [['Francisco Franco', 'Franco'], 'nonpartisan', 'Dictator of Spain, 1939–1975', 'Francoism'],
    [['Felipe VI'], 'crown', 'King of Spain', 'Head of State'],
    [['Juan Carlos I', 'Juan Carlos'], 'crown', 'King of Spain until 2014', 'Former Head of State'],
    // foreign politicians
    [['Ed Miliband', 'Miliband'], 'labour', 'Leader of the Labour Party (2010–15)', 'Soft left'],
    [['Harriet Harman'], 'labour', 'Acting leader of Labour (2015)', 'Labour right'],
    [['Jeremy Corbyn', 'Corbyn'], 'labour', 'Leader of the Labour Party (2015–20)', 'Socialist left'],
    [['Keir Starmer', 'Starmer'], 'labour', 'Leader of the Labour Party (from 2020)', 'Soft left turned centrist'],
    [['David Cameron', 'Cameron'], 'ukcon', 'Prime Minister of the UK (2010–16)', 'Liberal conservative'],
    [['Theresa May'], 'ukcon', 'Prime Minister of the UK (2016–19)', 'Conservative'],
    [['Boris Johnson'], 'ukcon', 'Prime Minister of the UK (2019–22)', 'Brexiteer conservative'],
    [['António Costa', 'Costa'], 'psportugal', 'Prime Minister of Portugal (from 2015)', 'Pragmatic social democrat'],
    [['António José Seguro', 'Seguro'], 'psportugal', 'Leader of the Portuguese Socialists (to 2014)', 'Centrist social democrat'],
    [['Helle Thorning-Schmidt', 'Thorning-Schmidt'], 'dksd', 'Prime Minister of Denmark (2011–15)', 'Centrist social democrat'],
    [['Mette Frederiksen', 'Frederiksen'], 'dksd', 'Leader of the Danish Social Democrats', 'Welfare state with a hard line on migration'],
    [['Sigmar Gabriel', 'Gabriel'], 'spd', 'Leader of the SPD (to 2017)', 'Grand-coalition pragmatist'],
    [['Martin Schulz', 'Schulz'], 'spd', 'Leader of the SPD (2017–18)', 'Pro-European social democrat'],
    [['Andrea Nahles', 'Nahles'], 'spd', 'Leader of the SPD (2018–19)', 'SPD left'],
    [['Olaf Scholz', 'Scholz'], 'spd', 'Chancellor of Germany (from 2021)', 'Centrist social democrat'],
    [['Angela Merkel', 'Merkel'], 'cdu', 'Chancellor of Germany (to 2021)', 'Centre-right'],
    [['Stefan Löfven', 'Löfven'], 'sap', 'Prime Minister of Sweden (2014–21)', 'Union-backed social democrat'],
    [['Magdalena Andersson', 'Andersson'], 'sap', 'Prime Minister of Sweden (2021–22)', 'Social democrat'],
    [['Barack Obama', 'Obama'], 'usdem', 'President of the United States (2009–17)', 'Liberal Democrat'],
    [['Joe Biden', 'Biden'], 'usdem', 'President of the United States (from 2021)', 'Centrist Democrat, pro-union'],
    [['Bernie Sanders', 'Sanders'], 'usdem', 'US Senator', 'Progressive wing, democratic socialist'],
    [['Alexandria Ocasio-Cortez', 'Ocasio-Cortez', 'AOC'], 'usdem', 'US Representative (from 2019)', 'Progressive wing, democratic socialist'],
    [['Nancy Pelosi', 'Pelosi'], 'usdem', 'Democratic leader in the House', 'Party leadership, liberal mainstream'],
    [['Chuck Schumer', 'Schumer'], 'usdem', 'Democratic leader in the Senate', 'Party leadership, liberal mainstream'],
    [['Matteo Renzi', 'Renzi'], 'pditaly', 'Prime Minister of Italy (2014–16), PD leader to 2018', 'Centrist moderniser'],
    [['Maurizio Martina'], 'pditaly', 'PD leader (2018–19)', 'Caretaker'],
    [['Nicola Zingaretti', 'Zingaretti'], 'pditaly', 'PD leader (2019–21)', 'Left of the party'],
    [['Enrico Letta', 'Letta'], 'pditaly', 'PD leader (2021–23)', 'Pro-European centre-left'],
    [['Elly Schlein', 'Schlein'], 'pditaly', 'PD leader (from 2023)', 'Progressive left'],
    [['Evangelos Venizelos', 'Venizelos'], 'pasok', 'PASOK leader (2012–15), Deputy Prime Minister', 'Grand-coalition pragmatist'],
    [['Fofi Gennimata', 'Gennimata'], 'pasok', 'PASOK leader (2015–21)', 'Social democrat'],
    [['Nikos Androulakis', 'Androulakis'], 'pasok', 'PASOK leader (from 2021)', 'Social democrat'],
    [['Donald Trump', 'Trump'], 'usrep', 'President of the United States (2017–21)', 'Right-wing populist'],
    [['Matteo Salvini', 'Salvini'], 'lega', 'Interior Minister of Italy (2018–19)', 'Hard-right populist'],
    [['Alexis Tsipras', 'Tsipras'], 'syriza', 'Prime Minister of Greece (2015–19)', 'Radical left'],
    [['Emmanuel Macron', 'Macron'], 'lrem', 'President of France (from 2017)', 'Liberal centrist'],
    [['François Hollande', 'Hollande'], 'psfrance', 'President of France (2012–17)', 'Social democrat'],
    [['Benoît Hamon', 'Hamon'], 'psfrance', 'PS candidate in 2017', 'Socialist left'],
    [['Mohammed VI'], 'morocco', 'King of Morocco', 'Head of State'],
    [['Brahim Ghali'], 'polisario', 'Leader of the Polisario Front', 'Sahrawi nationalism'],
    [['Vladimir Putin', 'Putin'], 'unitedrussia', 'President of Russia', 'Authoritarian nationalist'],
    [['José Manuel Villarejo', 'Villarejo'], 'nonpartisan', 'Retired police commissioner', 'At the centre of the "sewers of the State" tapes'],
    [['Volodymyr Zelensky', 'Zelensky'], 'servant', 'President of Ukraine', 'Centrist']
  ];

  // Wikipedia titles where the page is not simply the person's name
  // (checked against en.wikipedia.org). People not listed link by name.
  var PERSON_WIKI = {
    'Javier Fernández': 'Javier Fernández (Spanish politician)', 'Ignacio González': 'Ignacio González (politician)',
    'Pablo Iglesias': 'Pablo Iglesias Turrión', 'Mohammed VI': 'Mohammed VI of Morocco',
    'Fernando Clavijo': 'Fernando Clavijo (politician)', 'Volodymyr Zelensky': 'Volodymyr Zelenskyy',
    // no English page: Spanish Wikipedia instead ("es:" prefix)
    'Teresa Rodríguez': 'es:Teresa Rodríguez', 'Pepe Álvarez': 'es:Pepe Álvarez', 'Nacho Álvarez': 'es:Nacho Álvarez',
    'Verónica Pérez': 'es:Verónica Pérez Fernández',
    'Antonio Pradas': 'es:Antonio Pradas', 'Micaela Navarro': 'es:Micaela Navarro', 'Tomás Gómez': 'es:Tomás Gómez Franco',
    'Félix Bolaños': 'Félix Bolaños', 'Inés Ayala': 'Inés Ayala', 'Wilfredo Jurado': 'es:Crisis del PSOE de 2016',
    'Juan Cornejo': 'es:Juan Cornejo', 'Idoia Mendia': 'Idoia Mendia', 'Luis Tudanca': 'es:Luis Tudanca',
    'Odón Elorza': 'Odón Elorza', 'Sara Hernández': 'es:Sara Hernández Barroso', 'Patricia Hernández': 'es:Patricia Hernández Gutiérrez',
    'Jordi Évole': 'es:Jordi Évole', 'Rafael Simancas': 'es:Rafael Simancas', 'Jordi Sevilla': 'Jordi Sevilla', 'Manuel Escudero': 'es:Manuel Escudero Zamora', 'Zaida Cantera': 'es:Zaida Cantera', 'Óscar Puente': 'Óscar Puente', 'Toni Ferrer': 'es:Toni Ferrer', 'César Alierta': 'César Alierta'
  };
  var PARTY_WIKI = {
    psoe: "Spanish Socialist Workers' Party", pp: "People's Party (Spain)", up: 'Podemos (Spanish political party)',
    cs: 'Citizens (Spanish political party)', vox: 'Vox (political party)', iu: 'United Left (Spain)',
    erc: 'Republican Left of Catalonia', junts: 'Together for Catalonia (2020)', pnv: 'Basque Nationalist Party',
    bildu: 'EH Bildu', cup: 'Popular Unity Candidacy', cc: 'Canarian Coalition', mp: 'Más País',
    compromis: 'Coalició Compromís', upn: "Navarrese People's Union", prc: 'Regionalist Party of Cantabria',
    bng: 'Galician Nationalist Bloc', te: 'Teruel Existe', geroa: 'Geroa Bai', upyd: 'Union, Progress and Democracy',
    labour: 'Labour Party (UK)', spd: 'Social Democratic Party of Germany', syriza: 'Syriza',
    usdem: 'Democratic Party (United States)', polisario: 'Polisario Front',
    pditaly: 'Democratic Party (Italy)', pasok: 'PASOK', psportugal: 'Socialist Party (Portugal)', dksd: 'Social Democrats (Denmark)', sap: 'Swedish Social Democratic Party'
  };
  var NAME_WIKI = { PSC: "Socialists' Party of Catalonia", Sumar: 'Sumar (electoral alliance)', CiU: 'Convergence and Union',
                    'Unidas Podemos': 'Unidas Podemos', 'Unidos Podemos': 'Unidas Podemos' };

  // Events, processes and legal texts: phrase, Wikipedia title, short note.

  // Images supplied with the game (out/html/img/spain/Spain): portraits,
  // party logos, organisation emblems.
  var IMG = 'img/spain/Spain/';
  var PARTY_IMG = {
    psoe: 'Party Logos/Logotipo_electoral_del_PSOE.png', pp: 'Party Logos/Logo_del_PP_(2022).svg.webp',
    up: 'Party Logos/Logo_de_Podemos_(2022).svg.webp', cs: 'Party Logos/Ciudadanos_logo_2017.svg.webp',
    vox: 'Party Logos/VOX_logo.svg.webp', iu: 'Party Logos/Logo_Izquierda_Unida,_versión_bocadillo.svg.webp',
    erc: 'Party Logos/ERC_logo_2025.svg.webp', junts: 'Party Logos/Logotip_Junts_per_Catalunya.svg.webp',
    pnv: 'Party Logos/Logo_PNV_2025.svg.webp', bildu: 'Party Logos/Logo_de_EH_Bildu_(2023).svg.webp',
    cc: 'Party Logos/Coalición_Canaria.svg', mp: 'Party Logos/Más_País_logo.svg.webp',
    upn: 'Party Logos/Logo_UPN_2017.svg.webp', bng: 'Party Logos/Bloque_Nacionalista_Galego.svg.webp',
    upyd: 'Party Logos/Logotipo_de_UPYD_2018-2020.svg.webp', syriza: 'Party Logos/SYRIZA_logo_2020.svg.webp'
  };
  var PERSON_IMG = {
    'Pedro Sánchez': 'People/Pedro_Sánchez_2018_(cropped).jpg', 'Mariano Rajoy': 'People/Mariano_Rajoy_in_2018.jpg',
    'Pablo Iglesias': 'People/Pablo_Iglesias_Ahora_Madrid_2015_-_05_(cropped).jpg', 'Albert Rivera': 'People/Albert_Rivera_in_2019_(cropped).jpg',
    'Susana Díaz': 'People/30.12.28_Mensaje_Fin_de_Año_4_(cropped2).jpg', 'Adriana Lastra': 'People/(Adriana_Lastra)_2018._Asamblea_Abierta_sobre_pensiones_dignas_(39128555145)_(cropped).jpg',
    'César Luena': 'People/20130515_Cesar_Luena_(cropped).jpg', 'Ada Colau': 'People/Ada_Colau_(17533430830).jpg',
    'Alberto Ruiz-Gallardón': 'People/Alberto_Ruiz-Gallardón_na_Coruña.jpg', 'Alexis Tsipras': 'People/Alexis_Tsipras,_prime_minister_of_Greece_(cropped).jpg',
    'Artur Mas': 'People/Artur_Mas_-_Fotografia_oficial.jpg', 'Cándido Méndez': 'People/Cándido_Méndez_2014_(cropped).jpg',
    'Felipe VI': 'People/Daiga_Mieriņa_tiekas_ar_Spānijas_karali_-_53814974005_(cropped)-2.jpg', 'Francisco Franco': 'People/Francisco_Franco_posed_portrait_photograph.jpg',
    'Eduardo Madina': 'People/Jornadas_de_Juventudes_Socialistas_de_Olivenza_con_Eduardo_Madina_y_Guillermo_Fernández_Vara_(3).jpg',
    'Guillermo Fernández Vara': 'People/Jornadas_de_Juventudes_Socialistas_de_Olivenza_con_Eduardo_Madina_y_Guillermo_Fernández_Vara_(3).jpg',
    'Manuela Carmena': 'People/Manuela_Carmena_-_Ahora_Madrid._Acto_Cebada,_19_Abril_2015_(17199397141)_(cropped).jpg',
    'Pepe Álvarez': 'People/Pepe_AlvarezOKOK.jpg', 'José Antonio Pérez Tapias': 'People/Presentación_candidatura_Pérez_Tapias_en_Callao_14_junio_2014_(15).jpg',
    'Juan Carlos I': 'People/Rey_Juan_Carlos_2013.jpg'
  };
  var TOPIC_IMG = {
    'European Union': 'Interntational Bodies/Flag_of_Europe.svg', 'NATO': 'Interntational Bodies/Flag_of_NATO.svg',
    'Security Council': 'Interntational Bodies/Flag_of_the_United_Nations.svg', 'United Nations': 'Interntational Bodies/Flag_of_the_United_Nations.svg',
    'Party of European Socialists': 'Interntational Bodies/Party_of_European_Socialists.svg.webp',
    'Socialist International': 'Interntational Bodies/Red_Rose_(Socialism).svg', 'Progressive Alliance': 'Interntational Bodies/Red_Rose_(Socialism).svg',
    'UGT': 'General/Logo_de_UGT_(2021).svg.webp', 'Valley of the Fallen': 'Events/SPA-2014-San_Lorenzo_de_El_Escorial-Valley_of_the_Fallen_(Valle_de_los_Caídos).jpg'
  };
  function imgUrl(rel) { return rel ? encodeURI(IMG + rel) : ''; }
  var TOPICS = [

    // the chambers and levels of government
    [['Congress of Deputies'], 'Congress of Deputies', '<b>The lower house: 350 deputies</b>, elected every four years by D\'Hondt in 52 provincial districts (3% threshold per province). It invests and can remove the Prime Minister, passes the budget and every law, and has the last word over the Senate. Created by the 1978 Constitution; its building, the Palacio de las Cortes, dates from 1850.'],
    [['Senate'], 'Senate of Spain', '<b>The upper house: 208 elected senators plus about 58 appointed by the regional parliaments.</b> Each mainland province elects four by limited vote (the first party usually takes three). It can veto or amend bills, but Congress overrides it by absolute majority, or by simple majority after two months. Its one decisive power: authorising direct rule over a region under Article 155, used for the first time in October 2017.'],
    [['European Parliament'], 'European Parliament', '<b>Spain\'s seats in the European Parliament: 54 from 2014, 59 after Brexit (2020)</b>, out of 751 (705 after Brexit). Spain votes as a single national constituency with no threshold. The Parliament co-legislates with the Council of the EU, approves the EU budget and the Commission. Spanish MEPs sit in European groups: the PSOE in the Socialists and Democrats (S&D), the PP in the European People\'s Party.'],
    [['Regional parliaments'], 'Autonomous communities of Spain', '<b>The 17 regional parliaments of the autonomous communities</b>, 1,268 seats in all, created between 1979 and 1983. They elect the regional president, pass regional laws and budgets and run health, education and social services. Andalusia, Catalonia, Galicia and the Basque Country choose their own election dates; the other 13 vote together in May every four years. Each parliament also appoints senators.'],
    [['Regional governments'], 'Autonomous communities of Spain', '<b>The 17 regional governments</b> (and the cities of Ceuta and Melilla). Led by a president elected by the regional parliament, they spend about a third of all public money: hospitals, schools, social services, regional police in Catalonia and the Basque Country. Their presidents, the "barons", are the most powerful figures in the PSOE and the PP outside Madrid.'],
    [['Local government'], 'Municipalities of Spain', '<b>Spain\'s 8,131 municipalities and about 67,500 councillors</b>, elected every four years on the last Sunday of May by closed lists and D\'Hondt (5% threshold). The councillors elect the mayor. Town halls run urban planning, local police, water, waste and public transport; for parties they are the base of their organisation and their campaigns.'],
    [['municipal councils', 'town halls'], 'Municipalities of Spain', 'Spain\'s 8,131 town councils: about 67,500 councillors elected every four years in May, who elect the mayor and run planning, local police and services.'],
    // the ministries
    [['First Deputy Prime Minister'], 'Deputy Prime Minister of Spain', 'Coordinates the government and chairs the weekly meeting of under-secretaries that prepares the Council of Ministers; stands in for the Prime Minister. Carmen Calvo held the post from 2018, Nadia Calviño from 2021, María Jesús Montero from 2023.'],
    [['Minister of Finance'], 'Ministry of Finance (Spain)', 'Ministry of Finance (Hacienda): taxes, the Tax Agency, the state budget and the financing of the regions. It writes the budget and negotiates it in Congress. María Jesús Montero held it from 2018 to 2026.'],
    [['Minister of Economic Affairs'], 'Ministry of Economic Affairs (Spain)', 'Ministry of Economic Affairs: macroeconomic policy, Spain\'s voice in the Eurogroup and with Brussels, banking and the recovery funds. Nadia Calviño held it from 2018 to 2023, then Carlos Cuerpo.'],
    [['Minister of Foreign Affairs'], 'Ministry of Foreign Affairs (Spain)', 'Ministry of Foreign Affairs, the European Union and Cooperation: diplomacy, the embassies, relations with the EU, Morocco and Latin America, and Gibraltar.'],
    [['Minister of Interior'], 'Ministry of the Interior (Spain)', 'Ministry of the Interior: the National Police and the Civil Guard, prisons, migration at the borders (Ceuta, Melilla, the Canaries) and the running of elections.'],
    [['Minister of Defence'], 'Ministry of Defence (Spain)', 'Ministry of Defence: the armed forces, missions abroad, NATO commitments and the intelligence service (CNI). Margarita Robles held it from 2018.'],
    [['Minister of Justice'], 'Ministry of Justice (Spain)', 'Ministry of Justice: the courts\' resources, the prosecution service\'s relations with the government, pardons (as for the Catalan leaders in 2021) and the reform of criminal law.'],
    [['Minister of Labour'], 'Ministry of Labour and Social Economy', 'Ministry of Labour: employment law, the minimum wage, collective bargaining and social dialogue with unions and employers. Yolanda Díaz used it to pass the 2021 labour reform and raise the minimum wage.'],
    [['Minister of Social Rights and Pensions'], 'Ministry of Inclusion, Social Security and Migration', 'Social Security, pensions and the Minimum Living Income; under coalition governments also dependency care and social rights (the Ministry of Social Rights of 2020).'],
    [['Minister of Health'], 'Ministry of Health (Spain)', 'Ministry of Health: national health policy and coordination of the regions, which run the hospitals. It led the response to COVID-19 under Salvador Illa (2020–21).'],
    [['Minister of Education'], 'Ministry of Education (Spain)', 'Ministry of Education: the national curriculum, teacher training rules and grants; the regions run the schools. Every government passes its own education law, such as the LOMLOE (2020).'],
    [['Minister of Territorial Policy'], 'Ministry of Territorial Policy (Spain)', 'Ministry of Territorial Policy: relations with the autonomous communities, the transfer of powers and the State\'s delegates in the regions; the ministry that handles Catalonia day to day.'],
    [['Minister of Ecological Transition'], 'Ministry for the Ecological Transition', 'Ministry for the Ecological Transition: energy, climate, water and the coast. Created in 2018 for Teresa Ribera; it oversaw the end of coal mining and the growth of renewables.'],
    [['Minister of Equality'], 'Ministry of Equality (Spain)', 'Ministry of Equality: gender equality, violence against women, LGBTI rights. Re-created in 2020 for Irene Montero, it drafted the "only yes means yes" and Trans laws.'],
    [['Article 155'], 'Constitution of Spain', 'The constitutional article allowing direct rule over a region'],
    [['Constitution'], 'Constitution of Spain', 'The Spanish Constitution of 1978'],
    [['Federal Committee'], 'es:Comité Federal del PSOE', 'The PSOE\'s highest body between congresses: about 250 members'],
    [['Ethics Committee'], 'es:Crisis del PSOE de 2016', 'The PSOE\'s Commission of Ethics and Guarantees'],
    [['Salvados'], 'es:Salvados', 'Jordi Évole\'s interview programme on laSexta'],
    [['No es no'], 'es:Crisis del PSOE de 2016', '"No means no": the slogan of Sánchez\'s refusal to let Rajoy govern'],
    [['Gürtel'], 'Gürtel affair', 'The PP corruption network and its trial'],
    [['La Manada'], 'La Manada rape case', 'The 2016 Pamplona gang-rape case and its sentence'],
    [['Aquarius'], 'Aquarius Dignitus', 'The rescue ship refused by Italy in June 2018'],
    [['Brexit'], 'Brexit', 'The United Kingdom\'s withdrawal from the EU'],
    [['Valley of the Fallen'], 'Valley of the Fallen', 'Franco\'s mausoleum'],
    [['Security Council'], 'United Nations Security Council', 'Spain held a seat in 2015–16'],
    [['NATO'], 'NATO', 'The North Atlantic alliance'],
    [['United Nations'], 'United Nations', 'The UN'],
    [['UGT'], 'Unión General de Trabajadores', 'The socialist trade union, founded by Pablo Iglesias Posse in 1888'],
    [['state of alarm'], 'State of alarm (Spain)', 'The emergency regime of the Constitution'],
    [['Western Sahara'], 'Western Sahara', 'The former Spanish colony claimed by Morocco'],
    [['Pegasus'], 'Pegasus (spyware)', 'The spyware found on Catalan and government phones'],
    [['1 October'], '2017 Catalan independence referendum', 'The referendum of 1 October 2017'],
    [['Supreme Court'], 'Supreme Court (Spain)', 'Spain\'s highest court'],
    [['National Court'], 'Audiencia Nacional', 'The court for corruption and terrorism cases'],
    [['Moncloa'], 'Palace of Moncloa', 'The Prime Minister\'s residence'],
    [["D'Hondt"], "D'Hondt method", 'How seats are shared out in each province'],
    [['Cortes'], 'Cortes Generales', 'The Spanish parliament: Congress and Senate'],
    [['Senate'], 'Senate of Spain', 'The upper house'],
    [['Congress'], 'Congress of Deputies', 'The lower house: 350 deputies'],
    [['Socialist International'], 'Socialist International', 'The worldwide association of socialist parties'],
    [['Progressive Alliance'], 'Progressive Alliance', 'The network of social-democratic parties founded in 2013'],
    [['Party of European Socialists'], 'Party of European Socialists', 'The PSOE\'s European party'],
    [['geringonça'], 'XXI Constitutional Government of Portugal', 'Costa\'s left-wing government of 2015'],
    [['recovery fund'], 'Next Generation EU', 'The EU\'s pandemic recovery fund'],
    [['Las Ramblas', 'Cambrils'], '2017 Barcelona attacks', 'The August 2017 attacks'],
    [['independence leaders'], 'Trial of Catalonia independence leaders', 'The Supreme Court trial of 2019'],
    [['Historical Memory'], 'Historical Memory Law', 'The 2007 law on the victims of the Civil War and Franco'],
    [['Gibraltar'], 'Gibraltar', 'British territory claimed by Spain'],
    [['La Palma'], '2021 Cumbre Vieja volcanic eruption', 'The 2021 eruption'],
    [['invades Ukraine'], 'Russo-Ukrainian war (2022–present)', 'The Russian invasion of February 2022'],
    [['IBEX'], 'IBEX 35', 'The Madrid stock-market index'],
    [['European Commission'], 'European Commission', 'The EU executive'],
    [['Mossos'], "Mossos d'Esquadra", 'The Catalan police'],
    [['Vistalegre II'], '2016–2017 Podemos state party assembly', 'Podemos\'s second congress, 2017'],
    [['motion of no confidence'], 'Motion of no confidence', 'Art. 113: a vote to replace the Prime Minister'],
    [['European Union'], 'European Union', 'The EU'],
    [['labour reform'], 'es:Reforma laboral española de 2012', 'The PP\'s 2012 labour-market reform'],
    [['only yes means yes', 'only yes'], 'es:Ley Orgánica de Garantía Integral de la Libertad Sexual', 'The 2022 sexual-consent law']
  ];


  // The PSOE's regional federations: their own card, in the PSOE's colour.
  // [names], full name, region, note, Wikipedia title
  var AFFILIATES = [
    [['PSOE-A'], 'Partido Socialista Obrero Español de Andalucía', 'Andalusia', 'The largest federation of the PSOE, with about a quarter of its members. It governed Andalusia without a break from 1982 to 2019, under Rodríguez de la Borbolla, Chaves, Griñán and Susana Díaz, and is the stronghold of susanismo.', 'es:Partido Socialista Obrero Español de Andalucía'],
    [['PSC'], 'Partit dels Socialistes de Catalunya', 'Catalonia', 'A separate party federated with the PSOE since 1978, with its own group in the Catalan Parliament. Led by Miquel Iceta and then Salvador Illa, who won the 2021 Catalan election and became president in 2024.', 'Socialists\' Party of Catalonia'],
    [['PSPV'], 'Partit Socialista del País Valencià', 'Valencia', 'The PSOE in the Valencian Community. Under Ximo Puig it governed from 2015 to 2023 with Compromís and Podemos (the Botànic pact).', 'es:Partido Socialista del País Valenciano-PSOE'],
    [['PSdeG'], 'Partido dos Socialistas de Galicia', 'Galicia', 'The PSOE in Galicia, out of the Xunta since 2009 and overtaken by the BNG in 2020.', 'es:Partido dos Socialistas de Galicia-PSOE'],
    [['PSE-EE'], 'Partido Socialista de Euskadi–Euskadiko Ezkerra', 'Basque Country', 'The PSOE in the Basque Country, junior partner of the PNV in the Basque government from 2016. Led by Idoia Mendia, an ally of Sánchez.', 'es:Partido Socialista de Euskadi-Euskadiko Ezkerra'],
    [['FSA-PSOE'], 'Federación Socialista Asturiana', 'Asturias', 'The PSOE in Asturias, the federation of Javier Fernández and then Adrián Barbón, in government for most of the democratic period.', 'es:Federación Socialista Asturiana'],
    [['PSCM'], 'Partido Socialista de Castilla-La Mancha', 'Castilla-La Mancha', 'The PSOE in Castilla-La Mancha, the federation of Emiliano García-Page, who won absolute majorities in 2019 and 2023.', 'es:Partido Socialista de Castilla-La Mancha-PSOE'],
    [['PSIB'], 'Partit Socialista de les Illes Balears', 'Balearic Islands', 'The PSOE in the Balearics, which governed from 2015 to 2023 under Francina Armengol.', 'es:Partido Socialista de las Islas Baleares'],
    [['PSN'], 'Partido Socialista de Navarra', 'Navarre', 'The PSOE in Navarre. María Chivite has governed with Geroa Bai since 2019, with Bildu abstaining.', 'es:Partido Socialista de Navarra'],
    [['PSOE-M'], 'Partido Socialista Obrero Español de la Comunidad de Madrid', 'Madrid', 'The PSOE in the Madrid region, out of power there since 1995.', 'es:Partido Socialista de Madrid']
  ];


  // Alliances, joint lists and smaller parties: their own card, in the
  // colour of the party they belong to or are counted with.
  // [names], party id (colour), full name, kind, note, Wikipedia title
  var ORGS = [
    // Podemos's alliances
    [['Unidos Podemos'], 'up', 'Unidos Podemos', 'Electoral alliance, 2016', 'Podemos\'s joint list with Izquierda Unida and Equo for the June 2016 general election, led by Pablo Iglesias with Alberto Garzón. It won 71 seats, the same as Podemos and IU separately in 2015, and failed to overtake the PSOE.', 'Unidos Podemos'],
    [['Unidas Podemos'], 'up', 'Unidas Podemos', 'Electoral alliance, 2019', 'The same alliance of Podemos, IU and Equo renamed for 2019. It entered the coalition government with the PSOE in January 2020.', 'Unidas Podemos'],
    [['Sumar'], 'up', 'Sumar', 'Electoral alliance, 2023', 'Yolanda Díaz\'s platform, joined by Podemos, IU, Más País, Compromís, the Comuns and others for the July 2023 election. Podemos left it in December 2023.', 'Sumar (electoral platform)'],
    [['En Comú Podem'], 'up', 'En Comú Podem', 'Catalan alliance', 'The Catalan alliance of Podemos with ICV, EUiA and Barcelona en Comú, led by Xavier Domènech: first in Catalonia in the 2015 and 2016 general elections.', 'En Comú Podem'],
    [['Catalunya en Comú', 'Comuns'], 'up', 'Catalunya en Comú', 'Catalan party', 'Ada Colau\'s party (2017), heir of ICV and Barcelona en Comú; allied with Podemos in Catalunya en Comú–Podem.', 'Catalunya en Comú'],
    [['Catalunya Sí que es Pot'], 'up', 'Catalunya Sí que es Pot', 'Catalan alliance, 2015', 'The alliance of Podemos, ICV and EUiA for the September 2015 Catalan election. It won 11 seats, below expectations.', 'Catalunya Sí que es Pot'],
    [['En Marea'], 'up', 'En Marea', 'Galician alliance', 'The Galician alliance of Podemos, Anova, Esquerda Unida and the city "mareas": second in Galicia in the 2015 and 2016 general elections.', 'En Marea'],
    [['Elkarrekin Podemos'], 'up', 'Elkarrekin Podemos', 'Basque alliance', 'Podemos with Ezker Anitza-IU and Equo in the Basque Country (2016 onwards).', 'Elkarrekin Podemos'],
    [['Adelante Andalucía'], 'aa', 'Adelante Andalucía', 'Andalusian alliance, 2018', 'Podemos Andalucía (Teresa Rodríguez) and IU (Antonio Maíllo) together for the December 2018 Andalusian election: 17 seats. Rodríguez later took the name for her own party.', 'Adelante Andalucía'],
    [['Compromís–Podemos', 'És el moment', 'A la valenciana'], 'up', 'Compromís–Podemos–És el moment', 'Valencian alliance', 'Compromís and Podemos together in the Valencian Community for the 2015 and 2016 general elections.', 'Compromís–Podemos–És el moment'],
    [['Ahora Madrid'], 'up', 'Ahora Madrid', 'Municipal alliance (Madrid)', 'Manuela Carmena\'s platform for the 2015 Madrid city election, built by Podemos with Ganemos Madrid and parts of IU and Equo. Mayor 2015–19; it became Más Madrid in 2019.', 'Ahora Madrid'],
    [['Barcelona en Comú'], 'up', 'Barcelona en Comú', 'Municipal alliance (Barcelona)', 'Ada Colau\'s platform (2015), with ICV-EUiA, Podemos, Equo and Procés Constituent. Mayor 2015–23.', 'Barcelona en Comú'],
    [['Zaragoza en Común'], 'up', 'Zaragoza en Común', 'Municipal alliance (Zaragoza)', 'Pedro Santisteve\'s platform (2015), with Podemos, IU, Equo and others. Mayor 2015–19.', 'es:Zaragoza en Común'],
    [['València en Comú'], 'up', 'València en Comú', 'Municipal alliance (Valencia)', 'The Podemos-backed list in Valencia in 2015 (3 seats); it backed Joan Ribó of Compromís as mayor.', 'es:València en Comú'],
    [['Participa Sevilla'], 'up', 'Participa Sevilla', 'Municipal alliance (Seville)', 'The Podemos-backed list in Seville in 2015 (3 seats); it backed the socialist Juan Espadas as mayor.', 'es:Participa Sevilla'],
    [['Málaga Ahora'], 'up', 'Málaga Ahora', 'Municipal alliance (Málaga)', 'The Podemos-backed list in Málaga in 2015 (4 seats).', 'es:Málaga Ahora'],
    [['Som Palma'], 'up', 'Som Palma', 'Municipal alliance (Palma)', 'The Podemos-backed list in Palma in 2015 (5 seats); part of the left-wing pact that governed the city.', 'es:Som Palma'],
    [['Guanyar Alacant'], 'up', 'Guanyar Alacant', 'Municipal alliance (Alicante)', 'The Podemos-backed list in Alicante in 2015 (6 seats), with EU; part of the "tripartito" that governed until 2018.', 'es:Guanyar Alacant'],
    [['Cambiemos Murcia'], 'iu', 'Cambiemos Murcia', 'Municipal alliance (Murcia)', 'The list of IU, Equo and citizen groups in Murcia in 2015 (3 seats).', 'es:Cambiemos Murcia'],
    [['Ahora Murcia'], 'up', 'Ahora Murcia', 'Municipal alliance (Murcia)', 'Podemos\'s list in Murcia in 2015 (3 seats).', 'es:Ahora Murcia'],
    [['Las Palmas de Gran Canaria Puede', 'LPGC Puede'], 'up', 'Las Palmas de Gran Canaria Puede', 'Municipal alliance (Las Palmas)', 'The Podemos-backed list in Las Palmas in 2015 (6 seats); part of the city\'s left-wing government.', 'es:Las Palmas de Gran Canaria Puede'],
    [['Málaga para la Gente'], 'iu', 'Málaga para la Gente', 'Municipal list (Málaga)', 'Izquierda Unida\'s list in Málaga (2 seats in 2015).', 'es:Málaga para la Gente'],
    [['Más Madrid'], 'mp', 'Más Madrid', 'Party (Madrid)', 'Íñigo Errejón and Manuela Carmena\'s platform (2019), born from Ahora Madrid without Podemos. First in Madrid city in 2019.', 'Más Madrid'],
    [['Más País'], 'mp', 'Más País', 'Party', 'Errejón\'s national party for the November 2019 election, a split from Podemos; later part of Sumar.', 'Más País'],
    // the 2015 Catalan independence list
    [['Junts pel Sí', 'JxSí'], 'jxsi', 'Junts pel Sí', 'Joint list, 2015–17', 'A temporary merger for the plebiscitary Catalan election of 27 September 2015: Artur Mas\'s Convergència and Oriol Junqueras\'s ERC ran together, with Demòcrates and MES, behind the independent Raül Romeva. It won 62 seats and governed with the CUP\'s support. The two parties ran separately again in December 2017 (Junts per Catalunya and ERC).', 'Junts pel Sí'],
    // smaller and regional parties that can win seats
    [['Coalición Canaria', 'CC'], 'cc', 'Coalición Canaria', 'Canarian nationalist party', 'The Canarian nationalist centre party, in the Canary Islands government almost continuously since 1993; one or two deputies in Congress, often decisive in investitures.', 'Canarian Coalition'],
    [['Nueva Canarias', 'NC'], 'nc', 'Nueva Canarias', 'Canarian party', 'A centre-left Canarian nationalist split from CC (2005), strong in Gran Canaria; allied with the PSOE in 2019.', 'New Canaries'],
    [['Unidos por Gran Canaria'], 'cc', 'Unidos por Gran Canaria', 'Island party', 'A centre-right Gran Canaria party, allied with CC.', 'es:Unidos por Gran Canaria'],
    [['Agrupación Socialista Gomera', 'ASG'], 'asg', 'Agrupación Socialista Gomera', 'Island party', 'Casimiro Curbelo\'s party on La Gomera, a 2012 split from the PSOE; kingmaker in the Canarian parliament.', 'Gomera Socialist Group'],
    [['Agrupación Herreña', 'AHI'], 'ahi', 'Agrupación Herreña Independiente', 'Island party', 'The independent party of El Hierro, allied with CC.', 'es:Agrupación Herreña Independiente'],
    [['Foro Asturias', 'Foro'], 'foro', 'Foro Asturias', 'Asturian party', 'Francisco Álvarez-Cascos\'s 2011 split from the PP in Asturias; one deputy in Congress in 2015–16, in alliance with the PP.', 'Asturias Forum'],
    [['Geroa Bai', 'Geroa'], 'geroa', 'Geroa Bai', 'Navarrese party', 'Uxue Barkos\'s Basque nationalist coalition in Navarre, around the PNV; President of Navarre 2015–19, then in government with the PSN.', 'Geroa Bai'],
    [['UPN', 'NA+', 'Navarra Suma'], 'upn', 'Unión del Pueblo Navarro / Navarra Suma', 'Navarrese party', 'The Navarrese centre-right regionalist party, the PP\'s ally in Navarre; ran with the PP and Cs as Navarra Suma (NA+) in 2019.', 'Navarrese People\'s Union'],
    [['Partido Aragonés', 'PAR'], 'par', 'Partido Aragonés', 'Aragonese party', 'The centre-right Aragonese regionalist party, kingmaker in the Cortes de Aragón for decades.', 'Aragonese Party'],
    [['Chunta Aragonesista', 'CHA'], 'cha', 'Chunta Aragonesista', 'Aragonese party', 'The left-wing Aragonese nationalist party; allied with the PSOE and in the Aragonese government 2019–23.', 'Chunta Aragonesista'],
    [['Teruel Existe', 'TE'], 'te', 'Teruel Existe', 'Provincial platform', 'The citizens\' platform of "empty Spain" in Teruel; one deputy from 2019, whose vote invested Sánchez in January 2020.', 'Teruel Existe'],
    [['Soria ¡Ya!', 'Soria Ya'], 'sy', 'Soria ¡Ya!', 'Provincial platform', 'The Soria platform modelled on Teruel Existe: three seats in the Cortes of Castilla y León in 2022.', 'Soria ¡Ya!'],
    [['Unión del Pueblo Leonés', 'UPL'], 'upl', 'Unión del Pueblo Leonés', 'Leonese party', 'The party for a separate León region within Castilla y León.', 'Leonese People\'s Union'],
    [['Por Ávila', 'XAV'], 'xav', 'Por Ávila', 'Provincial party', 'A provincial party in Ávila, a split from the PP.', 'es:Por Ávila'],
    [['Més per Mallorca', 'MÉS per Mallorca', 'MÉS per Palma', 'Més'], 'mes', 'Més per Mallorca', 'Majorcan party', 'The left-wing Majorcan nationalist party; partner of the PSIB in the Balearic governments of 2015–23.', 'Més per Mallorca'],
    [['Més per Menorca', 'MxMe'], 'mxme', 'Més per Menorca', 'Menorcan party', 'The left-wing nationalist party of Menorca, allied with Més per Mallorca.', 'Més per Menorca'],
    [['El Pi'], 'elpi', 'El Pi – Proposta per les Illes', 'Balearic party', 'A centre-right Balearic regionalist party (2013).', 'El Pi'],
    [['PACMA'], 'pacma', 'PACMA', 'Animal rights party', 'The Animalist Party Against Mistreatment of Animals: a steady 1% nationally, never a deputy.', 'PACMA'],
    [['Pedro Sánchez List', 'PSL'], 'ps', 'Pedro Sánchez List', 'Party (game only)', 'The party Sánchez founds in this game if he leaves the PSOE. It never existed.', null],
    [['Podemos (2023)'], 'pod', 'Podemos', 'Party', 'Podemos after its break with Sumar in December 2023, led by Ione Belarra.', 'Podemos (Spanish political party)'],
    [['CiU', 'Convergència', 'DL'], 'junts', 'Convergència i Unió / Democràcia i Llibertat', 'Catalan party', 'Artur Mas\'s centre-right Catalan nationalist federation; CiU broke up in 2015, Convergència ran as Democràcia i Llibertat in December 2015, became the PDeCAT in 2016 and Junts per Catalunya in 2017.', 'Convergence and Union']
  ];

  // party names as they appear in the text
  var PARTY_NAMES = [
    [['PSOE'], 'psoe'], [['PP', "People's Party", 'Partido Popular', 'PPC', 'PPdeG'], 'pp'],
    [['Podemos', 'Unidas Podemos', 'Unidos Podemos', 'Sumar', 'En Comú Podem', 'Catalunya en Comú', 'En Marea', 'Elkarrekin Podemos', 'Comuns'], 'up'], [['Ciudadanos', 'Cs', 'Ciutadans'], 'cs'], [['Vox'], 'vox'],
    [['IU', 'Izquierda Unida'], 'iu'], [['ERC'], 'erc'], [['Junts', 'JxCat', 'Convergència', 'CiU'], 'junts'],
    [['PNV'], 'pnv'], [['EH Bildu', 'Bildu'], 'bildu'], [['CUP'], 'cup'], [['Coalición Canaria'], 'cc'],
    [['Más País'], 'mp'], [['Compromís'], 'compromis'], [['UPN'], 'upn'], [['PRC'], 'prc'], [['BNG'], 'bng'],
    [['Teruel Existe'], 'te'], [['Geroa Bai'], 'geroa'], [['UPyD'], 'upyd'], [['Pedro Sánchez List'], 'ps'],
    [['Italian Democratic Party'], 'pditaly'], [['PASOK'], 'pasok'],
    [['British Labour', 'Labour Party', 'Labour'], 'labour'], [['German SPD', 'SPD'], 'spd'], [['Syriza'], 'syriza'],
    [['US Democrats', 'Democratic Party'], 'usdem'], [['Portuguese Socialists'], 'psportugal'],
    [['Danish Social Democrats'], 'dksd'], [['Swedish Social Democrats'], 'sap'],
    [['Polisario'], 'polisario']
  ];

  // Party descriptions: native name, English name, ideology, and what it
  // is known for, written as "The <native> (en: <English>) is a <ideology>
  // party ... which ...".
  var PARTY_DESC = {
    psoe: ['Partido Socialista Obrero Español', "Spanish Socialist Workers' Party", 'social-democratic',
      'founded in 1879, the oldest party in Spain, which has governed for longer than any other party since the return of democracy'],
    pp: ['Partido Popular', "People's Party", 'conservative and Christian-democratic',
      "the main party of the Spanish centre-right since 1989, which governed under Aznar and Rajoy and was convicted as a beneficiary of the Gürtel corruption network"],
    up: ['Podemos', 'We Can', 'left-wing populist',
      'born in 2014 out of the 15-M anti-austerity movement, which promised to break the PP–PSOE two-party system'],
    cs: ['Ciudadanos', 'Citizens', 'liberal and anti-nationalist',
      'founded in Catalonia in 2006 against Catalan nationalism, which went national in 2015 promising to regenerate Spanish politics'],
    vox: ['Vox', 'Voice', 'national-conservative, right-wing populist',
      'founded in 2013 by former PP members, which opposes regional autonomy, feminism laws and immigration'],
    iu: ['Izquierda Unida', 'United Left', 'communist and eco-socialist',
      'founded in 1986 around the Communist Party of Spain (PCE), which has long been the main force to the left of the PSOE'],
    erc: ['Esquerra Republicana de Catalunya', 'Republican Left of Catalonia', 'left-wing, pro-independence',
      'founded in 1931, which governed Catalonia during the Second Republic and seeks a Catalan republic'],
    junts: ['Junts per Catalunya', 'Together for Catalonia', 'centre-right, pro-independence',
      "heir to Jordi Pujol's Convergència, which led the 2017 independence push under Carles Puigdemont"],
    pnv: ['Euzko Alderdi Jeltzalea – Partido Nacionalista Vasco', 'Basque Nationalist Party', 'Christian-democratic, Basque nationalist',
      'founded in 1895, which has governed the Basque Country for most of the democratic period and trades its votes in Madrid for investment and powers'],
    bildu: ['Euskal Herria Bildu', 'Basque Country Unite', 'left-wing, Basque pro-independence',
      'formed in 2012 by the abertzale left and allies, which entered institutions after ETA ended its violence'],
    cup: ["Candidatura d'Unitat Popular", 'Popular Unity Candidacy', 'anticapitalist, Catalan pro-independence',
      'an assembly-based party, which forced Artur Mas out of the presidency in 2016'],
    cc: ['Coalición Canaria', 'Canarian Coalition', 'Canarian nationalist and centrist',
      'founded in 1993, which has governed the Canary Islands for most of the period with partners from left and right'],
    mp: ['Más País', 'More Country', 'green-left',
      "founded in 2019 by Íñigo Errejón after his break with Podemos, which allied with Compromís in Valencia"],
    compromis: ['Coalició Compromís', 'Commitment Coalition', 'Valencian left-wing and green',
      'a coalition of Valencian nationalists and greens, which governed Valencia with the PSOE from 2015'],
    upn: ['Unión del Pueblo Navarro', "Navarrese People's Union", 'conservative, Navarrese regionalist',
      'founded in 1979, which defends Navarre as separate from the Basque Country and long allied with the PP'],
    prc: ['Partido Regionalista de Cantabria', 'Regionalist Party of Cantabria', 'centrist, Cantabrian regionalist',
      "led by Miguel Ángel Revilla, which governs Cantabria and lends its single deputy to whoever offers Cantabria the most"],
    bng: ['Bloque Nacionalista Galego', 'Galician Nationalist Bloc', 'left-wing, Galician nationalist',
      'founded in 1982, which became the main opposition in Galicia in 2020'],
    te: ['Teruel Existe', 'Teruel Exists', 'rural localist',
      "a citizens' platform for depopulated rural Spain, which won a seat in 2019 and decided Sánchez's investiture"],
    geroa: ['Geroa Bai', 'Yes to the Future', 'Basque nationalist',
      'the Basque nationalist coalition of Navarre, which led its government under Uxue Barkos from 2015'],
    upyd: ['Unión, Progreso y Democracia', 'Union, Progress and Democracy', 'social-liberal and centralist',
      'founded in 2007 by Rosa Díez, which was overtaken by Ciudadanos and lost all its seats in 2015'],
    ps: ['Lista Pedro Sánchez', 'Pedro Sánchez List', 'personalist social-democratic',
      "founded by Pedro Sánchez after his break with the PSOE, which competes with it for the same voters"],
    labour: ['Labour Party', 'Labour Party', 'social-democratic',
      'founded in 1900, the main party of the British left, which governed under Attlee, Wilson and Blair'],
    spd: ['Sozialdemokratische Partei Deutschlands', 'Social Democratic Party of Germany', 'social-democratic',
      'founded in 1863, the oldest party in Germany, which spent most of the 2010s as junior partner in grand coalitions'],
    syriza: ['Synaspismós Rizospastikís Aristerás (Syriza)', 'Coalition of the Radical Left', 'radical left',
      'which won the Greek election of 2015 against austerity and then accepted a third bailout'],
    usdem: ['Democratic Party', 'Democratic Party', 'liberal',
      'one of the two major parties of the United States, which held the presidency under Obama and Biden'],
    polisario: ['Frente Polisario', 'Polisario Front', 'Sahrawi nationalist',
      'a liberation movement, which claims independence for Western Sahara against Morocco'],
    pditaly: ['Partito Democratico', 'Democratic Party', 'centre-left',
      'founded in 2007 by merging the post-communist and Christian-left traditions, which led Italy under Renzi and later governed with the Five Star Movement'],
    pasok: ['Panellinio Sosialistiko Kinima', 'Panhellenic Socialist Movement', 'social-democratic',
      'which dominated Greek politics for three decades, then collapsed after 2012 as Syriza took its voters, giving the world the word "Pasokification"'],
    psportugal: ['Partido Socialista', 'Socialist Party', 'social-democratic',
      "Portugal's main centre-left party, which governed with the support of the radical left from 2015"],
    dksd: ['Socialdemokratiet', 'Social Democrats', 'social-democratic',
      "Denmark's largest party, which combined a strict line on migration with the welfare state under Mette Frederiksen"],
    sap: ['Sveriges socialdemokratiska arbetareparti', "Swedish Social Democratic Workers' Party", 'social-democratic',
      'the architect of the Swedish welfare state, which has governed Sweden for most of the last century'],
    ukcon: ['Conservative Party', 'Conservative Party', 'conservative',
      'the governing party of the United Kingdom from 2010, which held the Brexit referendum'],
    cdu: ['Christlich Demokratische Union Deutschlands', 'Christian Democratic Union of Germany', 'Christian-democratic',
      "Germany's main centre-right party, which governed under Angela Merkel from 2005 to 2021"],
    usrep: ['Republican Party', 'Republican Party', 'conservative',
      'one of the two major parties of the United States, which won the presidency with Donald Trump in 2016'],
    lega: ['Lega', 'League', 'right-wing populist',
      'once a northern separatist party, which became a national anti-immigration party under Matteo Salvini'],
    lrem: ['La République En Marche', 'The Republic on the Move', 'liberal centrist',
      'founded in 2016 by Emmanuel Macron, which won the French presidency and parliament in 2017'],
    psfrance: ['Parti socialiste', 'Socialist Party', 'social-democratic',
      'which held the French presidency under Hollande and fell to 6% in the 2017 election'],
    unitedrussia: ['Yedinaya Rossiya', 'United Russia', 'nationalist and conservative',
      "Russia's ruling party, which backs Vladimir Putin"],
    servant: ['Sluha Narodu', 'Servant of the People', 'centrist',
      'founded in 2018 and named after the TV series that made Volodymyr Zelensky famous'],
    bcomu: ['Barcelona en Comú', 'Barcelona in Common', 'left-wing municipalist',
      'which won Barcelona city hall in 2015 with Ada Colau as mayor'],
    ahoramadrid: ['Ahora Madrid', 'Madrid Now', 'left-wing municipalist',
      'which won Madrid city hall in 2015 with Manuela Carmena as mayor']
  };
  var PLACE = { labour: 'the United Kingdom', ukcon: 'the United Kingdom', spd: 'Germany', cdu: 'Germany', syriza: 'Greece',
                usdem: 'the United States', usrep: 'the United States', psportugal: 'Portugal', dksd: 'Denmark',
                sap: 'Sweden', lega: 'Italy', lrem: 'France', psfrance: 'France', unitedrussia: 'Russia', servant: 'Ukraine',
                polisario: 'Western Sahara', pditaly: 'Italy', pasok: 'Greece' };

  // single-word names that take no article ("Podemos is", not "The Podemos is")
  var NO_ARTICLE = { up: 1, vox: 1, cs: 1, mp: 1, te: 1, geroa: 1, bildu: 1, junts: 1, syriza: 1, lega: 1,
                     ahoramadrid: 1, bcomu: 1, servant: 1, ps: 1 };

  function partySentence(id) {
    var d = PARTY_DESC[id];
    if (!d) {
      return '';
    }
    var name = (NO_ARTICLE[id] ? '' : 'The ') + d[0] + (d[0] === d[1] ? '' : ' (en: ' + d[1] + ')');
    var art = /^[aeiou]/i.test(d[2]) ? 'an ' : 'a ';
    var fact = /^which/.test(d[3]) ? ' ' + d[3] : ', ' + d[3];
    return name + ' is ' + art + d[2] + ' party in ' + (PLACE[id] || 'Spain') + fact + '.';
  }

  // Current leaders. PSOE, PP, Podemos, Cs and the sister parties follow
  // the game (window.SpainGame); the rest change on their real dates.
  var LEADER_DATES = {
    vox: [[201409, 'Alejo Vidal-Quadras'], [999999, 'Santiago Abascal']],
    iu: [[201606, 'Cayo Lara'], [999999, 'Alberto Garzón']],
    erc: [[999999, 'Oriol Junqueras']],
    junts: [[201601, 'Artur Mas'], [999999, 'Carles Puigdemont']],
    pnv: [[999999, 'Andoni Ortuzar']], bildu: [[999999, 'Arnaldo Otegi']],
    cc: [[201506, 'Paulino Rivero'], [999999, 'Fernando Clavijo']], mp: [[999999, 'Íñigo Errejón']],
    compromis: [[999999, 'Mónica Oltra']], upn: [[201503, 'Yolanda Barcina'], [999999, 'Javier Esparza']],
    prc: [[999999, 'Miguel Ángel Revilla']], bng: [[999999, 'Ana Pontón']], te: [[999999, 'Tomás Guitarte']],
    geroa: [[999999, 'Uxue Barkos']], upyd: [[201507, 'Rosa Díez'], [999999, 'Andrés Herzog']],
    ukcon: [[201607, 'David Cameron'], [201907, 'Theresa May'], [202209, 'Boris Johnson'], [999999, 'Rishi Sunak']],
    cdu: [[201812, 'Angela Merkel'], [202101, 'Annegret Kramp-Karrenbauer'], [202201, 'Armin Laschet'], [999999, 'Friedrich Merz']],
    usrep: [[999999, 'Donald Trump']], lega: [[999999, 'Matteo Salvini']], syriza: [[202306, 'Alexis Tsipras'], [999999, 'Stefanos Kasselakis']],
    lrem: [[999999, 'Emmanuel Macron']], psfrance: [[201703, 'François Hollande'], [201804, 'Benoît Hamon'], [999999, 'Olivier Faure']],
    unitedrussia: [[999999, 'Vladimir Putin']], servant: [[999999, 'Volodymyr Zelensky']],
    polisario: [[201605, 'Mohamed Abdelaziz'], [999999, 'Brahim Ghali']],
    bcomu: [[999999, 'Ada Colau']], ahoramadrid: [[999999, 'Manuela Carmena']]
  };
  var SISTER_OF = { labour: 'labour', psportugal: 'portugal', dksd: 'denmark', spd: 'germany', sap: 'sweden', usdem: 'us',
                    pditaly: 'italy', pasok: 'greece' };
  // factions for leaders the game introduces who are not in PEOPLE
  var EXTRA_WINGS = {
    'Alejo Vidal-Quadras': 'Founder; liberal-conservative wing', 'Javier Esparza': 'Navarrese regionalist right',
    'Ana Pontón': 'Galician nationalist left', 'Tomás Guitarte': 'Rural platform', 'Rosa Díez': 'Founder; centralist',
    'Andrés Herzog': 'Centralist', 'Rishi Sunak': 'Fiscal conservative', 'Annegret Kramp-Karrenbauer': "Merkel's centrist wing",
    'Armin Laschet': "Merkel's centrist wing", 'Friedrich Merz': 'Conservative wing', 'Stefanos Kasselakis': 'Outsider',
    'Olivier Faure': 'Party mainstream', 'Nancy Pelosi and Chuck Schumer': 'Congressional leadership, liberal mainstream', 'Mohamed Abdelaziz': 'Founding leadership', 'Eduardo Madina': 'Modernisers'
  };

  function gameQ() {
    try {
      return root.dendryUI && root.dendryUI.dendryEngine.state.qualities;
    } catch (e) {
      return null;
    }
  }

  function currentLeader(id, Q) {
    Q = Q || gameQ() || { year: 2014, month: 7 };
    var G = root.SpainGame;
    var name = null;
    if (id === 'psoe') {
      name = Q.sanchez_leader === 0 && Q.psoe_leader ? Q.psoe_leader : 'Pedro Sánchez';
    } else if (id === 'pp') {
      name = Q.pp_leader || 'Mariano Rajoy';
    } else if ((id === 'up' || id === 'cs') && G && G.leaderOf && Q.year) {
      name = G.leaderOf(Q, id);
    } else if (id === 'ps') {
      name = 'Pedro Sánchez';
    } else if (SISTER_OF[id] && G && G.sisterLeader && Q.year) {
      name = G.sisterLeader(Q, SISTER_OF[id]).name.replace(/ \(.*\)$/, '');

    } else if (LEADER_DATES[id]) {
      var k = (Q.year || 2014) * 100 + (Q.month || 7);
      var list = LEADER_DATES[id];
      for (var i = 0; i < list.length; i++) {
        if (k <= list[i][0]) { name = list[i][1]; break; }
      }
    }
    if (!name) {
      return null;
    }
    var person = INDEX[name] && INDEX[name].kind === 'person' ? PEOPLE[INDEX[name].i] : null;
    var wing = person ? person[3] : (EXTRA_WINGS[name] || '');
    if (name === 'Pedro Sánchez' && id === 'ps') {
      wing = 'Founder';
    }
    return { name: name, wing: wing };
  }


  function partyInfo(id) {
    var UI = root.SpainUI;
    if (EXTRA_PARTIES[id]) {
      return { name: EXTRA_PARTIES[id][0], color: EXTRA_PARTIES[id][1], short: EXTRA_PARTIES[id][2] };
    }
    return { name: UI ? UI.partyName(id) : id, color: UI ? UI.partyColor(id) : '#888', short: UI ? UI.shortName(id) : id };
  }


  // The factions of the other parties (see SpainGame.RIVAL_FACTIONS).
  var FACTION_LABEL = {
    pp: { centrists: 'Centrists', pragmatists: 'Pragmatists', right: 'National-populist right' },
    cs: { progressives: 'Social liberals', liberals: 'Liberals', national: 'National liberals' },
    up: { pragmatic: 'Pragmatic left', populist: 'Populist left', anticapitalistas: 'Anticapitalist left' },
    pod: { populist: 'Populist left', anticapitalistas: 'Anticapitalist left' },
    vox: { national: 'National conservatives', catholic: 'Ultra-Catholic nationalists', liberals: 'Liberal conservatives' }
  };
  var FACTION_OF = {
    'Mariano Rajoy': 'pragmatists', 'Soraya Sáenz de Santamaría': 'centrists', 'Pablo Casado': 'right', 'María Dolores de Cospedal': 'pragmatists',
    'Alberto Núñez Feijóo': 'pragmatists', 'Isabel Díaz Ayuso': 'right', 'Cristina Cifuentes': 'centrists', 'Alberto Ruiz-Gallardón': 'pragmatists',
    'Esperanza Aguirre': 'right', 'Juanma Moreno': 'centrists', 'José María Aznar': 'right', 'Cristóbal Montoro': 'pragmatists',
    'Luis de Guindos': 'pragmatists', 'Fátima Báñez': 'pragmatists', 'José Manuel García-Margallo': 'centrists', 'Jorge Fernández Díaz': 'right',
    'Pedro Morenés': 'pragmatists', 'Rafael Catalá': 'pragmatists', 'Alfonso Alonso': 'centrists', 'José Ignacio Wert': 'right',
    'Isabel García Tejerina': 'pragmatists', 'Ignacio González': 'right', 'José Ramón Bauzá': 'right', 'Alberto Fabra': 'pragmatists',
    'Luisa Fernanda Rudi': 'pragmatists', 'Ignacio Diego': 'pragmatists', 'Juan Vicente Herrera': 'centrists', 'José Antonio Monago': 'centrists',
    'Alberto Garre': 'pragmatists', 'Pedro Antonio Sánchez': 'pragmatists', 'José Ignacio Ceniceros': 'pragmatists', 'Pedro Sanz': 'pragmatists',
    'Luis Bárcenas': 'pragmatists', 'Dolors Montserrat': 'pragmatists', 'Íñigo Méndez de Vigo': 'centrists', 'Ana Pastor': 'centrists',
    'Juan Ignacio Zoido': 'pragmatists', 'Álvaro Nadal': 'pragmatists',
    'Albert Rivera': 'national', 'Inés Arrimadas': 'liberals', 'Begoña Villacís': 'liberals', 'Luis Garicano': 'liberals', 'Toni Roldán': 'progressives',
    'Marta Rivera de la Cruz': 'liberals', 'Edmundo Bal': 'liberals', 'Francisco Igea': 'progressives', 'Juan Marín': 'liberals',
    'Juan Carlos Girauta': 'national', 'José Manuel Villegas': 'national',
    'Pablo Iglesias': 'populist', 'Íñigo Errejón': 'pragmatic', 'Irene Montero': 'populist', 'Ione Belarra': 'populist',
    'Pablo Echenique': 'populist', 'Teresa Rodríguez': 'anticapitalistas', 'Nacho Álvarez': 'populist', 'Pablo Bustinduy': 'pragmatic',
    'Carolina Bescansa': 'pragmatic', 'Julio Rodríguez': 'populist', 'Yolanda Díaz': 'pragmatic', 'Ernest Urtasun': 'pragmatic',
    'Santiago Abascal': 'national', 'Rocío Monasterio': 'liberals', 'Javier Ortega Smith': 'national', 'Iván Espinosa de los Monteros': 'liberals',
    'Jorge Buxadé': 'catholic', 'Macarena Olona': 'national', 'Agustín Rosety': 'national', 'Francisco Serrano': 'national'
  };
  // independents and allies inside the Podemos space have no current
  var FACTION_NOTE = { 'Manuel Castells': 'Independent', 'Xavier Domènech': 'En Comú Podem (ally)',
    'Juantxo López de Uralde': 'Equo (ally)', 'Ernest Urtasun': 'Comuns / Sumar (ally)' };

  // Build one regex over every name, longest first, with letter boundaries.
  var INDEX = {};
  var names = [];
  PEOPLE.forEach(function (p, i) {
    p[0].forEach(function (n) { INDEX[n] = { kind: 'person', i: i }; names.push(n); });
  });
  PARTY_NAMES.forEach(function (p) {
    p[0].forEach(function (n) { if (!INDEX[n]) { INDEX[n] = { kind: 'party', id: p[1] }; names.push(n); } });
  });
  AFFILIATES.forEach(function (a, i) {
    a[0].forEach(function (n) { INDEX[n] = { kind: 'affiliate', i: i }; names.push(n); });
  });
  ORGS.forEach(function (o, i) {
    o[0].forEach(function (n) { if (!INDEX[n]) { names.push(n); } INDEX[n] = { kind: 'org', i: i }; });
  });
  TOPICS.forEach(function (t, i) {
    t[0].forEach(function (n) { if (!INDEX[n]) { INDEX[n] = { kind: 'topic', i: i }; names.push(n); } });
  });

  // Any other party that has won seats in a regional parliament in the
  // data gets a plain card: its name, and where it sits.
  var SEAT_PARTIES = {};
  (function () {
    var R = null;
    try { R = (typeof module !== 'undefined' && module.exports) ? require('./regional_data.js') : root.SPAIN_REGIONAL_DATA; } catch (e) { R = null; }
    var UI = root.SpainUI || ((typeof module !== 'undefined' && module.exports) ? require('./spain_ui.js') : null);
    if (!R || !R.regions || !UI) { return; }
    Object.keys(R.regions).forEach(function (reg) {
      Object.keys(R.regions[reg]).forEach(function (date) {
        var e = R.regions[reg][date], tot = {}, all = 0;
        Object.keys(e.districts || {}).forEach(function (d) {
          e.districts[d].lists.forEach(function (l) { tot[l[0]] = (tot[l[0]] || 0) + l[2]; all += l[2]; });
        });
        Object.keys(tot).forEach(function (id) {
          if (tot[id] / all >= 0.025 && !SEAT_PARTIES[id]) { SEAT_PARTIES[id] = reg; }
        });
      });
    });
    Object.keys(SEAT_PARTIES).forEach(function (id) {
      [UI.partyName(id), UI.shortName(id)].forEach(function (n) {
        if (n && n.length > 1 && !INDEX[n]) { INDEX[n] = { kind: 'seatparty', id: id }; names.push(n); }
      });
    });
  })();
  names.sort(function (a, b) { return b.length - a.length; });
  var esc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  var RE = null;
  try {
    RE = new RegExp('(?<![\\p{L}\\p{N}])(' + names.map(esc).join('|') + ')(?![\\p{L}\\p{N}])', 'gu');
  } catch (e) {
    RE = new RegExp('\\b(' + names.map(esc).join('|') + ')\\b', 'g');
  }

  function lookup(text) {
    var hit = INDEX[text];
    if (!hit) {
      return null;
    }
    if (hit.kind === 'person') {
      var p = PEOPLE[hit.i];
      var title = PERSON_WIKI[p[0][0]] === undefined ? p[0][0] : PERSON_WIKI[p[0][0]];
      var fk = FACTION_OF[p[0][0]], fl = fk && FACTION_LABEL[p[1]] ? FACTION_LABEL[p[1]][fk] : (FACTION_NOTE[p[0][0]] || '');
      var wing = fl ? 'Faction: ' + fl + (p[3] ? ' — ' + p[3] : '') : p[3];
      return { kind: 'person', name: p[0][0], party: p[1], role: p[2], wing: wing, wiki: title, img: imgUrl(PERSON_IMG[p[0][0]]) };
    }
    if (hit.kind === 'seatparty') {
      return { kind: 'org', party: hit.id, name: (root.SpainUI || require('./spain_ui.js')).partyName(hit.id), sub: 'Regional party (' + SEAT_PARTIES[hit.id] + ')', note: 'Has won seats in the regional parliament of ' + SEAT_PARTIES[hit.id] + '.', wiki: null };
    }
    if (hit.kind === 'org') {
      var og = ORGS[hit.i];
      return { kind: 'org', party: og[1], name: og[2], sub: og[3], note: og[4], wiki: og[5] };
    }
    if (hit.kind === 'affiliate') {
      var af = AFFILIATES[hit.i];
      return { kind: 'affiliate', party: 'psoe', name: af[1], region: af[2], note: af[3], wiki: af[4] };
    }
    if (hit.kind === 'topic') {
      var t = TOPICS[hit.i];
      return { kind: 'topic', name: text, wiki: t[1], note: t[2], img: imgUrl(TOPIC_IMG[t[0][0]]) };
    }
    return { kind: 'party', party: hit.id, wiki: NAME_WIKI[text] || PARTY_WIKI[hit.id] || null };
  }

  // Readable text colour: very light party colours are darkened.
  function textColor(hex) {
    var h = hex.replace('#', '');
    var r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (lum < 0.6) {
      return hex;
    }
    var k = 0.6 / lum;
    var c = function (x) { return ('0' + Math.round(x * k).toString(16)).slice(-2); };
    return '#' + c(r) + c(g) + c(b);
  }

  var SKIP = { SCRIPT: 1, STYLE: 1, SVG: 1, svg: 1, SELECT: 1, OPTION: 1, TEXTAREA: 1, INPUT: 1, BUTTON: 1, TITLE: 1 };

  function annotate(rootEl) {
    if (!rootEl || !root.document) {
      return;
    }
    var doc = root.document;
    var walker = doc.createTreeWalker(rootEl, 4, {
      acceptNode: function (n) {
        for (var p = n.parentNode; p && p !== rootEl.parentNode; p = p.parentNode) {
          if (SKIP[p.nodeName] || (p.classList && (p.classList.contains('sp-ent') || p.classList.contains('sp-map-tip') ||
              p.classList.contains('sp-no-ent')))) {
            return 2;
          }
        }
        RE.lastIndex = 0;
        return RE.test(n.nodeValue) ? 1 : 2;
      }
    });
    var nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var inHeading = false;
      for (var h = node.parentNode; h && h !== rootEl.parentNode; h = h.parentNode) {
        if (/^H[1-6]$/.test(h.nodeName)) { inHeading = true; break; }
      }
      var frag = doc.createDocumentFragment();
      var last = 0;
      RE.lastIndex = 0;
      var m;
      while ((m = RE.exec(text)) !== null) {
        var info = lookup(m[1]);
        if (!info || (info.kind === 'topic' && inHeading)) {
          continue;
        }
        if (m.index > last) {
          frag.appendChild(doc.createTextNode(text.slice(last, m.index)));
        }
        // inside a choice link the name only gets colour and a card;
        // elsewhere it links to Wikipedia in a new tab
        var inLink = false;
        for (var a = node.parentNode; a && a !== rootEl.parentNode; a = a.parentNode) {
          // inside a link, or anywhere in a list of choices (subtitles,
          // unavailable options): the game handles clicks there itself
          if (a.nodeName === 'A' || (a.classList && (a.classList.contains('choices') || a.classList.contains('hand') ||
              a.classList.contains('decks') || a.classList.contains('pinned-cards')))) { inLink = true; break; }
        }
        var span = doc.createElement(info.wiki && !inLink ? 'a' : 'span');
        span.className = 'sp-ent' + (info.kind === 'topic' ? ' sp-topic' : '');
        if (info.wiki && !inLink) {
          span.href = wikiUrl(info.wiki);
          span.target = '_blank';
          span.rel = 'noopener';
        } else {
          span.setAttribute('tabindex', '0');
        }
        span.setAttribute('data-ent', m[1]);
        if (info.kind !== 'topic') {
          span.style.color = textColor(partyInfo(info.party).color);
        }
        span.textContent = m[1];
        frag.appendChild(span);
        last = m.index + m[1].length;
      }
      if (last === 0) {
        return;
      }
      if (last < text.length) {
        frag.appendChild(doc.createTextNode(text.slice(last)));
      }
      node.parentNode.replaceChild(frag, node);
    });
  }

  // "es:Title" links to Spanish Wikipedia (used where no English page exists)
  function wikiUrl(title) {
    var lang = /^es:/.test(title) ? 'es' : 'en';
    var t = title.replace(/^es:/, '');
    return 'https://' + lang + '.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, '_')).replace(/%2C/g, ',');
  }

  function cardHtml(key, linked) {
    var info = lookup(key);
    if (!info) {
      return '';
    }
    var more = linked && info.wiki ? '<div class="sp-ent-more">Click to open on ' + (/^es:/.test(info.wiki) ? 'Spanish ' : '') +
      'Wikipedia ↗</div>' : '';
    if (info.kind === 'topic') {
      return (info.img ? '<img class="sp-ent-emblem" src="' + info.img + '" alt="">' : '') +
        '<div><strong>' + info.wiki.replace(/^es:/, '') + '</strong></div><div class="sp-ent-wing">' + info.note + '</div>' + more;
    }
    var pi = partyInfo(info.party);
    var logo = PARTY_IMG[info.party] ? '<img class="sp-ent-plogo" src="' + imgUrl(PARTY_IMG[info.party]) + '" alt="' + pi.short + '">' : '';
    var badge = logo || '<span class="sp-ent-logo" style="background:' + pi.color + '">' + pi.short + '</span>';
    if (info.kind === 'person') {
      return '<div class="sp-ent-head">' + (info.img ? '<img class="sp-ent-photo" src="' + info.img + '" alt="">' : '') + badge + '<div><strong>' + info.name + '</strong><br>' + pi.name +
        '</div></div><div>' + info.role + '</div>' + (info.wing ? '<div class="sp-ent-wing">' + info.wing + '</div>' : '') + more;
    }
    if (info.kind === 'org') {
      var lg = PARTY_IMG[info.party] ? '<img class="sp-ent-plogo" src="' + imgUrl(PARTY_IMG[info.party]) + '" alt="">' : '<span class="sp-ent-logo" style="background:' + pi.color + '">' + pi.short + '</span>';
      return '<div class="sp-ent-head">' + lg + '<div><strong>' + info.name + '</strong><br>' + info.sub + '</div></div><div class="sp-ent-desc">' + info.note + '</div>' + more;
    }
    if (info.kind === 'affiliate') {
      return '<div class="sp-ent-head">' + badge + '<div><strong>' + info.name + '</strong><br>Regional federation of the PSOE: ' + info.region +
        '</div></div><div class="sp-ent-desc">' + info.note + '</div><div class="sp-ent-wing">Part of the ' + pi.name + '.</div>' + more;
    }
    var desc = partySentence(info.party);
    var lead = currentLeader(info.party);
    return '<div class="sp-ent-head">' + badge + '<div><strong>' + pi.name + '</strong></div></div>' +
      (desc ? '<div class="sp-ent-desc">' + desc + '</div>' : '') +
      (lead ? '<div class="sp-ent-lead"><b>Leader:</b> ' + lead.name + (lead.wing ? ' <span class="sp-ent-wing">(' + lead.wing + ')</span>' : '') + '</div>' : '') + more;
  }

  // Browser: annotate the story and sidebar as they change, and show a
  // card on hover or keyboard focus.
  function install() {
    var doc = root.document;
    if (!doc || install.done) {
      return;
    }
    install.done = true;
    var tip = doc.createElement('div');
    tip.className = 'sp-ent-tip';
    tip.setAttribute('role', 'tooltip');
    doc.body.appendChild(tip);
    var showFor = function (el) {
      tip.innerHTML = cardHtml(el.getAttribute('data-ent'), el.nodeName === 'A');
      tip.style.display = 'block';
      var r = el.getBoundingClientRect();
      var x = Math.min(r.left, root.innerWidth - tip.offsetWidth - 8);
      var y = r.bottom + 6;
      if (y + tip.offsetHeight > root.innerHeight - 4) {
        y = r.top - tip.offsetHeight - 6;
      }
      tip.style.left = Math.max(4, x) + 'px';
      tip.style.top = Math.max(4, y) + 'px';
    };
    var hide = function () { tip.style.display = 'none'; };
    doc.addEventListener('mouseover', function (ev) {
      var el = ev.target.closest && ev.target.closest('.sp-ent');
      if (el) { showFor(el); } else { hide(); }
    });
    doc.addEventListener('focusin', function (ev) {
      var el = ev.target.closest && ev.target.closest('.sp-ent');
      if (el) { showFor(el); }
    });
    doc.addEventListener('focusout', hide);
    root.addEventListener('scroll', hide, true);
    var targets = ['content', 'stats_sidebar'].map(function (id) { return doc.getElementById(id); }).filter(Boolean);
    var pending = false;
    var run = function () {
      pending = false;
      observer.disconnect();
      targets.forEach(annotate);
      targets.forEach(function (t) { observer.observe(t, { childList: true, subtree: true }); });
    };
    var observer = new MutationObserver(function () {
      if (!pending) {
        pending = true;
        (root.requestAnimationFrame || setTimeout)(run);
      }
    });
    run();
  }

  var api = { partySentence: partySentence, currentLeader: currentLeader, PEOPLE: PEOPLE, PARTY_IMG: PARTY_IMG, PERSON_IMG: PERSON_IMG, TOPIC_IMG: TOPIC_IMG, IMG: IMG, PARTY_NAMES: PARTY_NAMES, TOPICS: TOPICS, wikiUrl: wikiUrl, lookup: lookup, cardHtml: cardHtml, annotate: annotate,
              install: install, regex: function () { return RE; } };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SpainEntities = api;
    if (root.document) {
      if (root.document.readyState === 'loading') {
        root.document.addEventListener('DOMContentLoaded', install);
      } else {
        install();
      }
    }
  }
})(this);
