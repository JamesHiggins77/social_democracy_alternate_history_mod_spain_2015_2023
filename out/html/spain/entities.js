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
    // PSOE
    [['Pedro Sánchez', 'Sánchez'], 'psoe', 'Secretary-General of the PSOE', 'Sanchismo: the members against the apparatus'],
    [['Susana Díaz'], 'psoe', 'President of Andalusia', 'Regional Leaders (susanismo), the party\'s centrist establishment'],
    [['Emiliano García-Page', 'García-Page'], 'psoe', 'President of Castilla-La Mancha', 'Regional Leaders, centrist and hostile to deals with nationalists'],
    [['Javier Fernández'], 'psoe', 'President of Asturias; caretaker leader in 2016', 'Regional Leaders, institutionalist'],
    [['Eduardo Madina', 'Madina'], 'psoe', 'Basque deputy', 'Modernisers'],
    [['Patxi López'], 'psoe', 'Former Lehendakari', 'Institutionalists'],
    [['Antonio Hernando', 'Hernando'], 'psoe', 'Spokesperson of the parliamentary group', 'Institutionalists'],
    [['César Luena', 'Luena'], 'psoe', 'Secretary of Organisation (2014–16)', 'Sanchismo'],
    [['José Luis Ábalos', 'Ábalos'], 'psoe', 'Secretary of Organisation (from 2017)', 'Sanchismo'],
    [['Adriana Lastra', 'Lastra'], 'psoe', 'Deputy Secretary-General', 'Sanchismo, Progressives'],
    [['María Jesús Montero'], 'psoe', 'Minister of Finance', 'Regional Leaders (Andalusian)'],
    [['Carmen Calvo'], 'psoe', 'Deputy Prime Minister', 'Institutionalists'],
    [['Ximo Puig'], 'psoe', 'President of Valencia', 'Regional Leaders, federalist'],
    [['Guillermo Fernández Vara', 'Fernández Vara'], 'psoe', 'President of Extremadura', 'Regional Leaders'],
    [['Javier Lambán', 'Lambán'], 'psoe', 'President of Aragón', 'Regional Leaders, critic of Sánchez'],
    [['Francina Armengol', 'Armengol'], 'psoe', 'President of the Balearic Islands', 'Progressives, federalist'],
    [['Felipe González'], 'psoe', 'Prime Minister 1982–96', 'The old guard'],
    [['Alfredo Pérez Rubalcaba', 'Rubalcaba'], 'psoe', 'Secretary-General 2012–14', 'Institutionalists'],
    [['José Luis Rodríguez Zapatero', 'Zapatero'], 'psoe', 'Prime Minister 2004–11', 'Progressives'],
    [['Miquel Iceta', 'Iceta'], 'psoe', 'Leader of the PSC', 'Catalan socialists, federalist'],
    [['Salvador Illa', 'Illa'], 'psoe', 'PSC; Minister of Health', 'Catalan socialists'],
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
    [['Bernie Sanders', 'Sanders'], 'usdem', 'US Senator', 'Democratic socialist'],
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
    'Teresa Rodríguez': null
  };
  var PARTY_WIKI = {
    psoe: "Spanish Socialist Workers' Party", pp: "People's Party (Spain)", up: 'Podemos (Spanish political party)',
    cs: 'Citizens (Spanish political party)', vox: 'Vox (political party)', iu: 'United Left (Spain)',
    erc: 'Republican Left of Catalonia', junts: 'Together for Catalonia (2020)', pnv: 'Basque Nationalist Party',
    bildu: 'EH Bildu', cup: 'Popular Unity Candidacy', cc: 'Canarian Coalition', mp: 'Más País',
    compromis: 'Coalició Compromís', upn: "Navarrese People's Union", prc: 'Regionalist Party of Cantabria',
    bng: 'Galician Nationalist Bloc', te: 'Teruel Existe', geroa: 'Geroa Bai', upyd: 'Union, Progress and Democracy',
    labour: 'Labour Party (UK)', spd: 'Social Democratic Party of Germany', syriza: 'Syriza',
    usdem: 'Democratic Party (United States)', polisario: 'Polisario Front'
  };
  var NAME_WIKI = { PSC: "Socialists' Party of Catalonia", Sumar: 'Sumar (electoral alliance)', CiU: 'Convergence and Union',
                    'Unidas Podemos': 'Unidas Podemos', 'Unidos Podemos': 'Unidas Podemos' };

  // Events, processes and legal texts: phrase, Wikipedia title, short note.
  var TOPICS = [
    [['Article 155'], 'Constitution of Spain', 'The constitutional article allowing direct rule over a region'],
    [['Constitution'], 'Constitution of Spain', 'The Spanish Constitution of 1978'],
    [['Gürtel'], 'Gürtel affair', 'The PP corruption network and its trial'],
    [['La Manada'], 'La Manada rape case', 'The 2016 Pamplona gang-rape case and its sentence'],
    [['Aquarius'], 'Aquarius Dignitus', 'The rescue ship refused by Italy in June 2018'],
    [['Brexit'], 'Brexit', 'The United Kingdom\'s withdrawal from the EU'],
    [['Valley of the Fallen'], 'Valley of the Fallen', 'Franco\'s mausoleum'],
    [['Security Council'], 'United Nations Security Council', 'Spain held a seat in 2015–16'],
    [['NATO'], 'NATO', 'The North Atlantic alliance'],
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
    [['European Union'], 'European Union', 'The EU']
  ];

  // party names as they appear in the text
  var PARTY_NAMES = [
    [['PSOE', 'Socialists', 'PSC'], 'psoe'], [['PP', "People's Party", 'Partido Popular'], 'pp'],
    [['Podemos', 'Unidas Podemos', 'Unidos Podemos', 'Sumar'], 'up'], [['Ciudadanos', 'Cs'], 'cs'], [['Vox'], 'vox'],
    [['IU', 'Izquierda Unida'], 'iu'], [['ERC'], 'erc'], [['Junts', 'JxCat', 'Convergència', 'CiU'], 'junts'],
    [['PNV'], 'pnv'], [['EH Bildu', 'Bildu'], 'bildu'], [['CUP'], 'cup'], [['Coalición Canaria'], 'cc'],
    [['Más País'], 'mp'], [['Compromís'], 'compromis'], [['UPN'], 'upn'], [['PRC'], 'prc'], [['BNG'], 'bng'],
    [['Teruel Existe'], 'te'], [['Geroa Bai'], 'geroa'], [['UPyD'], 'upyd'], [['Pedro Sánchez List'], 'ps'],
    [['Labour'], 'labour'], [['SPD'], 'spd'], [['Syriza'], 'syriza'], [['Democrats'], 'usdem'],
    [['Polisario'], 'polisario']
  ];

  var IDEOLOGY = {
    psoe: 'Social democracy', pp: 'Conservatism, Christian democracy', up: 'Left-wing populism', cs: 'Liberalism, anti-nationalism',
    vox: 'National conservatism, right-wing populism', iu: 'Communism, eco-socialism', erc: 'Catalan independence, left',
    junts: 'Catalan independence, centre-right', pnv: 'Basque nationalism, Christian democracy', bildu: 'Basque independence, left',
    cup: 'Catalan independence, anticapitalist', cc: 'Canarian nationalism', mp: 'Green left', compromis: 'Valencian left',
    upn: 'Navarrese regionalism, conservative', prc: 'Cantabrian regionalism', bng: 'Galician nationalism, left',
    te: 'Rural localism', geroa: 'Basque nationalism (Navarre)', upyd: 'Social liberalism, centralism',
    ps: 'Sanchismo: personalist social democracy', labour: 'Social democracy', spd: 'Social democracy',
    syriza: 'Radical left', usdem: 'Liberalism'
  };

  function partyInfo(id) {
    var UI = root.SpainUI;
    if (EXTRA_PARTIES[id]) {
      return { name: EXTRA_PARTIES[id][0], color: EXTRA_PARTIES[id][1], short: EXTRA_PARTIES[id][2] };
    }
    return { name: UI ? UI.partyName(id) : id, color: UI ? UI.partyColor(id) : '#888', short: UI ? UI.shortName(id) : id };
  }

  // Build one regex over every name, longest first, with letter boundaries.
  var INDEX = {};
  var names = [];
  PEOPLE.forEach(function (p, i) {
    p[0].forEach(function (n) { INDEX[n] = { kind: 'person', i: i }; names.push(n); });
  });
  PARTY_NAMES.forEach(function (p) {
    p[0].forEach(function (n) { if (!INDEX[n]) { INDEX[n] = { kind: 'party', id: p[1] }; names.push(n); } });
  });
  TOPICS.forEach(function (t, i) {
    t[0].forEach(function (n) { if (!INDEX[n]) { INDEX[n] = { kind: 'topic', i: i }; names.push(n); } });
  });
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
      return { kind: 'person', name: p[0][0], party: p[1], role: p[2], wing: p[3], wiki: title };
    }
    if (hit.kind === 'topic') {
      var t = TOPICS[hit.i];
      return { kind: 'topic', name: text, wiki: t[1], note: t[2] };
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
          if (a.nodeName === 'A') { inLink = true; break; }
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

  function wikiUrl(title) {
    return 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_')).replace(/%2C/g, ',');
  }

  function cardHtml(key, linked) {
    var info = lookup(key);
    if (!info) {
      return '';
    }
    var more = linked && info.wiki ? '<div class="sp-ent-more">Click to open on Wikipedia ↗</div>' : '';
    if (info.kind === 'topic') {
      return '<div><strong>' + info.wiki + '</strong></div><div class="sp-ent-wing">' + info.note + '</div>' + more;
    }
    var pi = partyInfo(info.party);
    var badge = '<span class="sp-ent-logo" style="background:' + pi.color + '">' + pi.short + '</span>';
    if (info.kind === 'person') {
      return '<div class="sp-ent-head">' + badge + '<div><strong>' + info.name + '</strong><br>' + pi.name +
        '</div></div><div>' + info.role + '</div>' + (info.wing ? '<div class="sp-ent-wing">' + info.wing + '</div>' : '') + more;
    }
    return '<div class="sp-ent-head">' + badge + '<div><strong>' + pi.name + '</strong></div></div>' +
      (IDEOLOGY[info.party] ? '<div class="sp-ent-wing">' + IDEOLOGY[info.party] + '</div>' : '') + more;
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

  var api = { PEOPLE: PEOPLE, PARTY_NAMES: PARTY_NAMES, TOPICS: TOPICS, wikiUrl: wikiUrl, lookup: lookup, cardHtml: cardHtml, annotate: annotate,
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
