window.game={"compiled":"{\"title\":\"Social Democracy: Spain 2015–2023\",\"author\":\"A mod of Autumn Chen's Social Democracy: An Alternate History\",\"ifid\":\"7FCDF039-2B77-4179-B795-CBAFA65253AA\",\"content\":\"\",\"scenes\":{\"prevScene\":{\"id\":\"prevScene\",\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"prevTopScene\":{\"id\":\"prevTopScene\",\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"jumpScene\":{\"id\":\"jumpScene\",\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"backSpecialScene\":{\"id\":\"backSpecialScene\",\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"returnScene\":{\"id\":\"returnScene\",\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"cancel_advisor_action\":{\"id\":\"cancel_advisor_action\",\"type\":\"scene\",\"title\":\"Cancel action.\",\"viewIf\":{\"$code\":\"return ((Q['last_advisor_action'] || 0)===1);\"},\"goTo\":[{\"id\":\"root\"}],\"onArrival\":[{\"$code\":\"if (Q.month_actions > 0) {\\n    Q.month_actions -= 1;\\n}\\nQ.advisor_action_timer = 0;\\n// Canceling an advisor action\\n// reset the timer...\\nif (Q[card.id + \\\"_timer\\\"]) {\\n    Q[card.id + \\\"_timer\\\"] = 0;\\n}\\n// reduce visit count\\nif (this.state.visits[card.id]) {\\n    this.state.visits[card.id] -= 1;\\n}\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"easy_discard\":{\"id\":\"easy_discard\",\"type\":\"scene\",\"title\":\"Return card to hand.\",\"viewIf\":{\"$code\":\"return (((Q['difficulty'] || 0) <= 0) && ((Q['last_advisor_action'] || 0)===0));\"},\"goTo\":[{\"id\":\"root\"}],\"onArrival\":[{\"$code\":\"if (Q.month_actions > 0) {\\n    Q.month_actions -= 1;\\n}\\n// return card to hand\\nvar card = this.state.lastPlayedCard;\\ncard.image = card.cardImage;\\nif (Q.difficulty >= 0) {\\n    this.state.currentHands['main'].push(card);\\n} else {\\n    this.state.currentHands['main.main_easy'].push(card);\\n}\\n// reset the timer...\\nif (Q[card.id + \\\"_timer\\\"]) {\\n    Q[card.id + \\\"_timer\\\"] = 0;\\n}\\n// reduce visit count\\nif (this.state.visits[card.id]) {\\n    this.state.visits[card.id] -= 1;\\n}\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"game_over.survived\":{\"id\":\"game_over.survived\",\"title\":\"The end of 2023\",\"newPage\":true,\"onArrival\":[{\"$code\":\"Q['game_over'] = 1;\"}],\"options\":[{\"id\":\"@root.start_menu\",\"title\":\"Return to the main menu\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"December 2023\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Pedro Sánchez reaches the end of 2023 as leader of the PSOE. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":[\"Pedro Sánchez reaches the end of 2023 in \",{\"type\":\"insert\",\"insert\":2},{\"type\":\"conditional\",\"content\":\", as its leader \",\"predicate\":3},\". \"],\"predicate\":1},{\"type\":\"conditional\",\"content\":\"Pedro Sánchez reaches the end of 2023 on the PSOE backbenches. \",\"predicate\":4},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"He is Prime Minister: \",{\"type\":\"insert\",\"insert\":6},\". \"],\"predicate\":5},{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"conditional\",\"content\":[\"His party is in government under \",{\"type\":\"insert\",\"insert\":9},\": \",{\"type\":\"insert\",\"insert\":10},\". \"],\"predicate\":8},{\"type\":\"conditional\",\"content\":[\"The Prime Minister is \",{\"type\":\"insert\",\"insert\":12},\". \"],\"predicate\":11},\" \"],\"predicate\":7},\"\"]},{\"type\":\"paragraph\",\"content\":{\"type\":\"conditional\",\"content\":[\"Sánchez's authority: \",{\"type\":\"insert\",\"insert\":14},\"/100. PSOE unity: \",{\"type\":\"insert\",\"insert\":15},\"/100.\"],\"predicate\":13}}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['exiled'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['my_party'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_leads'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['backbench'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['sanchez_pm'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['government_type'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['sanchez_pm'] || 0)===0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_in_government'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pm'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['government_type'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_in_government'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pm'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sanchez_authority'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['psoe_unity'] || 0);\"}}]}},\"game_over\":{\"id\":\"game_over\",\"type\":\"scene\",\"title\":\"Game over\",\"newPage\":true,\"onArrival\":[{\"$code\":\"Q['game_over'] = 1;\"}],\"options\":[{\"id\":\"@root.start_menu\",\"title\":\"Return to the main menu\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Game over\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"insert\",\"insert\":0},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Pedro Sánchez's political career ends here. \",\"predicate\":1},{\"type\":\"conditional\",\"content\":\"With the right holding a commanding majority, or no party left to lead, there is no route back to government for Pedro Sánchez before the end of the period.\",\"predicate\":2}]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['loss_text'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['retired'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['retired'] || 0)===0);\"}}]}},\"credits.data\":{\"id\":\"credits.data\",\"title\":\"Election data\",\"options\":[{\"id\":\"@credits\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Election data\"},{\"type\":\"paragraph\",\"content\":\"General elections 2015–2023: official results of the Spanish Ministry of the Interior (infoelectoral), compiled in the MiCongreso project by josemam: https://github.com/josemam/MiCongreso\"},{\"type\":\"paragraph\",\"content\":\"Regional elections 2011–2023: official results compiled in the histEleccionesAutonomicas project by rricote: https://github.com/rricote/histEleccionesAutonomicas\"},{\"type\":\"paragraph\",\"content\":\"Polls 2011–2015: monthly averages of the opinion polls listed in English Wikipedia's \\\"Opinion polling for the 2015 Spanish general election\\\" (CC BY-SA), built by tools/build_poll_history.py. Polling error 2015–2023: the poll lists on Wikipedia for each general election, analysed by tools/build_poll_errors.py.\"},{\"type\":\"paragraph\",\"content\":\"Province map: Natural Earth 1:10m administrative boundaries (public domain), naturalearthdata.com.\"},{\"type\":\"paragraph\",\"content\":\"Government deficit and debt: Eurostat and Bank of Spain annual figures.\"},{\"type\":\"paragraph\",\"content\":\"Electoral law: Spanish Constitution (arts. 68, 99, 113, 115) and the Ley Orgánica del Régimen Electoral General (arts. 162–163), plus each autonomous community's electoral law.\"}]},\"library.menu\":{\"id\":\"library.menu\",\"options\":[{\"id\":\"@library.polls\",\"title\":\"Polling trends\"},{\"id\":\"@library.system\",\"title\":\"Spain's system of government\"},{\"id\":\"@library.elections\",\"title\":\"How elections work\"},{\"id\":\"@backSpecialScene\",\"title\":\"Exit the library\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"return\":{\"id\":\"return\",\"type\":\"scene\",\"title\":\"Back to main\",\"goTo\":[{\"id\":\"root\"}],\"onArrival\":[{\"$code\":\"if (((Q['difficulty'] || 0) < 0) ) { Q['month_actions'] = (Q['month_actions'] || 0) - 1; }\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"post_event.events_choice\":{\"id\":\"post_event.events_choice\",\"options\":[{\"id\":\"#sp_event\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"post_event\":{\"id\":\"post_event\",\"type\":\"scene\",\"title\":\"Post Event\",\"newPage\":true,\"onArrival\":[{\"$code\":\"Q.last_advisor_action = 0;\\nif (typeof window !== 'undefined' && window.SpainGame) {\\n    if (Q.month_actions >= 1) {\\n        if (Q.weekly) {\\n            window.SpainGame.endOfWeek(Q);\\n        } else {\\n            window.SpainGame.endOfMonth(Q);\\n        }\\n    } else {\\n        window.SpainGame.recalculate(Q);\\n    }\\n    Q.loss_text = window.SpainGame.lossReason(Q);\\n}\\nQ.is_lost = Q.loss_text ? 1 : 0;\\nQ.reached_end = (Q.year > 2023) ? 1 : 0;\\nQ.acting = Q.government_status == 'acting' ? 1 : 0;\\nQ.has_event = 0;\\nvar scene = this.game.scenes['post_event.events_choice'];\\nvar choices = this._compileChoices(scene);\\nif (choices && choices.length && choices[0].title != \\\"Continue...\\\") {\\n    Q.has_event = 1;\\n}\"}],\"goTo\":[{\"id\":\"game_over\",\"predicate\":{\"$code\":\"return ((Q['is_lost'] || 0)===1);\"}},{\"id\":\"game_over.survived\",\"predicate\":{\"$code\":\"return ((Q['reached_end'] || 0)===1);\"}},{\"id\":\"post_event.events_choice\",\"predicate\":{\"$code\":\"return ((Q['has_event'] || 0)===1);\"}},{\"id\":\"main\",\"predicate\":{\"$code\":\"return ((Q['has_event'] || 0)===0);\"}}],\"content\":{\"content\":{\"type\":\"heading\",\"content\":[\"\",{\"type\":\"conditional\",\"content\":[\"Week \",{\"type\":\"insert\",\"insert\":1},\", \"],\"predicate\":0},{\"type\":\"insert\",\"insert\":2},\" \",{\"type\":\"insert\",\"insert\":3}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['weekly'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['week'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['year'] || 0);\"}}]}},\"main.deck_national\":{\"id\":\"main.deck_national\",\"title\":\"National politics\",\"cardImage\":\"img/spain/deck_congreso_fachada.jpg\",\"isDeck\":true,\"options\":[{\"id\":\"#sp_national\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"root.start_menu\":{\"id\":\"root.start_menu\",\"newPage\":true,\"goTo\":[{\"id\":\"root.start_menu_2\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Social Democracy: Spain 2015–2023\"},{\"type\":\"paragraph\",\"content\":\"July 2014. Pedro Sánchez has just won the PSOE's first open primary. Ahead: the end of the two-party system, the rise of Podemos and Ciudadanos, and later Vox. Win power, keep it, and keep a PP majority, or a large PP–Vox majority, from closing every path to government.\"}]},\"status.politics\":{\"id\":\"status.politics\",\"title\":\"Politics\",\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame && Q.congress) {\\n    window.SpainGame.renderFactions(Q, 'sp-side-factions');\\n    window.SpainGame.renderRelations(Q, 'sp-side-relations');\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"PSOE\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-side-factions\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Economic line: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":0}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Social line: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":1}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Sanchismo: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":2}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Style: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":3}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Fed. Committee: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":4}},\"\"]},{\"type\":\"heading\",\"content\":\"Relations\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-side-relations\\\"></div>\"},\"\"]},{\"type\":\"heading\",\"content\":\"Between parties\"},{\"type\":\"paragraph\",\"content\":[\"Cs–independentists: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":5}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Cs–Podemos: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":6}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"PP–Cs: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":7}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"PP–Vox: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":8}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Podemos–ERC: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":9}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"PNV–PP: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":10}},\"\"]},{\"type\":\"heading\",\"content\":\"International\"},{\"type\":\"paragraph\",\"content\":[\"EU: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":11}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Portugal, Italy, Greece: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":12}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Morocco and Algeria: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":13}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"United States: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":14}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"NATO: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":15}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"United Nations: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":16}},{\"type\":\"conditional\",\"content\":\"(Security Council seat)\",\"predicate\":17}]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['econ_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['social_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sanchismo_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['style_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['committee_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['cs_indep_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['cs_up_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_cs_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_vox_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['up_indep_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pnv_pp_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['intl_eu_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['intl_south_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['intl_maghreb_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['intl_us_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['intl_nato_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['intl_un_word'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['unsc_won'] || 0)===1);\"}}]}},\"sp_catalonia.prosecute\":{\"id\":\"sp_catalonia.prosecute\",\"onArrival\":[{\"$code\":\"Q.cat_hard_line += 1; Q.rel_erc -= 12; Q.rel_junts -= 12; Q.rel_cs += 4; Q.regional_leaders_dissent -= 6; if (window.SpainGame) { window.SpainGame.territorial(Q, 'Cataluña', 'erc', 1.05); window.SpainGame.campaign(Q, 'psoe', {pensioners: 1}); }\"}],\"content\":{\"content\":\"The rule of law, applied fully. The independence movement now has martyrs.\",\"type\":\"paragraph\"}},\"sp_advisers.cs_channel\":{\"id\":\"sp_advisers.cs_channel\",\"title\":\"Work the Ciudadanos channel\",\"subtitle\":\"Talks with Ciudadanos advance; Podemos notices.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['cs_talks'] = (Q['cs_talks'] || 0) + 1;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 6;\\nQ['rel_up'] = (Q['rel_up'] || 0) - 3;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"Hernando knows Ciudadanos's parliamentary team well. The talks move a step forward.\",\"type\":\"paragraph\"}},\"election_lab.lab_baseline\":{\"id\":\"election_lab.lab_baseline\",\"onArrival\":[{\"$code\":\"Q['spain_lab_scenario'] = 1;\"}],\"goTo\":[{\"id\":\"election_lab.lab_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_exile.tour_members\":{\"id\":\"sp_exile.tour_members\",\"onArrival\":[{\"$code\":\"Q['sanchismo'] = (Q['sanchismo'] || 0) + 5;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 2;\"}],\"content\":{\"content\":\"The halls are small and full. The members tell you what they would not tell Ferraz.\",\"type\":\"paragraph\"}},\"sp_events.accept\":{\"id\":\"sp_events.accept\",\"onArrival\":[{\"$code\":\"Q['red_lines'] = 1;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 10;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 5;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 5;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 3;\"}],\"content\":{\"content\":\"The barons are satisfied. Talks with ERC and Convergència are now off the table, and everyone knows who wrote the rules.\",\"type\":\"paragraph\"}},\"sp_government.present\":{\"id\":\"sp_government.present\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.budget_timer = 12;\\nif (window.SpainGame) { window.SpainGame.holdBudget(Q); }\\nif (Q.budget_passed) {\\n    Q.sanchez_authority += 8; Q.budget_year = Q.year; Q.fiscal_adj += 0.2; if (window.SpainGame) { window.SpainGame.econ(Q, 0.2, -0.1); window.SpainGame.social(Q, 1); }\\n    if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 1, workers: 1, unemployed: 1}); }\\n} else {\\n    Q.sanchez_authority -= 6;\\n}\"}],\"goTo\":[{\"id\":\"sp_government.budget_passed\",\"predicate\":{\"$code\":\"return ((Q['budget_passed'] || 0)===1);\"}},{\"id\":\"sp_government.budget_failed\",\"predicate\":{\"$code\":\"return ((Q['budget_passed'] || 0)===0);\"}}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_leadership.r_ignore\":{\"id\":\"sp_leadership.r_ignore\",\"onArrival\":[{\"$code\":\"Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 4;\\nQ['member_morale'] = (Q['member_morale'] || 0) - 2;\"}],\"content\":{\"content\":\"The rumours do not die. They wait.\",\"type\":\"paragraph\"}},\"sp_investiture.sign_cs\":{\"id\":\"sp_investiture.sign_cs\",\"title\":\"Sign a government agreement with Ciudadanos\",\"subtitle\":\"Ciudadanos will vote yes; Podemos will vote no.\",\"chooseIf\":{\"$code\":\"return ((((Q['cs_talks'] || 0) >= 2) && ((Q['pact_cs'] || 0)===0)) && ((Q['pact_up'] || 0)===0));\"},\"unavailableSubtitle\":{\"content\":[{\"type\":\"conditional\",\"content\":\"Ciudadanos will not join an agreement that includes Podemos. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The talks with Ciudadanos are not far enough advanced.\",\"predicate\":1}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pact_up'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return (((Q['pact_up'] || 0)===0) && ((Q['cs_talks'] || 0) < 2));\"}}]},\"onArrival\":[{\"$code\":\"Q.pact_cs = 1; Q.rel_cs += 10; Q.rel_up -= 15; Q.modernisers_dissent -= 5; Q.institutionalists_dissent -= 3; Q.progressives_dissent += 10; Q.trade_unionists_dissent += 5; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', 'up', {workers: 1.5, students: 1.5, unemployed: 1}); window.SpainGame.campaign(Q, 'psoe', {professionals: 1.5, self_employed: 0.5}); }\"}],\"goTo\":[{\"id\":\"sp_investiture\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_party.convene\":{\"id\":\"sp_party.convene\",\"onArrival\":[{\"$code\":\"Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 8;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 2;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) + 3;\"}],\"content\":{\"content\":\"The meeting runs for five hours. You leave with their grudging support and the feeling that you now need their permission.\",\"type\":\"paragraph\"}},\"sp_national.change\":{\"id\":\"sp_national.change\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 2, students: 3, unemployed: 2}); } Q.progressives_dissent -= 3; Q.member_morale += 3; if (window.SpainGame) { window.SpainGame.position(Q, 0.5, 0); }\"}],\"content\":{\"content\":\"Young and working voters respond. Your most cautious barons wince at the word \\\"change\\\".\",\"type\":\"paragraph\"}},\"sp_start.renewal\":{\"id\":\"sp_start.renewal\",\"onArrival\":[{\"$code\":\"Q.opening = 1; Q.modernisers_dissent -= 5; Q.modernisers_strength += 3; Q.institutionalists_dissent += 3; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'young', 2); window.SpainGame.target(Q, 'psoe', 'middle', 1.5); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0.5); }\"}],\"content\":{\"content\":\"You fill the new executive with people under 45 and promise primaries, transparency and an end to the old ways. Commentators call it \\\"the new PSOE\\\". The old guard calls it inexperience.\",\"type\":\"paragraph\"}},\"sp_world.unsc_back\":{\"id\":\"sp_world.unsc_back\",\"onArrival\":[{\"$code\":\"Q.rel_pp += 2; if (window.SpainGame) { window.SpainGame.intl(Q, 'un', 8); }\"}],\"goTo\":[{\"id\":\"sp_world.unsc_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_negotiations.podemos\":{\"id\":\"sp_negotiations.podemos\",\"onArrival\":[{\"$code\":\"Q['up_talks'] = (Q['up_talks'] || 0) + 1;\\nQ['rel_up'] = (Q['rel_up'] || 0) + 8;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) - 4;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) - 5;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 5;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 3;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Podemos's team arrives with a 98-page document and a list of ministries. \",{\"type\":\"conditional\",\"content\":\"The talks are now serious enough to sign something, if you want to.\",\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['up_talks'] || 0) >= 2);\"}}]}},\"credits.images\":{\"id\":\"credits.images\",\"title\":\"Image sources\",\"options\":[{\"id\":\"@credits\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Image sources\"},{\"type\":\"paragraph\",\"content\":\"Images are taken from Wikimedia Commons under open licences. Every image, with its author, licence and link, is listed in docs/assets.md in the game's repository.\"}]},\"library.polls\":{\"id\":\"library.polls\",\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame && Q.started) {\\n    window.SpainGame.renderPollChart(Q, 'sp-lib-pollchart', false);\\n}\"}],\"options\":[{\"id\":\"@library.menu\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Polling trends\"},{\"type\":\"paragraph\",\"content\":\"A poll of polls over the last four years: before December 2015, the average of published polls (compiled from the list on Wikipedia); since then, the monthly polls of this game. Dashed lines mark general elections.\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-lib-pollchart\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Polls are not results. Comparing the final polls with the results of every general election from 2015 to 2023 shows misses of two to four points for a single party: Ciudadanos was overestimated in 2015, the predicted Podemos \",{\"type\":\"emphasis-1\",\"content\":\"sorpasso\"},\" of 2016 never came, the PP was overestimated in April 2019, Vox underestimated in November 2019, and the PSOE underestimated in 2023. The polls in this game make errors of the same kind and size.\"]}]},\"main.deck_party\":{\"id\":\"main.deck_party\",\"title\":\"Party politics\",\"viewIf\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===1);\"},\"cardImage\":\"img/spain/deck_ferraz.jpg\",\"isDeck\":true,\"options\":[{\"id\":\"#sp_party\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"root.start_menu_2\":{\"id\":\"root.start_menu_2\",\"options\":[{\"id\":\"@sp_start\",\"title\":\"New campaign (July 2014)\"},{\"id\":\"@election_lab\",\"title\":\"Election lab\"},{\"id\":\"@credits\",\"title\":\"Credits\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"root\":{\"id\":\"root\",\"type\":\"scene\",\"title\":\"Root Scene\",\"newPage\":true,\"goTo\":[{\"id\":\"post_event\",\"predicate\":{\"$code\":\"return ((Q['started'] || 0)===1);\"}},{\"id\":\"root.start_menu\",\"predicate\":{\"$code\":\"return ((Q['started'] || 0)===0);\"}}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"status.paramilitaries\":{\"id\":\"status.paramilitaries\",\"title\":\"Regions\",\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame && Q.regions) {\\n    window.SpainGame.renderRegions(Q, 'sp-side-regions');\\n}\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Regions\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-side-regions\\\"></div>\"}}]},\"sp_catalonia.police\":{\"id\":\"sp_catalonia.police\",\"onArrival\":[{\"$code\":\"Q.cat_hard_line += 1; Q.rel_erc -= 8; Q.rel_up -= 4; if (window.SpainGame) { window.SpainGame.campaign(Q, 'vox', {pensioners: -0.5, self_employed: -0.5}); }\"}],\"content\":{\"content\":\"The State shows it is present. Vox has less to shout about, for now.\",\"type\":\"paragraph\"}},\"sp_advisers.group\":{\"id\":\"sp_advisers.group\",\"title\":\"Hold the parliamentary group together\",\"subtitle\":\"Lower dissent among Institutionalists and Modernisers.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 6;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) - 3;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 3;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"A week of meetings with deputies, one by one. Nobody leaks for a while.\",\"type\":\"paragraph\"}},\"election_lab.lab_up_merger\":{\"id\":\"election_lab.lab_up_merger\",\"onArrival\":[{\"$code\":\"Q['spain_lab_scenario'] = 2;\"}],\"goTo\":[{\"id\":\"election_lab.lab_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_exile.tour_critic\":{\"id\":\"sp_exile.tour_critic\",\"onArrival\":[{\"$code\":\"Q.sanchismo += 7; Q.populism += 1; Q.member_morale -= 2; if (window.SpainGame) { window.SpainGame.transferRaw(Q, 'psoe', {up: 0.5, cs: 0.5}, {students: 0.5, workers: 0.5}); }\"}],\"content\":{\"content\":\"\\\"The PSOE has forgotten who it is for.\\\" The leadership calls it disloyalty; the members call it the truth.\",\"type\":\"paragraph\"}},\"sp_events.soften\":{\"id\":\"sp_events.soften\",\"onArrival\":[{\"$code\":\"Q['red_lines'] = 1;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 3;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 2;\"}],\"content\":{\"content\":\"The final text bars any referendum, but leaves you to decide which parties you talk to. It is a draw, and both sides claim it.\",\"type\":\"paragraph\"}},\"sp_government.budget_passed\":{\"id\":\"sp_government.budget_passed\",\"title\":\"Budget approved\",\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Budget approved\"},{\"type\":\"paragraph\",\"content\":[\"Yes \",{\"type\":\"insert\",\"insert\":0},\", no \",{\"type\":\"insert\",\"insert\":1},\". The government has its own budget: higher pensions, more for dependency care, more for science.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_yes'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_no'] || 0);\"}}]}},\"sp_leadership.r_address\":{\"id\":\"sp_leadership.r_address\",\"onArrival\":[{\"$code\":\"Q.sanchez_authority += 5 + Q.member_morale / 12; Q.regional_leaders_dissent -= 3; Q.institutionalists_dissent -= 3; Q.month_actions += 1;\"}],\"content\":{\"content\":\"A fortnight of meetings and phone calls. It buys time, and some of the barons are flattered to be asked.\",\"type\":\"paragraph\"}},\"sp_investiture.sign_up\":{\"id\":\"sp_investiture.sign_up\",\"title\":\"Sign a government agreement with Podemos\",\"subtitle\":\"Podemos will vote yes; Ciudadanos will vote no.\",\"chooseIf\":{\"$code\":\"return ((((Q['up_talks'] || 0) >= 2) && ((Q['pact_up'] || 0)===0)) && ((Q['pact_cs'] || 0)===0));\"},\"unavailableSubtitle\":{\"content\":[{\"type\":\"conditional\",\"content\":\"Podemos will not support a government built on a deal with Ciudadanos. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The talks with Podemos are not far enough advanced.\",\"predicate\":1}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pact_cs'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return (((Q['pact_cs'] || 0)===0) && ((Q['up_talks'] || 0) < 2));\"}}]},\"onArrival\":[{\"$code\":\"Q.pact_up = 1; Q.rel_up += 10; Q.rel_cs -= 15; Q.progressives_dissent -= 10; Q.regional_leaders_dissent += 12 + 8 * (Q.barons_veto || 0); Q.institutionalists_dissent += 6; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {cs: 0.6, pp: 0.4}, {pensioners: 1.5, self_employed: 1.5, homemakers: 1}); window.SpainGame.transfer(Q, 'up', 'psoe', {workers: 1.5, unemployed: 1}); }\"}],\"goTo\":[{\"id\":\"sp_investiture\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_party.executive\":{\"id\":\"sp_party.executive\",\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 5;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) - 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 4;\\nQ['federal_executive_backing'] = 1;\"}],\"content\":{\"content\":\"Your executive backs you. The barons note that they were not asked.\",\"type\":\"paragraph\"}},\"sp_national.reform\":{\"id\":\"sp_national.reform\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {professionals: 2, pensioners: 2, self_employed: 1}); } Q.institutionalists_dissent -= 3; Q.modernisers_dissent -= 2; if (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0); }\"}],\"content\":{\"content\":\"Older and middle-class voters hear a party of government. Some members hear a party afraid of its own shadow.\",\"type\":\"paragraph\"}},\"sp_start.left_turn\":{\"id\":\"sp_start.left_turn\",\"onArrival\":[{\"$code\":\"Q.opening = 2; Q.progressives_dissent -= 8; Q.trade_unionists_dissent -= 6; Q.regional_leaders_dissent += 5; Q.institutionalists_dissent += 4; Q.rel_up += 5; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'working', 2.5); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, 2.5, 0.5); }\"}],\"content\":{\"content\":\"You promise to repeal the labour reform and to reform the Constitution's article 135, the austerity amendment your own party voted for in 2011. The left of the party is surprised and pleased. Díaz's people are surprised.\",\"type\":\"paragraph\"}},\"sp_world.unsc_criticise\":{\"id\":\"sp_world.unsc_criticise\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 2; if (window.SpainGame) { window.SpainGame.intl(Q, 'un', 2); window.SpainGame.target(Q, 'psoe', 'young', 1); }\"}],\"goTo\":[{\"id\":\"sp_world.unsc_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_negotiations.cs\":{\"id\":\"sp_negotiations.cs\",\"onArrival\":[{\"$code\":\"Q['cs_talks'] = (Q['cs_talks'] || 0) + 1;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 8;\\nQ['rel_up'] = (Q['rel_up'] || 0) - 5;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) - 4;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 2;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) + 5;\\nQ['trade_unionists_dissent'] = (Q['trade_unionists_dissent'] || 0) + 2;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Albert Rivera's negotiators want labour-market flexibility, an end to the provincial councils and a hard line on Catalonia. \",{\"type\":\"conditional\",\"content\":\"An agreement is within reach.\",\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['cs_talks'] || 0) >= 2);\"}}]}},\"credits.software\":{\"id\":\"credits.software\",\"title\":\"Software\",\"options\":[{\"id\":\"@credits\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Software\"},{\"type\":\"paragraph\",\"content\":\"Dendry and DendryNexus by Ian Millington and Autumn Chen. d3.js (BSD licence). d3-parliament by Geoffrey Brossard (MIT). jQuery (MIT).\"}]},\"credits\":{\"id\":\"credits\",\"type\":\"scene\",\"title\":\"Credits\",\"newPage\":true,\"options\":[{\"id\":\"@credits.data\",\"title\":\"Election data\"},{\"id\":\"@credits.images\",\"title\":\"Image sources\"},{\"id\":\"@credits.software\",\"title\":\"Software\"},{\"id\":\"@root\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Credits\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"emphasis-2\",\"content\":\"Social Democracy: Spain 2015–2023\"},\" is a mod of \",{\"type\":\"emphasis-1\",\"content\":\"Social Democracy: An Alternate History\"},\" by Autumn Chen, released under the MIT licence. The game structure, the card system and much of the interface come from the original.\"]}]},\"library.system\":{\"id\":\"library.system\",\"goTo\":[{\"id\":\"library.menu\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The system of government\"},{\"type\":\"paragraph\",\"content\":\"Spain is a parliamentary monarchy. The King proposes a candidate for Prime Minister after consulting the parties. The candidate needs an absolute majority of the Congress of Deputies (176 of 350) in a first vote, or more yes than no votes in a second vote 48 hours later. Abstentions therefore matter.\"},{\"type\":\"paragraph\",\"content\":\"If no candidate is invested within two months of the first investiture vote, the Cortes are dissolved and a new election is held.\"},{\"type\":\"paragraph\",\"content\":\"A government can be removed only by a constructive motion of no confidence: an absolute majority must vote for a named alternative Prime Minister, who takes office immediately.\"},{\"type\":\"paragraph\",\"content\":\"The seventeen autonomous communities have their own parliaments and governments. Thirteen vote together each May with the municipal elections; Andalusia, Catalonia, the Basque Country and Galicia keep their own calendars.\"}]},\"main.deck_negotiations\":{\"id\":\"main.deck_negotiations\",\"title\":\"Government negotiations\",\"viewIf\":{\"$code\":\"return ((Q['seeking_government'] || 0)===1);\"},\"cardImage\":\"img/spain/event_rajoy_sanchez.jpg\",\"isDeck\":true,\"options\":[{\"id\":\"#sp_negotiations\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"status.polls\":{\"id\":\"status.polls\",\"title\":\"Polls\",\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame && Q.poll) {\\n    window.SpainGame.renderPollChart(Q, 'sp-side-pollchart', true);\\n    window.SpainGame.renderPolls(Q, 'sp-side-polls');\\n}\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Polls\"},{\"type\":\"paragraph\",\"content\":\"Poll of polls, last 4 years. Dashed lines: general elections.\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-side-pollchart\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":\"Polls can be off by several points. Now, and change vs. last election:\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-side-polls\\\"></div>\"}}]},\"status\":{\"id\":\"status\",\"type\":\"scene\",\"title\":\"Status\",\"newPage\":true,\"isSpecial\":true,\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame && Q.congress) {\\n    window.SpainGame.renderCongress(Q, 'sp-side-congress', true);\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Status\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"Week \",{\"type\":\"insert\",\"insert\":1},\", \"],\"predicate\":0},{\"type\":\"insert\",\"insert\":2},\" \",{\"type\":\"insert\",\"insert\":3},\"\"]},{\"type\":\"paragraph\",\"content\":[\"PM: \",{\"type\":\"insert\",\"insert\":4},{\"type\":\"conditional\",\"content\":\"(acting) \",\"predicate\":5},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"Govt: \",{\"type\":\"insert\",\"insert\":7},\" \"],\"predicate\":6},{\"type\":\"conditional\",\"content\":\"No government formed \",\"predicate\":8},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"conditional\",\"content\":\"PSOE in government \",\"predicate\":10},{\"type\":\"conditional\",\"content\":\"PSOE in opposition \",\"predicate\":11},\" \"],\"predicate\":9},{\"type\":\"conditional\",\"content\":[\"Sánchez's party: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":13}},{\"type\":\"conditional\",\"content\":\"(leader) \",\"predicate\":14},\", \",{\"type\":\"insert\",\"insert\":15},\" seats, \",{\"type\":\"insert\",\"insert\":16},\"% \"],\"predicate\":12},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Sánchez sits on the PSOE backbenches. \",\"predicate\":17},{\"type\":\"conditional\",\"content\":[\"PSOE leader: \",{\"type\":\"insert\",\"insert\":19},\" \"],\"predicate\":18},\"\"]},{\"type\":\"paragraph\",\"content\":[\"PP leader: \",{\"type\":\"insert\",\"insert\":20},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"Authority: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":22}},\" \"],\"predicate\":21},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Morale: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":23}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Unity: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":24}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Party funds: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":25}},\" (\",{\"type\":\"insert\",\"insert\":26},\"/mo)\",{\"type\":\"conditional\",\"content\":\", in debt \",\"predicate\":27},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"Dissolution in \",{\"type\":\"insert\",\"insert\":29},\" wk. \"],\"predicate\":28},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"Election: \",{\"type\":\"insert\",\"insert\":31},\" \",{\"type\":\"insert\",\"insert\":32},\" \"],\"predicate\":30},\"\"]},{\"type\":\"heading\",\"content\":\"Economy & society\"},{\"type\":\"paragraph\",\"content\":[\"Economy: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":33}},\" (growth \",{\"type\":\"insert\",\"insert\":34},\"%, unemployment \",{\"type\":\"insert\",\"insert\":35},\"%)\"]},{\"type\":\"paragraph\",\"content\":[\"Deficit: \",{\"type\":\"emphasis-2\",\"content\":[{\"type\":\"insert\",\"insert\":36},\"%\"]},\" of GDP, debt \",{\"type\":\"insert\",\"insert\":37},\"%\"]},{\"type\":\"paragraph\",\"content\":[\"Society: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":38}},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Stability: \",{\"type\":\"emphasis-2\",\"content\":{\"type\":\"insert\",\"insert\":39}},\"\"]},{\"type\":\"heading\",\"content\":\"Congress\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-side-congress\\\"></div>\"}}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['weekly'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['week'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['year'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pm'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['acting'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['acting'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['government_type'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['acting'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['exiled'] || 0)===0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['exiled'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['my_party'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_leads'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['player_seats'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['player_poll'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['backbench'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['psoe_leader'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_leader'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['authority_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['morale_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['unity_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['funds_display'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['funds_income_text'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['in_debt'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['investiture_clock'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['investiture_clock'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['election_year'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_year'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['economy_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['growth_text'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['unemployment_text'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['deficit_text'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['debt'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['cohesion_word'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['chaos_word'] || 0);\"}}]}},\"sp_catalonia.measured\":{\"id\":\"sp_catalonia.measured\",\"onArrival\":[{\"$code\":\"Q['cat_dialogue'] = (Q['cat_dialogue'] || 0) + 1;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 3;\\nQ['rel_erc'] = (Q['rel_erc'] || 0) + 2;\"}],\"content\":{\"content\":\"Firm but proportionate, says the government. Too soft, says the right; too hard, say the separatists.\",\"type\":\"paragraph\"}},\"sp_advisers.pnv\":{\"id\":\"sp_advisers.pnv\",\"title\":\"Sound out the PNV\",\"subtitle\":\"Better relations with the Basque nationalists.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['rel_pnv'] = (Q['rel_pnv'] || 0) + 10;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"Aitor Esteban is courteous and noncommittal. That, from the PNV, is a good sign.\",\"type\":\"paragraph\"}},\"election_lab.lab_vox\":{\"id\":\"election_lab.lab_vox\",\"onArrival\":[{\"$code\":\"Q['spain_lab_scenario'] = 3;\"}],\"goTo\":[{\"id\":\"election_lab.lab_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_exile.book\":{\"id\":\"sp_exile.book\",\"title\":\"Write a book\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_exile\"],\"viewIf\":{\"$code\":\"return (((Q['sanchez_leader'] || 0)===0) && ((Q['exile_book_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['exile_book_timer'] = 12;\"}],\"options\":[{\"id\":\"@sp_exile.book_yes\",\"title\":\"Write it\"},{\"id\":\"@root\",\"title\":\"Not now\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Write a book\"},{\"type\":\"paragraph\",\"content\":[\"A publisher offers you an advance for your account of the last years. The working title is \",{\"type\":\"emphasis-1\",\"content\":\"Manual de resistencia\"},\".\"]}]},\"sp_events.defy\":{\"id\":\"sp_events.defy\",\"onArrival\":[{\"$code\":\"Q['populism'] = (Q['populism'] || 0) + 1;\\nQ['red_lines'] = 0;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 20;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 10;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 8;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 4;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 4;\"}],\"content\":{\"content\":\"The vote is close. You keep your freedom to negotiate, but Susana Díaz has counted her votes, and so have you.\",\"type\":\"paragraph\"}},\"sp_government.budget_failed\":{\"id\":\"sp_government.budget_failed\",\"title\":\"Budget defeated\",\"options\":[{\"id\":\"@sp_government.snap\",\"title\":\"Call an early general election\"},{\"id\":\"@sp_government.carry_on\",\"title\":\"Carry on with the rolled-over budget\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Budget defeated\"},{\"type\":\"paragraph\",\"content\":[\"Yes \",{\"type\":\"insert\",\"insert\":0},\", no \",{\"type\":\"insert\",\"insert\":1},\". Congress throws out your budget. Governing on rolled-over accounts is possible, but every week of it is a week your opponents call you a Prime Minister without a majority.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_yes'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_no'] || 0);\"}}]}},\"sp_leadership.r_bluff\":{\"id\":\"sp_leadership.r_bluff\",\"onArrival\":[{\"$code\":\"Q.populism += 1; Q.lead_confronted = 1;\\nQ.bluff_won = (Q.federal_committee_balance + Q.member_morale / 4 + (Math.random() * 12 - 6) >= 55) ? 1 : 0;\\nif (Q.bluff_won) { Q.sanchez_authority += 15; Q.regional_leaders_dissent -= 8; Q.institutionalists_dissent -= 6; Q.sanchismo += 4; }\\nelse { Q.sanchez_authority -= 12; Q.regional_leaders_dissent += 8; }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"\\\"If anyone wants my job, let them stand in a primary.\\\" Nobody does. For now, the critics retreat. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"You dare them, and they take note. The critics are now openly counting votes in the Federal Committee.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['bluff_won'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['bluff_won'] || 0)===0);\"}}]}},\"sp_investiture.referendum\":{\"id\":\"sp_investiture.referendum\",\"title\":\"Offer the Catalan parties talks on their demands\",\"subtitle\":\"Could turn ERC and Convergència's votes into abstentions.\",\"viewIf\":{\"$code\":\"return (((Q['pact_cs'] || 0)===0) && ((Q['referendum_offer'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q.referendum_offer = 1; Q.rel_erc += 15; Q.rel_junts += 15; if (Q.red_lines) { Q.regional_leaders_dissent += 25; Q.federal_committee_balance -= 12; Q.sanchez_authority -= 6; } else { Q.regional_leaders_dissent += 10; } if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {pp: 0.5, cs: 0.5}, {pensioners: 2, homemakers: 1.5, self_employed: 1}); window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 1.05); }\"}],\"goTo\":[{\"id\":\"sp_investiture\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"You have broken the Federal Committee's resolution. The barons are openly discussing your removal. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The barons are furious, but the Federal Committee never bound you.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['red_lines'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['red_lines'] || 0)===0);\"}}]}},\"sp_party.announce\":{\"id\":\"sp_party.announce\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 5;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 12;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 5;\"}],\"content\":{\"content\":\"You set the line on television. In Seville, the reaction is icy.\",\"type\":\"paragraph\"}},\"sp_national.attack_podemos\":{\"id\":\"sp_national.attack_podemos\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 3, homemakers: 2, students: -2}); } Q.rel_up -= 10; Q.regional_leaders_dissent -= 4; Q.progressives_dissent += 4; if (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0); }\"}],\"content\":{\"content\":\"The barons enjoy it. Iglesias replies within the hour.\",\"type\":\"paragraph\"}},\"sp_start.unity\":{\"id\":\"sp_start.unity\",\"onArrival\":[{\"$code\":\"Q.opening = 3; Q.regional_leaders_dissent -= 5; Q.institutionalists_dissent -= 6; Q.diaz_relation += 8; Q.sanchismo -= 3; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'pensioners', 2); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, -1, 0); }\"}],\"content\":{\"content\":\"The barons get the posts they asked for. The party is calm; the voters notice little difference.\",\"type\":\"paragraph\"}},\"sp_start\":{\"id\":\"sp_start\",\"type\":\"scene\",\"title\":\"The new Secretary-General\",\"newPage\":true,\"setBg\":\"img/spain/bg_congreso_hemiciclo.jpg\",\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.newGame(Q, 0);\\n}\"}],\"options\":[{\"id\":\"@sp_start.renewal\",\"title\":\"A new PSOE: renewal, clean politics, a younger face\"},{\"id\":\"@sp_start.left_turn\",\"title\":\"Back to the left: tax the rich, repeal the labour reform\"},{\"id\":\"@sp_start.unity\",\"title\":\"A party of government: unity with the federations and the old guard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"13 July 2014 — The new Secretary-General\"},{\"type\":\"paragraph\",\"content\":[\"For the first time, the PSOE's members have chosen their leader directly. You, \",{\"type\":\"emphasis-2\",\"content\":\"Pedro Sánchez\"},\", a 42-year-old economist and Madrid deputy little known outside the party, have won with 48.7% of the vote, ahead of Eduardo Madina (36.2%) and José Antonio Pérez Tapias (15.1%).\"]},{\"type\":\"paragraph\",\"content\":\"You did not win alone. Susana Díaz, President of Andalusia and the most powerful figure in the party, chose not to stand and put the Andalusian federation, the largest in the PSOE, behind you. Most of the regional leaders followed. They expect a leader who will listen to them.\"},{\"type\":\"paragraph\",\"content\":\"The country you inherit is raw. Unemployment is above 24%. Mariano Rajoy governs with an absolute majority won in 2011, and has spent it on austerity and a labour reform the unions call the hardest in democracy. Corruption cases surround the PP. In May's European elections the two big parties together fell below 50% for the first time, and a new party called Podemos, founded in January, won 8% and five seats.\"},{\"type\":\"paragraph\",\"content\":\"The general election is due by the end of 2015. At the Extraordinary Congress in two weeks you must say what your PSOE stands for.\"}]},\"sp_world.unsc_silent\":{\"id\":\"sp_world.unsc_silent\",\"goTo\":[{\"id\":\"sp_world.unsc_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_negotiations.both\":{\"id\":\"sp_negotiations.both\",\"onArrival\":[{\"$code\":\"Q['up_talks'] = (Q['up_talks'] || 0) + 0.5;\\nQ['cs_talks'] = (Q['cs_talks'] || 0) + 0.5;\\nQ['rel_up'] = (Q['rel_up'] || 0) + 3;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 3;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 2;\"}],\"content\":{\"content\":\"Podemos will not share a table with Ciudadanos, and Ciudadanos will not sit in a government with Podemos. Your team shuttles between rooms. It makes you look like the centre of every solution, and it makes everyone suspicious of you.\",\"type\":\"paragraph\"}},\"library.elections\":{\"id\":\"library.elections\",\"goTo\":[{\"id\":\"library.menu\"}],\"content\":[{\"type\":\"heading\",\"content\":\"How elections work\"},{\"type\":\"paragraph\",\"content\":\"Each of Spain's 50 provinces is a constituency with at least two deputies; the other seats are shared by population. Ceuta and Melilla elect one each. Seats are allocated by the D'Hondt method, and a list needs 3% of the valid vote in a province, blank votes included.\"},{\"type\":\"paragraph\",\"content\":\"Small provinces have few seats, so the system rewards parties that are strong everywhere and parties concentrated in one region, and penalises parties with thinly spread national support.\"}]},\"library\":{\"id\":\"library\",\"type\":\"scene\",\"title\":\"Library\",\"newPage\":true,\"isSpecial\":true,\"goTo\":[{\"id\":\"library.menu\"}],\"content\":{\"type\":\"heading\",\"content\":\"The Library\"}},\"main.deck_government\":{\"id\":\"main.deck_government\",\"title\":\"Government\",\"viewIf\":{\"$code\":\"return (((((Q['psoe_in_government'] || 0)===1) && ((Q['sanchez_leader'] || 0)===1))) || ((Q['sanchez_pm'] || 0)===1));\"},\"cardImage\":\"img/spain/bg_congreso_hemiciclo.jpg\",\"isDeck\":true,\"options\":[{\"id\":\"#sp_government\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_catalonia.dialogue\":{\"id\":\"sp_catalonia.dialogue\",\"title\":\"A table for dialogue\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_catalonia\"],\"viewIf\":{\"$code\":\"return (((Q['catalan_crisis'] || 0)===1) && ((Q['cat_dialogue_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['cat_dialogue_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_catalonia.propose\",\"title\":\"Propose the table publicly\"},{\"id\":\"@sp_catalonia.mediator\",\"title\":\"Accept an international mediator\"},{\"id\":\"@sp_catalonia.no_talks\",\"title\":\"No talks while the law is being broken\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"A table for dialogue\"},{\"type\":\"paragraph\",\"content\":\"The PSC proposes a table where the two governments can talk, without preconditions and without a referendum.\"}]},\"sp_advisers.candidacy\":{\"id\":\"sp_advisers.candidacy\",\"title\":\"Seek investiture\",\"isPinnedCard\":true,\"cardImage\":\"img/spain/portrait_sanchez_2015.jpg\",\"tags\":[\"sp_advisor\"],\"viewIf\":{\"$code\":\"return ((((Q['sanchez_nominated'] || 0)===1) && ((Q['psoe_in_government'] || 0)===0)) && ((Q['sanchez_leader'] || 0)===1));\"},\"goTo\":[{\"id\":\"sp_investiture\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"election_lab.lab_landslide\":{\"id\":\"election_lab.lab_landslide\",\"onArrival\":[{\"$code\":\"Q['spain_lab_scenario'] = 4;\"}],\"goTo\":[{\"id\":\"election_lab.lab_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_exile.book_yes\":{\"id\":\"sp_exile.book_yes\",\"onArrival\":[{\"$code\":\"Q['sanchismo'] = (Q['sanchismo'] || 0) + 6;\\nQ['funds'] = (Q['funds'] || 0) + 1;\\nQ['populism'] = (Q['populism'] || 0) + 1;\"}],\"content\":{\"content\":\"It sells well. Everyone in politics reads the chapter about themselves first.\",\"type\":\"paragraph\"}},\"sp_events.iglesias_offer\":{\"id\":\"sp_events.iglesias_offer\",\"title\":\"Iglesias's offer\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((((((Q['year'] || 0)===2016) && ((Q['month'] || 0) >= 1)) && ((Q['month'] || 0) <= 3)) && ((Q['acting'] || 0)===1)) && ((Q['psoe_in_government'] || 0)===0)) && ((Q['rel_up'] || 0) >= 25)) && ((Q['formation_weeks'] || 0) >= 3)) && ((Q['sanchez_leader'] || 0)===1));\"},\"maxVisits\":1,\"options\":[{\"id\":\"@sp_events.welcome\",\"title\":\"Welcome the offer and invite Podemos to formal talks\"},{\"id\":\"@sp_events.programme\",\"title\":\"Say talks must start from the programme, not from posts\"},{\"id\":\"@sp_events.reject\",\"title\":\"Reject it publicly as an ultimatum\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Pablo Iglesias makes an offer\"},{\"type\":\"paragraph\",\"content\":\"Leaving his audience with the King, Pablo Iglesias announces to the press that he is offering the PSOE a coalition government: Sánchez as Prime Minister, Iglesias as Vice-President, and Podemos ministers in key portfolios. You learn of it from the television.\"}],\"countVisitsMax\":1},\"sp_government.snap\":{\"id\":\"sp_government.snap\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.callElection(Q); } Q.member_morale += 3;\"}],\"content\":{\"content\":\"You announce the dissolution of the Cortes. Spain votes in two months.\",\"type\":\"paragraph\"}},\"sp_leadership.r_primary\":{\"id\":\"sp_leadership.r_primary\",\"onArrival\":[{\"$code\":\"Q.populism += 1; Q.sanchismo += 3; window.SpainGame.leadershipElection(Q, 6);\"}],\"goTo\":[{\"id\":\"sp_leadership.primary_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_investiture.debate\":{\"id\":\"sp_investiture.debate\",\"title\":\"The debate\",\"options\":[{\"id\":\"@sp_investiture.speech_change\",\"title\":\"A government of change\"},{\"id\":\"@sp_investiture.speech_reform\",\"title\":\"A reformist government for all Spaniards\"},{\"id\":\"@sp_investiture.speech_attack\",\"title\":{\"content\":[\"The case against \",{\"type\":\"insert\",\"insert\":0}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_leader_short'] || 0);\"}}]}}],\"content\":[{\"type\":\"heading\",\"content\":\"The debate\"},{\"type\":\"paragraph\",\"content\":\"Two days of speeches. What do you build your speech around?\"}]},\"sp_party.formal_role\":{\"id\":\"sp_party.formal_role\",\"onArrival\":[{\"$code\":\"Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 15;\\nQ['regional_leaders_strength'] = (Q['regional_leaders_strength'] || 0) + 4;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 6;\\nQ['barons_veto'] = 1;\"}],\"content\":{\"content\":\"The barons join the negotiating structure. Nothing will be signed without them, which reassures them and limits you.\",\"type\":\"paragraph\"}},\"sp_national.rally\":{\"id\":\"sp_national.rally\",\"title\":\"A rally\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return (((Q['rally_timer'] || 0) <= 0) && ((Q['sanchez_active'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['rally_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_national.jobs\",\"title\":\"Decent jobs: end the precarious contracts of the labour reform\"},{\"id\":\"@sp_national.welfare\",\"title\":\"The welfare state: health, education, dependency care\"},{\"id\":\"@sp_national.corruption_speech\",\"title\":\"Clean politics: end the PP's corruption\"},{\"id\":\"@sp_national.spain\",\"title\":\"One Spain, plural and united\"},{\"id\":\"@sp_national.local\",\"title\":\"Whatever matters most in this town\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"A rally\"},{\"type\":\"paragraph\",\"content\":\"The hall is booked and the buses are on their way. What is tonight's speech about?\"},{\"type\":\"paragraph\",\"content\":\"Each big-hall theme costs 1 in party funds; a local event costs nothing.\"}]},\"sp_world.unsc_result\":{\"id\":\"sp_world.unsc_result\",\"onArrival\":[{\"$code\":\"Q.unsc_won = (Q.intl && Q.intl.un >= 50) ? 1 : 0; if (Q.unsc_won && window.SpainGame) { window.SpainGame.intl(Q, 'un', 5); window.SpainGame.intl(Q, 'eu', 2); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"After three rounds of voting, Spain defeats Turkey and wins a seat on the Security Council for 2015 and 2016, the fifth in its history. For two years Spanish diplomats will sit at the table on Syria, Libya and North Korea. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Spain falls short in the third round. The seat goes to Turkey, and the opposition and government blame each other.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['unsc_won'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['unsc_won'] || 0)===0);\"}}]}},\"sp_negotiations.pnv_cc\":{\"id\":\"sp_negotiations.pnv_cc\",\"onArrival\":[{\"$code\":\"Q['rel_pnv'] = (Q['rel_pnv'] || 0) + 8;\\nQ['rel_cc'] = (Q['rel_cc'] || 0) + 8;\"}],\"content\":{\"content\":\"The PNV wants its fiscal arrangements respected and transfers of powers to Euskadi; Coalición Canaria wants the islands' economic regime. Both are small, both are reliable, and both know what their votes are worth.\",\"type\":\"paragraph\"}},\"main.deck_catalonia\":{\"id\":\"main.deck_catalonia\",\"title\":\"Catalan crisis\",\"viewIf\":{\"$code\":\"return ((Q['catalan_crisis'] || 0)===1);\"},\"isDeck\":true,\"options\":[{\"id\":\"#sp_catalonia\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_catalonia.propose\":{\"id\":\"sp_catalonia.propose\",\"onArrival\":[{\"$code\":\"Q.cat_dialogue += 1; Q.rel_erc += 8; Q.rel_junts += 5; Q.rel_cs -= 8; Q.regional_leaders_dissent += 8; if (window.SpainGame) { window.SpainGame.position(Q, 0, 1); }\"}],\"content\":{\"content\":\"ERC is interested. Ciudadanos calls it treason; García-Page calls it naive.\",\"type\":\"paragraph\"}},\"sp_advisers.organisation\":{\"id\":\"sp_advisers.organisation\",\"title\":\"Secretary of Organisation\",\"isPinnedCard\":true,\"tags\":[\"sp_advisor\"],\"viewIf\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===1);\"},\"newPage\":true,\"options\":[{\"id\":\"@sp_advisers.org_tour\"},{\"id\":\"@sp_advisers.org_money\"},{\"id\":\"@sp_advisers.org_discipline\"},{\"id\":\"@root\",\"title\":\"Back\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":[\"\",{\"type\":\"conditional\",\"content\":\"César Luena \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"José Luis Ábalos \",\"predicate\":1},\"\"]},{\"type\":\"paragraph\",\"content\":\"The Secretary of Organisation runs the party machine: the federations, the lists, the money. Faction: loyal to the leadership.\"}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['year'] || 0) < 2017);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['year'] || 0) >= 2017);\"}}]}},\"election_lab.lab_result\":{\"id\":\"election_lab.lab_result\",\"title\":\"Election lab result\",\"newPage\":true,\"onDisplay\":[{\"$code\":\"var keys = {1: 'baseline', 2: 'up_merger', 3: 'vox_breakthrough', 4: 'right_landslide'};\\nif (typeof window !== 'undefined' && window.SpainUI) {\\n    window.SpainUI.renderLab(keys[Q.spain_lab_scenario] || 'baseline');\\n}\"}],\"options\":[{\"id\":\"@election_lab\",\"title\":\"Try another scenario\"},{\"id\":\"@root.start_menu\",\"title\":\"Back to the main menu\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Simulated Congress of Deputies\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-lab\\\"></div>\"}}]},\"election_lab\":{\"id\":\"election_lab\",\"type\":\"scene\",\"title\":\"Election lab\",\"newPage\":true,\"options\":[{\"id\":\"@election_lab.lab_baseline\",\"title\":\"December 2015, no change\"},{\"id\":\"@election_lab.lab_up_merger\",\"title\":\"Unidos Podemos and a PP recovery\"},{\"id\":\"@election_lab.lab_vox\",\"title\":\"Vox breaks through as Ciudadanos collapses\"},{\"id\":\"@election_lab.lab_landslide\",\"title\":\"A PP–Vox landslide\"},{\"id\":\"@root.start_menu\",\"title\":\"Back to the main menu\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Election lab\"},{\"type\":\"paragraph\",\"content\":\"This page runs the Spanish electoral engine that the campaign will use. Votes are built from social classes, adjusted by region, and projected onto the 52 provinces. Seats are then allocated exactly as in Spain: D'Hondt in each province, a 3% threshold, and seats per province set by population.\"},{\"type\":\"paragraph\",\"content\":\"Fed the official vote counts, the engine reproduces every Congress from 2015 to 2023. The scenarios below are illustrations of the model, not historical results.\"}]},\"sp_exile.organise\":{\"id\":\"sp_exile.organise\",\"title\":\"Build the organisation\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_exile\"],\"viewIf\":{\"$code\":\"return ((((Q['exiled'] || 0)===1) && ((Q['player_is_ps'] || 0)===1)) && ((Q['exile_org_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['exile_org_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_exile.org_branches\",\"title\":\"Open branches across Spain\"},{\"id\":\"@sp_exile.org_defectors\",\"title\":\"Recruit PSOE mayors and councillors\"},{\"id\":\"@sp_exile.org_movement\",\"title\":\"Run it as a movement: open primaries and online votes\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Build the organisation\"},{\"type\":\"paragraph\",\"content\":\"A new party needs branches in fifty-two provinces, candidates, lawyers and money.\"}]},\"sp_events.welcome\":{\"id\":\"sp_events.welcome\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 10;\\nQ['up_talks'] = (Q['up_talks'] || 0) + 1;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) - 6;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 10;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 6;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) - 6;\"}],\"content\":{\"content\":\"Podemos claims the initiative. Your barons say you have been humiliated in public and thanked Iglesias for it.\",\"type\":\"paragraph\"}},\"sp_government.carry_on\":{\"id\":\"sp_government.carry_on\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 3;\"}],\"content\":{\"content\":\"You govern by decree where you can and by patience where you cannot.\",\"type\":\"paragraph\"}},\"sp_leadership.primary_result\":{\"id\":\"sp_leadership.primary_result\",\"title\":\"The leadership election\",\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The leadership election\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"The members vote, and they vote for you. With a fresh mandate from the rank and file, the critics have nothing left to say for a while. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":[\"The members vote, and they choose \",{\"type\":\"insert\",\"insert\":2},\". Pedro Sánchez is no longer Secretary-General of the PSOE.\"],\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['primary_won'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['primary_won'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['psoe_leader'] || 0);\"}}]}},\"sp_investiture.speech_change\":{\"id\":\"sp_investiture.speech_change\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 3;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) - 2;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 3;\"}],\"goTo\":[{\"id\":\"sp_investiture.vote\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_party.membership\":{\"id\":\"sp_party.membership\",\"title\":\"Ask the members\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((((((Q['pact_cs'] || 0)===1) || ((Q['pact_up'] || 0)===1))) && ((Q['membership_round'] || 0) < (Q['formation_round'] || 0))) && ((Q['membership_timer'] || 0) <= 0)) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.membership_timer = 2; Q.membership_round = Q.formation_round || 1;\"}],\"options\":[{\"id\":\"@sp_party.consult\",\"title\":\"Hold the consultation\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Ask the members\"},{\"type\":\"paragraph\",\"content\":\"An agreement has been signed. You could put it to a vote of the whole membership, something the PSOE has never done, before the Federal Committee can bury it.\"}]},\"sp_national.jobs\":{\"id\":\"sp_national.jobs\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 3, unemployed: 3, students: 1}); } Q.trade_unionists_dissent -= 4; Q.progressives_dissent -= 2; if (window.SpainGame) { window.SpainGame.position(Q, 0.5, 0); }\"}],\"content\":{\"content\":\"The unions applaud. Business organisations call it a step backwards.\",\"type\":\"paragraph\"}},\"sp_world.geringonca\":{\"id\":\"sp_world.geringonca\",\"title\":\"Portugal's \\\"contraption\\\"\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['geringonca_seen'] || 0)===0) && ((((((Q['year'] || 0)===2015) && ((Q['month'] || 0) >= 11))) || ((Q['year'] || 0) >= 2016))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['geringonca_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_world.costa_model\",\"title\":\"Hail it as a model: the left can govern together\"},{\"id\":\"@sp_world.costa_cautious\",\"title\":\"Praise Costa, but say every country is different\"},{\"id\":\"@sp_world.costa_warning\",\"title\":\"Warn that Spain is not Portugal\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Portugal's \\\"contraption\\\"\"},{\"type\":\"paragraph\",\"content\":[\"In Lisbon, the socialist António Costa topples the centre-right minority government and governs with the support of the Communists, the Greens and the Left Bloc. The right calls it the \",{\"type\":\"emphasis-1\",\"content\":\"geringonça\"},\", the contraption. It is exactly the kind of arrangement Spain's left is arguing about.\"]}],\"countVisitsMax\":1},\"sp_negotiations.catalans\":{\"id\":\"sp_negotiations.catalans\",\"onArrival\":[{\"$code\":\"Q['rel_erc'] = (Q['rel_erc'] || 0) + 8;\\nQ['rel_junts'] = (Q['rel_junts'] || 0) + 6;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 1;\\n if (((Q['red_lines'] || 0)===1) ) { Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 10; } \\n if (((Q['red_lines'] || 0)===1) ) { Q['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 4; }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"ERC's spokesman repeats that their price is a referendum. \",{\"type\":\"conditional\",\"content\":\"Within hours, the barons know about the meeting and remind you of the Federal Committee's resolution.\",\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['red_lines'] || 0)===1);\"}}]}},\"main.deck_exile\":{\"id\":\"main.deck_exile\",\"title\":\"Sánchez's road back\",\"viewIf\":{\"$code\":\"return (((Q['sanchez_leader'] || 0)===0) && (((((Q['exiled'] || 0)===1) || ((Q['backbench'] || 0)===1)) || ((Q['leadership_exception_open'] || 0)===1))));\"},\"cardImage\":\"img/spain/portrait_sanchez_2015.jpg\",\"isDeck\":true,\"options\":[{\"id\":\"#sp_exile\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"main\":{\"id\":\"main\",\"type\":\"scene\",\"title\":\"Next month\",\"setBg\":\"img/spain/bg_congreso_hemiciclo.jpg\",\"isHand\":true,\"onArrival\":[{\"$code\":\"if (Q.advisor_action_timer <= 0) {\\n    Q.pinnedCardsDescription = 'Advisers - an action is available.';\\n} else if (Q.advisor_action_timer == 1) {\\n    Q.pinnedCardsDescription = 'Advisers - next action in 1 month.';\\n} else {\\n    Q.pinnedCardsDescription = 'Advisers - next action in ' + Q.advisor_action_timer + ' months.';\\n}\"}],\"maxCards\":3,\"options\":[{\"id\":\"@main.deck_national\"},{\"id\":\"@main.deck_party\"},{\"id\":\"@main.deck_negotiations\"},{\"id\":\"@main.deck_government\"},{\"id\":\"@main.deck_catalonia\"},{\"id\":\"@main.deck_exile\"},{\"id\":\"#sp_advisor\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Government formation: each turn is one week. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":[\"A general election is called for \",{\"type\":\"insert\",\"insert\":2},\" \",{\"type\":\"insert\",\"insert\":3},\". \"],\"predicate\":1},{\"type\":\"conditional\",\"content\":\"Spain has an acting government. \",\"predicate\":4},{\"type\":\"conditional\",\"content\":[\"The investiture clock is running: \",{\"type\":\"insert\",\"insert\":6},\" week(s) until the Cortes are dissolved. \"],\"predicate\":5},{\"type\":\"conditional\",\"content\":\"The Catalan crisis dominates everything.\",\"predicate\":7}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['weekly'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['election_year'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_year'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['acting'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['investiture_clock'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['investiture_clock'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['catalan_crisis'] || 0)===1);\"}}]}},\"sp_catalonia.mediator\":{\"id\":\"sp_catalonia.mediator\",\"onArrival\":[{\"$code\":\"Q.cat_dialogue += 2; Q.rel_erc += 10; Q.rel_junts += 10; Q.rel_cs -= 15; Q.rel_pp -= 10; Q.regional_leaders_dissent += 18; Q.institutionalists_dissent += 10; Q.sanchez_authority -= 4; if (window.SpainGame) { window.SpainGame.position(Q, 0, 2); }\"}],\"content\":{\"content\":\"Puigdemont's people are delighted. Within the PSOE, it is a scandal.\",\"type\":\"paragraph\"}},\"sp_advisers.org_tour\":{\"id\":\"sp_advisers.org_tour\",\"title\":\"Tour the federations\",\"subtitle\":\"Calms the regional leaders and firms up the Federal Committee.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 6;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) + 3;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"A month of dinners in regional capitals. The barons feel consulted.\",\"type\":\"paragraph\"}},\"sp_exile.org_branches\":{\"id\":\"sp_exile.org_branches\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Needs 1 in party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.campaignRaw(Q, 'ps', {workers: 0.8, pensioners: 0.6, professionals: 0.6, unemployed: 0.6, students: 0.5, homemakers: 0.4, self_employed: 0.3}); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"insert\",\"insert\":0},\" now exists outside Madrid.\"]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['new_party_name'] || 0);\"}}]}},\"sp_events.programme\":{\"id\":\"sp_events.programme\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 3;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 2;\"}],\"content\":{\"content\":\"You keep the door open without walking through it on Iglesias's terms. The commentators call it a good afternoon's work.\",\"type\":\"paragraph\"}},\"sp_government.minimum_wage\":{\"id\":\"sp_government.minimum_wage\",\"title\":\"The minimum wage\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_government\"],\"viewIf\":{\"$code\":\"return (((Q['psoe_in_government'] || 0)===1) && ((Q['wage_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['wage_timer'] = 12;\"}],\"options\":[{\"id\":\"@sp_government.big_rise\",\"title\":\"Raise it by 22% in one go\"},{\"id\":\"@sp_government.gradual\",\"title\":\"Raise it gradually over the legislature\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The minimum wage\"},{\"type\":\"paragraph\",\"content\":\"The minimum wage is €736 a month. The unions want €1,000; business warns of job losses.\"}]},\"sp_leadership.lead_challenge\":{\"id\":\"sp_leadership.lead_challenge\",\"title\":\"A challenger emerges\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['lead_challenge_due'] || 0)===1) && ((Q['lead_forced_due'] || 0)===0)) && ((Q['sanchez_leader'] || 0)===1)) && ((Q['election_year'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q['lead_stage'] = 2;\"}],\"options\":[{\"id\":\"@sp_leadership.c_ignore\",\"title\":\"Ignore it and get on with the job\"},{\"id\":\"@sp_leadership.c_address\",\"title\":\"Address it: a speech to the parliamentary group, a tour of the federations\"},{\"id\":\"@sp_leadership.c_bluff\",\"title\":\"Call their bluff: dare them to table the motion in the Federal Committee\"},{\"id\":\"@sp_leadership.c_primary\",\"title\":\"Call their bluff: call the leadership election yourself, now\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"A challenger emerges\"},{\"type\":\"paragraph\",\"content\":[\"The anonymous critics now have a name: \",{\"type\":\"insert\",\"insert\":0},\". Seven regional federations are collecting signatures for an extraordinary leadership election, and the papers are already printing the arithmetic of the Federal Committee.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['challenger'] || 0);\"}}]}},\"sp_investiture.speech_reform\":{\"id\":\"sp_investiture.speech_reform\",\"onArrival\":[{\"$code\":\"Q['rel_cs'] = (Q['rel_cs'] || 0) + 3;\\nQ['rel_pnv'] = (Q['rel_pnv'] || 0) + 2;\\nQ['rel_up'] = (Q['rel_up'] || 0) - 2;\"}],\"goTo\":[{\"id\":\"sp_investiture.vote\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_party.consult\":{\"id\":\"sp_party.consult\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q['funds'] = (Q['funds'] || 0) - 1;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 8;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 6;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) + 5;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 3;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) + 4;\"}],\"content\":{\"content\":\"The members back the agreement by a wide margin. The barons cannot argue with the result; they argue instead about the question.\",\"type\":\"paragraph\"}},\"sp_national.welfare\":{\"id\":\"sp_national.welfare\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 2, homemakers: 2, workers: 1}); } Q.trade_unionists_dissent -= 2; if (window.SpainGame) { window.SpainGame.position(Q, 0.3, 0); }\"}],\"content\":{\"content\":\"Classic social democracy, and still the PSOE's strongest ground.\",\"type\":\"paragraph\"}},\"sp_world.costa_model\":{\"id\":\"sp_world.costa_model\",\"onArrival\":[{\"$code\":\"Q.rel_up += 6; Q.progressives_dissent -= 4; Q.regional_leaders_dissent += 6; if (window.SpainGame) { window.SpainGame.intl(Q, 'south', 6); window.SpainGame.position(Q, 0.5, 0); }\"}],\"content\":{\"content\":\"Costa calls to thank you. Susana Díaz's people note that you are already measuring the curtains for a government with Podemos.\",\"type\":\"paragraph\"}},\"sp_negotiations.podemos_question\":{\"id\":\"sp_negotiations.podemos_question\",\"title\":\"The Podemos question\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_negotiations\"],\"viewIf\":{\"$code\":\"return ((((Q['podemos_talks_timer'] || 0) <= 0) && ((Q['seeking_government'] || 0)===1)) && ((Q['pact_up'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['podemos_talks_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_negotiations.coalition\",\"title\":\"Formal talks on a coalition government\"},{\"id\":\"@sp_negotiations.programme_deal\",\"title\":\"A programme agreement without ministries\"},{\"id\":\"@sp_negotiations.external\",\"title\":\"A PSOE government with Podemos's external support\"},{\"id\":\"@sp_negotiations.no_podemos\",\"title\":\"No government that depends on Podemos\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The Podemos question\"},{\"type\":\"paragraph\",\"content\":\"Podemos has its own incentives: it wants to overtake the PSOE, not prop it up. What do you offer Pablo Iglesias?\"}]},\"sp_catalonia.no_talks\":{\"id\":\"sp_catalonia.no_talks\",\"onArrival\":[{\"$code\":\"Q.cat_hard_line += 1; Q.rel_erc -= 8; Q.regional_leaders_dissent -= 5; Q.rel_cs += 4; if (window.SpainGame) { window.SpainGame.position(Q, 0, -0.5); }\"}],\"content\":{\"content\":\"Clear and firm. And the conflict goes on.\",\"type\":\"paragraph\"}},\"sp_advisers.org_money\":{\"id\":\"sp_advisers.org_money\",\"title\":\"Squeeze the finances\",\"subtitle\":\"Raises party funds; members grumble.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['funds'] = (Q['funds'] || 0) + 1.5;\\nQ['member_morale'] = (Q['member_morale'] || 0) - 2;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"Dues are chased, contracts renegotiated, the headquarters' heating turned down.\",\"type\":\"paragraph\"}},\"sp_exile.org_defectors\":{\"id\":\"sp_exile.org_defectors\",\"onArrival\":[{\"$code\":\"Q.rel_psoe = (Q.rel_psoe || 15) - 6; if (window.SpainGame) { window.SpainGame.transferRaw(Q, 'psoe', 'ps', {pensioners: 1, workers: 1, homemakers: 0.6}); }\"}],\"content\":{\"content\":\"A dozen mayors in Andalusia and Extremadura switch sides. The PSOE's new leadership is furious.\",\"type\":\"paragraph\"}},\"sp_events.reject\":{\"id\":\"sp_events.reject\",\"onArrival\":[{\"$code\":\"Q.rel_up -= 12; Q.rel_cs += 5; Q.regional_leaders_dissent -= 6; Q.progressives_dissent += 8; Q.member_morale -= 3; if (window.SpainGame) { window.SpainGame.transfer(Q, 'up', {students: 1, workers: 0.5}); }\"}],\"content\":{\"content\":\"The barons applaud. Many members, who voted for change, do not.\",\"type\":\"paragraph\"}},\"sp_government.big_rise\":{\"id\":\"sp_government.big_rise\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 3, unemployed: 1.5, students: 1, self_employed: -1.5}); } Q.trade_unionists_dissent -= 8; Q.rel_up += 6; Q.rel_cs -= 6; Q.wage_rise = 2; if (window.SpainGame) { window.SpainGame.position(Q, 1, 0); } if (window.SpainGame) { window.SpainGame.econ(Q, -0.1, 0.25);window.SpainGame.social(Q, 3); }\"}],\"content\":{\"content\":\"The largest rise since 1977. The Bank of Spain warns about employment; the workers who get it do not.\",\"type\":\"paragraph\"}},\"sp_leadership.c_ignore\":{\"id\":\"sp_leadership.c_ignore\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 5;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 6;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 4;\"}],\"content\":{\"content\":\"Silence looks like weakness. More signatures arrive.\",\"type\":\"paragraph\"}},\"sp_investiture.speech_attack\":{\"id\":\"sp_investiture.speech_attack\",\"onArrival\":[{\"$code\":\"Q['rel_pp'] = (Q['rel_pp'] || 0) - 8;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 4;\"}],\"goTo\":[{\"id\":\"sp_investiture.vote\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_party.federal_exec\":{\"id\":\"sp_party.federal_exec\",\"title\":\"The Federal Executive\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((Q['federal_exec_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['federal_exec_timer'] = 4;\"}],\"options\":[{\"id\":\"@sp_party.loyalist\",\"title\":\"A loyalist from your own network\"},{\"id\":\"@sp_party.baron\",\"title\":\"Someone close to the regional presidents\"},{\"id\":\"@sp_party.unionist\",\"title\":\"A figure from the UGT tradition\"},{\"id\":\"@sp_party.young\",\"title\":\"A young moderniser\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The Federal Executive\"},{\"type\":\"paragraph\",\"content\":\"A vacancy in the party leadership gives you the chance to reshape it. Who gets the post?\"}]},\"sp_national.corruption_speech\":{\"id\":\"sp_national.corruption_speech\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {professionals: 2, students: 1, workers: 1}); window.SpainGame.campaign(Q, 'pp', {professionals: -1, self_employed: -0.5}); } Q.rel_pp -= 4;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The audience chants about Bárcenas. \",{\"type\":\"conditional\",\"content\":\"With the PP in the dock, the message lands harder.\",\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pp_scandal'] || 0) >= 2);\"}}]}},\"sp_world.costa_cautious\":{\"id\":\"sp_world.costa_cautious\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'south', 3); }\"}],\"content\":{\"content\":\"A diplomatic answer, and a door left ajar.\",\"type\":\"paragraph\"}},\"sp_negotiations.coalition\":{\"id\":\"sp_negotiations.coalition\",\"onArrival\":[{\"$code\":\"Q.up_talks += 1.5; Q.rel_up += 10; Q.rel_cs -= 8; Q.progressives_dissent -= 8; Q.regional_leaders_dissent += 12; Q.institutionalists_dissent += 8; if (window.SpainGame) { window.SpainGame.position(Q, 1, 0); }\"}],\"content\":{\"content\":\"Iglesias wants the vice-presidency and the ministries that control the economy and security. The barons want you to walk away.\",\"type\":\"paragraph\"}},\"sp_catalonia.psc\":{\"id\":\"sp_catalonia.psc\",\"title\":\"The PSC line\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_catalonia\"],\"viewIf\":{\"$code\":\"return (((Q['catalan_crisis'] || 0)===1) && ((Q['cat_psc_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['cat_psc_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_catalonia.iceta_bridge\",\"title\":\"A bridge: recognise Catalonia as a nation within Spain\"},{\"id\":\"@sp_catalonia.iceta_unionist\",\"title\":\"A clear unionist line, shoulder to shoulder with Cs\"},{\"id\":\"@sp_catalonia.iceta_free\",\"title\":\"Let the PSC set its own line\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The PSC line\"},{\"type\":\"paragraph\",\"content\":\"Miquel Iceta needs to win back voters who fled to Ciudadanos without losing those who want a deal. What does the PSOE let him say?\"}]},\"sp_advisers.org_discipline\":{\"id\":\"sp_advisers.org_discipline\",\"title\":\"Discipline the critics\",\"subtitle\":\"More control of the Federal Committee; the old guard resents it.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) + 6;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 5;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 3;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"A few federations get new caretaker committees. The message is understood.\",\"type\":\"paragraph\"}},\"sp_exile.org_movement\":{\"id\":\"sp_exile.org_movement\",\"onArrival\":[{\"$code\":\"Q.populism += 1; if (window.SpainGame) { window.SpainGame.campaignRaw(Q, 'ps', {students: 1.2, unemployed: 0.8, professionals: 0.5}); }\"}],\"content\":{\"content\":\"Young volunteers join by the thousand. The press calls it Podemos with a tie.\",\"type\":\"paragraph\"}},\"sp_events.pp_round\":{\"id\":\"sp_events.pp_round\",\"title\":\"The King's consultations\",\"newPage\":true,\"faceImage\":\"img/spain/event_rajoy_sanchez.jpg\",\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((((((Q['acting'] || 0)===1) && ((Q['pp_asked'] || 0) < (Q['formation_round'] || 0))) && ((Q['election_year'] || 0)===0)) && ((Q['investiture_votes'] || 0)===0)) && ((Q['formation_weeks'] || 0) >= 2)) && ((Q['psoe_largest'] || 0)===0)) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q.pp_asked = Q.formation_round || 1;\"}],\"options\":[{\"id\":\"@sp_events.against\",\"title\":{\"content\":[\"Vote against \",{\"type\":\"insert\",\"insert\":0}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}}]}},{\"id\":\"@sp_events.abstain\",\"title\":\"Abstain and let a PP government be formed\"},{\"id\":\"@sp_events.limited\",\"title\":\"Negotiate a limited agreement in exchange for abstention\"},{\"id\":\"@sp_events.other_candidate\",\"title\":\"Demand a different PP candidate\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":0},\" asks for support\"]},{\"type\":\"paragraph\",\"content\":[\"The King has finished his consultations and offered the nomination to \",{\"type\":\"insert\",\"insert\":1},\", the leader of the largest party of the right. Before deciding whether to accept, \",{\"type\":\"insert\",\"insert\":2},\" calls you. \",{\"type\":\"conditional\",\"content\":\"Ciudadanos has overtaken the PP; Rivera offers a government of Ciudadanos and the PP, \",\"predicate\":3},{\"type\":\"conditional\",\"content\":\"Rajoy wants the PSOE to let him govern, \",\"predicate\":4},\" with your vote in favour, or at least an abstention. Many of the PSOE's voters, and most of its younger ones, will never forgive a PSOE that hands the right another term.\"]},{\"type\":\"paragraph\",\"content\":\"What will the PSOE do?\"}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['right_is_cs'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['right_is_cs'] || 0)===0);\"}}]}},\"sp_government.gradual\":{\"id\":\"sp_government.gradual\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 1.5, unemployed: 0.5}); } Q.trade_unionists_dissent -= 3; Q.rel_cs += 2; Q.wage_rise = 1; if (window.SpainGame) { window.SpainGame.position(Q, 0.3, 0); } if (window.SpainGame) { window.SpainGame.econ(Q, 0, 0.05);window.SpainGame.social(Q, 1.5); }\"}],\"content\":{\"content\":\"Prudent and predictable. The unions call it a missed opportunity.\",\"type\":\"paragraph\"}},\"sp_leadership.c_address\":{\"id\":\"sp_leadership.c_address\",\"onArrival\":[{\"$code\":\"Q.sanchez_authority += 4 + Q.member_morale / 15; Q.regional_leaders_dissent -= 2; Q.federal_committee_balance += 2; Q.month_actions += 1;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"You make your case. It steadies the group, but \",{\"type\":\"insert\",\"insert\":0},\" has not gone away.\"]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['challenger'] || 0);\"}}]}},\"sp_investiture.vote\":{\"id\":\"sp_investiture.vote\",\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.holdInvestiture(Q, 'sanchez');\\n}\"}],\"goTo\":[{\"id\":\"sp_investiture.won\",\"predicate\":{\"$code\":\"return ((Q['inv_passes'] || 0)===1);\"}},{\"id\":\"sp_investiture.lost\",\"predicate\":{\"$code\":\"return ((Q['inv_passes'] || 0)===0);\"}}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_party.loyalist\":{\"id\":\"sp_party.loyalist\",\"onArrival\":[{\"$code\":\"Q['sanchismo'] = (Q['sanchismo'] || 0) + 6;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) + 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 5;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 3;\"}],\"content\":{\"content\":\"Your grip on Ferraz tightens. The barons notice who is being promoted.\",\"type\":\"paragraph\"}},\"sp_national.spain\":{\"id\":\"sp_national.spain\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 2, homemakers: 1, self_employed: 1}); } Q.regional_leaders_dissent -= 4; Q.rel_erc -= 4; if (window.SpainGame) { window.SpainGame.position(Q, 0, -0.5); }\"}],\"content\":{\"content\":\"A big Spanish flag behind the stage. The barons approve; the PSC is less sure.\",\"type\":\"paragraph\"}},\"sp_world.costa_warning\":{\"id\":\"sp_world.costa_warning\",\"onArrival\":[{\"$code\":\"Q.rel_up -= 5; Q.regional_leaders_dissent -= 4; Q.progressives_dissent += 4;\"}],\"content\":{\"content\":\"The barons are reassured. Podemos quotes Lisbon at you for months.\",\"type\":\"paragraph\"}},\"sp_negotiations.programme_deal\":{\"id\":\"sp_negotiations.programme_deal\",\"onArrival\":[{\"$code\":\"Q['up_talks'] = (Q['up_talks'] || 0) + 1;\\nQ['rel_up'] = (Q['rel_up'] || 0) + 5;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) - 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 4;\"}],\"content\":{\"content\":\"Podemos listens, but says a programme without power is a promise without guarantees.\",\"type\":\"paragraph\"}},\"sp_catalonia.iceta_bridge\":{\"id\":\"sp_catalonia.iceta_bridge\",\"onArrival\":[{\"$code\":\"Q.cat_dialogue += 1; Q.regional_leaders_dissent += 6; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 1.06); } if (window.SpainGame) { window.SpainGame.position(Q, 0, 1); }\"}],\"content\":{\"content\":\"Iceta dances on stage and talks about a \\\"nation of nations\\\". Some voters come back.\",\"type\":\"paragraph\"}},\"sp_advisers.lastra\":{\"id\":\"sp_advisers.lastra\",\"title\":\"Adriana Lastra\",\"isPinnedCard\":true,\"tags\":[\"sp_advisor\"],\"viewIf\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===1);\"},\"newPage\":true,\"options\":[{\"id\":\"@sp_advisers.lastra_up\"},{\"id\":\"@sp_advisers.lastra_members\"},{\"id\":\"@sp_advisers.lastra_women\"},{\"id\":\"@root\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Adriana Lastra\"},{\"type\":\"paragraph\",\"content\":\"Asturian, combative, and one of the few who stayed with you in the worst moments. She speaks to the members, and to Podemos. Faction: Progressives.\"}]},\"sp_exile.bid\":{\"id\":\"sp_exile.bid\",\"title\":\"Bid for the leadership\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_exile\"],\"viewIf\":{\"$code\":\"return ((((((Q['exiled'] || 0)===1) && ((Q['player_leads'] || 0)===0)) && ((Q['player_is_ps'] || 0)===0)) && ((Q['exile_bid_timer'] || 0) <= 0)) && ((Q['elections_held'] || 0) >= 2));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['exile_bid_timer'] = 6;\"}],\"options\":[{\"id\":\"@sp_exile.bid_go\",\"title\":\"Stand for the leadership\"},{\"id\":\"@root\",\"title\":\"Not yet\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Bid for the leadership\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"insert\",\"insert\":0},\" is not doing as well as it hoped. Some of its members think the newcomer with a national profile should lead it.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['my_party'] || 0);\"}}]}},\"sp_events.against\":{\"id\":\"sp_events.against\",\"onArrival\":[{\"$code\":\"Q.psoe_stance_pp = \\\"no\\\"; Q.member_morale += 4; Q.rel_pp -= 6; Q.sanchez_authority += 2; if (window.SpainGame) { window.SpainGame.transfer(Q, 'up', 'psoe', {workers: 1, students: 1}); }\"}],\"goTo\":[{\"id\":\"sp_events.pp_decides\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_government.memory\":{\"id\":\"sp_government.memory\",\"title\":\"Historical memory\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_government\"],\"viewIf\":{\"$code\":\"return (((Q['psoe_in_government'] || 0)===1) && ((Q['memory_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['memory_timer'] = 24;\"}],\"options\":[{\"id\":\"@sp_government.exhume\",\"title\":\"Exhume Franco from the Valley of the Fallen\"},{\"id\":\"@sp_government.graves\",\"title\":\"Fund the search for the victims' graves\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Historical memory\"},{\"type\":\"paragraph\",\"content\":\"Franco is still buried in a state monument in the Valley of the Fallen, and tens of thousands of victims of the Civil War and the dictatorship lie in unmarked graves.\"}]},\"sp_leadership.c_bluff\":{\"id\":\"sp_leadership.c_bluff\",\"onArrival\":[{\"$code\":\"Q.populism += 1; Q.lead_confronted = 1;\\nQ.bluff_won = (Q.federal_committee_balance + Q.member_morale / 4 + (Math.random() * 12 - 6) >= 60) ? 1 : 0;\\nif (Q.bluff_won) { Q.sanchez_authority += 18; Q.regional_leaders_dissent -= 12; Q.sanchismo += 6; Q.lead_stage = 0; }\\nelse { Q.sanchez_authority = Math.max(0, Q.sanchez_authority - 15); Q.federal_committee_balance -= 6; if (Math.random() < 0.4) { window.SpainGame.oust(Q, true); Q.bluff_expelled = 1; } }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"The motion is never tabled. \",{\"type\":\"insert\",\"insert\":1},\" says there was never any challenge. \"],\"predicate\":0},{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"conditional\",\"content\":\"The Federal Committee answers your dare by removing you, and the ethics committee opens proceedings for \\\"disloyalty to the party's organs\\\". You are expelled from the PSOE. \",\"predicate\":3},{\"type\":\"conditional\",\"content\":\"The critics table the motion. You survive the night, barely, and everyone knows the next vote is a matter of time. \",\"predicate\":4},\"\"],\"predicate\":2}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['bluff_won'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['challenger'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['bluff_won'] || 0)===0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['bluff_expelled'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['bluff_expelled'] || 0)===0);\"}}]}},\"sp_investiture.won\":{\"id\":\"sp_investiture.won\",\"title\":\"Prime Minister\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 15;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 10;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) + 10;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) + 8;\\nQ['sanchez_nominated'] = 0;\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Prime Minister\"},{\"type\":\"paragraph\",\"content\":[\"Yes \",{\"type\":\"insert\",\"insert\":0},\", no \",{\"type\":\"insert\",\"insert\":1},\", abstentions \",{\"type\":\"insert\",\"insert\":2},\". Pedro Sánchez is invested President of the Government.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_yes'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_no'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_abstain'] || 0);\"}}]}},\"sp_party.baron\":{\"id\":\"sp_party.baron\",\"onArrival\":[{\"$code\":\"Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 8;\\nQ['regional_leaders_strength'] = (Q['regional_leaders_strength'] || 0) + 2;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) - 3;\"}],\"content\":{\"content\":\"A gesture of peace towards the federations. It costs you a seat at your own table.\",\"type\":\"paragraph\"}},\"sp_national.local\":{\"id\":\"sp_national.local\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 1.5, pensioners: 1, unemployed: 1, homemakers: 0.5}); }\"}],\"content\":{\"content\":\"Roads, hospitals, the local factory. Nothing memorable, nothing risky.\",\"type\":\"paragraph\"}},\"sp_world.brexit\":{\"id\":\"sp_world.brexit\",\"title\":\"Brexit\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['brexit_seen'] || 0)===0) && ((((((Q['year'] || 0)===2016) && ((Q['month'] || 0) >= 7))) || ((Q['year'] || 0) >= 2017))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['brexit_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_world.brexit_eu\",\"title\":\"Stand with the EU: no special deals, the Union negotiates as one\"},{\"id\":\"@sp_world.brexit_gibraltar\",\"title\":\"Put Gibraltar on the table\"},{\"id\":\"@sp_world.brexit_people\",\"title\":\"Make it about people: protect citizens on both sides\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Brexit\"},{\"type\":\"paragraph\",\"content\":\"The United Kingdom votes to leave the European Union. Three hundred thousand Spaniards live there, and as many Britons live in Spain. Gibraltar voted 96% to remain; the foreign ministry is already talking about co-sovereignty.\"}],\"countVisitsMax\":1},\"sp_negotiations.external\":{\"id\":\"sp_negotiations.external\",\"onArrival\":[{\"$code\":\"Q['up_talks'] = (Q['up_talks'] || 0) + 0.5;\\nQ['rel_up'] = (Q['rel_up'] || 0) - 2;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\"}],\"content\":{\"content\":\"Podemos refuses to be \\\"the PSOE's crutch\\\". The offer stays on the table.\",\"type\":\"paragraph\"}},\"sp_catalonia.iceta_unionist\":{\"id\":\"sp_catalonia.iceta_unionist\",\"onArrival\":[{\"$code\":\"Q.regional_leaders_dissent -= 4; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 1.03); window.SpainGame.regionalMod(Q, 'Cataluña', 'cs', 1.03); }\"}],\"content\":{\"content\":\"The PSC competes with Ciudadanos on its own ground, and Ciudadanos is better at it.\",\"type\":\"paragraph\"}},\"sp_advisers.lastra_up\":{\"id\":\"sp_advisers.lastra_up\",\"title\":\"Open a channel to Podemos\",\"subtitle\":\"Better relations and talks with Podemos; Ciudadanos notices.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 8;\\nQ['up_talks'] = (Q['up_talks'] || 0) + 1;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) - 2;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"Coffee with Irene Montero's team. Nothing is promised; something is understood.\",\"type\":\"paragraph\"}},\"sp_exile.bid_go\":{\"id\":\"sp_exile.bid_go\",\"onArrival\":[{\"$code\":\"Q.bid_won = (Q.sanchismo + Q.populism * 3 + (Math.random() * 20 - 10) >= 45) ? 1 : 0; if (Q.bid_won) { Q.player_leads = 1; } else { Q.sanchismo -= 5; }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"The members choose you. Pedro Sánchez leads \",{\"type\":\"insert\",\"insert\":1},\", and would be its candidate for Prime Minister. \"],\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The founders close ranks. The newcomer will have to wait.\",\"predicate\":2}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['bid_won'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['my_party'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['bid_won'] || 0)===0);\"}}]}},\"sp_events.abstain\":{\"id\":\"sp_events.abstain\",\"onArrival\":[{\"$code\":\"Q.psoe_stance_pp = \\\"abstain\\\"; Q.member_morale -= 15; Q.progressives_dissent += 20; Q.trade_unionists_dissent += 10; Q.regional_leaders_dissent -= 8; Q.institutionalists_dissent -= 6; Q.rel_pp += 10; Q.sanchez_authority -= 10; Q.sanchismo -= 5; Q.progressives_strength -= 5; Q.abstained_for_pp = 1; if (window.SpainGame) { window.SpainGame.transfer(Q, 'up', {up: 0.85, iu: 0.15}, {workers: 5, students: 5, unemployed: 4, professionals: 3, pensioners: 1}); }\"}],\"goTo\":[{\"id\":\"sp_events.pp_decides\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_government.exhume\":{\"id\":\"sp_government.exhume\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {students: 1.5, workers: 1, professionals: 1}); window.SpainGame.campaign(Q, 'vox', {pensioners: 0.5, self_employed: 0.5}); } Q.progressives_dissent -= 6; Q.rel_up += 4; Q.rel_pp -= 6; Q.franco_exhumed = 1; if (window.SpainGame) { window.SpainGame.position(Q, 0, 1.5); } if (window.SpainGame) { window.SpainGame.social(Q, 1); }\"}],\"content\":{\"content\":\"It takes a year of court battles. When the helicopter lifts the coffin, the left celebrates and Vox finds a new grievance.\",\"type\":\"paragraph\"}},\"sp_leadership.c_primary\":{\"id\":\"sp_leadership.c_primary\",\"onArrival\":[{\"$code\":\"Q.populism += 1; Q.sanchismo += 3; window.SpainGame.leadershipElection(Q, 5);\"}],\"goTo\":[{\"id\":\"sp_leadership.primary_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_investiture.lost\":{\"id\":\"sp_investiture.lost\",\"title\":\"Defeated\",\"onArrival\":[{\"$code\":\"Q.sanchez_nominated = 0;\\nif (Q.inv_yes >= 130) { Q.sanchez_authority += 2; } else { Q.sanchez_authority -= 6; }\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Defeated\"},{\"type\":\"paragraph\",\"content\":[\"Yes \",{\"type\":\"insert\",\"insert\":0},\", no \",{\"type\":\"insert\",\"insert\":1},\", abstentions \",{\"type\":\"insert\",\"insert\":2},\". The chamber rejects your candidacy in both ballots.\"]},{\"type\":\"paragraph\",\"content\":{\"type\":\"conditional\",\"content\":\"The two-month clock has started: eight weeks. If no one is invested before it runs out, the Cortes will be dissolved.\",\"predicate\":3}}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_yes'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_no'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_abstain'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['investiture_clock'] || 0) > 0);\"}}]}},\"sp_investiture\":{\"id\":\"sp_investiture\",\"type\":\"scene\",\"title\":\"The investiture debate\",\"newPage\":true,\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.renderVote(Q, 'sp-inv-count', 'sanchez');\\n}\"}],\"options\":[{\"id\":\"@sp_investiture.sign_cs\",\"title\":\"Sign a government agreement with Ciudadanos\"},{\"id\":\"@sp_investiture.sign_up\",\"title\":\"Sign a government agreement with Podemos\"},{\"id\":\"@sp_investiture.referendum\",\"title\":\"Offer the Catalan parties talks on their demands\"},{\"id\":\"@sp_investiture.debate\",\"title\":\"Go to the debate\"},{\"id\":\"@root\",\"title\":\"Not yet: keep negotiating\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The investiture debate\"},{\"type\":\"paragraph\",\"content\":\"The King has proposed you as candidate. Before you set the date, you can still change the arithmetic. This is the projected vote today:\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-inv-count\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":\"You need 176 yes votes in the first ballot, or more yes than no votes in the second.\"}]},\"sp_party.unionist\":{\"id\":\"sp_party.unionist\",\"onArrival\":[{\"$code\":\"Q['trade_unionists_dissent'] = (Q['trade_unionists_dissent'] || 0) - 8;\\nQ['trade_unionists_strength'] = (Q['trade_unionists_strength'] || 0) + 2;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) + 3;\"}],\"content\":{\"content\":\"The UGT has a voice at the top again.\",\"type\":\"paragraph\"}},\"sp_national.debate\":{\"id\":\"sp_national.debate\",\"title\":\"The televised debate\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return ((((Q['election_year'] || 0) > 0) && ((Q['debate_timer'] || 0) <= 0)) && ((Q['sanchez_active'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['debate_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_national.aggressive\",\"title\":\"Go for the jugular: question the Prime Minister's decency over corruption\"},{\"id\":\"@sp_national.presidential\",\"title\":\"Look presidential: calm, numbers, proposals\"},{\"id\":\"@sp_national.left\",\"title\":\"Fight Podemos for the left\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The televised debate\"},{\"type\":\"paragraph\",\"content\":\"The cameras are on. Your opponent is across the table. How do you play it?\"}]},\"sp_world.brexit_eu\":{\"id\":\"sp_world.brexit_eu\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 6); window.SpainGame.target(Q, 'psoe', 'middle', 1); } if (window.SpainGame) { window.SpainGame.econ(Q, -0.1, 0); }\"}],\"content\":{\"content\":\"Brussels appreciates a reliable partner.\",\"type\":\"paragraph\"}},\"sp_negotiations.no_podemos\":{\"id\":\"sp_negotiations.no_podemos\",\"onArrival\":[{\"$code\":\"Q.rel_up -= 15; Q.regional_leaders_dissent -= 10; Q.progressives_dissent += 10; Q.member_morale -= 4; if (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The barons applaud. The arithmetic of any alternative to \",{\"type\":\"insert\",\"insert\":0},\" has just become much harder.\"]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_leader_short'] || 0);\"}}]}},\"sp_catalonia.iceta_free\":{\"id\":\"sp_catalonia.iceta_free\",\"onArrival\":[{\"$code\":\"Q.sanchez_authority -= 1; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 1.04); }\"}],\"content\":{\"content\":\"The PSC is its own party, after all. Madrid hopes it knows what it is doing.\",\"type\":\"paragraph\"}},\"sp_advisers.lastra_members\":{\"id\":\"sp_advisers.lastra_members\",\"title\":\"Mobilise the members\",\"subtitle\":\"Raises morale and your personal following.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['member_morale'] = (Q['member_morale'] || 0) + 5;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) + 3;\\nQ['populism'] = (Q['populism'] || 0) + 0.5;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"Assemblies in every federation. The members feel the party belongs to them again.\",\"type\":\"paragraph\"}},\"sp_exile.bridge\":{\"id\":\"sp_exile.bridge\",\"title\":\"Bridges to the PSOE\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_exile\"],\"viewIf\":{\"$code\":\"return (((Q['exiled'] || 0)===1) && ((Q['exile_bridge_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['exile_bridge_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_exile.bridge_lunch\",\"title\":\"Lunch with old friends in the PSOE group\"},{\"id\":\"@sp_exile.bridge_attack\",\"title\":\"Attack the PSOE leadership instead\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Bridges to the PSOE\"},{\"type\":\"paragraph\",\"content\":\"Old colleagues still take your calls, some of them.\"}]},\"sp_events.limited\":{\"id\":\"sp_events.limited\",\"onArrival\":[{\"$code\":\"Q.psoe_stance_pp = \\\"abstain\\\"; Q.member_morale -= 10; Q.progressives_dissent += 12; Q.institutionalists_dissent -= 4; Q.rel_pp += 6; Q.sanchez_authority -= 5; Q.progressives_strength -= 2; Q.abstained_for_pp = 1; if (window.SpainGame) { window.SpainGame.transfer(Q, 'up', {up: 0.85, iu: 0.15}, {workers: 2.5, students: 2.5, unemployed: 2, professionals: 1.5}); }\"}],\"goTo\":[{\"id\":\"sp_events.pp_decides\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_government.graves\":{\"id\":\"sp_government.graves\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 3; Q.rel_up += 2; if (window.SpainGame) { window.SpainGame.social(Q, 0.5); }\"}],\"content\":{\"content\":\"Quiet, necessary work. Families find their grandparents.\",\"type\":\"paragraph\"}},\"sp_leadership.lead_forced\":{\"id\":\"sp_leadership.lead_forced\",\"title\":\"The forced primary\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['lead_forced_due'] || 0)===1) && ((Q['sanchez_leader'] || 0)===1));\"},\"options\":[{\"id\":\"@sp_leadership.f_fight\",\"title\":\"Fight for the members' votes\"},{\"id\":\"@sp_leadership.f_withdraw\",\"title\":\"Withdraw and leave with dignity\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The forced primary\"},{\"type\":\"paragraph\",\"content\":[\"Your authority has collapsed. The Federal Committee convenes an extraordinary leadership election, and you cannot stop it. \",{\"type\":\"insert\",\"insert\":0},\" is the candidate of the federations. All that remains is to fight it.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['challenger'] || 0);\"}}]}},\"sp_party.young\":{\"id\":\"sp_party.young\",\"onArrival\":[{\"$code\":\"Q['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) - 6;\\nQ['modernisers_strength'] = (Q['modernisers_strength'] || 0) + 2;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 4;\"}],\"content\":{\"content\":\"A fresh face for the cameras. The veterans mutter about inexperience.\",\"type\":\"paragraph\"}},\"sp_national.aggressive\":{\"id\":\"sp_national.aggressive\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 2, students: 2, unemployed: 2, pensioners: -1}); } Q.rel_pp -= 12; Q.member_morale += 6; Q.institutionalists_dissent += 3;\"}],\"content\":{\"content\":\"\\\"You are not a decent man,\\\" you tell him. The clip is everywhere by midnight. The members love it; the commentators are split.\",\"type\":\"paragraph\"}},\"sp_world.brexit_gibraltar\":{\"id\":\"sp_world.brexit_gibraltar\",\"onArrival\":[{\"$code\":\"Q.rel_pp += 3; if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', -2); window.SpainGame.target(Q, 'psoe', 'pensioners', 1.5); window.SpainGame.position(Q, 0, -0.5); } if (window.SpainGame) { window.SpainGame.econ(Q, -0.1, 0); }\"}],\"content\":{\"content\":\"A patriotic note that plays well in Andalusia and badly in Brussels.\",\"type\":\"paragraph\"}},\"sp_negotiations.cs_channel\":{\"id\":\"sp_negotiations.cs_channel\",\"title\":\"The Ciudadanos channel\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_negotiations\"],\"viewIf\":{\"$code\":\"return ((((Q['cs_talks_timer'] || 0) <= 0) && ((Q['seeking_government'] || 0)===1)) && ((Q['pact_cs'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['cs_talks_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_negotiations.bilateral\",\"title\":\"Open bilateral talks\"},{\"id\":\"@sp_negotiations.three_way\",\"title\":\"Propose a three-way arrangement with Podemos\"},{\"id\":\"@sp_negotiations.reform_pact\",\"title\":\"Seek a narrow pact on institutional reform\"},{\"id\":\"@sp_negotiations.refuse_cs\",\"title\":\"Refuse: Ciudadanos's programme is not ours\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The Ciudadanos channel\"},{\"type\":\"paragraph\",\"content\":\"Albert Rivera signals that Ciudadanos will negotiate reforms, but never in a government that depends on Podemos.\"}]},\"sp_catalonia.federal_reform\":{\"id\":\"sp_catalonia.federal_reform\",\"title\":\"A federal answer\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_catalonia\"],\"viewIf\":{\"$code\":\"return (((Q['catalan_crisis'] || 0)===1) && ((Q['cat_federal_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['cat_federal_timer'] = 6;\"}],\"options\":[{\"id\":\"@sp_catalonia.propose_reform\",\"title\":\"Propose a constitutional reform commission\"},{\"id\":\"@sp_catalonia.not_now\",\"title\":\"Not now: first restore the law\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"A federal answer\"},{\"type\":\"paragraph\",\"content\":\"The Granada Declaration of 2013 proposed a federal Spain. Is now the moment to put it on the table?\"}]},\"sp_advisers.lastra_women\":{\"id\":\"sp_advisers.lastra_women\",\"title\":\"Lead on equality\",\"subtitle\":\"A campaign aimed at women.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q.advisor_action_timer = 2; Q.month_actions += 1; Q.last_advisor_action = 1; Q.progressives_dissent -= 3; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'women', 1.5); }\"}],\"content\":{\"content\":\"Equal pay, the wage gap, gender violence: the PSOE's feminist agenda gets a month of attention.\",\"type\":\"paragraph\"}},\"sp_exile.bridge_lunch\":{\"id\":\"sp_exile.bridge_lunch\",\"onArrival\":[{\"$code\":\"Q.rel_psoe = (Q.rel_psoe || 20) + 8;\"}],\"content\":{\"content\":\"The conversation is awkward and useful.\",\"type\":\"paragraph\"}},\"sp_events.other_candidate\":{\"id\":\"sp_events.other_candidate\",\"onArrival\":[{\"$code\":\"Q.psoe_stance_pp = \\\"no\\\"; Q.rel_pp -= 10; Q.sanchez_authority += 3; Q.institutionalists_dissent += 3;\"}],\"goTo\":[{\"id\":\"sp_events.pp_decides\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_government.pensions\":{\"id\":\"sp_government.pensions\",\"title\":\"Pensions\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_government\"],\"viewIf\":{\"$code\":\"return (((Q['psoe_in_government'] || 0)===1) && ((Q['pensions_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['pensions_timer'] = 12;\"}],\"options\":[{\"id\":\"@sp_government.index\",\"title\":\"Index pensions to inflation\"},{\"id\":\"@sp_government.minimum\",\"title\":\"Raise the minimum and widows' pensions most\"},{\"id\":\"@easy_discard\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Pensions\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"You promised the pensioners that their pensions would rise with prices. \",\"predicate\":0},\"The Social Security system runs a deficit. What do you do?\"]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pensions_promise'] || 0)===1);\"}}]}},\"sp_leadership.f_fight\":{\"id\":\"sp_leadership.f_fight\",\"onArrival\":[{\"$code\":\"window.SpainGame.leadershipElection(Q, -3); if (!Q.primary_won && (Q.lead_confronted || Q.populism >= 6)) { Q.expelled = 1; }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Against every prediction, the members keep you. The apparatus is humiliated, and your authority is rebuilt from the ground up. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":2},\" wins. \",{\"type\":\"conditional\",\"content\":\"Within weeks your open war with the leadership ends in an expulsion file. You are no longer a member of the PSOE. \",\"predicate\":3},\"\"],\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['primary_won'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['primary_won'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['psoe_leader'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['expelled'] || 0)===1);\"}}]}},\"sp_party.ugt\":{\"id\":\"sp_party.ugt\",\"title\":\"The UGT\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((Q['ugt_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['ugt_timer'] = 4;\"}],\"options\":[{\"id\":\"@sp_party.commit\",\"title\":\"Commit to repealing the labour reform\"},{\"id\":\"@sp_party.partial\",\"title\":\"Promise to repeal its \\\"most harmful aspects\\\"\"},{\"id\":\"@sp_party.distance\",\"title\":\"Keep a polite distance\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The UGT\"},{\"type\":\"paragraph\",\"content\":\"The UGT's general secretary asks for a meeting. The union wants the PSOE to commit to repealing the 2012 labour reform and restoring collective bargaining.\"}]},\"sp_national.presidential\":{\"id\":\"sp_national.presidential\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 2, professionals: 2, self_employed: 1}); } Q.sanchez_authority += 3;\"}],\"content\":{\"content\":\"No knockout, no gaffe. The undecided see a possible Prime Minister.\",\"type\":\"paragraph\"}},\"sp_world.brexit_people\":{\"id\":\"sp_world.brexit_people\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 3); window.SpainGame.target(Q, 'psoe', 'young', 1); } if (window.SpainGame) { window.SpainGame.econ(Q, -0.1, 0); }\"}],\"content\":{\"content\":\"Thousands of young Spaniards working in Britain take note.\",\"type\":\"paragraph\"}},\"sp_negotiations.bilateral\":{\"id\":\"sp_negotiations.bilateral\",\"onArrival\":[{\"$code\":\"Q.cs_talks += 1.5; Q.rel_cs += 10; Q.rel_up -= 8; Q.modernisers_dissent -= 5; Q.progressives_dissent += 6; Q.trade_unionists_dissent += 3; if (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0); }\"}],\"content\":{\"content\":\"The two teams work fast. A document starts to take shape: 200 measures, from labour contracts to the provincial councils.\",\"type\":\"paragraph\"}},\"sp_catalonia.propose_reform\":{\"id\":\"sp_catalonia.propose_reform\",\"onArrival\":[{\"$code\":\"Q.federal_proposal = 1; Q.constitutional_commission = 1; Q.cat_dialogue += 1; Q.rel_pnv += 6; Q.rel_erc += 4; Q.rel_pp -= 4; Q.regional_leaders_dissent += 4; Q.institutionalists_dissent -= 2; if (window.SpainGame) { window.SpainGame.position(Q, 0, 0.8); }\"}],\"content\":{\"content\":\"The PP agrees to a commission and to nothing else. It is a start.\",\"type\":\"paragraph\"}},\"sp_advisers.redondo\":{\"id\":\"sp_advisers.redondo\",\"title\":\"Iván Redondo\",\"isPinnedCard\":true,\"tags\":[\"sp_advisor\"],\"viewIf\":{\"$code\":\"return (((Q['sanchez_leader'] || 0)===1) && ((Q['year'] || 0) >= 2017));\"},\"newPage\":true,\"options\":[{\"id\":\"@sp_advisers.redondo_poll\"},{\"id\":\"@sp_advisers.redondo_narrative\"},{\"id\":\"@sp_advisers.redondo_centre\"},{\"id\":\"@root\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Iván Redondo\"},{\"type\":\"paragraph\",\"content\":\"A political consultant who once worked for the PP and now works for you. He believes in data, narrative and nothing else. Faction: none but yours.\"}]},\"sp_exile.bridge_attack\":{\"id\":\"sp_exile.bridge_attack\",\"onArrival\":[{\"$code\":\"Q.rel_psoe = (Q.rel_psoe || 20) - 6; Q.populism += 1; if (window.SpainGame) { window.SpainGame.transferRaw(Q, 'psoe', Q.player_party, {workers: 0.6, students: 0.4}); }\"}],\"content\":{\"content\":\"Some PSOE voters agree with you. None of its leaders will.\",\"type\":\"paragraph\"}},\"sp_events.pp_decides\":{\"id\":\"sp_events.pp_decides\",\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainParliament) {\\n    var cand = Q.right_candidate || 'pp';\\n    var v = window.SpainParliament.investiture(Q.congress, cand, Q);\\n    if (v.passes) {\\n        window.SpainGame.holdInvestiture(Q, cand);\\n        Q.pp_invested_now = 1;\\n    } else {\\n        Q.pp_invested_now = 0;\\n        Q.rajoy_declined = 1;\\n    }\\n}\"}],\"goTo\":[{\"id\":\"sp_events.pp_invested\",\"predicate\":{\"$code\":\"return ((Q['pp_invested_now'] || 0)===1);\"}},{\"id\":\"sp_events.pp_declines\",\"predicate\":{\"$code\":\"return ((Q['pp_invested_now'] || 0)===0);\"}}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_government.index\":{\"id\":\"sp_government.index\",\"subtitle\":\"Deficit +0.3 points\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 3}); } Q.trade_unionists_dissent -= 4; Q.pensions_promise = 0; Q.fiscal_adj += 0.3; if (window.SpainGame) { window.SpainGame.position(Q, 0.3, 0); } if (window.SpainGame) { window.SpainGame.social(Q, 2); }\"}],\"content\":{\"content\":\"Nine million pensioners see it in their next payment.\",\"type\":\"paragraph\"}},\"sp_leadership.f_withdraw\":{\"id\":\"sp_leadership.f_withdraw\",\"onArrival\":[{\"$code\":\"window.SpainGame.oust(Q, false);\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"You do not stand. \",{\"type\":\"insert\",\"insert\":0},\" becomes Secretary-General unopposed.\"]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['psoe_leader'] || 0);\"}}]}},\"sp_party.commit\":{\"id\":\"sp_party.commit\",\"onArrival\":[{\"$code\":\"Q.trade_unionists_dissent -= 10; Q.progressives_dissent -= 4; Q.modernisers_dissent += 4; Q.rel_cs -= 4; Q.labour_promise = 2; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 2, unemployed: 1}); } if (window.SpainGame) { window.SpainGame.position(Q, 1.5, 0); }\"}],\"content\":{\"content\":\"A clear promise. Business and Ciudadanos will hold you to it, from the other side.\",\"type\":\"paragraph\"}},\"sp_national.left\":{\"id\":\"sp_national.left\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 2, unemployed: 2, students: 1}); window.SpainGame.campaign(Q, 'up', {workers: -1, unemployed: -1}); } Q.rel_up -= 8; if (window.SpainGame) { window.SpainGame.position(Q, 1, 0); }\"}],\"content\":{\"content\":\"You claim the left as the PSOE's ground. Podemos's voters listen; Podemos's leaders take note.\",\"type\":\"paragraph\"}},\"sp_world.barcelona_attack\":{\"id\":\"sp_world.barcelona_attack\",\"title\":\"Las Ramblas\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['barcelona_attack_seen'] || 0)===0) && ((((((Q['year'] || 0)===2017) && ((Q['month'] || 0) >= 8))) || ((Q['year'] || 0) >= 2018))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.barcelona_attack_seen = 1; if (window.SpainGame) { window.SpainGame.migration(Q, 3); window.SpainGame.intl(Q, 'eu', 3); window.SpainGame.intl(Q, 'maghreb', -3); }\"}],\"options\":[{\"id\":\"@sp_world.attack_unity\",\"title\":\"Stand with every government, Spanish and Catalan\"},{\"id\":\"@sp_world.attack_police\",\"title\":\"Question the coordination between the Mossos and the national police\"},{\"id\":\"@sp_world.attack_islamophobia\",\"title\":\"Warn against blaming Muslims and migrants\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Las Ramblas\"},{\"type\":\"paragraph\",\"content\":\"A van drives into the crowds on Barcelona's Ramblas; another attack follows in Cambrils. Sixteen people are killed. The attackers were young men from Ripoll, radicalised by an imam. For a few days, Spain and Catalonia mourn together, a month before the referendum.\"}],\"countVisitsMax\":1},\"sp_negotiations.three_way\":{\"id\":\"sp_negotiations.three_way\",\"onArrival\":[{\"$code\":\"Q['cs_talks'] = (Q['cs_talks'] || 0) + 0.5;\\nQ['up_talks'] = (Q['up_talks'] || 0) + 0.5;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) - 2;\\nQ['rel_up'] = (Q['rel_up'] || 0) - 2;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\"}],\"content\":{\"content\":\"Both say no to sitting with the other. You have shown willing, and learned the limits.\",\"type\":\"paragraph\"}},\"sp_catalonia.not_now\":{\"id\":\"sp_catalonia.not_now\",\"onArrival\":[{\"$code\":\"Q.regional_leaders_dissent -= 4; Q.rel_pnv -= 3; Q.cat_hard_line += 1; if (window.SpainGame) { window.SpainGame.position(Q, 0, -0.3); }\"}],\"content\":{\"content\":\"The reform can wait. The question is whether the conflict will.\",\"type\":\"paragraph\"}},\"sp_catalonia\":{\"id\":\"sp_catalonia\",\"type\":\"scene\",\"title\":\"Enforce the law\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_catalonia\"],\"viewIf\":{\"$code\":\"return (((Q['catalan_crisis'] || 0)===1) && ((Q['cat_155_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['cat_155_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_catalonia.prosecute\",\"title\":\"Back the prosecution of the independence leaders\"},{\"id\":\"@sp_catalonia.police\",\"title\":\"Reinforce the police in Catalonia\"},{\"id\":\"@sp_catalonia.measured\",\"title\":\"Act, but with the minimum force the law allows\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Enforce the law\"},{\"type\":\"paragraph\",\"content\":\"The Constitutional Court's rulings are being ignored. How far should the State go?\"}]},\"sp_advisers.redondo_poll\":{\"id\":\"sp_advisers.redondo_poll\",\"title\":\"Commission private polling\",\"subtitle\":\"See the PSOE's real support, without the published polls' error.\",\"chooseIf\":{\"$code\":\"return (((Q['advisor_action_timer'] || 0)===0) && ((Q['funds'] || 0) >= 0.5));\"},\"unavailableSubtitle\":{\"content\":[{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action. \"],\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Needs 0.5 in party funds.\",\"predicate\":2}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"}}]},\"onArrival\":[{\"$code\":\"Q.advisor_action_timer = 2; Q.month_actions += 1; Q.last_advisor_action = 1; Q.funds -= 0.5; Q.internal_psoe = Math.round(((Q.true_poll && Q.true_poll.psoe) || 0) * 10) / 10; Q.published_psoe = Math.round(((Q.poll && Q.poll.psoe) || 0) * 10) / 10;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Redondo's private poll puts the PSOE at \",{\"type\":\"insert\",\"insert\":0},\"%. The published average says \",{\"type\":\"insert\",\"insert\":1},\"%.\"]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['internal_psoe'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['published_psoe'] || 0);\"}}]}},\"sp_exile.exile_funds\":{\"id\":\"sp_exile.exile_funds\",\"title\":\"Raise money\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_exile\"],\"viewIf\":{\"$code\":\"return (((Q['exiled'] || 0)===1) && ((Q['exile_funds_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['exile_funds_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_exile.funds_small\",\"title\":\"Small donations from supporters\"},{\"id\":\"@sp_exile.funds_big\",\"title\":\"A dinner with business donors\"}],\"content\":{\"type\":\"heading\",\"content\":\"Raise money\"}},\"sp_events.pp_invested\":{\"id\":\"sp_events.pp_invested\",\"title\":\"A government of the right\",\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"A government of the right\"},{\"type\":\"paragraph\",\"content\":[\"With the PSOE's abstention, \",{\"type\":\"insert\",\"insert\":0},\" is invested Prime Minister: \",{\"type\":\"insert\",\"insert\":1},\". The country has a government. In the PSOE, the argument about who allowed it has only begun. Membership cards are torn up on social media, and the polls show left-wing voters moving to Podemos.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['government_type'] || 0);\"}}]}},\"sp_government.minimum\":{\"id\":\"sp_government.minimum\",\"subtitle\":\"Deficit +0.1 points\",\"onArrival\":[{\"$code\":\"Q.fiscal_adj += 0.1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 1.5, homemakers: 1.5}); } Q.progressives_dissent -= 3; if (Q.pensions_promise) { Q.sanchez_authority -= 2; } if (window.SpainGame) { window.SpainGame.position(Q, 0.2, 0); } if (window.SpainGame) { window.SpainGame.social(Q, 2); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Targeted and fair, say the economists. \",{\"type\":\"conditional\",\"content\":\"Not what you promised, say the pensioners' associations.\",\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pensions_promise'] || 0)===1);\"}}]}},\"sp_leadership.exile\":{\"id\":\"sp_leadership.exile\",\"title\":\"After Ferraz\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((Q['exile_pending'] || 0)===1);\"},\"options\":[{\"id\":\"@sp_leadership.join_cs\",\"title\":\"Join Ciudadanos\"},{\"id\":\"@sp_leadership.join_up\",\"title\":\"Join Podemos\"},{\"id\":\"@sp_leadership.new_party\",\"title\":\"Found your own party\"},{\"id\":\"@sp_leadership.backbench\",\"title\":\"Stay in the PSOE as a backbench deputy and wait\"},{\"id\":\"@sp_leadership.retire\",\"title\":\"Retire from politics\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"After Ferraz\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"You have been expelled from the PSOE. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"You are no longer Secretary-General. \",\"predicate\":1},\" Your phone keeps ringing anyway. Some calls are offers.\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Albert Rivera's people suggest that a moderate social democrat would be welcome in Ciudadanos. \",\"predicate\":2},{\"type\":\"conditional\",\"content\":\"Podemos sounds you out about joining a broad progressive front. \",\"predicate\":3},\" Your own followers want you to start again under a new name. Your pollsters think a party of your own could start at around \",{\"type\":\"insert\",\"insert\":4},\"%; your personal following and an anti-establishment profile are what it would run on. Every vote it wins would come out of the PSOE or Podemos, splitting the left in every province, and many voters would see it as a vanity project.\"]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['expelled'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['expelled'] || 0)===0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['can_join_cs'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['can_join_up'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['new_party_prospect'] || 0);\"}}]}},\"sp_party.partial\":{\"id\":\"sp_party.partial\",\"onArrival\":[{\"$code\":\"Q.trade_unionists_dissent -= 4; Q.labour_promise = 1; if (window.SpainGame) { window.SpainGame.position(Q, 0.5, 0); }\"}],\"content\":{\"content\":\"Enough to keep the union on side. Not enough to excite anybody.\",\"type\":\"paragraph\"}},\"sp_national.corruption\":{\"id\":\"sp_national.corruption\",\"title\":\"The corruption files\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return ((((Q['scandal_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1)) && ((Q['pm_is_pp'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['scandal_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_national.commission\",\"title\":\"Demand a parliamentary commission of inquiry\"},{\"id\":\"@sp_national.resign\",\"title\":{\"content\":[\"Demand \",{\"type\":\"insert\",\"insert\":0},\"'s resignation\"],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_leader_short'] || 0);\"}}]}},{\"id\":\"@sp_national.restraint\",\"title\":\"Leave it to the judges\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The corruption files\"},{\"type\":\"paragraph\",\"content\":\"Another sumario arrives from the National Court: Gürtel, Púnica, Lezo, the PP's off-the-books accounts. How hard do you push?\"}]},\"sp_world.attack_unity\":{\"id\":\"sp_world.attack_unity\",\"onArrival\":[{\"$code\":\"Q.sanchez_authority += 3; Q.rel_pp += 2; Q.rel_erc += 3; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'pensioners', 1); }\"}],\"content\":{\"content\":\"Your presence at the march in Barcelona is noted with respect.\",\"type\":\"paragraph\"}},\"sp_negotiations.reform_pact\":{\"id\":\"sp_negotiations.reform_pact\",\"onArrival\":[{\"$code\":\"Q['cs_talks'] = (Q['cs_talks'] || 0) + 1;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 5;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 3;\"}],\"content\":{\"content\":\"Anti-corruption measures, limits on political appointments. Useful, and not yet a government.\",\"type\":\"paragraph\"}},\"sp_advisers.redondo_narrative\":{\"id\":\"sp_advisers.redondo_narrative\",\"title\":\"Build the narrative\",\"subtitle\":\"Strengthens your personal following; the party elders dislike it.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['sanchismo'] = (Q['sanchismo'] || 0) + 6;\\nQ['populism'] = (Q['populism'] || 0) + 1;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 3;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"The resistant, the survivor, the man the apparatus could not kill. The story writes itself, with some help.\",\"type\":\"paragraph\"}},\"sp_exile.funds_small\":{\"id\":\"sp_exile.funds_small\",\"onArrival\":[{\"$code\":\"Q.funds += 0.6 + Q.sanchismo / 60;\"}],\"content\":{\"content\":\"Thousands of small transfers. Not much, but nobody owns you.\",\"type\":\"paragraph\"}},\"sp_events.pp_declines\":{\"id\":\"sp_events.pp_declines\",\"title\":\"The right's candidate declines\",\"options\":[{\"id\":\"@sp_events.offer\",\"title\":\"Tell the King you are ready to seek the investiture\"},{\"id\":\"@sp_events.hold\",\"title\":\"Hold back and keep negotiating\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":0},\" declines the nomination\"]},{\"type\":\"paragraph\",\"content\":[\"Without the votes, \",{\"type\":\"insert\",\"insert\":1},\" does something no candidate had done before: declines the King's offer, and waits for others to fail. The initiative passes to you, if you want it.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}}]}},\"sp_government.labour\":{\"id\":\"sp_government.labour\",\"title\":\"The labour reform\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_government\"],\"viewIf\":{\"$code\":\"return (((Q['psoe_in_government'] || 0)===1) && ((Q['labour_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['labour_timer'] = 18;\"}],\"options\":[{\"id\":\"@sp_government.repeal\",\"title\":\"Repeal it outright\"},{\"id\":\"@sp_government.social_dialogue\",\"title\":\"Replace it through an agreement between unions and employers\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The labour reform\"},{\"type\":\"paragraph\",\"content\":\"The PP's 2012 labour reform made dismissal cheaper and weakened collective bargaining. Spain has the highest rate of temporary contracts in the EU.\"}]},\"sp_leadership.join_cs\":{\"id\":\"sp_leadership.join_cs\",\"chooseIf\":{\"$code\":\"return ((Q['can_join_cs'] || 0)===1);\"},\"unavailableSubtitle\":\"Ciudadanos only wants a proven moderate (a centrist economic line) with good relations with them.\",\"onArrival\":[{\"$code\":\"window.SpainGame.joinParty(Q, 'cs'); Q.month_actions += 1;\"}],\"content\":{\"content\":\"You sign up with Ciudadanos at a packed press conference. The PSOE calls it treason; Rivera calls it the birth of a great centre. You will have to earn your place in a party that is not yours.\",\"type\":\"paragraph\"}},\"sp_party.distance\":{\"id\":\"sp_party.distance\",\"onArrival\":[{\"$code\":\"Q.trade_unionists_dissent += 8; Q.modernisers_dissent -= 3; Q.rel_cs += 3; if (window.SpainGame) { window.SpainGame.position(Q, -1, 0); }\"}],\"content\":{\"content\":\"The union leaders leave unhappy. Your economic team is relieved.\",\"type\":\"paragraph\"}},\"sp_national.commission\":{\"id\":\"sp_national.commission\",\"onArrival\":[{\"$code\":\"Q.pp_scandal = (Q.pp_scandal || 0) + 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'pp', {professionals: -1, workers: -1}); } Q.rel_pp -= 6; Q.rel_up += 3; Q.rel_cs += 2;\"}],\"content\":{\"content\":\"Podemos and Ciudadanos back the commission. The hearings will run for months.\",\"type\":\"paragraph\"}},\"sp_world.attack_police\":{\"id\":\"sp_world.attack_police\",\"onArrival\":[{\"$code\":\"Q.rel_erc -= 8; Q.rel_junts -= 8; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 0.98); window.SpainGame.target(Q, 'psoe', 'pensioners', 1.5); window.SpainGame.partyRel(Q, 'cs', 'junts', -5); }\"}],\"content\":{\"content\":\"The question is fair; the timing is not. In Catalonia it reads as an attack on its police.\",\"type\":\"paragraph\"}},\"sp_negotiations.refuse_cs\":{\"id\":\"sp_negotiations.refuse_cs\",\"onArrival\":[{\"$code\":\"Q['rel_cs'] = (Q['rel_cs'] || 0) - 15;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) - 6;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) + 6;\"}],\"content\":{\"content\":\"Clear lines. Fewer options.\",\"type\":\"paragraph\"}},\"sp_advisers.redondo_centre\":{\"id\":\"sp_advisers.redondo_centre\",\"title\":\"Occupy the centre\",\"subtitle\":\"Move towards the centre and court Ciudadanos's voters.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q.advisor_action_timer = 2; Q.month_actions += 1; Q.last_advisor_action = 1; Q.rel_cs += 4; Q.progressives_dissent += 3; if (window.SpainGame) { window.SpainGame.position(Q, -1, 0); window.SpainGame.target(Q, 'psoe', 'middle', 1.2); }\"}],\"content\":{\"content\":\"\\\"The PSOE is the party of the great majority.\\\" Ciudadanos's voters hear it; so does Podemos.\",\"type\":\"paragraph\"}},\"sp_exile.funds_big\":{\"id\":\"sp_exile.funds_big\",\"onArrival\":[{\"$code\":\"Q.funds += 2; Q.populism -= 1;\"}],\"content\":{\"content\":\"A generous evening. The photos are less generous.\",\"type\":\"paragraph\"}},\"sp_events.offer\":{\"id\":\"sp_events.offer\",\"onArrival\":[{\"$code\":\"Q['sanchez_nominated'] = 1;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 5;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 4;\"}],\"content\":{\"content\":\"The King proposes you as candidate. The Speaker will set the date of the debate when you are ready. (Use the \\\"Seek investiture\\\" card.)\",\"type\":\"paragraph\"}},\"sp_government.repeal\":{\"id\":\"sp_government.repeal\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 3, unemployed: 1.5, self_employed: -2}); } Q.trade_unionists_dissent -= 10; Q.rel_up += 8; Q.rel_cs -= 10; Q.rel_pnv -= 4; if (window.SpainGame) { window.SpainGame.position(Q, 1.5, 0); } if (window.SpainGame) { window.SpainGame.econ(Q, -0.2, 0.3);window.SpainGame.social(Q, 2); }\"}],\"content\":{\"content\":\"The unions celebrate; the CEOE threatens to take it to Brussels.\",\"type\":\"paragraph\"}},\"sp_leadership.join_up\":{\"id\":\"sp_leadership.join_up\",\"chooseIf\":{\"$code\":\"return ((Q['can_join_up'] || 0)===1);\"},\"unavailableSubtitle\":\"Podemos only wants a proven progressive (a left or progressive line) with good relations with them.\",\"onArrival\":[{\"$code\":\"window.SpainGame.joinParty(Q, 'up'); Q.month_actions += 1;\"}],\"content\":{\"content\":\"You join Podemos's lists as an independent. The left calls it the end of the PSOE's monopoly; the PSOE calls it the end of Pedro Sánchez.\",\"type\":\"paragraph\"}},\"sp_party.juventudes\":{\"id\":\"sp_party.juventudes\",\"title\":\"Socialist Youth\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((Q['juventudes_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['juventudes_timer'] = 4;\"}],\"options\":[{\"id\":\"@sp_party.housing\",\"title\":\"Housing and youth rent support\"},{\"id\":\"@sp_party.jobs_young\",\"title\":\"Youth jobs and an end to unpaid internships\"},{\"id\":\"@sp_party.digital\",\"title\":\"A digital campaign run by the young members\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Socialist Youth\"},{\"type\":\"paragraph\",\"content\":\"The Juventudes Socialistas want a campaign aimed at young voters, most of whom now vote for Podemos or Ciudadanos.\"}]},\"sp_national.resign\":{\"id\":\"sp_national.resign\",\"onArrival\":[{\"$code\":\"Q.pp_scandal = (Q.pp_scandal || 0) + 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {students: 1, workers: 1}); } Q.rel_pp -= 12; Q.member_morale += 4;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"A good headline. \",{\"type\":\"insert\",\"insert\":0},\" waits for it to pass.\"]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_leader_short'] || 0);\"}}]}},\"sp_world.attack_islamophobia\":{\"id\":\"sp_world.attack_islamophobia\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 3; if (window.SpainGame) { window.SpainGame.intl(Q, 'maghreb', 5); window.SpainGame.position(Q, 0, 0.8); window.SpainGame.campaign(Q, 'vox', {self_employed: 0.5, pensioners: 0.5}); }\"}],\"content\":{\"content\":\"Morocco's ambassador thanks you. A small party called Vox calls you naive.\",\"type\":\"paragraph\"}},\"sp_negotiations.small_parties\":{\"id\":\"sp_negotiations.small_parties\",\"title\":\"The small parties\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_negotiations\"],\"viewIf\":{\"$code\":\"return (((Q['small_parties_timer'] || 0) <= 0) && ((Q['seeking_government'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['small_parties_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_negotiations.pnv_deal\",\"title\":\"The PNV: respect the Basque fiscal agreement and transfer powers\"},{\"id\":\"@sp_negotiations.cc_deal\",\"title\":\"Coalición Canaria: the islands' economic regime\"},{\"id\":\"@sp_negotiations.regionalists\",\"title\":\"The small regionalists: investment for their provinces\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The small parties\"},{\"type\":\"paragraph\",\"content\":\"Every seat counts in a second ballot, where an abstention is worth as much as a no avoided.\"}]},\"sp_advisers.montero\":{\"id\":\"sp_advisers.montero\",\"title\":\"María Jesús Montero\",\"isPinnedCard\":true,\"tags\":[\"sp_advisor\"],\"viewIf\":{\"$code\":\"return (((Q['sanchez_leader'] || 0)===1) && ((Q['psoe_in_government'] || 0)===1));\"},\"newPage\":true,\"options\":[{\"id\":\"@sp_advisers.montero_tighten\"},{\"id\":\"@sp_advisers.montero_regions\"},{\"id\":\"@sp_advisers.montero_partners\"},{\"id\":\"@root\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"María Jesús Montero\"},{\"type\":\"paragraph\",\"content\":\"Minister of Finance. Sevillian, fast-talking, and the person who knows where every euro goes. Faction: Regional leaders.\"}]},\"sp_exile.low_profile\":{\"id\":\"sp_exile.low_profile\",\"title\":\"Keep a low profile\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_exile\"],\"viewIf\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===0);\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\"}],\"options\":[{\"id\":\"@sp_exile.low_watch\",\"title\":\"Watch and wait\"},{\"id\":\"@sp_exile.low_calls\",\"title\":\"Keep in touch with your people\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Keep a low profile\"},{\"type\":\"paragraph\",\"content\":\"A quiet month: a few interviews declined, a few calls returned, a lot of reading.\"}]},\"sp_events.hold\":{\"id\":\"sp_events.hold\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 2;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"You tell the King you need more time. \",{\"type\":\"insert\",\"insert\":0},\"'s strategy depends on everyone else's patience running out first.\"]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}}]}},\"sp_government.social_dialogue\":{\"id\":\"sp_government.social_dialogue\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 2, unemployed: 1, professionals: 0.5}); } Q.trade_unionists_dissent -= 6; Q.rel_pnv += 3; Q.sanchez_authority += 3; if (window.SpainGame) { window.SpainGame.position(Q, -0.3, 0); } if (window.SpainGame) { window.SpainGame.econ(Q, 0.1, -0.3);window.SpainGame.social(Q, 2); }\"}],\"content\":{\"content\":\"Months of talks produce a deal signed by unions and employers alike: fewer temporary contracts, stronger sectoral bargaining.\",\"type\":\"paragraph\"}},\"sp_leadership.new_party\":{\"id\":\"sp_leadership.new_party\",\"onArrival\":[{\"$code\":\"window.SpainGame.joinParty(Q, 'ps', 'Pedro Sánchez List'); Q.month_actions += 1;\"}],\"goTo\":[{\"id\":\"sp_leadership.founded\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_party.housing\":{\"id\":\"sp_party.housing\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {students: 2.5, workers: 1}); } Q.modernisers_dissent -= 3; if (window.SpainGame) { window.SpainGame.position(Q, 0.5, 0); }\"}],\"content\":{\"content\":\"Young renters notice. Some, at least.\",\"type\":\"paragraph\"}},\"sp_national.restraint\":{\"id\":\"sp_national.restraint\",\"onArrival\":[{\"$code\":\"Q['rel_pp'] = (Q['rel_pp'] || 0) + 4;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 3;\\nQ['member_morale'] = (Q['member_morale'] || 0) - 3;\"}],\"content\":{\"content\":\"Institutional and prudent. Many of your voters wanted more.\",\"type\":\"paragraph\"}},\"sp_world.la_manada\":{\"id\":\"sp_world.la_manada\",\"title\":\"La Manada\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['la_manada_seen'] || 0)===0) && ((((((Q['year'] || 0)===2018) && ((Q['month'] || 0) >= 5))) || ((Q['year'] || 0) >= 2019))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['la_manada_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_world.only_yes\",\"title\":\"Promise a law where only yes means yes\"},{\"id\":\"@sp_world.review_code\",\"title\":\"Call for a review of the penal code by experts\"},{\"id\":\"@sp_world.respect_courts\",\"title\":\"Respect the courts' decision\"}],\"content\":[{\"type\":\"heading\",\"content\":\"La Manada\"},{\"type\":\"paragraph\",\"content\":\"A court in Navarre convicts five men of \\\"sexual abuse\\\" rather than rape for the group assault of an 18-year-old during the San Fermín festival, because she did not resist. Hundreds of thousands of women take to the streets: \\\"It's not abuse, it's rape.\\\"\"}],\"countVisitsMax\":1},\"sp_negotiations.pnv_deal\":{\"id\":\"sp_negotiations.pnv_deal\",\"onArrival\":[{\"$code\":\"Q['rel_pnv'] = (Q['rel_pnv'] || 0) + 12;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 2;\"}],\"content\":{\"content\":\"Aitor Esteban takes notes. The PNV never gives its vote cheaply, or early.\",\"type\":\"paragraph\"}},\"sp_advisers.montero_tighten\":{\"id\":\"sp_advisers.montero_tighten\",\"title\":\"Tighten spending\",\"subtitle\":\"Lowers the deficit and pleases Brussels; the unions object.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q.advisor_action_timer = 2; Q.month_actions += 1; Q.last_advisor_action = 1; Q.fiscal_adj -= 0.3; Q.trade_unionists_dissent += 5; if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 3); window.SpainGame.econ(Q, -0.1, 0.05); window.SpainGame.social(Q, -1); }\"}],\"content\":{\"content\":\"A spending freeze in every ministry but pensions.\",\"type\":\"paragraph\"}},\"sp_exile.low_watch\":{\"id\":\"sp_exile.low_watch\",\"onArrival\":[{\"$code\":\"Q['sanchismo'] = (Q['sanchismo'] || 0) - 1;\"}],\"content\":{\"content\":\"Out of sight is, a little, out of mind.\",\"type\":\"paragraph\"}},\"sp_events.king_turns\":{\"id\":\"sp_events.king_turns\",\"title\":\"The King turns to you\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((((((Q['rajoy_declined'] || 0)===1) && ((Q['sanchez_nominated'] || 0)===0)) && ((Q['investiture_votes'] || 0)===0)) && ((Q['acting'] || 0)===1)) && ((Q['election_year'] || 0)===0)) && ((Q['king_asked'] || 0) < (Q['formation_round'] || 0))) && ((Q['formation_weeks'] || 0) >= 5)) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q.king_asked = Q.formation_round || 1;\"}],\"options\":[{\"id\":\"@sp_events.king_accept\",\"title\":\"Accept the nomination\"},{\"id\":\"@sp_events.king_refuse\",\"title\":{\"content\":[\"Refuse: \",{\"type\":\"insert\",\"insert\":0},\" must face the chamber first\"],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}}]}}],\"content\":[{\"type\":\"heading\",\"content\":\"The King turns to you\"},{\"type\":\"paragraph\",\"content\":\"After a second round of consultations, the King asks whether you will stand. If no one does, the investiture clock never starts and the country stays in limbo.\"}]},\"sp_government.reshuffle\":{\"id\":\"sp_government.reshuffle\",\"title\":\"Reshuffle the cabinet\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_government\"],\"viewIf\":{\"$code\":\"return (((Q['psoe_in_government'] || 0)===1) && ((Q['reshuffle_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['reshuffle_timer'] = 12;\"}],\"options\":[{\"id\":\"@sp_government.loyal_cabinet\",\"title\":\"Bring in your most loyal allies\"},{\"id\":\"@sp_government.barons_cabinet\",\"title\":\"Give ministries to people close to the barons\"},{\"id\":\"@sp_government.experts\",\"title\":\"Appoint independent experts\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Reshuffle the cabinet\"},{\"type\":\"paragraph\",\"content\":\"A minister is damaged by a scandal over a master's degree. The press is asking how long they will last.\"}]},\"sp_leadership.founded\":{\"id\":\"sp_leadership.founded\",\"title\":\"The founding\",\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The founding\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"insert\",\"insert\":0},\" is launched in a sports hall in Madrid. \",{\"type\":\"conditional\",\"content\":\"Your anti-establishment message, \\\"neither the apparatus nor the IBEX\\\", fills it. \",\"predicate\":1},{\"type\":\"conditional\",\"content\":\"The hall is respectable rather than full; you are known as a man of the apparatus you are now running against. \",\"predicate\":2},\" The first polls give it \",{\"type\":\"insert\",\"insert\":3},\"%.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['new_party_name'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['populism'] || 0) >= 5);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['populism'] || 0) < 5);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['player_poll'] || 0);\"}}]}},\"sp_party.jobs_young\":{\"id\":\"sp_party.jobs_young\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {students: 2, unemployed: 1.5}); } Q.trade_unionists_dissent -= 2;\"}],\"content\":{\"content\":\"A practical message for a generation of temporary contracts.\",\"type\":\"paragraph\"}},\"sp_national.pensions_campaign\":{\"id\":\"sp_national.pensions_campaign\",\"title\":\"The pensions march\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return ((((Q['pensions_campaign_timer'] || 0) <= 0) && ((Q['sanchez_active'] || 0)===1)) && ((Q['year'] || 0) >= 2016));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['pensions_campaign_timer'] = 4;\"}],\"options\":[{\"id\":\"@sp_national.march\",\"title\":\"Join the march: index pensions to inflation\"},{\"id\":\"@sp_national.pact\",\"title\":\"Propose a cross-party pact in the Toledo Pact commission\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The pensions march\"},{\"type\":\"paragraph\",\"content\":\"Pensioners are marching in Bilbao and Madrid against a 0.25% annual rise. They are the largest group of voters in Spain, and they vote.\"}]},\"sp_world.only_yes\":{\"id\":\"sp_world.only_yes\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 5; Q.only_yes_law = 1; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'women', 3); window.SpainGame.position(Q, 0, 1.5); } if (window.SpainGame) { window.SpainGame.social(Q, 1.5); }\"}],\"content\":{\"content\":\"The feminist movement has its demand, and the PSOE has made it its own. Drafting such a law well will be harder than promising it.\",\"type\":\"paragraph\"}},\"sp_negotiations.cc_deal\":{\"id\":\"sp_negotiations.cc_deal\",\"onArrival\":[{\"$code\":\"Q['rel_cc'] = (Q['rel_cc'] || 0) + 12;\"}],\"content\":{\"content\":\"Ana Oramas will listen to any government that remembers the Canaries exist.\",\"type\":\"paragraph\"}},\"sp_advisers.montero_regions\":{\"id\":\"sp_advisers.montero_regions\",\"title\":\"Renegotiate regional financing\",\"subtitle\":\"Calms the barons; costs money.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 8;\\nQ['fiscal_adj'] = (Q['fiscal_adj'] || 0) + 0.1;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"Every region gets a little more. None of them thinks it is enough, but all of them take it.\",\"type\":\"paragraph\"}},\"sp_exile.low_calls\":{\"id\":\"sp_exile.low_calls\",\"onArrival\":[{\"$code\":\"Q['sanchismo'] = (Q['sanchismo'] || 0) + 2;\"}],\"content\":{\"content\":\"Your network holds together.\",\"type\":\"paragraph\"}},\"sp_exile\":{\"id\":\"sp_exile\",\"type\":\"scene\",\"title\":\"Tour the agrupaciones\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_exile\"],\"viewIf\":{\"$code\":\"return ((((Q['sanchez_leader'] || 0)===0) && ((Q['exiled'] || 0)===0)) && ((Q['exile_tour_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['exile_tour_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_exile.tour_members\",\"title\":\"Listen to the members\"},{\"id\":\"@sp_exile.tour_critic\",\"title\":\"Criticise the leadership's line\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Tour the agrupaciones\"},{\"type\":\"paragraph\",\"content\":\"No car from the party, no staff. You drive yourself from one local branch to the next, as you did in 2014.\"}]},\"sp_events.king_accept\":{\"id\":\"sp_events.king_accept\",\"onArrival\":[{\"$code\":\"Q['sanchez_nominated'] = 1;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 4;\"}],\"content\":{\"content\":\"You are the candidate. (Use the \\\"Seek investiture\\\" card when you are ready.)\",\"type\":\"paragraph\"}},\"sp_government.loyal_cabinet\":{\"id\":\"sp_government.loyal_cabinet\",\"onArrival\":[{\"$code\":\"Q['sanchismo'] = (Q['sanchismo'] || 0) + 6;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 6;\"}],\"content\":{\"content\":\"A government of trust. Critics call it a court.\",\"type\":\"paragraph\"}},\"sp_leadership.backbench\":{\"id\":\"sp_leadership.backbench\",\"chooseIf\":{\"$code\":\"return ((Q['expelled'] || 0)===0);\"},\"unavailableSubtitle\":\"You have been expelled from the party.\",\"onArrival\":[{\"$code\":\"Q['backbench'] = 1;\\nQ['backbench_since'] = (Q['time'] || 0);\"}],\"content\":{\"content\":\"You take a seat at the back of the PSOE group. The new leadership watches you as closely as the PP does. If they stumble, the members may remember you.\",\"type\":\"paragraph\"}},\"sp_party.digital\":{\"id\":\"sp_party.digital\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {students: 3}); } Q.modernisers_dissent -= 5; Q.institutionalists_dissent += 2;\"}],\"content\":{\"content\":\"The memes are good. The veterans do not understand them.\",\"type\":\"paragraph\"}},\"sp_national.march\":{\"id\":\"sp_national.march\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 4}); } Q.trade_unionists_dissent -= 4; Q.pensions_promise = 1; if (window.SpainGame) { window.SpainGame.position(Q, 0.5, 0); }\"}],\"content\":{\"content\":\"You march with the pensioners. Now you have promised them inflation-linked pensions, and they will remember.\",\"type\":\"paragraph\"}},\"sp_world.review_code\":{\"id\":\"sp_world.review_code\",\"onArrival\":[{\"$code\":\"Q.institutionalists_dissent -= 3; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'women', 1.5); }\"}],\"content\":{\"content\":\"Serious and slow. The marchers wanted more.\",\"type\":\"paragraph\"}},\"sp_negotiations.regionalists\":{\"id\":\"sp_negotiations.regionalists\",\"onArrival\":[{\"$code\":\"Q['rel_bng'] = (Q['rel_bng'] || 0) + 8;\\nQ['rel_prc'] = (Q['rel_prc'] || 0) + 8;\\nQ['rel_te'] = (Q['rel_te'] || 0) + 8;\\nQ['rel_geroa'] = (Q['rel_geroa'] || 0) + 8;\\nQ['rel_nc'] = (Q['rel_nc'] || 0) + 8;\"}],\"content\":{\"content\":\"A motorway here, a train line there. The small groups are pragmatic.\",\"type\":\"paragraph\"}},\"sp_advisers.montero_partners\":{\"id\":\"sp_advisers.montero_partners\",\"title\":\"Sound out the budget partners\",\"subtitle\":\"Better relations with the PNV and ERC.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['rel_pnv'] = (Q['rel_pnv'] || 0) + 5;\\nQ['rel_erc'] = (Q['rel_erc'] || 0) + 5;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"Investments for the Basque Country, a commission for Catalonia. The budget arithmetic improves.\",\"type\":\"paragraph\"}},\"sp_advisers\":{\"id\":\"sp_advisers\",\"type\":\"scene\",\"title\":\"Antonio Hernando\",\"isPinnedCard\":true,\"cardImage\":\"img/spain/portrait_hernando.jpg\",\"tags\":[\"sp_advisor\"],\"viewIf\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===1);\"},\"newPage\":true,\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.renderVote(Q, 'sp-hernando-count', 'sanchez');\\n}\"}],\"options\":[{\"id\":\"@sp_advisers.cs_channel\"},{\"id\":\"@sp_advisers.group\"},{\"id\":\"@sp_advisers.pnv\"},{\"id\":\"@root\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Antonio Hernando\"},{\"type\":\"paragraph\",\"content\":\"Spokesperson of the parliamentary group and a central negotiator. Hernando lives by arithmetic: who votes yes, who abstains, who can be moved. Faction: Institutionalists. Loyal to the leadership, for now.\"},{\"type\":\"paragraph\",\"content\":\"His current count for your investiture:\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-hernando-count\\\"></div>\"}}]},\"sp_events.king_refuse\":{\"id\":\"sp_events.king_refuse\",\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.holdInvestiture(Q, Q.right_candidate || 'pp');\\n}\\nQ.sanchez_authority -= 3;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The King proposes \",{\"type\":\"insert\",\"insert\":0},\", who this time goes to the vote and loses it. The two-month clock has started: if no one is invested, Spain votes again.\"]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}}]}},\"sp_government.barons_cabinet\":{\"id\":\"sp_government.barons_cabinet\",\"onArrival\":[{\"$code\":\"Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 10;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 4;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) - 4;\"}],\"content\":{\"content\":\"The federations feel represented. Your own people feel overlooked.\",\"type\":\"paragraph\"}},\"sp_leadership.retire\":{\"id\":\"sp_leadership.retire\",\"onArrival\":[{\"$code\":\"Q['retired'] = 1;\"}],\"content\":{\"content\":\"You leave politics, and write a book about it.\",\"type\":\"paragraph\"}},\"sp_party.programme\":{\"id\":\"sp_party.programme\",\"title\":\"The programme\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((Q['programme_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['programme_timer'] = 6;\"}],\"options\":[{\"id\":\"@sp_party.social\",\"title\":\"Social democracy: a stronger welfare state and fair taxes\"},{\"id\":\"@sp_party.federal\",\"title\":\"A federal Spain: constitutional reform for the territories\"},{\"id\":\"@sp_party.modern\",\"title\":\"Modernisation: education, science and the digital economy\"},{\"id\":\"@sp_party.fiscal\",\"title\":\"Fiscal credibility: no promise without a figure\"},{\"id\":\"@sp_party.public\",\"title\":\"Public ownership: a public bank and a public energy company\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The programme\"},{\"type\":\"paragraph\",\"content\":\"The party's programme conference must settle the PSOE's offer to the country. What is the centrepiece?\"}]},\"sp_national.pact\":{\"id\":\"sp_national.pact\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 1.5}); } Q.rel_cs += 4; Q.rel_pnv += 3; Q.institutionalists_dissent -= 3; if (window.SpainGame) { window.SpainGame.position(Q, -0.3, 0); }\"}],\"content\":{\"content\":\"Serious, consensual and slow. The pensioners are not impressed; the parties are.\",\"type\":\"paragraph\"}},\"sp_world.respect_courts\":{\"id\":\"sp_world.respect_courts\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent += 8; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', 'up', {students: 1.5, professionals: 1}); window.SpainGame.position(Q, 0, -0.5); } if (window.SpainGame) { window.SpainGame.social(Q, -1); }\"}],\"content\":{\"content\":\"Institutionally correct, politically deaf. Young women notice.\",\"type\":\"paragraph\"}},\"sp_negotiations.party_offer\":{\"id\":\"sp_negotiations.party_offer\",\"title\":\"What does the party promise?\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_negotiations\"],\"viewIf\":{\"$code\":\"return (((Q['programme_timer'] || 0) <= 0) && ((Q['seeking_government'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['programme_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_negotiations.offer_jobs\",\"title\":\"Employment and labour rights\"},{\"id\":\"@sp_negotiations.offer_pensions\",\"title\":\"Pensions and social protection\"},{\"id\":\"@sp_negotiations.offer_institutions\",\"title\":\"Anti-corruption and institutional reform\"},{\"id\":\"@sp_negotiations.offer_territory\",\"title\":\"Constitutional and territorial reform\"},{\"id\":\"@sp_negotiations.offer_fiscal\",\"title\":\"Economic and fiscal credibility\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"What does the party promise?\"},{\"type\":\"paragraph\",\"content\":\"The talks have moved from procedure to policy. Every partner wants something different. What do you lead with?\"}]},\"sp_events.dissolution\":{\"id\":\"sp_events.dissolution\",\"title\":\"The Cortes are dissolved\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((Q['dissolution_due'] || 0)===1);\"},\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.dissolve(Q);\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The Cortes are dissolved\"},{\"type\":\"paragraph\",\"content\":[\"Eight weeks, two months, have passed since the first investiture vote without a Prime Minister being elected. The King signs the decree of dissolution. Spain will vote again in \",{\"type\":\"insert\",\"insert\":0},\" \",{\"type\":\"insert\",\"insert\":1},\".\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_year'] || 0);\"}}]}},\"sp_government.experts\":{\"id\":\"sp_government.experts\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {professionals: 2}); } Q.modernisers_dissent -= 4; Q.institutionalists_dissent += 3;\"}],\"content\":{\"content\":\"An astronaut, a judge, an economist from Brussels. The press is impressed for a week.\",\"type\":\"paragraph\"}},\"sp_leadership.comeback\":{\"id\":\"sp_leadership.comeback\",\"title\":\"The members remember\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['comeback_ready'] || 0)===1) && ((Q['backbench'] || 0)===1)) && ((Q['election_year'] || 0)===0));\"},\"options\":[{\"id\":\"@sp_leadership.comeback_run\",\"title\":\"Run in the primary\"},{\"id\":\"@sp_leadership.comeback_wait\",\"title\":\"Not yet\"},{\"id\":\"@sp_leadership.comeback_leave\",\"title\":\"Leave the PSOE for good\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The members remember\"},{\"type\":\"paragraph\",\"content\":[\"The PSOE under \",{\"type\":\"insert\",\"insert\":0},\" is sinking in the polls. Members are signing a petition for a new primary, and many of them want you on the ballot.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['psoe_leader'] || 0);\"}}]}},\"sp_party.social\":{\"id\":\"sp_party.social\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 1.5, pensioners: 1, unemployed: 1}); } Q.progressives_dissent -= 6; Q.trade_unionists_dissent -= 4; Q.modernisers_dissent += 3; Q.rel_up += 4; if (window.SpainGame) { window.SpainGame.position(Q, 1, 0); }\"}],\"content\":{\"content\":\"The left of the party is happy. The economists ask who pays.\",\"type\":\"paragraph\"}},\"sp_national.feminism\":{\"id\":\"sp_national.feminism\",\"title\":\"8 March\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return ((((Q['feminism_timer'] || 0) <= 0) && ((Q['sanchez_active'] || 0)===1)) && ((Q['year'] || 0) >= 2017));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['feminism_timer'] = 6;\"}],\"options\":[{\"id\":\"@sp_national.join\",\"title\":\"Join the strike: the PSOE is a feminist party\"},{\"id\":\"@sp_national.law\",\"title\":\"Commit to an equal pay and parental leave law\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"8 March\"},{\"type\":\"paragraph\",\"content\":\"The feminist strike is one of the largest mobilisations in Spanish history. Millions of women stop work or march.\"}]},\"sp_world.cifuentes\":{\"id\":\"sp_world.cifuentes\",\"title\":\"The master's degree\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['cifuentes_seen'] || 0)===0) && ((((((Q['year'] || 0)===2018) && ((Q['month'] || 0) >= 4))) || ((Q['year'] || 0) >= 2019)))) && ((Q['madrid_pp'] || 0)===1));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.cifuentes_seen = 1; Q.pp_scandal = (Q.pp_scandal || 0) + 1; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Madrid', 'pp', 0.95); }\"}],\"options\":[{\"id\":\"@sp_world.madrid_censure\",\"title\":\"Table a motion of no confidence in the Madrid assembly\"},{\"id\":\"@sp_world.demand_elections\",\"title\":\"Demand early elections in Madrid\"},{\"id\":\"@sp_world.universities\",\"title\":\"Make it about cleaning up the universities\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The master's degree\"},{\"type\":\"paragraph\",\"content\":\"Madrid's president, Cristina Cifuentes, turns out to have been awarded a master's degree she never studied for, with forged marks. Then a video emerges of her being stopped for shoplifting face cream years before. She resigns.\"}],\"countVisitsMax\":1},\"sp_negotiations.offer_jobs\":{\"id\":\"sp_negotiations.offer_jobs\",\"onArrival\":[{\"$code\":\"Q.rel_up += 6; Q.rel_cs -= 4; Q.trade_unionists_dissent -= 5; Q.up_talks += 0.5; if (window.SpainGame) { window.SpainGame.position(Q, 0.5, 0); }\"}],\"content\":{\"content\":\"Podemos and the unions are interested. Ciudadanos wants flexibility, not rights.\",\"type\":\"paragraph\"}},\"sp_events.general_election\":{\"id\":\"sp_events.general_election\",\"title\":\"General election\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((Q['general_election_due'] || 0)===1);\"},\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.runGeneralElection(Q);\\n}\"}],\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.renderCongress(Q, 'sp-election-result', false);\\n    window.SpainGame.renderMap(Q, 'sp-election-map');\\n    window.SpainGame.renderPollMiss(Q, 'sp-election-pollmiss');\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":[\"General election: \",{\"type\":\"insert\",\"insert\":0},\" \",{\"type\":\"insert\",\"insert\":1},\"\"]},{\"type\":\"paragraph\",\"content\":\"Vote share, seats and seat share, with the change since the previous election.\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-election-result\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"insert\",\"insert\":2},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-election-pollmiss\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-election-map\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":\"The campaign cost the party 4 in funds.\"}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['year'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_verdict'] || 0);\"}}]}},\"sp_government.tax_reform\":{\"id\":\"sp_government.tax_reform\",\"title\":\"Tax reform\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_government\"],\"viewIf\":{\"$code\":\"return (((Q['psoe_in_government'] || 0)===1) && ((Q['tax_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['tax_timer'] = 12;\"}],\"options\":[{\"id\":\"@sp_government.corporate\",\"title\":\"A minimum corporate tax rate for large companies (deficit −0.3)\"},{\"id\":\"@sp_government.wealth\",\"title\":\"A tax on large fortunes and a levy on banks (deficit −0.4)\"},{\"id\":\"@sp_government.green\",\"title\":\"Green taxes on fuel and flights (deficit −0.2)\"},{\"id\":\"@sp_government.tax_cut\",\"title\":\"Cut income tax for low earners (deficit +0.3)\"},{\"id\":\"@easy_discard\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Tax reform\"},{\"type\":\"paragraph\",\"content\":[\"The government's deficit is \",{\"type\":\"insert\",\"insert\":0},\"% of GDP, with public debt at \",{\"type\":\"insert\",\"insert\":1},\"%. The Treasury proposes options.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['deficit_text'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['debt'] || 0);\"}}]}},\"sp_leadership.comeback_run\":{\"id\":\"sp_leadership.comeback_run\",\"onArrival\":[{\"$code\":\"var b = Q.backbench_since; window.SpainGame.leadershipElection(Q, 4); if (!Q.primary_won) { Q.backbench = 1; Q.backbench_since = b; Q.comeback_next = Q.time + 24; }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Pedro Sánchez is Secretary-General of the PSOE again. The barons who threw you out will have to work with you. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":2},\" holds on. The members were tempted, not convinced.\"],\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['primary_won'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['primary_won'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['psoe_leader'] || 0);\"}}]}},\"sp_party.federal\":{\"id\":\"sp_party.federal\",\"onArrival\":[{\"$code\":\"Q.federal_proposal = 1; Q.rel_erc += 4; Q.rel_pnv += 4; Q.regional_leaders_dissent += 4; Q.institutionalists_dissent -= 2; Q.cat_dialogue += 1; if (window.SpainGame) { window.SpainGame.position(Q, 0, 0.8); }\"}],\"content\":{\"content\":\"The Granada Declaration becomes a programme. The barons support it in principle and fear it in practice.\",\"type\":\"paragraph\"}},\"sp_national.join\":{\"id\":\"sp_national.join\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {students: 2, professionals: 2, homemakers: 1, workers: 1}); } Q.rel_up += 3; Q.progressives_dissent -= 3; if (window.SpainGame) { window.SpainGame.position(Q, 0, 1.2); }\"}],\"content\":{\"content\":\"The images of the PSOE leadership in the march travel far. Vox calls it \\\"gender ideology\\\".\",\"type\":\"paragraph\"}},\"sp_world.madrid_censure\":{\"id\":\"sp_world.madrid_censure\",\"onArrival\":[{\"$code\":\"Q.rel_cs -= 3; Q.rel_up += 3; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Madrid', 'psoe', 1.03); }\"}],\"content\":{\"content\":\"Ciudadanos refuses to back it, and the PP keeps Madrid. But voters saw who tried.\",\"type\":\"paragraph\"}},\"sp_negotiations.offer_pensions\":{\"id\":\"sp_negotiations.offer_pensions\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 3;\\nQ['rel_pnv'] = (Q['rel_pnv'] || 0) + 2;\\nQ['rel_cc'] = (Q['rel_cc'] || 0) + 2;\\nQ['trade_unionists_dissent'] = (Q['trade_unionists_dissent'] || 0) - 3;\"}],\"content\":{\"content\":\"Nobody objects to pensions. Nobody is won over by them either.\",\"type\":\"paragraph\"}},\"sp_events.regional_elections\":{\"id\":\"sp_events.regional_elections\",\"title\":\"Regional elections\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((Q['has_regional_elections'] || 0)===1);\"},\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.runDueRegionalElections(Q);\\n}\"}],\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.renderMap(Q, 'sp-regional-map');\\n    window.SpainGame.renderRegionalResults(Q, 'sp-regional-results');\\n}\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Regional elections\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-regional-map\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-regional-results\\\"></div>\"}}]},\"sp_government.corporate\":{\"id\":\"sp_government.corporate\",\"onArrival\":[{\"$code\":\"Q.fiscal_adj -= 0.3; Q.rel_up += 4; Q.rel_cs -= 4; Q.rel_pnv -= 2; Q.progressives_dissent -= 3; if (window.SpainGame) { window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, 0.8, 0); } if (window.SpainGame) { window.SpainGame.econ(Q, -0.05, 0); }\"}],\"content\":{\"content\":\"The IBEX-35 companies grumble; the public mostly approves.\",\"type\":\"paragraph\"}},\"sp_leadership.comeback_wait\":{\"id\":\"sp_leadership.comeback_wait\",\"onArrival\":[{\"$code\":\"Q['comeback_next'] = ((Q['time'] || 0) + 6);\"}],\"content\":{\"content\":\"You let them sign. The longer they wait, the louder they will ask.\",\"type\":\"paragraph\"}},\"sp_party.modern\":{\"id\":\"sp_party.modern\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {professionals: 2, students: 1.5}); } Q.modernisers_dissent -= 6; Q.rel_cs += 3; if (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0.3); }\"}],\"content\":{\"content\":\"The PSOE as a party of the future, at least on paper.\",\"type\":\"paragraph\"}},\"sp_national.law\":{\"id\":\"sp_national.law\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 1.5, homemakers: 1.5, professionals: 1}); } Q.equality_law = 1; Q.modernisers_dissent -= 3; if (window.SpainGame) { window.SpainGame.position(Q, 0, 0.6); }\"}],\"content\":{\"content\":\"Less spectacular, more concrete: equal paternity and maternity leave becomes a flagship promise.\",\"type\":\"paragraph\"}},\"sp_world.demand_elections\":{\"id\":\"sp_world.demand_elections\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Madrid', 'psoe', 1.02); window.SpainGame.regionalMod(Q, 'Madrid', 'cs', 1.03); }\"}],\"content\":{\"content\":\"Ciudadanos agrees in principle and abstains in practice.\",\"type\":\"paragraph\"}},\"sp_negotiations.offer_institutions\":{\"id\":\"sp_negotiations.offer_institutions\",\"onArrival\":[{\"$code\":\"Q['rel_cs'] = (Q['rel_cs'] || 0) + 6;\\nQ['rel_up'] = (Q['rel_up'] || 0) + 3;\\nQ['cs_talks'] = (Q['cs_talks'] || 0) + 0.5;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 3;\"}],\"content\":{\"content\":\"Common ground with both new parties: the one subject they agree on.\",\"type\":\"paragraph\"}},\"sp_events.federal_committee\":{\"id\":\"sp_events.federal_committee\",\"title\":\"Revolt in the Federal Committee\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['revolt_possible'] || 0)===1) && ((Q['sanchez_leader'] || 0)===1)) && ((Q['revolt_round'] || 0) < (Q['formation_round'] || 0)));\"},\"onArrival\":[{\"$code\":\"Q.revolt_round = Q.formation_round || 1;\"}],\"options\":[{\"id\":\"@sp_events.fight\",\"title\":\"Fight it out in the Federal Committee\"},{\"id\":\"@sp_events.members\",\"title\":\"Resign and take your case to the members\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Revolt in the Federal Committee\"},{\"type\":\"paragraph\",\"content\":\"Half of the Federal Executive resigns at once, intending to force your fall. The critics demand a caretaker committee and an end to your strategy.\"}]},\"sp_government.wealth\":{\"id\":\"sp_government.wealth\",\"onArrival\":[{\"$code\":\"Q.fiscal_adj -= 0.4; Q.rel_up += 6; Q.rel_cs -= 8; Q.rel_pp -= 6; Q.progressives_dissent -= 5; Q.modernisers_dissent += 3; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {self_employed: -1, professionals: -0.5, workers: 0.5}); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, 2, 0); } if (window.SpainGame) { window.SpainGame.econ(Q, -0.1, 0);window.SpainGame.social(Q, 1); }\"}],\"content\":{\"content\":\"Madrid's regional government promises to cancel it on its territory. The fight over tax becomes a fight between regions.\",\"type\":\"paragraph\"}},\"sp_leadership.comeback_leave\":{\"id\":\"sp_leadership.comeback_leave\",\"onArrival\":[{\"$code\":\"Q['backbench'] = 0;\\nQ['backbench_since'] = 0;\"}],\"content\":{\"content\":\"You hand in your membership card. The question is where to go next.\",\"type\":\"paragraph\"}},\"sp_party.fiscal\":{\"id\":\"sp_party.fiscal\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {professionals: 1.5, self_employed: 1, pensioners: 0.5}); } Q.institutionalists_dissent -= 5; Q.progressives_dissent += 4; Q.rel_cs += 4; if (window.SpainGame) { window.SpainGame.position(Q, -1.2, 0); }\"}],\"content\":{\"content\":\"Brussels and the markets would approve. The members are less sure what the PSOE is for.\",\"type\":\"paragraph\"}},\"sp_national.censure\":{\"id\":\"sp_national.censure\",\"title\":\"Motion of no confidence\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return (((((Q['pp_governs'] || 0)===1) && ((Q['sanchez_leader'] || 0)===1)) && ((Q['censure_timer'] || 0) <= 0)) && ((Q['election_year'] || 0)===0));\"},\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.renderVote(Q, 'sp-censure-count', 'censure');\\n}\"}],\"options\":[{\"id\":\"@sp_national.table\",\"title\":\"Table the motion\"},{\"id\":\"@root\",\"title\":\"Not now\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Motion of no confidence\"},{\"type\":\"paragraph\",\"content\":\"A motion of no confidence must name an alternative Prime Minister, you, and needs an absolute majority: 176 yes votes. If it passes, you take office the next day, without an election. If it fails, it strengthens the government.\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"The PP holds an absolute majority on its own: no motion can pass. Tabling one would be a gesture, not a threat. \",\"predicate\":0},\"Hernando's count of a motion tabled today:\"]},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-censure-count\\\"></div>\"}}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pp_majority'] || 0)===1);\"}}]}},\"sp_world.universities\":{\"id\":\"sp_world.universities\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'students', 1.5); }\"}],\"content\":{\"content\":\"The scandal spreads to other politicians' degrees.\",\"type\":\"paragraph\"}},\"sp_negotiations.offer_territory\":{\"id\":\"sp_negotiations.offer_territory\",\"onArrival\":[{\"$code\":\"Q.rel_pnv += 6; Q.rel_erc += 6; Q.rel_junts += 4; Q.rel_cs -= 6; Q.regional_leaders_dissent += 8; Q.cat_dialogue += 1; if (window.SpainGame) { window.SpainGame.position(Q, 0, 1); }\"}],\"content\":{\"content\":\"The nationalists listen. So do the barons, with alarm.\",\"type\":\"paragraph\"}},\"sp_events.fight\":{\"id\":\"sp_events.fight\",\"onArrival\":[{\"$code\":\"Q.committee_won = (Q.federal_committee_balance + Q.member_morale / 5 >= 55) ? 1 : 0;\\nif (Q.committee_won) {\\n    Q.sanchez_authority += 10; Q.regional_leaders_dissent -= 10; Q.federal_committee_balance += 5;\\n} else {\\n    Q.sanchez_leader = 0;\\n    if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {up: 0.6, cs: 0.4}, {students: 2, workers: 2, professionals: 1}); }\\n    if (Q.in_leadership_window) {\\n        Q.leadership_exception_open = 1;\\n    }\\n}\"}],\"goTo\":[{\"id\":\"sp_events.fight_won\",\"predicate\":{\"$code\":\"return ((Q['committee_won'] || 0)===1);\"}},{\"id\":\"sp_events.ousted\",\"predicate\":{\"$code\":\"return ((Q['committee_won'] || 0)===0);\"}}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_government.green\":{\"id\":\"sp_government.green\",\"onArrival\":[{\"$code\":\"Q.fiscal_adj -= 0.2; Q.rel_up += 2; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {students: 1, self_employed: -1, workers: -0.5}); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, 0, 0.3); } if (window.SpainGame) { window.SpainGame.econ(Q, -0.05, 0); }\"}],\"content\":{\"content\":\"Young urban voters approve. Truck drivers and farmers do not.\",\"type\":\"paragraph\"}},\"sp_leadership.player_line\":{\"id\":\"sp_leadership.player_line\",\"title\":\"How will your party vote?\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((((Q['exiled'] || 0)===1) && ((Q['acting'] || 0)===1)) && ((Q['election_year'] || 0)===0)) && ((Q['player_line_set'] || 0)===0)) && ((Q['formation_weeks'] || 0) >= 1));\"},\"options\":[{\"id\":\"@sp_leadership.line_right_coalition\",\"title\":{\"content\":[{\"type\":\"conditional\",\"content\":\"Stand as the right's candidate, in coalition with the PP \",\"predicate\":0},{\"type\":\"conditional\",\"content\":[\"Enter a coalition government with \",{\"type\":\"insert\",\"insert\":2},\"\"],\"predicate\":1}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_is_right_cand'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_is_right_cand'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}}]}},{\"id\":\"@sp_leadership.line_right_support\",\"title\":{\"content\":[{\"type\":\"conditional\",\"content\":\"Stand as the right's candidate, alone \",\"predicate\":0},{\"type\":\"conditional\",\"content\":[\"Support \",{\"type\":\"insert\",\"insert\":2},\" from outside\"],\"predicate\":1}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_is_right_cand'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_is_right_cand'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}}]}},{\"id\":\"@sp_leadership.line_left_coalition\",\"title\":\"Enter a coalition government with the PSOE\"},{\"id\":\"@sp_leadership.line_left_support\",\"title\":\"Support the PSOE's candidate from outside, abstain on the right's\"},{\"id\":\"@sp_leadership.line_abstain\",\"title\":\"Abstain on every candidate\"},{\"id\":\"@sp_leadership.line_against\",\"title\":\"Vote against every candidate and force new elections\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":[\"How will \",{\"type\":\"insert\",\"insert\":0},\" vote?\"]},{\"type\":\"paragraph\",\"content\":[\"Congress is hung. \",{\"type\":\"conditional\",\"content\":\"As the largest party of the right, you are the right's candidate; \",\"predicate\":1},{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":3},\" is the right's candidate; \"],\"predicate\":2},\" \",{\"type\":\"insert\",\"insert\":4},\" leads the PSOE. With \",{\"type\":\"insert\",\"insert\":5},\" deputies, \",{\"type\":\"insert\",\"insert\":6},\" has to choose. \",{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"conditional\",\"content\":\"Your party is bigger than the PSOE: the left's candidate would be you. \",\"predicate\":8},\"\"],\"predicate\":7}]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['my_party'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_is_right_cand'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_is_right_cand'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['psoe_leader'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['player_seats'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['my_party'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_is_ps'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_seats'] || 0) > (Q['congress_psoe_seats'] || 0));\"}}]}},\"sp_party.agrupaciones\":{\"id\":\"sp_party.agrupaciones\",\"title\":\"The local branches\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((Q['membership_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['membership_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_party.tour\",\"title\":\"Tour the branches in your own car\"},{\"id\":\"@sp_party.reform_party\",\"title\":\"Promise more power for the members: primaries for every candidacy\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The local branches\"},{\"type\":\"paragraph\",\"content\":\"The PSOE has nearly 190,000 members in thousands of local branches. You could spend a month among them.\"}]},\"sp_national.table\":{\"id\":\"sp_national.table\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.censure_timer = 6;\\nif (window.SpainGame) { window.SpainGame.holdCensure(Q); }\\nif (Q.censure_passed) {\\n    Q.sanchez_authority += 20; Q.member_morale += 15; Q.sanchismo += 15; Q.federal_committee_balance += 10;\\n} else {\\n    Q.sanchez_authority -= 10; Q.member_morale -= 5; Q.rel_pp -= 10;\\n}\"}],\"goTo\":[{\"id\":\"sp_national.censure_won\",\"predicate\":{\"$code\":\"return ((Q['censure_passed'] || 0)===1);\"}},{\"id\":\"sp_national.censure_lost\",\"predicate\":{\"$code\":\"return ((Q['censure_passed'] || 0)===0);\"}}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_world.aquarius\":{\"id\":\"sp_world.aquarius\",\"title\":\"The Aquarius\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['aquarius_seen'] || 0)===0) && ((((((Q['year'] || 0)===2018) && ((Q['month'] || 0) >= 6))) || ((Q['year'] || 0) >= 2019))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['aquarius_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_world.aquarius_valencia\",\"title\":\"Offer the port of Valencia\"},{\"id\":\"@sp_world.aquarius_eu\",\"title\":\"Insist on a European solution: every country must take its share\"},{\"id\":\"@sp_world.aquarius_no\",\"title\":\"Refuse: Spain cannot become Europe's only open door\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The Aquarius\"},{\"type\":\"paragraph\",\"content\":[\"Italy's new interior minister, Matteo Salvini, closes Italian ports to the rescue ship \",{\"type\":\"emphasis-1\",\"content\":\"Aquarius\"},\", carrying 629 people picked up off Libya. Malta refuses too. The ship is drifting in the Mediterranean. \",{\"type\":\"conditional\",\"content\":\"The decision is yours. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The government hesitates, and asks the opposition what it would do.\",\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]},\"countVisitsMax\":1},\"sp_negotiations.offer_fiscal\":{\"id\":\"sp_negotiations.offer_fiscal\",\"onArrival\":[{\"$code\":\"Q.rel_cs += 6; Q.rel_pnv += 3; Q.rel_up -= 6; Q.cs_talks += 0.5; Q.progressives_dissent += 4; if (window.SpainGame) { window.SpainGame.position(Q, -1, 0); }\"}],\"content\":{\"content\":\"Brussels would approve. Podemos calls it austerity with a red rose.\",\"type\":\"paragraph\"}},\"sp_events.fight_won\":{\"id\":\"sp_events.fight_won\",\"title\":\"You survive\",\"content\":[{\"type\":\"heading\",\"content\":\"You survive\"},{\"type\":\"paragraph\",\"content\":\"After a day of shouting in the corridors of Ferraz, the vote goes your way. Your critics will wait for another chance.\"}]},\"sp_government.tax_cut\":{\"id\":\"sp_government.tax_cut\",\"onArrival\":[{\"$code\":\"Q.fiscal_adj += 0.3; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 1.5, homemakers: 1, pensioners: 0.5}); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0); } if (window.SpainGame) { window.SpainGame.econ(Q, 0.15, -0.1); }\"}],\"content\":{\"content\":\"Popular at home. In Brussels, someone opens a spreadsheet.\",\"type\":\"paragraph\"}},\"sp_leadership.line_right_coalition\":{\"id\":\"sp_leadership.line_right_coalition\",\"chooseIf\":{\"$code\":\"return ((Q['player_is_cs'] || 0)===1);\"},\"unavailableSubtitle\":\"Only Ciudadanos would join the right in government.\",\"onArrival\":[{\"$code\":\"Q.player_line_right = 'coalition'; Q.player_line_left = 'no'; Q.player_line_set = 1; Q.rel_pp += 5; if (window.SpainGame) { window.SpainGame.position(Q, -0.5, -0.5); }\"}],\"content\":{\"content\":\"Ministries in exchange for your votes. Your old comrades will never forgive the photograph.\",\"type\":\"paragraph\"}},\"sp_party.tour\":{\"id\":\"sp_party.tour\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q['funds'] = (Q['funds'] || 0) - 1;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) + 8;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 6;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 3;\"}],\"content\":{\"content\":\"You drive from branch to branch, sleeping in small hotels. The members who meet you do not forget it.\",\"type\":\"paragraph\"}},\"sp_national.censure_won\":{\"id\":\"sp_national.censure_won\",\"title\":\"Prime Minister\",\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Prime Minister\"},{\"type\":\"paragraph\",\"content\":[\"Yes \",{\"type\":\"insert\",\"insert\":0},\", no \",{\"type\":\"insert\",\"insert\":1},\", abstentions \",{\"type\":\"insert\",\"insert\":2},\". For the first time in Spanish democracy, a motion of no confidence succeeds. Pedro Sánchez is President of the Government.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_yes'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_no'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_abstain'] || 0);\"}}]}},\"sp_world.aquarius_valencia\":{\"id\":\"sp_world.aquarius_valencia\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 6; if (window.SpainGame) { window.SpainGame.intl(Q, 'un', 6); window.SpainGame.intl(Q, 'eu', 4); window.SpainGame.intl(Q, 'south', -4); window.SpainGame.position(Q, 0, 1.2); window.SpainGame.target(Q, 'psoe', 'young', 1.5); window.SpainGame.campaign(Q, 'vox', {pensioners: 0.8, self_employed: 0.8, workers: 0.5}); } if (window.SpainGame) { window.SpainGame.migration(Q, 6);window.SpainGame.social(Q, 1); }\"}],\"content\":{\"type\":\"paragraph\",\"content\":[\"The \",{\"type\":\"emphasis-1\",\"content\":\"Aquarius\"},\" docks in Valencia to a welcome from volunteers and the world's cameras. Salvini mocks you; Vox finds a cause.\"]}},\"sp_negotiations.back_iglesias\":{\"id\":\"sp_negotiations.back_iglesias\",\"title\":\"Back Iglesias for Prime Minister?\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_negotiations\"],\"viewIf\":{\"$code\":\"return ((((Q['seeking_government'] || 0)===1) && ((Q['up_rivals_psoe'] || 0)===1)) && ((Q['iglesias_round'] || 0) < (Q['formation_round'] || 0)));\"},\"onArrival\":[{\"$code\":\"Q.iglesias_round = Q.formation_round || 1; Q.month_actions += 1;\"}],\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    Q.psoe_backs_iglesias = 'coalition';\\n    window.SpainGame.renderVote(Q, 'sp-iglesias-count', 'up');\\n    Q.psoe_backs_iglesias = 0;\\n}\"}],\"options\":[{\"id\":\"@sp_negotiations.iglesias_coalition\",\"title\":\"Back him, in a coalition with PSOE ministers\"},{\"id\":\"@sp_negotiations.iglesias_external\",\"title\":\"Back him from outside the government\"},{\"id\":\"@sp_negotiations.no_iglesias\",\"title\":\"Refuse: the PSOE does not follow Podemos\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Back Iglesias for Prime Minister?\"},{\"type\":\"paragraph\",\"content\":[\"Podemos has \",{\"type\":\"insert\",\"insert\":0},\" seats to the PSOE's \",{\"type\":\"insert\",\"insert\":1},\". Pablo Iglesias says the left's leader should be the left's largest party, and asks for the PSOE's votes. This is how his investiture would go with them:\"]},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-iglesias-count\\\"></div>\"}}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['congress_up_seats'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['congress_psoe_seats'] || 0);\"}}]}},\"sp_events.members\":{\"id\":\"sp_events.members\",\"onArrival\":[{\"$code\":\"Q['populism'] = (Q['populism'] || 0) + 1;\\nQ['sanchez_leader'] = 0;\\n if (((Q['in_leadership_window'] || 0)===1) ) { Q['leadership_exception_open'] = 1; }\"}],\"goTo\":[{\"id\":\"sp_events.ousted\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_government.foreign_tour\":{\"id\":\"sp_government.foreign_tour\",\"title\":\"Foreign policy\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_government\"],\"viewIf\":{\"$code\":\"return (((Q['psoe_in_government'] || 0)===1) && ((Q['foreign_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['foreign_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_government.tour_brussels\",\"title\":\"Brussels and Berlin: be a reliable European\"},{\"id\":\"@sp_government.tour_south\",\"title\":\"Lisbon, Rome and Athens: build a southern alliance\"},{\"id\":\"@sp_government.tour_rabat\",\"title\":\"Rabat and Algiers: secure the southern border and the gas\"},{\"id\":\"@sp_government.tour_washington\",\"title\":\"Washington and NATO: be a dependable ally\"},{\"id\":\"@sp_government.tour_un\",\"title\":\"New York: lead on climate and development at the UN\"},{\"id\":\"@root\",\"title\":\"Stay at home this month\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Foreign policy\"},{\"type\":\"paragraph\",\"content\":\"The foreign minister brings a list of capitals that want a visit, and a reminder that every trip abroad is a week not spent at home.\"}]},\"sp_leadership.line_right_support\":{\"id\":\"sp_leadership.line_right_support\",\"onArrival\":[{\"$code\":\"Q.player_line_right = 'support'; Q.player_line_left = 'no'; Q.player_line_set = 1; if (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Your deputies will vote for \",{\"type\":\"insert\",\"insert\":0},\", in exchange for a programme.\"]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}}]}},\"sp_party.reform_party\":{\"id\":\"sp_party.reform_party\",\"onArrival\":[{\"$code\":\"Q['sanchismo'] = (Q['sanchismo'] || 0) + 5;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 8;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 8;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 6;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 3;\"}],\"content\":{\"content\":\"The members cheer. The apparatus that runs the party sees the threat clearly.\",\"type\":\"paragraph\"}},\"sp_national.censure_lost\":{\"id\":\"sp_national.censure_lost\",\"title\":\"The motion fails\",\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The motion fails\"},{\"type\":\"paragraph\",\"content\":[\"Yes \",{\"type\":\"insert\",\"insert\":0},\", no \",{\"type\":\"insert\",\"insert\":1},\", abstentions \",{\"type\":\"insert\",\"insert\":2},\". The government survives, and its ministers thank you for the show of strength.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_yes'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_no'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_abstain'] || 0);\"}}]}},\"sp_world.aquarius_eu\":{\"id\":\"sp_world.aquarius_eu\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 3); window.SpainGame.intl(Q, 'south', 2); }\"}],\"content\":{\"content\":\"Brussels convenes a summit. The ship waits another week.\",\"type\":\"paragraph\"}},\"sp_negotiations.iglesias_coalition\":{\"id\":\"sp_negotiations.iglesias_coalition\",\"onArrival\":[{\"$code\":\"Q.psoe_backs_iglesias = 'coalition';\\nif (window.SpainGame) { window.SpainGame.holdInvestiture(Q, 'up'); }\\nQ.iglesias_result = Q.inv_passes ? 1 : 0;\\nQ.sanchez_authority -= 10; Q.regional_leaders_dissent += 25; Q.institutionalists_dissent += 15; Q.progressives_dissent -= 10; Q.rel_up += 15; Q.rel_cs -= 15;\\nif (window.SpainGame) { window.SpainGame.position(Q, 2, 1); }\\nif (!Q.inv_passes) { Q.psoe_backs_iglesias = 0; }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Pablo Iglesias is invested Prime Minister. The PSOE enters a coalition as junior partner, with a vice-presidency and ministries. Half your party is appalled; the other half wonders whether you have saved the left or surrendered it. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Even with your votes, Iglesias falls short. The two-month clock is running.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['iglesias_result'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['iglesias_result'] || 0)===0);\"}}]}},\"sp_events.ousted\":{\"id\":\"sp_events.ousted\",\"title\":\"Sánchez falls\",\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Sánchez falls\"},{\"type\":\"paragraph\",\"content\":[\"You are no longer Secretary-General. \",{\"type\":\"conditional\",\"content\":\"A caretaker committee takes over Ferraz. Your seat in Congress, your car, your office: all gone. But the members have not spoken yet, and the next primary is due in May 2017.\",\"predicate\":0}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['leadership_exception_open'] || 0)===1);\"}}]}},\"sp_government.tour_brussels\":{\"id\":\"sp_government.tour_brussels\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 6); window.SpainGame.intl(Q, 'south', -1); } Q.sanchez_authority += 1;\"}],\"content\":{\"content\":\"The Commission sees a government it can work with. Brussels will be more patient with the deficit.\",\"type\":\"paragraph\"}},\"sp_leadership.line_left_coalition\":{\"id\":\"sp_leadership.line_left_coalition\",\"chooseIf\":{\"$code\":\"return ((Q['player_is_cs'] || 0)===0);\"},\"unavailableSubtitle\":\"Ciudadanos will not sit in a cabinet with the PSOE.\",\"onArrival\":[{\"$code\":\"Q.player_line_left = 'coalition'; Q.player_line_right = 'no'; Q.player_line_set = 1; Q.rel_psoe = (Q.rel_psoe || 20) + 5;\"}],\"content\":{\"content\":\"You offer the PSOE a coalition. The irony is not lost on anyone.\",\"type\":\"paragraph\"}},\"sp_party.fundraising\":{\"id\":\"sp_party.fundraising\",\"title\":\"Party finances\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((Q['fundraising_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['fundraising_timer'] = 4;\"}],\"options\":[{\"id\":\"@sp_party.donors\",\"title\":\"A dinner with business donors (+3)\"},{\"id\":\"@sp_party.microdonations\",\"title\":\"An online appeal to members and sympathisers (+2)\"},{\"id\":\"@sp_party.bank_loan\",\"title\":\"A bank loan against future subsidies (+4, lower income for a year)\"},{\"id\":\"@easy_discard\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Party finances\"},{\"type\":\"paragraph\",\"content\":[\"The party treasurer reports funds of \",{\"type\":\"insert\",\"insert\":0},\". Campaigns cost money, and the next one is never far away.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['funds_display'] || 0);\"}}]}},\"sp_national.campaign_ads\":{\"id\":\"sp_national.campaign_ads\",\"title\":\"Campaign ads\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return (((Q['ads_timer'] || 0) <= 0) && ((Q['sanchez_active'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['ads_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_national.ads_students\",\"title\":\"Students\"},{\"id\":\"@sp_national.ads_young\",\"title\":\"Young people\"},{\"id\":\"@sp_national.ads_pensioners\",\"title\":\"Pensioners\"},{\"id\":\"@sp_national.ads_working\",\"title\":\"The working class\"},{\"id\":\"@sp_national.ads_middle\",\"title\":\"The middle class\"},{\"id\":\"@sp_national.ads_women\",\"title\":\"Women\"},{\"id\":\"@sp_national.ads_unemployed\",\"title\":\"The unemployed\"},{\"id\":\"@sp_national.ads_rural\",\"title\":\"Rural Spain\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Campaign ads\"},{\"type\":\"paragraph\",\"content\":\"The agency has a TV, radio and online campaign ready. It costs 2 in party funds, and it can be aimed at one audience. Who is it for?\"}]},\"sp_world.aquarius_no\":{\"id\":\"sp_world.aquarius_no\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent += 10; Q.rel_up -= 8; if (window.SpainGame) { window.SpainGame.intl(Q, 'un', -6); window.SpainGame.intl(Q, 'south', 3); window.SpainGame.position(Q, 0, -1); window.SpainGame.transfer(Q, 'psoe', 'up', {students: 1.5, professionals: 1}); } if (window.SpainGame) { window.SpainGame.migration(Q, -2);window.SpainGame.social(Q, -1); }\"}],\"content\":{\"content\":\"Salvini praises Spain. Your own members do not.\",\"type\":\"paragraph\"}},\"sp_negotiations.iglesias_external\":{\"id\":\"sp_negotiations.iglesias_external\",\"onArrival\":[{\"$code\":\"Q.psoe_backs_iglesias = 'external';\\nif (window.SpainGame) { window.SpainGame.holdInvestiture(Q, 'up'); }\\nQ.iglesias_result = Q.inv_passes ? 1 : 0;\\nQ.sanchez_authority -= 6; Q.regional_leaders_dissent += 18; Q.institutionalists_dissent += 10; Q.rel_up += 8;\\nif (window.SpainGame) { window.SpainGame.position(Q, 1, 0.5); }\\nif (!Q.inv_passes) { Q.psoe_backs_iglesias = 0; }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Iglesias governs alone, with the PSOE's votes from the opposition benches. Every law will need you; every failure will be shared. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Even with your votes, Iglesias falls short. The two-month clock is running.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['iglesias_result'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['iglesias_result'] || 0)===0);\"}}]}},\"sp_events.primary\":{\"id\":\"sp_events.primary\",\"title\":\"The primary\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['leadership_exception_open'] || 0)===1) && ((((((Q['year'] || 0)===2017) && ((Q['month'] || 0) >= 5))) || ((Q['year'] || 0) >= 2018))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.primary_won = (Q.member_morale + Q.sanchismo / 2 >= 60) ? 1 : 0;\\nQ.leadership_exception_open = 0;\\nif (Q.primary_won) {\\n    Q.sanchez_leader = 1; Q.sanchez_authority = 70; Q.sanchismo += 20; Q.member_morale += 10;\\n    Q.federal_committee_balance = 60;\\n    Q.red_lines = 0;\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The primary\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"The members vote, and they vote for you. Against the barons, the elders and the apparatus, Pedro Sánchez is Secretary-General again. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The members vote, and they do not vote for you.\",\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['primary_won'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['primary_won'] || 0)===0);\"}}]},\"countVisitsMax\":1},\"sp_government.tour_south\":{\"id\":\"sp_government.tour_south\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'south', 7); window.SpainGame.intl(Q, 'eu', 1); }\"}],\"content\":{\"content\":\"Costa, the Italian prime minister and the Greek prime minister sign a joint letter on fiscal rules. Together, the south carries weight in the Council.\",\"type\":\"paragraph\"}},\"sp_leadership.line_left_support\":{\"id\":\"sp_leadership.line_left_support\",\"onArrival\":[{\"$code\":\"Q.player_line_left = 'support'; Q.player_line_right = 'abstain'; Q.player_line_set = 1;\"}],\"content\":{\"content\":\"Support for the PSOE's candidate, without joining the government.\",\"type\":\"paragraph\"}},\"sp_party.donors\":{\"id\":\"sp_party.donors\",\"onArrival\":[{\"$code\":\"Q['funds'] = (Q['funds'] || 0) + 3;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 2;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) + 4;\\nQ['member_morale'] = (Q['member_morale'] || 0) - 2;\"}],\"content\":{\"content\":\"The cheques arrive. So do questions from the left of the party about who the PSOE listens to.\",\"type\":\"paragraph\"}},\"sp_national.ads_students\":{\"id\":\"sp_national.ads_students\",\"title\":\"Students\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 2);\"},\"unavailableSubtitle\":\"Not enough party funds (needs 2).\",\"onArrival\":[{\"$code\":\"Q.funds -= 2; Q.modernisers_dissent -= 1; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'students', 4); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The ads run for three weeks, aimed at students. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.nato_two_percent\":{\"id\":\"sp_world.nato_two_percent\",\"title\":\"Two per cent\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['nato_two_seen'] || 0)===0) && ((((((Q['year'] || 0)===2018) && ((Q['month'] || 0) >= 7))) || ((Q['year'] || 0) >= 2019))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['nato_two_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_world.nato_commit\",\"title\":\"Commit to a path towards 2%\"},{\"id\":\"@sp_world.nato_gradual\",\"title\":\"Promise gradual increases, with no date\"},{\"id\":\"@sp_world.nato_refuse\",\"title\":\"Refuse: Spain's priority is its welfare state\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Two per cent\"},{\"type\":\"paragraph\",\"content\":\"At the NATO summit in Brussels, President Trump demands that every ally spend 2% of GDP on defence, and singles out the laggards. Spain spends 0.9%, among the lowest in the alliance.\"}],\"countVisitsMax\":1},\"sp_negotiations.no_iglesias\":{\"id\":\"sp_negotiations.no_iglesias\",\"onArrival\":[{\"$code\":\"Q.rel_up -= 10; Q.regional_leaders_dissent -= 6; Q.progressives_dissent += 6;\"}],\"content\":{\"content\":\"The PSOE will lead or it will not govern. Iglesias calls it arrogance.\",\"type\":\"paragraph\"}},\"sp_negotiations\":{\"id\":\"sp_negotiations\",\"type\":\"scene\",\"title\":\"The negotiating team\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_negotiations\"],\"viewIf\":{\"$code\":\"return (((Q['negotiations_timer'] || 0) <= 0) && ((Q['seeking_government'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['negotiations_timer'] = 1;\"}],\"options\":[{\"id\":\"@sp_negotiations.podemos\",\"title\":\"Podemos: work towards a government agreement\"},{\"id\":\"@sp_negotiations.cs\",\"title\":\"Ciudadanos: work towards a reform agreement\"},{\"id\":\"@sp_negotiations.both\",\"title\":\"Both at once: try for a three-way arrangement\"},{\"id\":\"@sp_negotiations.pnv_cc\",\"title\":\"The PNV and Coalición Canaria\"},{\"id\":\"@sp_negotiations.catalans\",\"title\":\"Sound out ERC and Convergència\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The negotiating team\"},{\"type\":\"paragraph\",\"content\":\"Antonio Hernando, Meritxell Batet, José Enrique Serrano, Jordi Sevilla, Rodolfo Ares and María Luisa Carcedo wait for instructions. Who do they sit down with this month?\"}]},\"sp_events.deadlock_vote\":{\"id\":\"sp_events.deadlock_vote\",\"title\":\"The King forces a vote\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((((Q['acting'] || 0)===1) && ((Q['investiture_votes'] || 0)===0)) && ((Q['election_year'] || 0)===0)) && ((Q['formation_weeks'] || 0) >= 16)) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.holdInvestiture(Q, Q.right_candidate || 'pp');\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The King forces a vote\"},{\"type\":\"paragraph\",\"content\":[\"Months have passed without a candidate facing the chamber, and without a first vote the constitutional clock cannot start. The King proposes \",{\"type\":\"insert\",\"insert\":0},\" once more, and this time the vote goes ahead.\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"He loses it. The two-month clock has started: if no one is invested, the Cortes will be dissolved and Spain will vote again. \",\"predicate\":1},{\"type\":\"conditional\",\"content\":\"He wins it. Spain has a government.\",\"predicate\":2}]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['acting'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['acting'] || 0)===0);\"}}]}},\"sp_government.tour_rabat\":{\"id\":\"sp_government.tour_rabat\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'maghreb', 7); } Q.progressives_dissent += 1;\"}],\"content\":{\"content\":\"Cooperation on migration improves. Human rights groups ask what was promised in return.\",\"type\":\"paragraph\"}},\"sp_leadership.line_abstain\":{\"id\":\"sp_leadership.line_abstain\",\"onArrival\":[{\"$code\":\"Q.player_line_left = 'abstain'; Q.player_line_right = 'abstain'; Q.player_line_set = 1;\"}],\"content\":{\"content\":\"Your deputies will abstain and let the others decide.\",\"type\":\"paragraph\"}},\"sp_party.microdonations\":{\"id\":\"sp_party.microdonations\",\"onArrival\":[{\"$code\":\"Q['funds'] = (Q['funds'] || 0) + 2;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) + 3;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 3;\"}],\"content\":{\"content\":\"Thousands of small donations. The members feel the party is theirs.\",\"type\":\"paragraph\"}},\"sp_national.ads_young\":{\"id\":\"sp_national.ads_young\",\"title\":\"Young people\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 2);\"},\"unavailableSubtitle\":\"Not enough party funds (needs 2).\",\"onArrival\":[{\"$code\":\"Q.funds -= 2; Q.modernisers_dissent -= 1; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'young', 4); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The ads run for three weeks, aimed at young people. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.nato_commit\":{\"id\":\"sp_world.nato_commit\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent += 8; Q.rel_up -= 8; if (window.SpainGame) { window.SpainGame.intl(Q, 'nato', 10); window.SpainGame.intl(Q, 'us', 8); window.SpainGame.position(Q, -0.5, 0); } if (Q.psoe_in_government) { Q.fiscal_adj += 0.2; }\"}],\"content\":{\"content\":\"Washington is pleased. Podemos calls it a militarist budget.\",\"type\":\"paragraph\"}},\"sp_events.morning_after\":{\"id\":\"sp_events.morning_after\",\"title\":\"The morning after\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['elections_held'] || 0) >= 1) && ((Q['morning_seen'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q['morning_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_events.responsible\",\"title\":{\"content\":[\"The responsible opposition: no to \",{\"type\":\"insert\",\"insert\":0},\", no promises yet\"],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_leader_short'] || 0);\"}}]}},{\"id\":\"@sp_events.alternative\",\"title\":\"An alternative government: announce talks for a change of government\"},{\"id\":\"@sp_events.stability\",\"title\":\"Institutional stability: explore whether any agreement with the PP is possible\"}],\"content\":[{\"type\":\"heading\",\"content\":\"21 December 2015 — The morning after\"},{\"type\":\"paragraph\",\"content\":\"The results are in. Your senior team gathers at Ferraz. The party faces two opposite accusations: that it will rescue the PP, or that it will hand the country to Podemos. Regional presidents, former leaders and the parliamentary group all have their own ideas about what you should do next.\"},{\"type\":\"paragraph\",\"content\":\"How do you position the PSOE this morning?\"}]},\"sp_government.tour_washington\":{\"id\":\"sp_government.tour_washington\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'us', 6); window.SpainGame.intl(Q, 'nato', 4); } Q.rel_up -= 2;\"}],\"content\":{\"content\":\"The bases at Rota and Morón are mentioned warmly. Podemos is less warm.\",\"type\":\"paragraph\"}},\"sp_leadership.line_against\":{\"id\":\"sp_leadership.line_against\",\"onArrival\":[{\"$code\":\"Q.player_line_left = 'no'; Q.player_line_right = 'no'; Q.player_line_set = 1; Q.populism += 1;\"}],\"content\":{\"content\":\"No to everyone. If nobody else can count to 176, Spain will vote again.\",\"type\":\"paragraph\"}},\"sp_party.bank_loan\":{\"id\":\"sp_party.bank_loan\",\"onArrival\":[{\"$code\":\"Q['funds'] = (Q['funds'] || 0) + 4;\\nQ['loan_months'] = 12;\"}],\"content\":{\"content\":\"The bank is happy to lend to a party with a guaranteed state subsidy. The interest will come out of future income.\",\"type\":\"paragraph\"}},\"sp_national.ads_pensioners\":{\"id\":\"sp_national.ads_pensioners\",\"title\":\"Pensioners\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 2);\"},\"unavailableSubtitle\":\"Not enough party funds (needs 2).\",\"onArrival\":[{\"$code\":\"Q.funds -= 2; Q.institutionalists_dissent -= 1; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'pensioners', 4); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The ads run for three weeks, aimed at pensioners. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.nato_gradual\":{\"id\":\"sp_world.nato_gradual\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'nato', 3); window.SpainGame.intl(Q, 'us', 1); }\"}],\"content\":{\"content\":\"A promise everyone knows how to read.\",\"type\":\"paragraph\"}},\"sp_events.responsible\":{\"id\":\"sp_events.responsible\",\"onArrival\":[{\"$code\":\"Q['posture'] = 1;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 3;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Refusing to back \",{\"type\":\"insert\",\"insert\":0},\" while keeping every other door open reassures anti-PP voters and most of the party. Your critics will call it indecision.\"]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_leader_short'] || 0);\"}}]}},\"sp_government.tour_un\":{\"id\":\"sp_government.tour_un\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'un', 7); window.SpainGame.target(Q, 'psoe', 'young', 0.5); }\"}],\"content\":{\"content\":\"A speech on the 2030 Agenda earns applause in New York and a few headlines at home.\",\"type\":\"paragraph\"}},\"sp_government\":{\"id\":\"sp_government\",\"type\":\"scene\",\"title\":\"The budget\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_government\"],\"viewIf\":{\"$code\":\"return (((Q['psoe_in_government'] || 0)===1) && ((Q['budget_timer'] || 0) <= 0));\"},\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.renderVote(Q, 'sp-budget-count', 'budget');\\n}\"}],\"options\":[{\"id\":\"@sp_government.present\",\"title\":\"Present the budget to Congress\"},{\"id\":\"@root\",\"title\":\"Not yet\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The budget\"},{\"type\":\"paragraph\",\"content\":\"Without a budget of your own, the government lives on its predecessor's spending plans. María Jesús Montero has a draft ready. This is the likely vote:\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-budget-count\\\"></div>\"}}]},\"sp_leadership.auto_government\":{\"id\":\"sp_leadership.auto_government\",\"title\":\"A government is formed\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((Q['auto_formed'] || 0)===1);\"},\"onArrival\":[{\"$code\":\"Q['auto_formed'] = 0;\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"A government is formed\"},{\"type\":\"paragraph\",\"content\":[\"Congress invests \",{\"type\":\"insert\",\"insert\":0},\". Spain has a \",{\"type\":\"insert\",\"insert\":1},\". \",{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":3},\" is in government. \"],\"predicate\":2},{\"type\":\"conditional\",\"content\":\"Pedro Sánchez is Prime Minister.\",\"predicate\":4}]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pm'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['government_type'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['player_in_government'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['my_party'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['sanchez_pm'] || 0)===1);\"}}]}},\"sp_party.public\":{\"id\":\"sp_party.public\",\"title\":\"Public ownership: a public bank and a public energy company\",\"subtitle\":\"Popular with workers; liberals and the moderate middle class will run.\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 8; Q.trade_unionists_dissent -= 4; Q.modernisers_dissent += 8; Q.institutionalists_dissent += 6; Q.rel_up += 6; Q.rel_cs -= 10; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'working', 3); window.SpainGame.target(Q, 'psoe', 'unemployed', 2); window.SpainGame.position(Q, 3, 0); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"Bankia, rescued with public money, could stay public. The electricity companies' profits could fund lower bills. The left cheers; the IBEX-35, Ciudadanos and the business press warn of \\\"Venezuela\\\".\",\"type\":\"paragraph\"}},\"sp_national.ads_working\":{\"id\":\"sp_national.ads_working\",\"title\":\"The working class\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 2);\"},\"unavailableSubtitle\":\"Not enough party funds (needs 2).\",\"onArrival\":[{\"$code\":\"Q.funds -= 2; Q.trade_unionists_dissent -= 2; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'working', 4); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The ads run for three weeks, aimed at the working class. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.nato_refuse\":{\"id\":\"sp_world.nato_refuse\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 5; Q.rel_up += 4; if (window.SpainGame) { window.SpainGame.intl(Q, 'nato', -8); window.SpainGame.intl(Q, 'us', -10); window.SpainGame.position(Q, 0.5, 0); }\"}],\"content\":{\"content\":\"Trump names Spain in a tweet. The left applauds.\",\"type\":\"paragraph\"}},\"sp_events.alternative\":{\"id\":\"sp_events.alternative\",\"onArrival\":[{\"$code\":\"Q.posture = 2; Q.rel_up += 10; Q.rel_cs -= 6; Q.member_morale += 7; Q.progressives_dissent -= 5; Q.regional_leaders_dissent += 8; Q.institutionalists_dissent += 4; Q.sanchez_authority += 3; if (window.SpainGame) { window.SpainGame.transfer(Q, 'up', 'psoe', {workers: 1, students: 1}); window.SpainGame.transfer(Q, 'psoe', 'cs', {pensioners: 0.5, self_employed: 0.5}); } if (window.SpainGame) { window.SpainGame.position(Q, 0.8, 0); }\"}],\"content\":{\"content\":\"The members are energised. In Seville, Toledo and Mérida, regional presidents read the announcement with alarm.\",\"type\":\"paragraph\"}},\"sp_leadership.pp_leader_falls\":{\"id\":\"sp_leadership.pp_leader_falls\",\"title\":\"The PP changes leader\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['pp_leader_falls_due'] || 0)===1) && ((Q['election_year'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"window.SpainGame.choosePPLeader(Q);\"}],\"options\":[{\"id\":\"@sp_leadership.pp_pact\",\"title\":\"Offer the new leader a State pact on pensions and Catalonia\"},{\"id\":\"@sp_leadership.pp_same\",\"title\":\"\\\"Same PP, new face\\\": tie them to the corruption of the past\"},{\"id\":\"@sp_leadership.pp_wait\",\"title\":\"Watch and wait\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The PP changes leader\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"insert\",\"insert\":0},\" has lost \",{\"type\":\"conditional\",\"content\":\"the government \",\"predicate\":1},{\"type\":\"conditional\",\"content\":\"the party's confidence \",\"predicate\":2},\", and the PP will not forgive it. After weeks of pressure from the regional barons, \",{\"type\":\"insert\",\"insert\":3},\" resigns. The party congress chooses \",{\"type\":\"insert\",\"insert\":4},\".\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"The new leader promises to recover the voters who left for Vox: a harder line on Catalonia, on taxes and on immigration. Vox's leaders smile; the PNV stops returning calls. \",\"predicate\":5},{\"type\":\"conditional\",\"content\":\"The new leader promises a calmer, more centrist PP, open to State pacts. Ciudadanos's voters start coming home; Vox calls it the \\\"cowardly right\\\".\",\"predicate\":6}]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_old_leader'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pm_is_pp'] || 0)===0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pm_is_pp'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_old_leader'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pp_leader'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pp_style_hard'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pp_style_moderate'] || 0)===1);\"}}]}},\"sp_party.dues\":{\"id\":\"sp_party.dues\",\"title\":\"Party dues\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((Q['dues_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['dues_timer'] = 6;\"}],\"options\":[{\"id\":\"@sp_party.dues_raise\",\"title\":\"Raise the dues\"},{\"id\":\"@sp_party.dues_cut\",\"title\":\"Cut the dues\"},{\"id\":\"@root\",\"title\":\"Leave them as they are\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Party dues\"},{\"type\":\"paragraph\",\"content\":[\"The treasurer presents the accounts. Members pay \",{\"type\":\"conditional\",\"content\":\"the standard dues \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"more than the standard dues \",\"predicate\":1},{\"type\":\"conditional\",\"content\":\"less than the standard dues \",\"predicate\":2},\". Income this month: \",{\"type\":\"insert\",\"insert\":3},\" after running costs, which rise every year.\"]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['dues_level'] || 0)===0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['dues_level'] || 0) > 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['dues_level'] || 0) < 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['funds_income'] || 0);\"}}]}},\"sp_national.ads_middle\":{\"id\":\"sp_national.ads_middle\",\"title\":\"The middle class\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 2);\"},\"unavailableSubtitle\":\"Not enough party funds (needs 2).\",\"onArrival\":[{\"$code\":\"Q.funds -= 2; Q.modernisers_dissent -= 2; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'middle', 4); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The ads run for three weeks, aimed at the middle class. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.tariffs\":{\"id\":\"sp_world.tariffs\",\"title\":\"Trump's tariffs\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['tariffs_seen'] || 0)===0) && ((((((Q['year'] || 0)===2019) && ((Q['month'] || 0) >= 10))) || ((Q['year'] || 0) >= 2020))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.tariffs_seen = 1; Q.tariff_hit = (Q.intl && Q.intl.us < 45) ? 2 : 1; if (window.SpainGame) { window.SpainGame.econ(Q, -0.1 * Q.tariff_hit, 0.05 * Q.tariff_hit); window.SpainGame.target(Q, Q.psoe_in_government ? 'psoe' : 'pp', 'rural', -2 * Q.tariff_hit); }\"}],\"options\":[{\"id\":\"@sp_world.tariffs_eu\",\"title\":\"Answer through the EU: retaliation on American goods\"},{\"id\":\"@sp_world.tariffs_bilateral\",\"title\":\"Negotiate directly with Washington\"},{\"id\":\"@sp_world.tariffs_farmers\",\"title\":\"Compensate the farmers\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Trump's tariffs\"},{\"type\":\"paragraph\",\"content\":[\"In the Airbus dispute, Washington slaps 25% tariffs on Spanish olive oil, olives, wine and cheese. \",{\"type\":\"conditional\",\"content\":\"With relations already cold, Spain is hit harder than its neighbours. \",\"predicate\":0},\" Farmers in Andalusia and Castilla-La Mancha face ruin, and blame the government.\"]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['tariff_hit'] || 0)===2);\"}}]},\"countVisitsMax\":1},\"sp_events.stability\":{\"id\":\"sp_events.stability\",\"onArrival\":[{\"$code\":\"Q.posture = 3; Q.rel_pp += 10; Q.rel_cs += 5; Q.member_morale -= 8; Q.progressives_dissent += 8; Q.institutionalists_dissent -= 5; Q.regional_leaders_dissent -= 3; Q.sanchez_authority -= 3; if (Q.campaign_line == 1) { Q.sanchez_authority -= 4; Q.member_morale -= 6; } if (window.SpainGame) { window.SpainGame.transfer(Q, 'up', {workers: Q.campaign_line == 1 ? 2.5 : 1.5, students: 1.5, unemployed: 1}); } if (window.SpainGame) { window.SpainGame.position(Q, -0.8, 0); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Institutional voices welcome your responsibility. Among the members, the word \\\"abstention\\\" is already circulating. \",{\"type\":\"conditional\",\"content\":\"You promised in the campaign that the PSOE would never make Rajoy Prime Minister, and the members have not forgotten.\",\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['campaign_line'] || 0)===1);\"}}]}},\"sp_leadership.pp_pact\":{\"id\":\"sp_leadership.pp_pact\",\"onArrival\":[{\"$code\":\"Q.rel_pp += 8; Q.progressives_dissent += 5; if (window.SpainGame) { window.SpainGame.position(Q, -0.3, 0); }\"}],\"content\":{\"content\":\"The offer is received politely and declined politely. Moderate voters noticed it was made.\",\"type\":\"paragraph\"}},\"sp_party.dues_raise\":{\"id\":\"sp_party.dues_raise\",\"chooseIf\":{\"$code\":\"return ((Q['dues_level'] || 0) < 2);\"},\"unavailableSubtitle\":\"Dues are already at their highest.\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.dues_level += 1; Q.member_morale -= 5; Q.sanchismo -= 2; Q.trade_unionists_dissent += 3; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {up: 0.6, pp: 0.2, cs: 0.2}, {workers: 0.5, pensioners: 0.4, students: 0.4, unemployed: 0.4}); }\"}],\"content\":{\"content\":\"More money for Ferraz, and fewer members. Some of those who leave stop voting for the party too.\",\"type\":\"paragraph\"}},\"sp_national.ads_women\":{\"id\":\"sp_national.ads_women\",\"title\":\"Women\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 2);\"},\"unavailableSubtitle\":\"Not enough party funds (needs 2).\",\"onArrival\":[{\"$code\":\"Q.funds -= 2; Q.progressives_dissent -= 1; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'women', 4); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The ads run for three weeks, aimed at women. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.tariffs_eu\":{\"id\":\"sp_world.tariffs_eu\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 4); window.SpainGame.intl(Q, 'us', -6); }\"}],\"content\":{\"content\":\"Brussels prepares its list. The farmers wait.\",\"type\":\"paragraph\"}},\"sp_events.gurtel\":{\"id\":\"sp_events.gurtel\",\"title\":\"The Gürtel sentence\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['gurtel_seen'] || 0)===0) && ((((((Q['year'] || 0)===2018) && ((Q['month'] || 0) >= 5))) || ((Q['year'] || 0) >= 2019))));\"},\"onArrival\":[{\"$code\":\"Q.gurtel_seen = 1;\\nQ.pp_scandal = (Q.pp_scandal || 0) + 3;\\nif (window.SpainGame) {\\n    window.SpainGame.campaign(Q, 'pp', {pensioners: -3, professionals: -3, self_employed: -2, workers: -2, homemakers: -2});\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The Gürtel sentence\"},{\"type\":\"paragraph\",\"content\":[\"The National Court rules that the People's Party profited from the Gürtel corruption network, and finds that the PP ran a parallel accounting system for years. \",{\"type\":\"conditional\",\"content\":\"Rajoy is Prime Minister of a government whose party has just been convicted as a beneficiary of corruption. Every opposition party is asking the same question: who will table a motion of no confidence? \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The PP, out of government, takes the blow in the polls.\",\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pp_governs'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pp_governs'] || 0)===0);\"}}]}},\"sp_leadership.pp_same\":{\"id\":\"sp_leadership.pp_same\",\"onArrival\":[{\"$code\":\"Q.rel_pp -= 6; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'young', 1); }\"}],\"content\":{\"content\":\"The corruption files are reopened on every talk show.\",\"type\":\"paragraph\"}},\"sp_party.dues_cut\":{\"id\":\"sp_party.dues_cut\",\"chooseIf\":{\"$code\":\"return ((Q['dues_level'] || 0) > -2);\"},\"unavailableSubtitle\":\"Dues are already at their lowest.\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.dues_level -= 1; Q.member_morale += 4; Q.sanchismo += 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 0.3, students: 0.3, unemployed: 0.3}); }\"}],\"content\":{\"content\":\"Membership grows, especially among the young and the unemployed. The party's accounts get tighter.\",\"type\":\"paragraph\"}},\"sp_national.ads_unemployed\":{\"id\":\"sp_national.ads_unemployed\",\"title\":\"The unemployed\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 2);\"},\"unavailableSubtitle\":\"Not enough party funds (needs 2).\",\"onArrival\":[{\"$code\":\"Q.funds -= 2; Q.trade_unionists_dissent -= 1; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'unemployed', 4); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The ads run for three weeks, aimed at the unemployed. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.tariffs_bilateral\":{\"id\":\"sp_world.tariffs_bilateral\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'us', 6); window.SpainGame.intl(Q, 'eu', -3); }\"}],\"content\":{\"content\":\"A few exemptions, a lot of photographs.\",\"type\":\"paragraph\"}},\"sp_events.cat_referendum_law\":{\"id\":\"sp_events.cat_referendum_law\",\"title\":\"The referendum laws\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['cat_crisis_seen'] || 0)===0) && ((Q['catalonia_independentist'] || 0)===1)) && ((((((Q['year'] || 0)===2017) && ((Q['month'] || 0) >= 9))) || ((Q['year'] || 0) >= 2018))));\"},\"onArrival\":[{\"$code\":\"Q.cat_crisis_seen = 1; Q.catalan_crisis = 1; Q.cat_crisis_stage = 1; Q.cat_stage_time = Q.time;\\nif (window.SpainGame) { window.SpainGame.partyRel(Q, 'cs', 'erc', -5); window.SpainGame.partyRel(Q, 'cs', 'junts', -8); window.SpainGame.partyRel(Q, 'pp', 'junts', -10); window.SpainGame.partyRel(Q, 'pnv', 'junts', 5); }\\nif (window.SpainGame) {\\n    window.SpainGame.territorial(Q, 'Cataluña', 'erc', 1.1);\\n    window.SpainGame.territorial(Q, 'Cataluña', 'junts', 1.1);\\n    window.SpainGame.regionalMod(Q, 'Cataluña', 'cs', 1.25);\\n    window.SpainGame.campaign(Q, 'vox', {self_employed: 1.5, pensioners: 1, workers: 1, homemakers: 1});\\n    window.SpainGame.recalculate(Q);\\n}\"}],\"options\":[{\"id\":\"@sp_events.state\",\"title\":\"Stand with the State: the law must be enforced\"},{\"id\":\"@sp_events.both\",\"title\":\"Defend the law, and call for dialogue at the same time\"},{\"id\":\"@sp_events.talk\",\"title\":\"Insist that only negotiation can solve this\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The referendum laws\"},{\"type\":\"paragraph\",\"content\":[\"In two chaotic sessions, the Parliament of Catalonia passes a law calling a referendum on independence for 1 October and a \\\"transitional law\\\" for a new republic. The opposition walks out. The Constitutional Court suspends both laws within days. \",{\"type\":\"conditional\",\"content\":\"As Prime Minister, the response is yours to lead. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Rajoy's government asks the PSOE for unity in defence of the Constitution. \",\"predicate\":1},\"\"]},{\"type\":\"paragraph\",\"content\":[\"A new deck of cards is available: \",{\"type\":\"emphasis-2\",\"content\":\"Catalan crisis\"},\".\"]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]}},\"sp_leadership.pp_wait\":{\"id\":\"sp_leadership.pp_wait\",\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 1;\"}],\"content\":{\"content\":\"You let the new leader make the first mistakes.\",\"type\":\"paragraph\"}},\"sp_leadership\":{\"id\":\"sp_leadership\",\"type\":\"scene\",\"title\":\"Whispers in Ferraz\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((((Q['lead_rumours_due'] || 0)===1) && ((Q['lead_challenge_due'] || 0)===0)) && ((Q['lead_forced_due'] || 0)===0)) && ((Q['sanchez_leader'] || 0)===1)) && ((Q['election_year'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q['lead_stage'] = 1;\"}],\"options\":[{\"id\":\"@sp_leadership.r_ignore\",\"title\":\"Ignore it: rumours die if you do not feed them\"},{\"id\":\"@sp_leadership.r_address\",\"title\":\"Address it: meet the federations and the deputies one by one\"},{\"id\":\"@sp_leadership.r_bluff\",\"title\":\"Call their bluff: challenge the critics to say it to your face\"},{\"id\":\"@sp_leadership.r_primary\",\"title\":\"Call their bluff: call a leadership election yourself\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Whispers in Ferraz\"},{\"type\":\"paragraph\",\"content\":\"The stories start in the Madrid press: unnamed \\\"historic leaders\\\" and \\\"senior figures in the federations\\\" who doubt that Pedro Sánchez can win. Nobody puts a name to them yet. Everybody knows who they are.\"}]},\"sp_party.intl_network\":{\"id\":\"sp_party.intl_network\",\"title\":\"Socialist International and Progressive Alliance\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((Q['intl_net_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['intl_net_timer'] = 4;\"}],\"options\":[{\"id\":\"@sp_party.net_host\",\"title\":\"Host a Progressive Alliance conference in Madrid\"},{\"id\":\"@sp_party.net_labour\",\"title\":{\"content\":[\"British Labour under \",{\"type\":\"insert\",\"insert\":0}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sister_labour'] || 0);\"}}]}},{\"id\":\"@sp_party.net_portugal\",\"title\":{\"content\":[\"The Portuguese Socialists under \",{\"type\":\"insert\",\"insert\":0}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sister_portugal'] || 0);\"}}]}},{\"id\":\"@sp_party.net_denmark\",\"title\":{\"content\":[\"The Danish Social Democrats under \",{\"type\":\"insert\",\"insert\":0}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sister_denmark'] || 0);\"}}]}},{\"id\":\"@sp_party.net_germany\",\"title\":{\"content\":[\"The German SPD under \",{\"type\":\"insert\",\"insert\":0}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sister_germany'] || 0);\"}}]}},{\"id\":\"@sp_party.net_sweden\",\"title\":{\"content\":[\"The Swedish Social Democrats under \",{\"type\":\"insert\",\"insert\":0}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sister_sweden'] || 0);\"}}]}},{\"id\":\"@sp_party.net_us\",\"title\":{\"content\":[\"The US Democrats: \",{\"type\":\"insert\",\"insert\":0}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sister_us'] || 0);\"}}]}},{\"id\":\"@root\",\"title\":\"Not now\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Socialist International and Progressive Alliance\"},{\"type\":\"paragraph\",\"content\":\"The PSOE belongs to both international families of the centre-left. Party money spent there builds friendships with sister parties and the chance to learn from them. What you learn depends on who leads them now, and not every lesson helps. Studying the same leadership again teaches less each time.\"}]},\"sp_national.ads_rural\":{\"id\":\"sp_national.ads_rural\",\"title\":\"Rural Spain\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 2);\"},\"unavailableSubtitle\":\"Not enough party funds (needs 2).\",\"onArrival\":[{\"$code\":\"Q.funds -= 2; Q.regional_leaders_dissent -= 2; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'rural', 4); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The ads run for three weeks, aimed at rural Spain. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.tariffs_farmers\":{\"id\":\"sp_world.tariffs_farmers\",\"onArrival\":[{\"$code\":\"Q.regional_leaders_dissent -= 4; if (Q.psoe_in_government) { Q.fiscal_adj += 0.1; } else { Q.funds -= 1; } if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'rural', 2); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Aid reaches the cooperatives within months. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The PSOE funds a campaign tour of the olive groves and promises aid.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]}},\"sp_events.state\":{\"id\":\"sp_events.state\",\"onArrival\":[{\"$code\":\"Q['rel_cs'] = (Q['rel_cs'] || 0) + 5;\\nQ['rel_pp'] = (Q['rel_pp'] || 0) + 5;\\nQ['rel_erc'] = (Q['rel_erc'] || 0) - 15;\\nQ['rel_junts'] = (Q['rel_junts'] || 0) - 15;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 8;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) + 5;\\nQ['cat_hard_line'] = (Q['cat_hard_line'] || 0) + 1;\"}],\"content\":{\"content\":\"You stand beside the institutions. Miquel Iceta's PSC warns that the PSOE must not disappear from Catalan politics.\",\"type\":\"paragraph\"}},\"sp_party.net_host\":{\"id\":\"sp_party.net_host\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1.5);\"},\"unavailableSubtitle\":\"Needs 1.5 in party funds.\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.funds -= 1.5; Q.sanchez_authority += 2; if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 4); window.SpainGame.intl(Q, 'south', 4); window.SpainGame.intl(Q, 'us', 2); window.SpainGame.intl(Q, 'maghreb', 2); }\"}],\"content\":{\"content\":\"Delegations from forty parties fill a Madrid conference centre. You are photographed with prime ministers and future prime ministers.\",\"type\":\"paragraph\"}},\"sp_national.media_appearance\":{\"id\":\"sp_national.media_appearance\",\"title\":\"Media appearance\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return (((Q['appearance_timer'] || 0) <= 0) && ((Q['sanchez_active'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['appearance_timer'] = 1;\"}],\"options\":[{\"id\":\"@sp_national.tv\",\"title\":\"A prime-time TV interview (everyone, a little)\"},{\"id\":\"@sp_national.radio\",\"title\":\"Morning radio (pensioners and the middle class)\"},{\"id\":\"@sp_national.streamers\",\"title\":\"YouTube and streamers (young people)\"},{\"id\":\"@sp_national.morning_tv\",\"title\":\"Morning TV and women's magazines (women)\"},{\"id\":\"@sp_national.regional_press\",\"title\":\"The regional press (rural Spain)\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Media appearance\"},{\"type\":\"paragraph\",\"content\":\"Your press office has offers from every kind of outlet. Each reaches a different audience, and each costs 1 in party funds (travel, staff, production). Where do you go?\"}]},\"sp_world.mas_pais\":{\"id\":\"sp_world.mas_pais\",\"title\":\"Errejón goes his own way\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['mas_pais_seen'] || 0)===0) && ((((((Q['year'] || 0)===2019) && ((Q['month'] || 0) >= 9))) || ((Q['year'] || 0) >= 2020)))) && ((Q['up_running'] || 0)===1));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.mas_pais_seen = 1; if (window.SpainGame) { window.SpainGame.transfer(Q, 'up', 'mp', {students: 3, professionals: 2.5, workers: 1, unemployed: 1}); window.SpainGame.partyRel(Q, 'up', 'erc', -2); }\"}],\"options\":[{\"id\":\"@sp_world.errejon_welcome\",\"title\":\"Welcome a partner who wants to govern\"},{\"id\":\"@sp_world.errejon_ignore\",\"title\":\"Ignore it: it is Podemos's problem\"},{\"id\":\"@sp_world.errejon_vote\",\"title\":\"Tell left voters that only the PSOE vote is useful\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Errejón goes his own way\"},{\"type\":\"paragraph\",\"content\":\"Íñigo Errejón, Podemos's co-founder and its most moderate strategist, breaks with Pablo Iglesias and launches Más País, allied with Compromís in Valencia. The space to the PSOE's left is now split in two.\"}],\"countVisitsMax\":1},\"sp_events.both\":{\"id\":\"sp_events.both\",\"onArrival\":[{\"$code\":\"Q['cat_dialogue'] = (Q['cat_dialogue'] || 0) + 1;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 2;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\"}],\"content\":{\"content\":\"Defend the Constitution, offer a way out. Neither side is convinced, but both keep talking to you.\",\"type\":\"paragraph\"}},\"sp_party.net_labour\":{\"id\":\"sp_party.net_labour\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 0.5);\"},\"unavailableSubtitle\":\"Needs 0.5 in party funds.\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.funds -= 0.5; if (window.SpainGame) { window.SpainGame.learnFrom(Q, 'labour'); }\"}],\"goTo\":[{\"id\":\"sp_party.lesson\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_national.tv\":{\"id\":\"sp_national.tv\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 1, pensioners: 1, professionals: 0.8, students: 0.8, unemployed: 0.8, homemakers: 0.8, self_employed: 0.5}); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"Millions watch. Nobody remembers much the next day, but it helps.\",\"type\":\"paragraph\"}},\"sp_world.errejon_welcome\":{\"id\":\"sp_world.errejon_welcome\",\"onArrival\":[{\"$code\":\"Q.rel_mp = (Q.rel_mp || 50) + 10; Q.rel_up -= 4;\"}],\"content\":{\"content\":\"Errejón returns the compliment, carefully.\",\"type\":\"paragraph\"}},\"sp_events.talk\":{\"id\":\"sp_events.talk\",\"onArrival\":[{\"$code\":\"Q.cat_dialogue += 2; Q.rel_erc += 8; Q.rel_junts += 5; Q.rel_cs -= 10; Q.regional_leaders_dissent += 12; Q.institutionalists_dissent += 6; if (window.SpainGame) { window.SpainGame.position(Q, 0, 1); }\"}],\"content\":{\"content\":\"The PSC and Podemos welcome it. Susana Díaz and García-Page say it publicly: the PSOE cannot sound like it is negotiating with lawbreakers.\",\"type\":\"paragraph\"}},\"sp_party.net_portugal\":{\"id\":\"sp_party.net_portugal\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 0.5);\"},\"unavailableSubtitle\":\"Needs 0.5 in party funds.\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.funds -= 0.5; if (window.SpainGame) { window.SpainGame.learnFrom(Q, 'portugal'); }\"}],\"goTo\":[{\"id\":\"sp_party.lesson\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_national.radio\":{\"id\":\"sp_national.radio\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'pensioners', 1.5); window.SpainGame.target(Q, 'psoe', 'middle', 1.5); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"An hour of serious questions on Cadena SER and COPE. Older and middle-class listeners take you seriously.\",\"type\":\"paragraph\"}},\"sp_world.errejon_ignore\":{\"id\":\"sp_world.errejon_ignore\",\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 1;\"}],\"content\":{\"content\":\"The split costs the left seats in small provinces under D'Hondt.\",\"type\":\"paragraph\"}},\"sp_events.cat_1o\":{\"id\":\"sp_events.cat_1o\",\"title\":\"1 October\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['catalan_crisis'] || 0)===1) && ((Q['cat_crisis_stage'] || 0)===1)) && ((Q['time'] || 0) >= ((Q['cat_stage_time'] || 0) + 1)));\"},\"onArrival\":[{\"$code\":\"Q.cat_crisis_stage = 2;\\nQ.cat_stage_time = Q.time;\\nif (window.SpainGame) {\\n    window.SpainGame.territorial(Q, 'Cataluña', 'erc', 1.08);\\n    window.SpainGame.territorial(Q, 'Cataluña', 'junts', 1.08);\\n    window.SpainGame.regionalMod(Q, 'Cataluña', 'cs', 1.15);\\n    window.SpainGame.campaign(Q, 'vox', {self_employed: 2, pensioners: 1.5, workers: 1.5, homemakers: 1, professionals: 1});\\n    window.SpainGame.recalculate(Q);\\n}\"}],\"options\":[{\"id\":\"@sp_events.back_police\",\"title\":\"Back the State's response without reservation\"},{\"id\":\"@sp_events.criticise\",\"title\":\"Defend legality but criticise the police charges\"},{\"id\":\"@sp_events.mediate\",\"title\":\"Call for mediation and an urgent meeting of the party leaders\"}],\"content\":[{\"type\":\"heading\",\"content\":\"1 October\"},{\"type\":\"paragraph\",\"content\":\"The referendum goes ahead without legal guarantees. Police try to stop the voting in hundreds of polling stations; the images of baton charges travel round the world. The Catalan government claims 90% voted yes on a turnout of 43%. Two days later, the King addresses the nation.\"}]},\"sp_party.net_denmark\":{\"id\":\"sp_party.net_denmark\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 0.5);\"},\"unavailableSubtitle\":\"Needs 0.5 in party funds.\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.funds -= 0.5; if (window.SpainGame) { window.SpainGame.learnFrom(Q, 'denmark'); }\"}],\"goTo\":[{\"id\":\"sp_party.lesson\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_national.streamers\":{\"id\":\"sp_national.streamers\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; Q.modernisers_dissent -= 2; Q.institutionalists_dissent += 1; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'young', 2.5); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The clips go viral, some for the right reasons. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.errejon_vote\":{\"id\":\"sp_world.errejon_vote\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.transfer(Q, 'mp', 'psoe', {students: 1, professionals: 1}); window.SpainGame.transfer(Q, 'up', 'psoe', {workers: 0.5}); }\"}],\"content\":{\"content\":\"The \\\"useful vote\\\" argument works on some of them.\",\"type\":\"paragraph\"}},\"sp_events.back_police\":{\"id\":\"sp_events.back_police\",\"onArrival\":[{\"$code\":\"Q['rel_pp'] = (Q['rel_pp'] || 0) + 4;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 4;\\nQ['rel_up'] = (Q['rel_up'] || 0) - 6;\\nQ['rel_erc'] = (Q['rel_erc'] || 0) - 10;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 5;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) + 6;\\nQ['cat_hard_line'] = (Q['cat_hard_line'] || 0) + 1;\"}],\"content\":{\"content\":\"Order before everything. In Barcelona, PSC mayors take down their posters.\",\"type\":\"paragraph\"}},\"sp_party.net_germany\":{\"id\":\"sp_party.net_germany\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 0.5);\"},\"unavailableSubtitle\":\"Needs 0.5 in party funds.\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.funds -= 0.5; if (window.SpainGame) { window.SpainGame.learnFrom(Q, 'germany'); }\"}],\"goTo\":[{\"id\":\"sp_party.lesson\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_national.morning_tv\":{\"id\":\"sp_national.morning_tv\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; Q.progressives_dissent -= 1; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'women', 2.5); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Childcare, equal pay, gender violence: an audience the big debates often ignore. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.cat_sentence\":{\"id\":\"sp_world.cat_sentence\",\"title\":\"The sentence\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['cat_sentence_seen'] || 0)===0) && ((Q['cat_crisis_seen'] || 0)===1)) && ((((((Q['year'] || 0)===2019) && ((Q['month'] || 0) >= 10))) || ((Q['year'] || 0) >= 2020))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.cat_sentence_seen = 1; Q.cat_tension = (Q.cat_tension || 0) + 15; if (window.SpainGame) { window.SpainGame.campaign(Q, 'vox', {self_employed: 2, pensioners: 1.5, workers: 1.5, homemakers: 1, professionals: 1}); window.SpainGame.territorial(Q, 'Cataluña', 'erc', 1.05); window.SpainGame.partyRel(Q, 'cs', 'erc', -5); }\"}],\"options\":[{\"id\":\"@sp_world.sentence_order\",\"title\":\"Order first: full support for the police\"},{\"id\":\"@sp_world.sentence_dialogue\",\"title\":\"Order, and the promise of dialogue once calm returns\"},{\"id\":\"@sp_world.sentence_pardons\",\"title\":\"Hint that pardons could be part of the solution\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The sentence\"},{\"type\":\"paragraph\",\"content\":\"The Supreme Court sentences the independence leaders to between nine and thirteen years for sedition. Barcelona burns for a week: barricades, burning containers, the airport blockaded. The images play on every channel in Spain, and Vox's rallies fill up.\"}],\"countVisitsMax\":1},\"sp_events.criticise\":{\"id\":\"sp_events.criticise\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 3;\\nQ['rel_erc'] = (Q['rel_erc'] || 0) + 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 3;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 1;\"}],\"content\":{\"content\":\"You keep a foot in both camps, and are attacked from both.\",\"type\":\"paragraph\"}},\"sp_party.net_sweden\":{\"id\":\"sp_party.net_sweden\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 0.5);\"},\"unavailableSubtitle\":\"Needs 0.5 in party funds.\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.funds -= 0.5; if (window.SpainGame) { window.SpainGame.learnFrom(Q, 'sweden'); }\"}],\"goTo\":[{\"id\":\"sp_party.lesson\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_national.regional_press\":{\"id\":\"sp_national.regional_press\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; Q.regional_leaders_dissent -= 2; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'rural', 2.5); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Interviews with the local papers of Soria, Teruel and Zamora: depopulation, trains, rural doctors. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.sentence_order\":{\"id\":\"sp_world.sentence_order\",\"onArrival\":[{\"$code\":\"Q.cat_hard_line += 1; Q.rel_erc -= 8; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'pensioners', 2); window.SpainGame.campaign(Q, 'vox', {self_employed: -0.5, pensioners: -0.5}); window.SpainGame.position(Q, 0, -1); }\"}],\"content\":{\"content\":\"Firmness takes a little of Vox's oxygen.\",\"type\":\"paragraph\"}},\"sp_events.mediate\":{\"id\":\"sp_events.mediate\",\"onArrival\":[{\"$code\":\"Q.cat_dialogue += 1; Q.rel_erc += 6; Q.rel_junts += 4; Q.rel_pp -= 6; Q.regional_leaders_dissent += 8; if (window.SpainGame) { window.SpainGame.position(Q, 0, 0.8); }\"}],\"content\":{\"content\":\"Mediation goes nowhere, but you are the only national leader still talking to everyone.\",\"type\":\"paragraph\"}},\"sp_party.net_us\":{\"id\":\"sp_party.net_us\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 0.5);\"},\"unavailableSubtitle\":\"Needs 0.5 in party funds.\",\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.funds -= 0.5; if (window.SpainGame) { window.SpainGame.learnFrom(Q, 'us'); }\"}],\"goTo\":[{\"id\":\"sp_party.lesson\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_national.campaign_tour\":{\"id\":\"sp_national.campaign_tour\",\"title\":\"Campaign tour\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return ((((Q['election_year'] || 0) > 0) && ((Q['tour_timer'] || 0) <= 0)) && ((Q['sanchez_active'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['tour_timer'] = 1;\"}],\"options\":[{\"id\":\"@sp_national.tour_andalucia\",\"title\":\"Andalusia, the PSOE's heartland\"},{\"id\":\"@sp_national.tour_cataluna\",\"title\":\"Catalonia, with the PSC\"},{\"id\":\"@sp_national.tour_madrid\",\"title\":\"Madrid and its suburbs\"},{\"id\":\"@sp_national.tour_valencia\",\"title\":\"Valencia\"},{\"id\":\"@sp_national.tour_rural\",\"title\":\"The provinces of rural Spain\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Campaign tour\"},{\"type\":\"paragraph\",\"content\":\"The election is close. Where do you spend the last weeks? Each stop costs 1 in party funds.\"}]},\"sp_world.sentence_dialogue\":{\"id\":\"sp_world.sentence_dialogue\",\"onArrival\":[{\"$code\":\"Q.cat_dialogue += 1; Q.rel_erc += 3;\"}],\"content\":{\"content\":\"Both camps think you are talking to the other one.\",\"type\":\"paragraph\"}},\"sp_events.cat_155\":{\"id\":\"sp_events.cat_155\",\"title\":\"Independence and Article 155\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['catalan_crisis'] || 0)===1) && ((Q['cat_crisis_stage'] || 0)===2)) && ((Q['time'] || 0) >= ((Q['cat_stage_time'] || 0) + 1))) && ((Q['psoe_in_government'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q.cat_crisis_stage = 3;\\nif (Q.regions && Q.regions['Cataluña']) {\\n    var y = Q.year, m = Q.month + 2;\\n    if (m > 12) { m -= 12; y += 1; }\\n    Q.regions['Cataluña'].nextElection = y + '-' + (m < 10 ? '0' : '') + m + '-21';\\n    Q.regions['Cataluña'].lastWasSnap = true;\\n}\"}],\"options\":[{\"id\":\"@sp_events.support_155\",\"title\":\"Support Article 155, limited to calling elections\"},{\"id\":\"@sp_events.abstain_155\",\"title\":\"Refuse to support it: politics, not courts and police\"},{\"id\":\"@sp_events.own_155\",\"title\":\"Support it, and demand a commission on constitutional reform in exchange\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Independence and Article 155\"},{\"type\":\"paragraph\",\"content\":\"The Parliament of Catalonia votes a declaration of independence. Within hours, the Senate authorises the use of Article 155 of the Constitution: the Catalan government is dismissed and Catalan elections are called for two months' time. Puigdemont leaves for Brussels; members of his government are jailed pending trial.\"}]},\"sp_party.lesson\":{\"id\":\"sp_party.lesson\",\"title\":\"The lesson\",\"content\":{\"content\":[{\"type\":\"heading\",\"content\":[\"What you learn from \",{\"type\":\"insert\",\"insert\":0},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"insert\",\"insert\":1},\"\"]},{\"type\":\"paragraph\",\"content\":{\"type\":\"conditional\",\"content\":[\"Your delegation has studied this leadership \",{\"type\":\"insert\",\"insert\":3},\" times; the lessons are only \",{\"type\":\"insert\",\"insert\":4},\"% as strong as the first time.\"],\"predicate\":2}}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['learn_leader'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['learn_text'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['learn_times'] || 0) > 1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['learn_times'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['learn_factor'] || 0);\"}}]}},\"sp_party\":{\"id\":\"sp_party\",\"type\":\"scene\",\"title\":\"The regional presidents\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((Q['barons_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['barons_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_party.convene\",\"title\":\"Convene the regional presidents before deciding anything\"},{\"id\":\"@sp_party.executive\",\"title\":\"Consult the Federal Executive first\"},{\"id\":\"@sp_party.announce\",\"title\":\"Announce your strategy, then inform them\"},{\"id\":\"@sp_party.formal_role\",\"title\":\"Offer the barons a formal role in the negotiations\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The regional presidents\"},{\"type\":\"paragraph\",\"content\":\"Susana Díaz in Andalusia, Emiliano García-Page in Castilla-La Mancha, Guillermo Fernández Vara in Extremadura, Javier Lambán in Aragón, Ximo Puig in Valencia, Javier Fernández in Asturias: each governs, each has their own electorate, and each has a view on what you should do in Madrid.\"}]},\"sp_national.tour_andalucia\":{\"id\":\"sp_national.tour_andalucia\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; Q.regional_leaders_dissent -= 3; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Andalucía', 'psoe', 1.04); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"Rallies, markets and local television across Andalusia. The PSOE's vote there firms up.\",\"type\":\"paragraph\"}},\"sp_world.sentence_pardons\":{\"id\":\"sp_world.sentence_pardons\",\"onArrival\":[{\"$code\":\"Q.cat_dialogue += 2; Q.rel_erc += 10; Q.regional_leaders_dissent += 15; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {pp: 0.4, vox: 0.4, cs: 0.2}, {pensioners: 2, homemakers: 1.5, self_employed: 1.5}); window.SpainGame.position(Q, 0, 2); }\"}],\"content\":{\"content\":\"The word \\\"pardon\\\" dominates the next election campaign. Not in your favour.\",\"type\":\"paragraph\"}},\"sp_events.support_155\":{\"id\":\"sp_events.support_155\",\"onArrival\":[{\"$code\":\"Q.rel_pp += 6; Q.rel_cs += 6; Q.rel_erc -= 15; Q.rel_junts -= 20; Q.rel_up -= 8; Q.regional_leaders_dissent -= 10; Q.progressives_dissent += 8; Q.cat_hard_line += 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 1, homemakers: 0.5}); window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 0.96); }\"}],\"content\":{\"content\":\"The PSOE stands with the State. The PSC's vote holds in Barcelona's suburbs and falls in Girona.\",\"type\":\"paragraph\"}},\"sp_national.tour_cataluna\":{\"id\":\"sp_national.tour_cataluna\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1;  if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 1.04); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"Rallies, markets and local television across Catalonia. The PSOE's vote there firms up.\",\"type\":\"paragraph\"}},\"sp_world.rivera_resigns\":{\"id\":\"sp_world.rivera_resigns\",\"title\":\"Rivera resigns\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['rivera_resigns_seen'] || 0)===0) && ((Q['elections_held'] || 0) >= 2)) && ((Q['cs_collapsed'] || 0)===1));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.rivera_resigns_seen = 1; if (window.SpainGame) { window.SpainGame.transfer(Q, 'cs', {pp: 0.6, vox: 0.25, psoe: 0.15}, {professionals: 3, self_employed: 3, pensioners: 2, students: 2}); }\"}],\"options\":[{\"id\":\"@sp_world.cs_voters\",\"title\":\"Make a play for Ciudadanos's centrist voters\"},{\"id\":\"@sp_world.cs_shrug\",\"title\":\"Let them go\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Rivera resigns\"},{\"type\":\"paragraph\",\"content\":\"Ciudadanos has collapsed at the polls, and Albert Rivera resigns as leader and leaves politics. The party that wanted to replace the PP is fighting for survival; most of its voters are heading back to the PP, and some to Vox.\"}],\"countVisitsMax\":1},\"sp_events.abstain_155\":{\"id\":\"sp_events.abstain_155\",\"onArrival\":[{\"$code\":\"Q.rel_pp -= 10; Q.rel_cs -= 10; Q.rel_erc += 6; Q.rel_up += 6; Q.regional_leaders_dissent += 25; Q.institutionalists_dissent += 15; Q.federal_committee_balance -= 8; Q.sanchez_authority -= 4; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {cs: 0.5, pp: 0.4, vox: 0.1}, {pensioners: 2.5, homemakers: 2, self_employed: 1.5, workers: 1}); window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 1.06); } if (window.SpainGame) { window.SpainGame.position(Q, 0, 1.5); }\"}],\"content\":{\"content\":\"The barons call it a betrayal of the Constitution. Podemos and the PSC applaud; nobody else does.\",\"type\":\"paragraph\"}},\"sp_national.tour_madrid\":{\"id\":\"sp_national.tour_madrid\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1;  if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Madrid', 'psoe', 1.04); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"Rallies, markets and local television across Madrid. The PSOE's vote there firms up.\",\"type\":\"paragraph\"}},\"sp_world.cs_voters\":{\"id\":\"sp_world.cs_voters\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'middle', 2.5); window.SpainGame.position(Q, -0.5, 0); }\"}],\"content\":{\"content\":\"Some of the urban professionals who voted Cs in 2019 give the PSOE a look.\",\"type\":\"paragraph\"}},\"sp_events.own_155\":{\"id\":\"sp_events.own_155\",\"onArrival\":[{\"$code\":\"Q['rel_pp'] = (Q['rel_pp'] || 0) + 3;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 3;\\nQ['rel_erc'] = (Q['rel_erc'] || 0) - 8;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 4;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 3;\\nQ['constitutional_commission'] = 1;\"}],\"content\":{\"content\":\"You get your commission on reforming the territorial model, on paper. It keeps the federal idea alive.\",\"type\":\"paragraph\"}},\"sp_national.tour_valencia\":{\"id\":\"sp_national.tour_valencia\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1;  if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Comunidad Valenciana', 'psoe', 1.04); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"Rallies, markets and local television across Valencia. The PSOE's vote there firms up.\",\"type\":\"paragraph\"}},\"sp_world.cs_shrug\":{\"id\":\"sp_world.cs_shrug\",\"onArrival\":[{\"$code\":\"Q['progressives_dissent'] = (Q['progressives_dissent'] || 0) - 2;\"}],\"content\":{\"content\":\"The centre empties, and the PP fills it.\",\"type\":\"paragraph\"}},\"sp_events.cat_crisis_end\":{\"id\":\"sp_events.cat_crisis_end\",\"title\":\"After the Catalan election\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['catalan_crisis'] || 0)===1) && ((Q['cat_crisis_stage'] || 0)===3)) && ((Q['cat_election_held'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['catalan_crisis'] = 0;\\nQ['cat_crisis_stage'] = 4;\"}],\"content\":[{\"type\":\"heading\",\"content\":\"After the Catalan election\"},{\"type\":\"paragraph\",\"content\":\"Catalonia has voted. The direct rule of Article 155 ends with the new government, but the crisis has changed Spanish politics: Ciudadanos rode it in Catalonia, and a small party called Vox has made itself known as a private prosecutor in the courts against the independence leaders.\"},{\"type\":\"paragraph\",\"content\":\"The Catalan crisis deck is closed for now. The questions it raised are not.\"}]},\"sp_national.tour_rural\":{\"id\":\"sp_national.tour_rural\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 1);\"},\"unavailableSubtitle\":\"Not enough party funds.\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; Q.regional_leaders_dissent -= 2; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'rural', 3); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Small towns where every seat is decided by a few hundred votes. \",{\"type\":\"conditional\",\"content\":[\"This audience has heard it before: the effect is \",{\"type\":\"insert\",\"insert\":1},\"% of a fresh campaign.\"],\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['last_target_factor'] || 0) < 100);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['last_target_factor'] || 0);\"}}]}},\"sp_world.covid\":{\"id\":\"sp_world.covid\",\"title\":\"The pandemic\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['covid_seen'] || 0)===0) && ((((((Q['year'] || 0)===2020) && ((Q['month'] || 0) >= 3))) || ((Q['year'] || 0) >= 2021))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.covid_seen = 1; Q.funds += 1;\"}],\"options\":[{\"id\":\"@sp_world.covid_strict\",\"title\":{\"content\":[{\"type\":\"conditional\",\"content\":\"A strict national lockdown, decided in Madrid \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Support every extension of the state of alarm\",\"predicate\":1}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]}},{\"id\":\"@sp_world.covid_regions\",\"title\":{\"content\":[{\"type\":\"conditional\",\"content\":\"Co-governance: the regions manage the measures \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Support it, but demand the regions have a say\",\"predicate\":1}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]}},{\"id\":\"@sp_world.covid_economy\",\"title\":{\"content\":[{\"type\":\"conditional\",\"content\":\"Protect the economy: lighter, shorter measures \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Oppose the extensions: the government is improvising\",\"predicate\":1}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]}}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The pandemic\"},{\"type\":\"paragraph\",\"content\":[\"A new coronavirus is filling the hospitals of Madrid and Barcelona. On 14 March the government declares a state of alarm. Spain enters one of the strictest lockdowns in the world; tens of thousands will die; the economy will shrink by more than 10% this year. Party campaigns stop; the party saves money it cannot spend. \",{\"type\":\"conditional\",\"content\":\"As Prime Minister, every decision is yours, and so is every death in the headlines. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The government asks for the opposition's votes to extend the state of alarm every two weeks.\",\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]},\"countVisitsMax\":1},\"sp_events.vox_vistalegre\":{\"id\":\"sp_events.vox_vistalegre\",\"title\":\"Vox fills Vistalegre\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['cat_crisis_seen'] || 0)===1) && ((Q['vox_rise_seen'] || 0)===0)) && ((((((Q['year'] || 0)===2018) && ((Q['month'] || 0) >= 10))) || ((Q['year'] || 0) >= 2019))));\"},\"onArrival\":[{\"$code\":\"Q.vox_rise_seen = 1;\\n// The surge feeds on the Catalan crisis: on dialogue the right calls weakness,\\n// and on how far the PP has itself moved to the right.\\nvar push = 8 + 2 * (Q.cat_dialogue || 0) - (Q.cat_hard_line || 0) + (Q.pp_scandal >= 3 ? 2 : 0);\\npush = Math.max(3, push);\\nQ.vox_push = push;\\nif (window.SpainGame) { window.SpainGame.partyRel(Q, 'pp', 'vox', 10); window.SpainGame.partyRel(Q, 'cs', 'vox', 5); }\\nif (window.SpainGame) {\\n    window.SpainGame.campaign(Q, 'vox', {self_employed: push + 3, pensioners: push - 1, workers: push,\\n        homemakers: push - 1, professionals: push - 2, unemployed: push - 1, students: push - 2});\\n    window.SpainGame.campaign(Q, 'pp', {self_employed: -2, pensioners: -1});\\n    window.SpainGame.recalculate(Q);\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Vox fills Vistalegre\"},{\"type\":\"paragraph\",\"content\":\"Ten thousand people pack the Vistalegre arena in Madrid, and thousands more are turned away, for a party that won 0.2% of the vote in 2015. Santiago Abascal promises to suspend Catalan autonomy, deport illegal immigrants and repeal the gender-violence law.\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Abascal's loudest applause comes when he attacks the \\\"dialogue with coup plotters\\\". \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The State's firmness in Catalonia has taken some of the wind out of his sails, but not all of it. \",\"predicate\":1},\"\"]},{\"type\":\"paragraph\",\"content\":\"The polls start to pick it up. Vox is no longer a curiosity.\"}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['cat_dialogue'] || 0) >= 3);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['cat_hard_line'] || 0) >= 3);\"}}]}},\"sp_national.pes_contacts\":{\"id\":\"sp_national.pes_contacts\",\"title\":\"International contacts\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return ((((Q['psoe_in_government'] || 0)===0) && ((Q['sanchez_leader'] || 0)===1)) && ((Q['pes_timer'] || 0) <= 0));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['pes_timer'] = 3;\"}],\"options\":[{\"id\":\"@sp_national.pes_congress\",\"title\":\"Speak at the PES congress\"},{\"id\":\"@sp_national.pes_lisbon\",\"title\":\"Visit António Costa in Lisbon\"},{\"id\":\"@sp_national.pes_washington\",\"title\":\"Meet Democrats in Washington\"},{\"id\":\"@root\",\"title\":\"Not this month\"}],\"content\":[{\"type\":\"heading\",\"content\":\"International contacts\"},{\"type\":\"paragraph\",\"content\":\"As leader of the opposition you have no ministry, but you do have the Party of European Socialists and the Socialist International. Being seen abroad as a Prime Minister in waiting has its uses.\"}]},\"sp_world.covid_strict\":{\"id\":\"sp_world.covid_strict\",\"onArrival\":[{\"$code\":\"if (Q.psoe_in_government) { Q.fiscal_adj += 0.5; Q.sanchez_authority += 6; Q.regional_leaders_dissent += 6; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 2, homemakers: 1}); window.SpainGame.campaign(Q, 'vox', {self_employed: 2, professionals: 0.5}); window.SpainGame.intl(Q, 'eu', 3); } } else { Q.rel_pp += 5; Q.sanchez_authority += 3; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'pensioners', 1.5); } } if (window.SpainGame) { if (Q.psoe_in_government) { window.SpainGame.econ(Q, -1.5, 1.0);window.SpainGame.social(Q, 1); } }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"The curve flattens. The furlough scheme (ERTE) protects millions of jobs. Shopkeepers and the self-employed are furious, and Vox drives through Madrid in caravans of honking cars. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Responsible opposition. The government thanks you; your critics say you have become the PP's crutch.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]}},\"sp_events.brussels\":{\"id\":\"sp_events.brussels\",\"title\":\"A letter from Brussels\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['brussels_due'] || 0)===1) && ((Q['psoe_in_government'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q.brussels_year = Q.year; Q.brussels_due = 0;\"}],\"options\":[{\"id\":\"@sp_events.cuts\",\"title\":\"Announce spending cuts\"},{\"id\":\"@sp_events.taxes\",\"title\":\"Raise taxes on large companies and banks\"},{\"id\":\"@sp_events.defy_brussels\",\"title\":\"Defend your spending: growth will close the gap\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"A letter from Brussels\"},{\"type\":\"paragraph\",\"content\":[\"The European Commission writes that Spain's deficit, \",{\"type\":\"insert\",\"insert\":0},\"% of GDP, breaches the Stability and Growth Pact's 3% ceiling. It asks for \\\"additional measures\\\".\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['deficit_text'] || 0);\"}}]}},\"sp_national.pes_congress\":{\"id\":\"sp_national.pes_congress\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 3); } Q.sanchez_authority += 1; Q.funds -= 0.2;\"}],\"content\":{\"content\":\"Social democrats from twenty-seven countries applaud the man who might govern Spain.\",\"type\":\"paragraph\"}},\"sp_world.covid_regions\":{\"id\":\"sp_world.covid_regions\",\"onArrival\":[{\"$code\":\"if (Q.psoe_in_government) { Q.fiscal_adj += 0.3; Q.regional_leaders_dissent -= 10; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 0.5}); window.SpainGame.regionalMod(Q, 'Madrid', 'pp', 1.04); } } else { Q.regional_leaders_dissent -= 6; Q.rel_pp += 2; } if (window.SpainGame) { if (Q.psoe_in_government) { window.SpainGame.econ(Q, -1.0, 0.7); } }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"The regions take charge, and seventeen different sets of rules confuse everyone. Madrid's president keeps her bars open and becomes a national figure. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The barons who govern regions are grateful.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]}},\"sp_events.cuts\":{\"id\":\"sp_events.cuts\",\"onArrival\":[{\"$code\":\"Q.fiscal_adj -= 0.5; Q.progressives_dissent += 6; Q.trade_unionists_dissent += 6; Q.rel_up -= 6; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: -1.5, pensioners: -1, unemployed: -1}); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, -1.5, 0); }\"}],\"content\":{\"content\":\"The Commission is satisfied. Your voters remember 2010.\",\"type\":\"paragraph\"}},\"sp_national.pes_lisbon\":{\"id\":\"sp_national.pes_lisbon\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'south', 4); } Q.rel_up += 1; Q.funds -= 0.2;\"}],\"content\":{\"content\":\"Costa explains, over lunch, how to govern with the radical left without being swallowed by it.\",\"type\":\"paragraph\"}},\"sp_world.covid_economy\":{\"id\":\"sp_world.covid_economy\",\"onArrival\":[{\"$code\":\"if (Q.psoe_in_government) { Q.fiscal_adj += 0.1; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {pp: 0.5, up: 0.3, cs: 0.2}, {pensioners: 3, homemakers: 2, professionals: 1.5}); window.SpainGame.intl(Q, 'eu', -3); } } else { Q.rel_pp -= 8; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {up: 0.5, pp: 0.5}, {pensioners: 1.5, homemakers: 1}); } } if (window.SpainGame) { if (Q.psoe_in_government) { window.SpainGame.econ(Q, 0.8, -0.3);window.SpainGame.social(Q, -3); } }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"The second wave is worse. The death toll rises, and the anger with it. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"In the middle of a pandemic, opposing the measures looks irresponsible to most voters.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]}},\"sp_events.taxes\":{\"id\":\"sp_events.taxes\",\"onArrival\":[{\"$code\":\"Q.fiscal_adj -= 0.4; Q.rel_cs -= 6; Q.rel_pp -= 4; Q.rel_up += 4; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {self_employed: -1, professionals: -0.5}); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, 1, 0); }\"}],\"content\":{\"content\":\"The banks protest; the Commission accepts the plan.\",\"type\":\"paragraph\"}},\"sp_national.pes_washington\":{\"id\":\"sp_national.pes_washington\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'us', 4); window.SpainGame.intl(Q, 'nato', 2); } Q.funds -= 0.3;\"}],\"content\":{\"content\":\"The photos with senators look prime-ministerial. The bill is not cheap.\",\"type\":\"paragraph\"}},\"sp_national\":{\"id\":\"sp_national\",\"type\":\"scene\",\"title\":\"The interview\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_national\"],\"viewIf\":{\"$code\":\"return (((Q['media_timer'] || 0) <= 0) && ((Q['sanchez_active'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['media_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_national.change\",\"title\":\"Change: Spain needs a different government\"},{\"id\":\"@sp_national.reform\",\"title\":\"Reform and stability: a serious party for difficult times\"},{\"id\":\"@sp_national.attack_podemos\",\"title\":\"Podemos is not the answer\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The interview\"},{\"type\":\"paragraph\",\"content\":\"A prime-time interview on La Sexta. What is the message?\"}]},\"sp_world.recovery_fund\":{\"id\":\"sp_world.recovery_fund\",\"title\":\"The recovery fund\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['recovery_seen'] || 0)===0) && ((Q['covid_seen'] || 0)===1)) && ((((((Q['year'] || 0)===2020) && ((Q['month'] || 0) >= 7))) || ((Q['year'] || 0) >= 2021))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.recovery_seen = 1; Q.recovery_size = (Q.intl && Q.intl.eu >= 65 && Q.intl.south >= 60) ? 2 : ((Q.intl && Q.intl.eu >= 45) ? 1 : 0);\"}],\"options\":[{\"id\":\"@sp_world.fund_green\",\"title\":\"Spend it on the green and digital transition\"},{\"id\":\"@sp_world.fund_regions\",\"title\":\"Share it generously with the regions\"},{\"id\":\"@sp_world.fund_social\",\"title\":\"Put it into health, care and jobs\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The recovery fund\"},{\"type\":\"paragraph\",\"content\":[\"For the first time, the EU will borrow together: €750 billion for recovery, much of it in grants. The \\\"frugal\\\" northern countries want loans with conditions; Spain, Italy, Portugal and Greece want grants. \",{\"type\":\"conditional\",\"content\":\"With strong allies in Brussels and the south, Spain secures around €140 billion, nearly half of it in grants. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Spain secures a fair share, after hard bargaining. \",\"predicate\":1},{\"type\":\"conditional\",\"content\":\"With few friends in Brussels, Spain gets less than it hoped, and on stricter terms.\",\"predicate\":2}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['recovery_size'] || 0)===2);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['recovery_size'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['recovery_size'] || 0)===0);\"}}]},\"countVisitsMax\":1},\"sp_events.defy_brussels\":{\"id\":\"sp_events.defy_brussels\",\"onArrival\":[{\"$code\":\"Q.sanchez_authority -= 4; Q.institutionalists_dissent += 6; Q.fiscal_adj += 0.1; if (window.SpainGame) { window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"The risk premium rises a few points. The Commission keeps writing.\",\"type\":\"paragraph\"}},\"sp_world.fund_green\":{\"id\":\"sp_world.fund_green\",\"onArrival\":[{\"$code\":\"if (Q.psoe_in_government) { Q.fiscal_adj -= 0.3 * Q.recovery_size; } if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 4); window.SpainGame.target(Q, 'psoe', 'young', 1 + Q.recovery_size); } if (window.SpainGame) { window.SpainGame.econ(Q, 0.4 * Q.recovery_size, -0.2 * Q.recovery_size); }\"}],\"content\":{\"content\":\"Brussels approves the plan quickly. Solar farms and charging points start to appear.\",\"type\":\"paragraph\"}},\"sp_events.gallardon\":{\"id\":\"sp_events.gallardon\",\"title\":\"The abortion law falls\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['gallardon_seen'] || 0)===0) && ((((((Q['year'] || 0)===2014) && ((Q['month'] || 0) >= 9))) || ((Q['year'] || 0) >= 2015)))) && ((Q['pp_governs'] || 0)===1));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['gallardon_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_events.women_victory\",\"title\":\"Celebrate it as a victory for women's mobilisation\"},{\"id\":\"@sp_events.repeal\",\"title\":\"Promise to restore the 2010 law in full, including for 16- and 17-year-olds\"},{\"id\":\"@sp_events.move_on\",\"title\":\"Move on: this was the PP's own mess\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The abortion law falls\"},{\"type\":\"paragraph\",\"content\":\"Facing protests across the country and divisions in his own party, Rajoy withdraws the justice minister's law restricting abortion. Alberto Ruiz-Gallardón resigns.\"}],\"countVisitsMax\":1},\"sp_world.fund_regions\":{\"id\":\"sp_world.fund_regions\",\"onArrival\":[{\"$code\":\"Q.regional_leaders_dissent -= 10; if (Q.psoe_in_government) { Q.fiscal_adj -= 0.2 * Q.recovery_size; } if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'rural', 1 + Q.recovery_size); } if (window.SpainGame) { window.SpainGame.econ(Q, 0.3 * Q.recovery_size, -0.2 * Q.recovery_size); }\"}],\"content\":{\"content\":\"The regional presidents, of every party, are happy for once.\",\"type\":\"paragraph\"}},\"sp_events.women_victory\":{\"id\":\"sp_events.women_victory\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 3; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'women', 2.5); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, 0, 0.5); }\"}],\"content\":{\"content\":\"The feminist organisations that led the protests welcome the PSOE's support.\",\"type\":\"paragraph\"}},\"sp_world.fund_social\":{\"id\":\"sp_world.fund_social\",\"onArrival\":[{\"$code\":\"Q.trade_unionists_dissent -= 5; if (Q.psoe_in_government) { Q.fiscal_adj -= 0.2 * Q.recovery_size; } if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', -2); window.SpainGame.target(Q, 'psoe', 'working', 1 + Q.recovery_size); } if (window.SpainGame) { window.SpainGame.econ(Q, 0.3 * Q.recovery_size, -0.4 * Q.recovery_size);window.SpainGame.social(Q, 2); }\"}],\"content\":{\"content\":\"Popular at home; Brussels insists on more reforms in return.\",\"type\":\"paragraph\"}},\"sp_events.repeal\":{\"id\":\"sp_events.repeal\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 5; Q.institutionalists_dissent += 2; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'women', 2); window.SpainGame.target(Q, 'psoe', 'young', 1.5); window.SpainGame.target(Q, 'psoe', 'pensioners', -1); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, 0, 1.2); }\"}],\"content\":{\"content\":\"A clear commitment. The bishops' conference condemns it.\",\"type\":\"paragraph\"}},\"sp_world.emeritus\":{\"id\":\"sp_world.emeritus\",\"title\":\"The King Emeritus leaves\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['emeritus_seen'] || 0)===0) && ((((((Q['year'] || 0)===2020) && ((Q['month'] || 0) >= 8))) || ((Q['year'] || 0) >= 2021))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['emeritus_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_world.monarchy_defend\",\"title\":\"Defend the institution: the King is not his father\"},{\"id\":\"@sp_world.monarchy_transparency\",\"title\":\"Demand transparency and an end to the King's legal immunity\"},{\"id\":\"@sp_world.monarchy_silence\",\"title\":\"Say as little as possible\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The King Emeritus leaves\"},{\"type\":\"paragraph\",\"content\":\"Under investigation in Switzerland and Spain over millions from Saudi Arabia, the former King Juan Carlos I leaves Spain for Abu Dhabi. Podemos demands a referendum on the monarchy.\"}],\"countVisitsMax\":1},\"sp_events.move_on\":{\"id\":\"sp_events.move_on\",\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 2;\"}],\"content\":{\"content\":\"The PP's divisions speak for themselves.\",\"type\":\"paragraph\"}},\"sp_world.monarchy_defend\":{\"id\":\"sp_world.monarchy_defend\",\"onArrival\":[{\"$code\":\"Q.institutionalists_dissent -= 5; Q.rel_up -= 8; Q.rel_pp += 3; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'pensioners', 1.5); window.SpainGame.position(Q, 0, -0.5); }\"}],\"content\":{\"content\":\"The PSOE as a party of State. Podemos calls you courtiers.\",\"type\":\"paragraph\"}},\"sp_events.black_cards\":{\"id\":\"sp_events.black_cards\",\"title\":\"The black cards and Púnica\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['black_cards_seen'] || 0)===0) && ((((((Q['year'] || 0)===2014) && ((Q['month'] || 0) >= 10))) || ((Q['year'] || 0) >= 2015))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.black_cards_seen = 1; Q.pp_scandal = (Q.pp_scandal || 0) + 1; if (window.SpainGame) { window.SpainGame.campaign(Q, 'pp', {pensioners: -1, professionals: -1.5, self_employed: -1}); }\"}],\"options\":[{\"id\":\"@sp_events.expel\",\"title\":\"Expel every PSOE member who used a black card, immediately\"},{\"id\":\"@sp_events.anticorruption\",\"title\":\"Propose a state pact against corruption\"},{\"id\":\"@sp_events.attack_pp\",\"title\":\"Focus on the PP: it is their system\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The black cards and Púnica\"},{\"type\":\"paragraph\",\"content\":\"Two scandals in one month. The board of Caja Madrid, the savings bank rescued with public money, spent millions on undeclared \\\"black\\\" credit cards: the users include PP figures, but also PSOE and IU representatives and union leaders. Days later, Operation Púnica arrests dozens of mayors and officials, most of them from the PP, for kickbacks on public contracts.\"},{\"type\":\"paragraph\",\"content\":\"Disgust with \\\"the caste\\\" of the old parties has never been higher.\"}],\"countVisitsMax\":1},\"sp_world.monarchy_transparency\":{\"id\":\"sp_world.monarchy_transparency\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 5; Q.institutionalists_dissent += 5; Q.rel_up += 5; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'young', 1.5); window.SpainGame.position(Q, 0, 0.8); }\"}],\"content\":{\"content\":\"The Royal Household is not pleased. Young voters are.\",\"type\":\"paragraph\"}},\"sp_events.expel\":{\"id\":\"sp_events.expel\",\"onArrival\":[{\"$code\":\"Q.sanchez_authority += 5; Q.institutionalists_dissent += 5; Q.trade_unionists_dissent += 4; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'middle', 1.5); window.SpainGame.target(Q, 'psoe', 'young', 1); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"You act within hours. Some veterans think you threw old comrades to the wolves; the voters think you did the obvious thing.\",\"type\":\"paragraph\"}},\"sp_world.monarchy_silence\":{\"id\":\"sp_world.monarchy_silence\",\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 1;\"}],\"content\":{\"content\":\"The story runs for weeks without you.\",\"type\":\"paragraph\"}},\"sp_events.anticorruption\":{\"id\":\"sp_events.anticorruption\",\"onArrival\":[{\"$code\":\"Q.rel_cs += 4; Q.rel_pp -= 2; Q.institutionalists_dissent -= 2; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'middle', 1); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"A serious proposal. Rajoy ignores it; the new parties call it too little, too late.\",\"type\":\"paragraph\"}},\"sp_world.ayuso\":{\"id\":\"sp_world.ayuso\",\"title\":\"Ayuso calls an election\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['ayuso_seen'] || 0)===0) && ((Q['madrid_pp'] || 0)===1)) && ((((((Q['year'] || 0)===2021) && ((Q['month'] || 0) >= 3))) || ((Q['year'] || 0) >= 2022))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.ayuso_seen = 1;\\nif (Q.regions && Q.regions['Madrid']) { var y = Q.year, m = Q.month + 2; if (m > 12) { m -= 12; y += 1; } Q.regions['Madrid'].nextElection = y + '-' + (m < 10 ? '0' : '') + m + '-04'; Q.regions['Madrid'].lastWasSnap = true; }\\nif (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Madrid', 'pp', 1.15); window.SpainGame.regionalMod(Q, 'Madrid', 'cs', 0.6); }\"}],\"options\":[{\"id\":\"@sp_world.madrid_all_in\",\"title\":\"Throw everything into Madrid\"},{\"id\":\"@sp_world.madrid_local\",\"title\":\"Let the Madrid socialists run their own campaign\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Ayuso calls an election\"},{\"type\":\"paragraph\",\"content\":[\"In Murcia, Ciudadanos tries to topple the PP with the PSOE's help, and fails. In Madrid, Isabel Díaz Ayuso, fearing the same, dissolves her assembly first and calls an election under one word: \",{\"type\":\"emphasis-1\",\"content\":\"Libertad\"},\". Pablo Iglesias leaves the national government to run against her.\"]}],\"countVisitsMax\":1},\"sp_events.attack_pp\":{\"id\":\"sp_events.attack_pp\",\"onArrival\":[{\"$code\":\"Q.rel_pp -= 6; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', 'up', {students: 1, workers: 0.5}); }\"}],\"content\":{\"content\":\"The PSOE's own cardholders are still on the front pages. Podemos says \\\"PP and PSOE, the same thing\\\".\",\"type\":\"paragraph\"}},\"sp_world.madrid_all_in\":{\"id\":\"sp_world.madrid_all_in\",\"chooseIf\":{\"$code\":\"return ((Q['funds'] || 0) >= 2);\"},\"unavailableSubtitle\":\"Not enough party funds (needs 2).\",\"onArrival\":[{\"$code\":\"Q.funds -= 2; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Madrid', 'psoe', 1.04); }\"}],\"content\":{\"content\":\"You campaign in Madrid every weekend. If it goes badly, it will be your defeat as much as theirs.\",\"type\":\"paragraph\"}},\"sp_events.vistalegre_podemos\":{\"id\":\"sp_events.vistalegre_podemos\",\"title\":\"Podemos at Vistalegre\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['podemos_assembly_seen'] || 0)===0) && ((((((Q['year'] || 0)===2014) && ((Q['month'] || 0) >= 10))) || ((Q['year'] || 0) >= 2015))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['podemos_assembly_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_events.compete_left\",\"title\":\"Compete for the same voters: a bold programme for the young and the precarious\"},{\"id\":\"@sp_events.populists\",\"title\":\"Call it what it is: populism with simple answers\"},{\"id\":\"@sp_events.own_ground\",\"title\":\"Ignore Podemos and talk about governing\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Podemos at Vistalegre\"},{\"type\":\"paragraph\",\"content\":\"Seven thousand people fill the Vistalegre arena for Podemos's founding assembly. Pablo Iglesias wins control of the party and sets one goal: to \\\"storm the heavens\\\" and govern Spain. Within weeks, some polls put Podemos first.\"},{\"type\":\"paragraph\",\"content\":\"How does the PSOE answer?\"}],\"countVisitsMax\":1},\"sp_world.madrid_local\":{\"id\":\"sp_world.madrid_local\",\"onArrival\":[{\"$code\":\"Q.sanchez_authority -= 1;\"}],\"content\":{\"content\":\"A local campaign by a local candidate. The national stakes are obvious anyway.\",\"type\":\"paragraph\"}},\"sp_events.compete_left\":{\"id\":\"sp_events.compete_left\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 4; Q.rel_up -= 2; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'young', 2.5); window.SpainGame.target(Q, 'psoe', 'unemployed', 2); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, 0.8, 0); }\"}],\"content\":{\"content\":\"You will not leave the indignant generation to Iglesias. Some of them listen.\",\"type\":\"paragraph\"}},\"sp_world.ceuta\":{\"id\":\"sp_world.ceuta\",\"title\":\"Ceuta\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['ceuta_seen'] || 0)===0) && ((((((Q['year'] || 0)===2021) && ((Q['month'] || 0) >= 5))) || ((Q['year'] || 0) >= 2022))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.ceuta_seen = 1; Q.ceuta_severe = (Q.intl && Q.intl.maghreb < 45) ? 1 : 0; if (window.SpainGame) { window.SpainGame.migration(Q, 8 + 6 * Q.ceuta_severe); window.SpainGame.campaign(Q, 'vox', {pensioners: 1 + Q.ceuta_severe, self_employed: 1 + Q.ceuta_severe, workers: 0.5 + Q.ceuta_severe}); }\"}],\"options\":[{\"id\":\"@sp_world.ceuta_army\",\"title\":\"Send the army to the border and ask Brussels for support\"},{\"id\":\"@sp_world.ceuta_rabat\",\"title\":\"Calm things down with Rabat, quietly\"},{\"id\":\"@sp_world.ceuta_children\",\"title\":\"Protect the unaccompanied children first\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Ceuta\"},{\"type\":\"paragraph\",\"content\":[\"Angry that Spain admitted the Polisario leader Brahim Ghali to a Spanish hospital, Morocco's border guards step aside. \",{\"type\":\"conditional\",\"content\":\"Ten thousand people, many of them children, swim and walk into Ceuta in two days. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Several thousand people cross into Ceuta before Rabat closes the border again. \",\"predicate\":1},\" Vox calls it an invasion.\"]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['ceuta_severe'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['ceuta_severe'] || 0)===0);\"}}]},\"countVisitsMax\":1},\"sp_events.populists\":{\"id\":\"sp_events.populists\",\"onArrival\":[{\"$code\":\"Q.rel_up -= 12; Q.regional_leaders_dissent -= 4; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'pensioners', 2); window.SpainGame.transfer(Q, 'psoe', 'up', {students: 1.5, unemployed: 1}); } if (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0); }\"}],\"content\":{\"content\":\"Older voters nod. Younger ones hear the establishment defending itself.\",\"type\":\"paragraph\"}},\"sp_world.ceuta_army\":{\"id\":\"sp_world.ceuta_army\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'maghreb', -8); window.SpainGame.intl(Q, 'eu', 5); window.SpainGame.target(Q, 'psoe', 'pensioners', 1.5); window.SpainGame.position(Q, 0, -0.8); } if (window.SpainGame) { window.SpainGame.migration(Q, -2); }\"}],\"content\":{\"content\":\"Firm, and seen to be firm. Brussels declares Ceuta's border Europe's border.\",\"type\":\"paragraph\"}},\"sp_events.own_ground\":{\"id\":\"sp_events.own_ground\",\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 2;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) + 2;\"}],\"content\":{\"content\":\"You keep your distance. Podemos keeps growing.\",\"type\":\"paragraph\"}},\"sp_world.ceuta_rabat\":{\"id\":\"sp_world.ceuta_rabat\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'maghreb', 6); window.SpainGame.campaign(Q, 'vox', {pensioners: 0.5, self_employed: 0.5}); } if (window.SpainGame) { window.SpainGame.migration(Q, -3); }\"}],\"content\":{\"content\":\"The crisis ends, the questions about what Spain conceded do not.\",\"type\":\"paragraph\"}},\"sp_events.nine_n\":{\"id\":\"sp_events.nine_n\",\"title\":\"The 9N consultation\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['nine_n_seen'] || 0)===0) && ((((((Q['year'] || 0)===2014) && ((Q['month'] || 0) >= 11))) || ((Q['year'] || 0) >= 2015))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.nine_n_seen = 1; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Cataluña', 'cs', 1.15); window.SpainGame.recalculate(Q); }\"}],\"options\":[{\"id\":\"@sp_events.federal_answer\",\"title\":\"Answer with the federal reform of the Constitution\"},{\"id\":\"@sp_events.legal_answer\",\"title\":\"Back legal action against the consultation\"},{\"id\":\"@sp_events.psc_space\",\"title\":\"Let the PSC find its own space\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The 9N consultation\"},{\"type\":\"paragraph\",\"content\":\"Despite the Constitutional Court, Artur Mas's government holds a \\\"participatory process\\\" on independence. 2.3 million Catalans vote, 80% of them for independence; most of those who oppose it stay at home. In Catalonia, Ciudadanos becomes the loudest voice against the process.\"}],\"countVisitsMax\":1},\"sp_world.ceuta_children\":{\"id\":\"sp_world.ceuta_children\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 4; if (window.SpainGame) { window.SpainGame.intl(Q, 'un', 4); window.SpainGame.position(Q, 0, 1); }\"}],\"content\":{\"content\":\"UNICEF praises Spain. Vox puts the children on its campaign posters.\",\"type\":\"paragraph\"}},\"sp_events.federal_answer\":{\"id\":\"sp_events.federal_answer\",\"onArrival\":[{\"$code\":\"Q.federal_proposal = 1; Q.rel_pnv += 3; Q.regional_leaders_dissent += 3; Q.cat_dialogue += 1; if (window.SpainGame) { window.SpainGame.position(Q, 0, 0.5); }\"}],\"content\":{\"content\":\"The Granada Declaration becomes your answer: a federal Spain. Few in Catalonia are listening any more.\",\"type\":\"paragraph\"}},\"sp_world.pardons\":{\"id\":\"sp_world.pardons\",\"title\":\"The pardons\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((((Q['pardons_seen'] || 0)===0) && ((Q['psoe_in_government'] || 0)===1)) && ((Q['cat_crisis_seen'] || 0)===1)) && ((Q['cat_sentence_seen'] || 0)===1)) && ((((((Q['year'] || 0)===2021) && ((Q['month'] || 0) >= 6))) || ((Q['year'] || 0) >= 2022))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['pardons_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_world.pardon_yes\",\"title\":\"Grant the pardons: \\\"concord over revenge\\\"\"},{\"id\":\"@sp_world.pardon_no\",\"title\":\"Refuse: the sentences stand\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The pardons\"},{\"type\":\"paragraph\",\"content\":\"The independence leaders have served more than three years. ERC, on whose votes your government depends, asks for pardons. The Supreme Court advises against; the PP collects signatures in the street.\"}],\"countVisitsMax\":1},\"sp_events.legal_answer\":{\"id\":\"sp_events.legal_answer\",\"onArrival\":[{\"$code\":\"Q.rel_pp += 3; Q.regional_leaders_dissent -= 4; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 0.97); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"The barons approve. The PSC loses more members to the independence camp.\",\"type\":\"paragraph\"}},\"sp_world.pardon_yes\":{\"id\":\"sp_world.pardon_yes\",\"onArrival\":[{\"$code\":\"Q.cat_dialogue += 2; Q.rel_erc += 20; Q.rel_junts += 10; Q.regional_leaders_dissent += 15; Q.rel_pp -= 10; Q.rel_cs -= 10; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {pp: 0.5, vox: 0.3, cs: 0.2}, {pensioners: 2, homemakers: 1.5, self_employed: 1.5}); window.SpainGame.territorial(Q, 'Cataluña', 'erc', 0.97); window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 1.06); window.SpainGame.position(Q, 0, 1.5); } if (window.SpainGame) { Q.cat_tension = Math.max(0, (Q.cat_tension || 0) - 8); }\"}],\"content\":{\"content\":\"The streets of Catalonia go quiet. The rest of Spain argues about it for a year.\",\"type\":\"paragraph\"}},\"sp_events.psc_space\":{\"id\":\"sp_events.psc_space\",\"onArrival\":[{\"$code\":\"Q.sanchez_authority -= 1; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 1.02); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"Miquel Iceta's PSC treads its own careful line.\",\"type\":\"paragraph\"}},\"sp_world.pardon_no\":{\"id\":\"sp_world.pardon_no\",\"onArrival\":[{\"$code\":\"Q.rel_erc -= 20; Q.regional_leaders_dissent -= 8; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'pensioners', 1.5); } if (Q.depends_on_catalans) { Q.depends_on_catalans = 0; Q.lost_majority = 1; } if (window.SpainGame) { Q.cat_tension = (Q.cat_tension || 0) + 5; }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"ERC withdraws its support. Your government no longer has a majority. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The PP has nothing to campaign on. ERC has everything.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['lost_majority'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['lost_majority'] || 0)===0);\"}}]}},\"sp_events.diaz_snap\":{\"id\":\"sp_events.diaz_snap\",\"title\":\"Díaz calls an election\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['diaz_snap_seen'] || 0)===0) && ((Q['year'] || 0)===2015)) && ((Q['month'] || 0) >= 1)) && ((Q['regions_andalucia_psoe'] || 0)===1));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.diaz_snap_seen = 1;\\nif (Q.regions && Q.regions['Andalucía']) {\\n    Q.regions['Andalucía'].nextElection = '2015-03-22';\\n    Q.regions['Andalucía'].lastWasSnap = true;\\n}\"}],\"options\":[{\"id\":\"@sp_events.campaign_with_diaz\",\"title\":\"Campaign at her side across Andalusia\"},{\"id\":\"@sp_events.distance_diaz\",\"title\":\"Let her run her own campaign\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Díaz calls an election\"},{\"type\":\"paragraph\",\"content\":\"Susana Díaz breaks her coalition with Izquierda Unida and calls an Andalusian election for 22 March, a year early. She wants her own mandate before Podemos grows any further, and before the general election. Everyone in Ferraz understands the other reason: a big win would make her the strongest person in the PSOE.\"}],\"countVisitsMax\":1},\"sp_world.la_palma\":{\"id\":\"sp_world.la_palma\",\"title\":\"The volcano\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['la_palma_seen'] || 0)===0) && ((((((Q['year'] || 0)===2021) && ((Q['month'] || 0) >= 9))) || ((Q['year'] || 0) >= 2022))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['la_palma_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_world.palma_aid\",\"title\":{\"content\":[{\"type\":\"conditional\",\"content\":\"Declare a disaster zone and fund the reconstruction \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Demand that the government spends whatever it takes\",\"predicate\":1}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]}},{\"id\":\"@sp_world.palma_visit\",\"title\":\"Visit, listen, and promise not to forget\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The volcano\"},{\"type\":\"paragraph\",\"content\":\"A volcano erupts on La Palma. For three months lava buries homes, farms and banana plantations; seven thousand people are evacuated.\"}],\"countVisitsMax\":1},\"sp_events.campaign_with_diaz\":{\"id\":\"sp_events.campaign_with_diaz\",\"onArrival\":[{\"$code\":\"Q.funds -= 1; Q.diaz_relation += 6; Q.regional_leaders_dissent -= 5; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Andalucía', 'psoe', 1.03); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"The two of you share stages from Almería to Huelva. If she wins, you can share the credit; she will not forget that you came.\",\"type\":\"paragraph\"}},\"sp_world.palma_aid\":{\"id\":\"sp_world.palma_aid\",\"onArrival\":[{\"$code\":\"if (Q.psoe_in_government) { Q.fiscal_adj += 0.05; } Q.rel_cc += 5; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Canarias', 'psoe', 1.03); }\"}],\"content\":{\"content\":\"The islanders remember who came, and who paid.\",\"type\":\"paragraph\"}},\"sp_events.distance_diaz\":{\"id\":\"sp_events.distance_diaz\",\"onArrival\":[{\"$code\":\"Q['diaz_relation'] = (Q['diaz_relation'] || 0) - 6;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) + 2;\"}],\"content\":{\"content\":\"She runs as the face of the Andalusian PSOE, not of yours. The result will be hers alone.\",\"type\":\"paragraph\"}},\"sp_world.palma_visit\":{\"id\":\"sp_world.palma_visit\",\"onArrival\":[{\"$code\":\"Q['rel_cc'] = (Q['rel_cc'] || 0) + 2;\"}],\"content\":{\"content\":\"The visit is appreciated; the help will be measured later.\",\"type\":\"paragraph\"}},\"sp_events.rivera_national\":{\"id\":\"sp_events.rivera_national\",\"title\":\"Ciudadanos goes national\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['rivera_seen'] || 0)===0) && ((Q['year'] || 0)===2015)) && ((Q['month'] || 0) >= 2));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['rivera_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_events.spare_part\",\"title\":\"Call Ciudadanos the PP's spare part\"},{\"id\":\"@sp_events.court_centre\",\"title\":\"Compete for the centre: clean institutions and economic credibility\"},{\"id\":\"@sp_events.ignore_cs\",\"title\":\"Ignore them: the real fight is with Podemos and the PP\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Ciudadanos goes national\"},{\"type\":\"paragraph\",\"content\":\"Albert Rivera, until now known for opposing Catalan independence, takes Ciudadanos across Spain. Young, telegenic and free of corruption cases, he offers \\\"sensible change\\\": regeneration without Podemos's revolution. Disillusioned PP voters, and some of yours, are listening.\"}],\"countVisitsMax\":1},\"sp_world.ukraine\":{\"id\":\"sp_world.ukraine\",\"title\":\"War in Ukraine\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['ukraine_seen'] || 0)===0) && ((((((Q['year'] || 0)===2022) && ((Q['month'] || 0) >= 2))) || ((Q['year'] || 0) >= 2023))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.ukraine_seen = 1; if (Q.psoe_in_government) { Q.fiscal_adj += 0.3; } if (window.SpainGame) { window.SpainGame.econ(Q, -0.8, 0.2); window.SpainGame.migration(Q, 3); }\"}],\"options\":[{\"id\":\"@sp_world.ukraine_arms\",\"title\":\"Send weapons with the EU and NATO\"},{\"id\":\"@sp_world.ukraine_humanitarian\",\"title\":\"Humanitarian aid and refugees, no weapons\"},{\"id\":\"@sp_world.ukraine_refugees\",\"title\":\"Open Spain to Ukrainian refugees, whatever else\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"War in Ukraine\"},{\"type\":\"paragraph\",\"content\":[\"Russia invades Ukraine. Millions flee west; gas and electricity prices explode. \",{\"type\":\"conditional\",\"content\":\"Your coalition partners in Podemos oppose sending weapons.\",\"predicate\":0}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}}]},\"countVisitsMax\":1},\"sp_events.spare_part\":{\"id\":\"sp_events.spare_part\",\"onArrival\":[{\"$code\":\"Q.rel_cs -= 10; Q.progressives_dissent -= 2; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'working', 1); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, 0.3, 0); }\"}],\"content\":{\"content\":\"The label sticks, among your own voters at least.\",\"type\":\"paragraph\"}},\"sp_world.ukraine_arms\":{\"id\":\"sp_world.ukraine_arms\",\"onArrival\":[{\"$code\":\"Q.rel_up -= 10; Q.progressives_dissent += 5; if (window.SpainGame) { window.SpainGame.intl(Q, 'nato', 12); window.SpainGame.intl(Q, 'eu', 6); window.SpainGame.intl(Q, 'us', 8); window.SpainGame.target(Q, 'psoe', 'middle', 1); window.SpainGame.partyRel(Q, 'pp', 'up', -5); }\"}],\"content\":{\"content\":\"Spain stands with its allies. Podemos votes against in Congress, and the coalition creaks.\",\"type\":\"paragraph\"}},\"sp_events.court_centre\":{\"id\":\"sp_events.court_centre\",\"onArrival\":[{\"$code\":\"Q.rel_cs += 3; Q.modernisers_dissent -= 3; Q.progressives_dissent += 3; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'middle', 2.5); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, -0.8, 0); }\"}],\"content\":{\"content\":\"You hold on to more of the professional middle class than the polls expected.\",\"type\":\"paragraph\"}},\"sp_world.ukraine_humanitarian\":{\"id\":\"sp_world.ukraine_humanitarian\",\"onArrival\":[{\"$code\":\"Q.rel_up += 4; if (window.SpainGame) { window.SpainGame.intl(Q, 'nato', -8); window.SpainGame.intl(Q, 'eu', -4); window.SpainGame.intl(Q, 'us', -6); }\"}],\"content\":{\"content\":\"Brussels and Washington notice who is missing from the list.\",\"type\":\"paragraph\"}},\"sp_events.ignore_cs\":{\"id\":\"sp_events.ignore_cs\",\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 1;\"}],\"content\":{\"content\":\"Ciudadanos keeps rising, mostly at the PP's expense, and some at yours.\",\"type\":\"paragraph\"}},\"sp_world.ukraine_refugees\":{\"id\":\"sp_world.ukraine_refugees\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 4); window.SpainGame.intl(Q, 'un', 4); window.SpainGame.target(Q, 'psoe', 'women', 1); }\"}],\"content\":{\"content\":\"Families in Málaga and Valencia take in Ukrainians. For once, almost nobody objects.\",\"type\":\"paragraph\"}},\"sp_events.mayors_of_change\":{\"id\":\"sp_events.mayors_of_change\",\"title\":\"The mayors of change\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['mayors_seen'] || 0)===0) && ((((((Q['year'] || 0)===2015) && ((Q['month'] || 0) >= 6))) || ((Q['year'] || 0) >= 2016))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['mayors_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_events.back_mayors\",\"title\":\"Back the platforms in Madrid and Barcelona, and ask for their votes elsewhere\"},{\"id\":\"@sp_events.own_candidates\",\"title\":\"Insist on PSOE mayors wherever possible\"},{\"id\":\"@sp_events.let_pp\",\"title\":\"Abstain and let the most-voted lists govern\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The mayors of change\"},{\"type\":\"paragraph\",\"content\":\"The municipal elections redraw the map of Spanish cities. Citizen platforms backed by Podemos come close in Madrid, with the former judge Manuela Carmena, and win Barcelona, with the housing activist Ada Colau. In both, they can only govern with the PSOE's votes. Elsewhere, PSOE mayors need Podemos.\"}],\"countVisitsMax\":1},\"sp_world.sahara\":{\"id\":\"sp_world.sahara\",\"title\":\"The letter to Rabat\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['sahara_seen'] || 0)===0) && ((Q['psoe_in_government'] || 0)===1)) && ((Q['ceuta_seen'] || 0)===1)) && ((((((Q['year'] || 0)===2022) && ((Q['month'] || 0) >= 3))) || ((Q['year'] || 0) >= 2023))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['sahara_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_world.sahara_morocco\",\"title\":\"Back Morocco's autonomy plan\"},{\"id\":\"@sp_world.sahara_neutral\",\"title\":\"Keep Spain's neutrality\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The letter to Rabat\"},{\"type\":\"paragraph\",\"content\":\"Morocco offers to end the crisis if Spain backs its plan for autonomy for Western Sahara under Moroccan sovereignty, abandoning Spain's long neutrality. Algeria, which supplies much of Spain's gas and backs the Polisario, warns of consequences.\"}],\"countVisitsMax\":1},\"sp_events.back_mayors\":{\"id\":\"sp_events.back_mayors\",\"onArrival\":[{\"$code\":\"Q.rel_up += 10; Q.rel_cs -= 4; Q.progressives_dissent -= 6; Q.regional_leaders_dissent += 4; Q.mayors_of_change = 1; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'young', 1); window.SpainGame.recalculate(Q); } if (window.SpainGame) { window.SpainGame.position(Q, 0.5, 0.3); }\"}],\"content\":{\"content\":\"Carmena and Colau take office with socialist votes, and the PSOE wins dozens of city halls and regional governments with Podemos's support in return.\",\"type\":\"paragraph\"}},\"sp_world.sahara_morocco\":{\"id\":\"sp_world.sahara_morocco\",\"onArrival\":[{\"$code\":\"Q.rel_up -= 10; Q.progressives_dissent += 8; if (window.SpainGame) { window.SpainGame.intl(Q, 'maghreb', 10); window.SpainGame.intl(Q, 'un', -5); } Q.fiscal_adj += 0.1; if (window.SpainGame) { window.SpainGame.migration(Q, -4); }\"}],\"content\":{\"content\":\"Rabat reopens the borders and cooperates on migration. Algeria freezes its friendship treaty and raises gas prices. Every party in Congress, including your partners, votes to condemn the decision.\",\"type\":\"paragraph\"}},\"sp_events.own_candidates\":{\"id\":\"sp_events.own_candidates\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) - 6;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 3;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) + 3;\"}],\"content\":{\"content\":\"Tough negotiations, city by city. Some deals fail, and the PP keeps a few cities it had lost.\",\"type\":\"paragraph\"}},\"sp_world.sahara_neutral\":{\"id\":\"sp_world.sahara_neutral\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'maghreb', -6); window.SpainGame.intl(Q, 'un', 3); }\"}],\"content\":{\"content\":\"Rabat keeps the pressure on, and the migration routes stay open.\",\"type\":\"paragraph\"}},\"sp_events.let_pp\":{\"id\":\"sp_events.let_pp\",\"onArrival\":[{\"$code\":\"Q.rel_up -= 12; Q.rel_pp += 4; Q.member_morale -= 8; Q.progressives_dissent += 10; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', 'up', {students: 2, workers: 1.5, unemployed: 1.5}); }\"}],\"content\":{\"content\":\"The PP keeps Madrid. Your members cannot believe it, and many of your voters decide Podemos is the only real alternative.\",\"type\":\"paragraph\"}},\"sp_world.pegasus\":{\"id\":\"sp_world.pegasus\",\"title\":\"Pegasus\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['pegasus_seen'] || 0)===0) && ((Q['psoe_in_government'] || 0)===1)) && ((Q['cat_crisis_seen'] || 0)===1)) && ((((((Q['year'] || 0)===2022) && ((Q['month'] || 0) >= 4))) || ((Q['year'] || 0) >= 2023))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.pegasus_seen = 1; Q.rel_erc -= 15; Q.rel_junts -= 10;\"}],\"options\":[{\"id\":\"@sp_world.pegasus_dismiss\",\"title\":\"Dismiss the head of the intelligence service\"},{\"id\":\"@sp_world.pegasus_defend\",\"title\":\"Defend the services: everything was authorised by a judge\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Pegasus\"},{\"type\":\"paragraph\",\"content\":\"Researchers reveal that the phones of dozens of Catalan independence leaders were infected with Pegasus spyware, and later that the Prime Minister's own phone was hacked too, probably from Morocco. ERC suspends its support until there are answers.\"}],\"countVisitsMax\":1},\"sp_events.syriza\":{\"id\":\"sp_events.syriza\",\"title\":\"Syriza gives way\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['syriza_seen'] || 0)===0) && ((((((Q['year'] || 0)===2015) && ((Q['month'] || 0) >= 7))) || ((Q['year'] || 0) >= 2016))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['syriza_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_events.realism\",\"title\":\"Make the case for realistic change within Europe\"},{\"id\":\"@sp_events.solidarity\",\"title\":\"Express solidarity with Greece, and blame Merkel's austerity\"},{\"id\":\"@sp_events.say_nothing\",\"title\":\"Say nothing\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Syriza gives way\"},{\"type\":\"paragraph\",\"content\":\"A week after the Greeks voted \\\"no\\\" to the bailout terms in a referendum, Alexis Tsipras signs a third bailout harsher than the one they rejected. Podemos had made Syriza its model. Its promise that austerity could simply be refused looks much less convincing.\"}],\"countVisitsMax\":1},\"sp_world.pegasus_dismiss\":{\"id\":\"sp_world.pegasus_dismiss\",\"onArrival\":[{\"$code\":\"Q.rel_erc += 12; Q.institutionalists_dissent += 6; if (window.SpainGame) { window.SpainGame.intl(Q, 'nato', -2); }\"}],\"content\":{\"content\":\"ERC returns to the table. The intelligence community is furious.\",\"type\":\"paragraph\"}},\"sp_events.realism\":{\"id\":\"sp_events.realism\",\"onArrival\":[{\"$code\":\"Q.rel_up -= 4; Q.institutionalists_dissent -= 2; if (window.SpainGame) { window.SpainGame.transfer(Q, 'up', 'psoe', {workers: 1, professionals: 1, pensioners: 0.5}); } if (window.SpainGame) { window.SpainGame.position(Q, -0.8, 0); }\"}],\"content\":{\"content\":\"\\\"Change is possible, but it has to be real.\\\" Some of the voters who left for Podemos start to come back.\",\"type\":\"paragraph\"}},\"sp_world.pegasus_defend\":{\"id\":\"sp_world.pegasus_defend\",\"onArrival\":[{\"$code\":\"Q.rel_erc -= 8; Q.institutionalists_dissent -= 3; if (Q.depends_on_catalans && Q.rel_erc < 30) { Q.depends_on_catalans = 0; Q.lost_majority = 1; }\"}],\"content\":{\"content\":\"The services are reassured. ERC is not.\",\"type\":\"paragraph\"}},\"sp_events.solidarity\":{\"id\":\"sp_events.solidarity\",\"onArrival\":[{\"$code\":\"Q.rel_up += 4; Q.progressives_dissent -= 3; Q.modernisers_dissent += 2; if (window.SpainGame) { window.SpainGame.position(Q, 0.8, 0); }\"}],\"content\":{\"content\":\"The left of the party approves. It does little for the PSOE's credibility as a government in waiting.\",\"type\":\"paragraph\"}},\"sp_world.energy_exception\":{\"id\":\"sp_world.energy_exception\",\"title\":\"The Iberian exception\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['energy_seen'] || 0)===0) && ((Q['ukraine_seen'] || 0)===1)) && ((Q['psoe_in_government'] || 0)===1)) && ((((((Q['year'] || 0)===2022) && ((Q['month'] || 0) >= 4))) || ((Q['year'] || 0) >= 2023))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.energy_seen = 1; Q.iberian_ok = (Q.intl && Q.intl.south >= 55 && Q.intl.eu >= 50) ? 1 : 0; if (Q.iberian_ok) { Q.fiscal_adj -= 0.1; if (window.SpainGame) { window.SpainGame.econ(Q, 0.3, -0.1); window.SpainGame.target(Q, 'psoe', 'working', 2); window.SpainGame.target(Q, 'psoe', 'pensioners', 1.5); window.SpainGame.intl(Q, 'south', 4); } } else { if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {pp: 0.6, vox: 0.4}, {workers: 1, pensioners: 1, self_employed: 1}); } }\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The Iberian exception\"},{\"type\":\"paragraph\",\"content\":[\"Electricity bills have tripled. Spain and Portugal ask Brussels to let them cap the price of gas used for electricity, arguing that the Iberian peninsula is an \\\"energy island\\\". \",{\"type\":\"conditional\",\"content\":\"With António Costa at your side and goodwill in Brussels, the Commission agrees. Bills fall within weeks. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"Without allies, the request stalls. Bills keep rising, and so does the anger.\",\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['iberian_ok'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['iberian_ok'] || 0)===0);\"}}]},\"countVisitsMax\":1},\"sp_events.say_nothing\":{\"id\":\"sp_events.say_nothing\",\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 1;\"}],\"content\":{\"content\":\"Podemos's troubles are its own.\",\"type\":\"paragraph\"}},\"sp_world.nato_madrid\":{\"id\":\"sp_world.nato_madrid\",\"title\":\"The Madrid summit\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['nato_madrid_seen'] || 0)===0) && ((Q['psoe_in_government'] || 0)===1)) && ((((((Q['year'] || 0)===2022) && ((Q['month'] || 0) >= 6))) || ((Q['year'] || 0) >= 2023))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.nato_madrid_seen = 1; Q.nato_hosts = (Q.intl && Q.intl.nato >= 55) ? 1 : 0; if (Q.nato_hosts) { Q.sanchez_authority += 4; Q.rel_up -= 4; if (window.SpainGame) { window.SpainGame.intl(Q, 'nato', 5); window.SpainGame.intl(Q, 'us', 5); } }\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The Madrid summit\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"NATO's leaders meet in Madrid, forty years after Spain joined, to adopt a new strategy after the invasion of Ukraine, including, at Spain's insistence, the threats from the alliance's southern flank. Biden, at a dinner in the Prado, calls Spain a model ally. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The alliance chooses another capital for its summit; Spain's allies have doubts about its commitment.\",\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['nato_hosts'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['nato_hosts'] || 0)===0);\"}}]},\"countVisitsMax\":1},\"sp_events.mas_plebiscite\":{\"id\":\"sp_events.mas_plebiscite\",\"title\":\"Mas calls a \\\"plebiscitary\\\" election\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['mas_seen'] || 0)===0) && ((Q['year'] || 0)===2015)) && ((Q['month'] || 0) >= 8)) && ((Q['catalonia_independentist'] || 0)===1));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.mas_seen = 1;\\nif (Q.regions && Q.regions['Cataluña']) {\\n    Q.regions['Cataluña'].nextElection = '2015-09-27';\\n    Q.regions['Cataluña'].lastWasSnap = true;\\n}\"}],\"options\":[{\"id\":\"@sp_events.psc_federal\",\"title\":\"The PSC campaigns for a federal Spain and a negotiated reform\"},{\"id\":\"@sp_events.unionist_front\",\"title\":\"Join a common front of the parties against independence\"},{\"id\":\"@sp_events.psc_alone\",\"title\":\"Leave the campaign to the PSC\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Mas calls a \\\"plebiscitary\\\" election\"},{\"type\":\"paragraph\",\"content\":\"Artur Mas calls Catalan elections for 27 September and declares them a plebiscite on independence. His Convergència and its rival ERC will run on a single list, Junts pel Sí. If it wins a majority, they promise to start the road to independence.\"}],\"countVisitsMax\":1},\"sp_world.eu_presidency\":{\"id\":\"sp_world.eu_presidency\",\"title\":\"The EU presidency\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['eu_presidency_seen'] || 0)===0) && ((((((Q['year'] || 0)===2023) && ((Q['month'] || 0) >= 7))) || ((Q['year'] || 0) >= 2024))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.eu_presidency_seen = 1; if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 4); } if (Q.psoe_in_government) { Q.sanchez_authority += 3; }\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The EU presidency\"},{\"type\":\"paragraph\",\"content\":[\"For six months Spain holds the presidency of the Council of the European Union, chairing the negotiations on migration, artificial intelligence and fiscal rules. \",{\"type\":\"conditional\",\"content\":\"You chair the summits, and the photographs help at home. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The government chairs the summits; the PSOE watches.\",\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]},\"countVisitsMax\":1},\"sp_events.psc_federal\":{\"id\":\"sp_events.psc_federal\",\"onArrival\":[{\"$code\":\"Q.cat_dialogue += 1; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 1.03); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"Iceta's dancing becomes the image of the campaign. The PSC holds its ground better than feared.\",\"type\":\"paragraph\"}},\"sp_world.vox_breakthrough\":{\"id\":\"sp_world.vox_breakthrough\",\"title\":\"Vox breaks through\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((Q['vox_breakthrough_due'] || 0)===1);\"},\"onArrival\":[{\"$code\":\"Q.vox_breakthrough_due = 0; if (window.SpainGame) { window.SpainGame.transferRaw(Q, 'pp', 'vox', {pensioners: 0.8, self_employed: 1.2, workers: 0.6, professionals: 0.6, homemakers: 0.6}); window.SpainGame.transferRaw(Q, 'cs', 'vox', {self_employed: 0.8, workers: 0.6, professionals: 0.6, students: 0.4}); window.SpainGame.partyRel(Q, 'pp', 'vox', 10); }\"}],\"options\":[{\"id\":\"@sp_world.vox_alarm\",\"title\":\"Sound the alarm: \\\"an antifascist front\\\"\"},{\"id\":\"@sp_world.vox_cordon\",\"title\":\"Demand that the PP and Cs build a cordon sanitaire\"},{\"id\":\"@sp_world.vox_issues\",\"title\":\"Answer the anger behind the vote: jobs, rural Spain, housing\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Vox breaks through\"},{\"type\":\"paragraph\",\"content\":[\"For the first time since 1982, a party of the hard right wins seats in a Spanish parliament: Vox enters the assembly of \",{\"type\":\"insert\",\"insert\":0},\". The PP and Ciudadanos immediately start talking about governing with its votes. Every channel invites Santiago Abascal.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['vox_breakthrough_region'] || 0);\"}}]}},\"sp_events.unionist_front\":{\"id\":\"sp_events.unionist_front\",\"onArrival\":[{\"$code\":\"Q.rel_cs += 4; Q.rel_pp += 2; if (window.SpainGame) { window.SpainGame.regionalMod(Q, 'Cataluña', 'cs', 1.05); window.SpainGame.recalculate(Q); }\"}],\"content\":{\"content\":\"The front against independence has a leader, and it is Inés Arrimadas of Ciudadanos, not the PSC.\",\"type\":\"paragraph\"}},\"sp_world.vox_alarm\":{\"id\":\"sp_world.vox_alarm\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent -= 4; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'young', 1.5); window.SpainGame.campaignRaw(Q, 'vox', {pensioners: 0.3, self_employed: 0.3}); }\"}],\"content\":{\"content\":\"Your voters mobilise. So do his.\",\"type\":\"paragraph\"}},\"sp_events.psc_alone\":{\"id\":\"sp_events.psc_alone\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 1;\"}],\"content\":{\"content\":\"The PSC fights alone.\",\"type\":\"paragraph\"}},\"sp_world.vox_cordon\":{\"id\":\"sp_world.vox_cordon\",\"onArrival\":[{\"$code\":\"Q.rel_cs -= 4; Q.rel_pp -= 4; if (window.SpainGame) { window.SpainGame.partyRel(Q, 'cs', 'vox', -8); window.SpainGame.target(Q, 'psoe', 'middle', 1); }\"}],\"content\":{\"content\":\"Ciudadanos refuses to sign anything, then refuses to sit with Vox at the same table, then takes its votes.\",\"type\":\"paragraph\"}},\"sp_events.dissolution_2015\":{\"id\":\"sp_events.dissolution_2015\",\"title\":\"Rajoy dissolves the Cortes\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['legislature_expired'] || 0)===1) && ((Q['elections_held'] || 0)===0)) && ((Q['campaign_line'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q['dissolution_2015_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_events.change\",\"title\":\"Change: no deals with Rajoy, a government of progress\"},{\"id\":\"@sp_events.governing\",\"title\":\"A governing party: serious, moderate, ready from day one\"},{\"id\":\"@sp_events.vs_podemos\",\"title\":\"The only real alternative: Podemos is a risk Spain cannot take\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Rajoy dissolves the Cortes\"},{\"type\":\"paragraph\",\"content\":[\"Mariano Rajoy has run his legislature to the end. He signs the dissolution of the Cortes and calls the general election for \",{\"type\":\"insert\",\"insert\":0},\" \",{\"type\":\"insert\",\"insert\":1},\", the last possible date.\"]},{\"type\":\"paragraph\",\"content\":\"He goes to the country on the economy: Spain is growing again, and unemployment is falling, if from 26% to 21%. Against him: four years of austerity and cuts to health and education; the labour reform; Bárcenas's accounts and the Gürtel trials; the black cards and Púnica; the 2012 bank bailout. The PP still leads the polls, but a long way below the 44.6% that gave it its majority. The majority itself is gone: the question is who will govern without one.\"},{\"type\":\"paragraph\",\"content\":\"Four parties can now win more than 10%. What line does the PSOE take into the campaign?\"}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_year'] || 0);\"}}]}},\"sp_world.vox_issues\":{\"id\":\"sp_world.vox_issues\",\"onArrival\":[{\"$code\":\"Q.trade_unionists_dissent -= 2; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'rural', 1.5); window.SpainGame.social(Q, 1); }\"}],\"content\":{\"content\":\"Less noise, more substance. The effect is slower, and lasts longer.\",\"type\":\"paragraph\"}},\"sp_events.change\":{\"id\":\"sp_events.change\",\"onArrival\":[{\"$code\":\"Q.campaign_line = 1; Q.rel_pp -= 8; Q.rel_up += 6; Q.member_morale += 5; Q.progressives_dissent -= 5;\\nif (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {workers: 1.5, students: 1.5, unemployed: 1}); window.SpainGame.recalculate(Q); }\\nif (window.SpainGame) { window.SpainGame.position(Q, 0.5, 0); }\"}],\"content\":{\"content\":\"You promise that the PSOE will never make Rajoy Prime Minister. It energises the members and closes a door you may later want open.\",\"type\":\"paragraph\"}},\"sp_world.vistalegre_two\":{\"id\":\"sp_world.vistalegre_two\",\"title\":\"Vistalegre II\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['vistalegre_two_seen'] || 0)===0) && ((((((Q['year'] || 0)===2017) && ((Q['month'] || 0) >= 2))) || ((Q['year'] || 0) >= 2018)))) && ((Q['up_running'] || 0)===1));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.vistalegre_two_seen = 1; if (window.SpainGame) { window.SpainGame.transferRaw(Q, 'up', {psoe: 0.7, iu: 0.1, cs: 0.2}, {professionals: 1, students: 0.8, workers: 0.6, unemployed: 0.5}); }\"}],\"options\":[{\"id\":\"@sp_world.vista_door\",\"title\":\"Open the door to disappointed Podemos voters\"},{\"id\":\"@sp_world.vista_silent\",\"title\":\"Say nothing about another party's congress\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Vistalegre II\"},{\"type\":\"paragraph\",\"content\":\"Podemos's second congress becomes a public duel between Pablo Iglesias and Íñigo Errejón: a party of the street against a party that wants to govern. Iglesias wins easily, and Errejón's allies are purged. Some of Podemos's more moderate voters start looking elsewhere.\"}],\"countVisitsMax\":1},\"sp_events.governing\":{\"id\":\"sp_events.governing\",\"onArrival\":[{\"$code\":\"Q.campaign_line = 2; Q.rel_cs += 6; Q.rel_pnv += 3; Q.institutionalists_dissent -= 5; Q.regional_leaders_dissent -= 4;\\nif (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 1.5, professionals: 1, self_employed: 0.5}); window.SpainGame.recalculate(Q); }\\nif (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0); }\"}],\"content\":{\"content\":\"The barons approve. Older and middle-class voters hear a party of government; younger ones hear the past.\",\"type\":\"paragraph\"}},\"sp_world.vista_door\":{\"id\":\"sp_world.vista_door\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.transferRaw(Q, 'up', 'psoe', {professionals: 0.6, students: 0.5}); } Q.rel_up -= 4;\"}],\"content\":{\"content\":\"\\\"The PSOE is the useful vote for change.\\\" Some of them listen.\",\"type\":\"paragraph\"}},\"sp_events.vs_podemos\":{\"id\":\"sp_events.vs_podemos\",\"onArrival\":[{\"$code\":\"Q.campaign_line = 3; Q.rel_up -= 12; Q.regional_leaders_dissent -= 6; Q.progressives_dissent += 5;\\nif (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 2, homemakers: 1.5, students: -1}); window.SpainGame.recalculate(Q); }\\nif (window.SpainGame) { window.SpainGame.position(Q, -0.5, 0); }\"}],\"content\":{\"content\":\"Your attacks on Iglesias hold the PSOE's older voters. Podemos will remember them when the talking starts.\",\"type\":\"paragraph\"}},\"sp_world.vista_silent\":{\"id\":\"sp_world.vista_silent\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 2;\"}],\"content\":{\"content\":\"Podemos notices your discretion.\",\"type\":\"paragraph\"}},\"sp_events.finance_crisis\":{\"id\":\"sp_events.finance_crisis\",\"title\":\"The treasurer's report\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['deep_debt'] || 0)===1) && ((Q['sanchez_leader'] || 0)===1)) && ((Q['finance_crisis_year'] || 0) < (Q['year'] || 0)));\"},\"onArrival\":[{\"$code\":\"Q.finance_crisis_year = Q.year;\"}],\"options\":[{\"id\":\"@sp_events.cut_staff\",\"title\":\"Cut Ferraz's staff and campaign budget\"},{\"id\":\"@sp_events.appeal_members\",\"title\":\"Appeal to the members for an emergency contribution\"},{\"id\":\"@sp_events.blame_predecessors\",\"title\":\"Blame the debts inherited from the previous leadership\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The treasurer's report\"},{\"type\":\"paragraph\",\"content\":[\"The party treasurer brings the Federal Executive a report it cannot ignore: the PSOE owes \",{\"type\":\"insert\",\"insert\":0},\" in party funds' worth to banks and suppliers, staff are being paid late, and the federations are asking where their money has gone. Your critics are already saying that a man who cannot run the party's accounts cannot run the country's.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['funds_display'] || 0);\"}}]}},\"sp_world.chalet\":{\"id\":\"sp_world.chalet\",\"title\":\"The chalet in Galapagar\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['chalet_seen'] || 0)===0) && ((((((Q['year'] || 0)===2018) && ((Q['month'] || 0) >= 5))) || ((Q['year'] || 0) >= 2019)))) && ((Q['up_running'] || 0)===1));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.chalet_seen = 1; if (window.SpainGame) { window.SpainGame.transferRaw(Q, 'up', {psoe: 0.6, iu: 0.2, mp: 0.2}, {workers: 0.8, unemployed: 0.8, students: 0.6, pensioners: 0.3}); }\"}],\"options\":[{\"id\":\"@sp_world.chalet_mock\",\"title\":\"Let your people mock it\"},{\"id\":\"@sp_world.chalet_above\",\"title\":\"Stay above it\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The chalet in Galapagar\"},{\"type\":\"paragraph\",\"content\":\"Pablo Iglesias and Irene Montero buy a €600,000 house with a pool in the Madrid hills. The man who mocked politicians for living in villas puts his leadership to a vote of the members, and survives it. The damage to Podemos's image does not go away.\"}],\"countVisitsMax\":1},\"sp_events.cut_staff\":{\"id\":\"sp_events.cut_staff\",\"onArrival\":[{\"$code\":\"Q['funds'] = (Q['funds'] || 0) + 3;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) - 6;\\nQ['member_morale'] = (Q['member_morale'] || 0) - 4;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) + 6;\"}],\"content\":{\"content\":\"Dozens of party staff are let go, many of them your own people. The books improve; the loyalty of your team does not.\",\"type\":\"paragraph\"}},\"sp_world.chalet_mock\":{\"id\":\"sp_world.chalet_mock\",\"onArrival\":[{\"$code\":\"Q.rel_up -= 8; if (window.SpainGame) { window.SpainGame.target(Q, 'psoe', 'working', 1); }\"}],\"content\":{\"content\":\"The jokes write themselves. Podemos will remember who told them.\",\"type\":\"paragraph\"}},\"sp_events.appeal_members\":{\"id\":\"sp_events.appeal_members\",\"onArrival\":[{\"$code\":\"Q['funds'] = (Q['funds'] || 0) + 2;\\nQ['member_morale'] = (Q['member_morale'] || 0) - 6;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 3;\"}],\"content\":{\"content\":\"The members pay, and some of them ask why they have to.\",\"type\":\"paragraph\"}},\"sp_world.chalet_above\":{\"id\":\"sp_world.chalet_above\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 3;\"}],\"content\":{\"content\":\"\\\"Where people live is their own business.\\\"\",\"type\":\"paragraph\"}},\"sp_events.blame_predecessors\":{\"id\":\"sp_events.blame_predecessors\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 4;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 10;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 6;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 6;\"}],\"content\":{\"content\":\"The old guard takes it personally. The debts are still there.\",\"type\":\"paragraph\"}},\"sp_world.canaries\":{\"id\":\"sp_world.canaries\",\"title\":\"The Canary route\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['canaries_seen'] || 0)===0) && ((((((Q['year'] || 0)===2020) && ((Q['month'] || 0) >= 10))) || ((Q['year'] || 0) >= 2021))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.canaries_seen = 1; if (window.SpainGame) { window.SpainGame.migration(Q, 10); }\"}],\"options\":[{\"id\":\"@sp_world.can_transfer\",\"title\":\"Share them out across Spain and invest in reception\"},{\"id\":\"@sp_world.can_return\",\"title\":\"Speed up returns to Morocco and Senegal\"},{\"id\":\"@sp_world.can_europe\",\"title\":\"Ask the EU for a common response\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The Canary route\"},{\"type\":\"paragraph\",\"content\":[\"More than twenty thousand people reach the Canary Islands in small boats this year, eight times more than last. Thousands sleep on the dock at Arguineguín. \",{\"type\":\"conditional\",\"content\":\"The islands' government demands that you transfer migrants to the mainland. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The government is overwhelmed; Vox holds a rally on the dock.\",\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}}]},\"countVisitsMax\":1},\"sp_events.finance_ouster\":{\"id\":\"sp_events.finance_ouster\",\"title\":\"Removed over the finances\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['ruinous_debt'] || 0)===1) && ((Q['sanchez_leader'] || 0)===1)) && ((Q['federal_committee_balance'] || 0) < 55));\"},\"onArrival\":[{\"$code\":\"Q.sanchez_leader = 0;\\nif (Q.in_leadership_window) { Q.leadership_exception_open = 1; }\\nif (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {up: 0.5, cs: 0.5}, {students: 1, workers: 1, professionals: 1}); }\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Removed over the finances\"},{\"type\":\"paragraph\",\"content\":\"With the party unable to pay its own campaign debts, the Federal Committee meets in emergency session. The regional leaders, the old guard and even some of your own executive vote to remove you for \\\"the ruinous management of the party\\\". A caretaker committee takes over Ferraz.\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"conditional\",\"content\":\"The members have not spoken yet. The next primary is due in May 2017.\",\"predicate\":0}}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['leadership_exception_open'] || 0)===1);\"}}]}},\"sp_world.can_transfer\":{\"id\":\"sp_world.can_transfer\",\"onArrival\":[{\"$code\":\"Q.rel_cc += 6; if (window.SpainGame) { window.SpainGame.social(Q, 1); window.SpainGame.intl(Q, 'un', 3); window.SpainGame.migration(Q, 3); window.SpainGame.position(Q, 0, 0.5); } if (Q.psoe_in_government) { Q.fiscal_adj += 0.05; }\"}],\"content\":{\"content\":\"Humane, and visible: the camps in each region become local news.\",\"type\":\"paragraph\"}},\"sp_events.cat_155_gov\":{\"id\":\"sp_events.cat_155_gov\",\"title\":\"Independence declared\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['catalan_crisis'] || 0)===1) && ((Q['cat_crisis_stage'] || 0)===2)) && ((Q['time'] || 0) >= ((Q['cat_stage_time'] || 0) + 1))) && ((Q['psoe_in_government'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q.cat_crisis_stage = 3;\"}],\"options\":[{\"id\":\"@sp_events.gov_155_elections\",\"title\":\"Apply Article 155 and call Catalan elections at once\"},{\"id\":\"@sp_events.gov_155_long\",\"title\":\"Apply Article 155 indefinitely, until order is restored\"},{\"id\":\"@sp_events.gov_no_155\",\"title\":\"Refuse Article 155: negotiate with the Generalitat\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Independence declared\"},{\"type\":\"paragraph\",\"content\":[\"The Parliament of Catalonia votes a declaration of independence. The decision is yours: as Prime Minister, only you can ask the Senate to authorise Article 155, and the PP's majority there will grant it. \",{\"type\":\"conditional\",\"content\":\"Your government survives on the votes of the very parties that have just declared independence.\",\"predicate\":0}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['depends_on_catalans'] || 0)===1);\"}}]}},\"sp_world.can_return\":{\"id\":\"sp_world.can_return\",\"onArrival\":[{\"$code\":\"Q.progressives_dissent += 5; if (window.SpainGame) { window.SpainGame.migration(Q, -5); window.SpainGame.intl(Q, 'maghreb', 3); window.SpainGame.position(Q, 0, -0.6); }\"}],\"content\":{\"content\":\"Arrivals slow. Human rights groups and your own left are unhappy.\",\"type\":\"paragraph\"}},\"sp_events.gov_155_elections\":{\"id\":\"sp_events.gov_155_elections\",\"onArrival\":[{\"$code\":\"Q.rel_pp += 8; Q.rel_cs += 8; Q.rel_erc -= 20; Q.rel_junts -= 25; Q.rel_up -= 6; Q.regional_leaders_dissent -= 10; Q.progressives_dissent += 6; Q.cat_hard_line += 1;\\nif (Q.regions && Q.regions['Cataluña']) { var y = Q.year, m = Q.month + 2; if (m > 12) { m -= 12; y += 1; } Q.regions['Cataluña'].nextElection = y + '-' + (m < 10 ? '0' : '') + m + '-21'; Q.regions['Cataluña'].lastWasSnap = true; }\\nif (Q.depends_on_catalans) { Q.depends_on_catalans = 0; Q.lost_majority = 1; }\\nif (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 1.5, homemakers: 1, self_employed: 0.5}); window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 0.97); window.SpainGame.partyRel(Q, 'erc', 'up', -5); window.SpainGame.position(Q, 0, -1); }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"The Catalan government is dismissed and elections are called. Most of Spain backs you; the PSC holds its own. \",{\"type\":\"conditional\",\"content\":\"ERC and Junts will never vote with you again: your government no longer has a majority.\",\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['lost_majority'] || 0)===1);\"}}]}},\"sp_world.can_europe\":{\"id\":\"sp_world.can_europe\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.intl(Q, 'eu', 2); }\"}],\"content\":{\"content\":\"Brussels promises a pact on migration, eventually.\",\"type\":\"paragraph\"}},\"sp_world\":{\"id\":\"sp_world\",\"type\":\"scene\",\"title\":\"The Security Council vote\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['unsc_seen'] || 0)===0) && ((((((Q['year'] || 0)===2014) && ((Q['month'] || 0) >= 10))) || ((Q['year'] || 0) >= 2015))));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['unsc_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_world.unsc_back\",\"title\":\"Back the bid publicly: this is Spain's seat, not the PP's\"},{\"id\":\"@sp_world.unsc_criticise\",\"title\":\"Back the bid, but criticise the government's aid cuts\"},{\"id\":\"@sp_world.unsc_silent\",\"title\":\"Say nothing\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The Security Council vote\"},{\"type\":\"paragraph\",\"content\":\"Spain is competing with Turkey and New Zealand for two non-permanent seats on the UN Security Council for 2015–2016. The government's diplomats have lobbied for years; the vote in the General Assembly is days away. Rajoy asks the opposition to show a united front.\"}],\"countVisitsMax\":1},\"sp_events.gov_155_long\":{\"id\":\"sp_events.gov_155_long\",\"onArrival\":[{\"$code\":\"Q.rel_pp += 10; Q.rel_cs += 10; Q.rel_erc -= 30; Q.rel_junts -= 30; Q.rel_up -= 15; Q.rel_pnv -= 10; Q.progressives_dissent += 15; Q.regional_leaders_dissent -= 12; Q.cat_hard_line += 2;\\nif (Q.regions && Q.regions['Cataluña']) { var y = Q.year + 1, m = Q.month; Q.regions['Cataluña'].nextElection = y + '-' + (m < 10 ? '0' : '') + m + '-21'; Q.regions['Cataluña'].lastWasSnap = true; }\\nif (Q.depends_on_catalans) { Q.depends_on_catalans = 0; Q.lost_majority = 1; }\\nif (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 2, homemakers: 1.5}); window.SpainGame.transfer(Q, 'psoe', 'up', {students: 1.5, workers: 1}); window.SpainGame.regionalMod(Q, 'Cataluña', 'psoe', 0.92); window.SpainGame.territorial(Q, 'Cataluña', 'erc', 1.1); window.SpainGame.position(Q, 0, -2); }\"}],\"content\":{\"content\":\"Direct rule from Madrid for a year. The State is in control; in Catalonia, the independence movement has never been stronger, and the PNV is alarmed.\",\"type\":\"paragraph\"}},\"sp_events.gov_no_155\":{\"id\":\"sp_events.gov_no_155\",\"onArrival\":[{\"$code\":\"Q.rel_pp -= 20; Q.rel_cs -= 25; Q.rel_erc += 10; Q.rel_junts += 10; Q.rel_up += 6; Q.regional_leaders_dissent += 35; Q.institutionalists_dissent += 20; Q.federal_committee_balance -= 15; Q.sanchez_authority -= 10; Q.cat_dialogue += 2;\\nif (Q.regions && Q.regions['Cataluña']) { var y = Q.year, m = Q.month + 4; if (m > 12) { m -= 12; y += 1; } Q.regions['Cataluña'].nextElection = y + '-' + (m < 10 ? '0' : '') + m + '-21'; Q.regions['Cataluña'].lastWasSnap = true; }\\nif (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {pp: 0.4, cs: 0.4, vox: 0.2}, {pensioners: 3, homemakers: 2.5, self_employed: 2, workers: 1.5, professionals: 1}); window.SpainGame.campaign(Q, 'vox', {pensioners: 2, self_employed: 2, workers: 1.5}); window.SpainGame.position(Q, 0, 3); }\"}],\"content\":{\"content\":\"You refuse to suspend autonomy and open talks. The PP and Ciudadanos call it treason and fill the streets of Madrid; the barons openly discuss replacing you. The Generalitat agrees to new Catalan elections in four months.\",\"type\":\"paragraph\"}},\"sp_events.partners_price\":{\"id\":\"sp_events.partners_price\",\"title\":\"Your partners' price\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['catalan_crisis'] || 0)===1) && ((Q['psoe_in_government'] || 0)===1)) && ((Q['depends_on_catalans'] || 0)===1)) && ((Q['partners_price_seen'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q['partners_price_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_events.concede_talks\",\"title\":\"Open talks that include their demands\"},{\"id\":\"@sp_events.dialogue_only\",\"title\":\"A dialogue table, but no referendum\"},{\"id\":\"@sp_events.refuse_partners\",\"title\":\"Refuse: you will not negotiate the unity of Spain\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Your partners' price\"},{\"type\":\"paragraph\",\"content\":\"ERC and Junts remind you that your government exists because of their votes. Their price for keeping it alive: a negotiation on a self-determination referendum, and the release of the jailed independence leaders.\"}]},\"sp_events.concede_talks\":{\"id\":\"sp_events.concede_talks\",\"onArrival\":[{\"$code\":\"Q.rel_erc += 15; Q.rel_junts += 15; Q.cat_dialogue += 2; Q.regional_leaders_dissent += 25; Q.rel_cs -= 20; Q.rel_pp -= 15; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {pp: 0.4, cs: 0.35, vox: 0.25}, {pensioners: 2.5, homemakers: 2, self_employed: 1.5, workers: 1}); window.SpainGame.position(Q, 0, 2.5); window.SpainGame.partyRel(Q, 'cs', 'pp', 10); }\"}],\"content\":{\"content\":\"Your majority survives. Ciudadanos and the PP accuse you of selling Spain; across the country, moderates are listening to them.\",\"type\":\"paragraph\"}},\"sp_events.dialogue_only\":{\"id\":\"sp_events.dialogue_only\",\"onArrival\":[{\"$code\":\"Q.rel_erc += 5; Q.rel_junts -= 5; Q.cat_dialogue += 1; Q.regional_leaders_dissent += 8; if (window.SpainGame) { window.SpainGame.transfer(Q, 'psoe', {pp: 0.5, cs: 0.5}, {pensioners: 1, homemakers: 1}); window.SpainGame.position(Q, 0, 1); }\"}],\"content\":{\"content\":\"ERC accepts the table, for now. Junts calls it a trap. Your majority hangs on ERC's patience.\",\"type\":\"paragraph\"}},\"sp_events.refuse_partners\":{\"id\":\"sp_events.refuse_partners\",\"onArrival\":[{\"$code\":\"Q.rel_erc -= 20; Q.rel_junts -= 20; Q.depends_on_catalans = 0; Q.lost_majority = 1; Q.regional_leaders_dissent -= 10; Q.sanchez_authority += 3; if (window.SpainGame) { window.SpainGame.campaign(Q, 'psoe', {pensioners: 1.5, homemakers: 1}); window.SpainGame.position(Q, 0, -1); }\"}],\"content\":{\"content\":\"The country's majority applauds. In Congress, you no longer have one: every vote from now on is a negotiation.\",\"type\":\"paragraph\"}},\"sp_events.king_nominates_psoe\":{\"id\":\"sp_events.king_nominates_psoe\",\"title\":\"The King nominates you\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((((((Q['acting'] || 0)===1) && ((Q['psoe_largest'] || 0)===1)) && ((Q['pp_asked'] || 0) < (Q['formation_round'] || 0))) && ((Q['election_year'] || 0)===0)) && ((Q['investiture_votes'] || 0)===0)) && ((Q['formation_weeks'] || 0) >= 2)) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q.pp_asked = Q.formation_round || 1; Q.sanchez_nominated = 1; Q.sanchez_authority += 5; Q.member_morale += 5;\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The King nominates you\"},{\"type\":\"paragraph\",\"content\":\"The PSOE is the largest party in Congress. After his consultations, the King proposes you as candidate for President of the Government. The right will vote against; everything depends on the deals you can strike. (Use the \\\"Seek investiture\\\" card when you are ready.)\"}]},\"sp_events.king_second_round\":{\"id\":\"sp_events.king_second_round\",\"title\":\"The King's second round\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((((((Q['acting'] || 0)===1) && ((Q['right_failed_vote'] || 0)===1)) && ((Q['investiture_clock'] || 0) > 0)) && ((Q['sanchez_nominated'] || 0)===0)) && ((Q['sanchez_leader'] || 0)===1)) && ((Q['election_year'] || 0)===0)) && ((Q['king_second_asked'] || 0) < (Q['formation_round'] || 0)));\"},\"onArrival\":[{\"$code\":\"Q.king_second_asked = Q.formation_round || 1;\"}],\"options\":[{\"id\":\"@sp_events.second_accept\",\"title\":\"Accept the nomination and seek a majority\"},{\"id\":\"@sp_events.second_refuse\",\"title\":\"Decline: let the clock run out\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The King's second round\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"insert\",\"insert\":0},\" has lost the vote in Congress. The two-month clock is running. The King calls a new round of consultations and asks whether you can find the votes.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['right_leader'] || 0);\"}}]}},\"sp_events.second_accept\":{\"id\":\"sp_events.second_accept\",\"onArrival\":[{\"$code\":\"Q['sanchez_nominated'] = 1;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 3;\"}],\"content\":{\"content\":\"You are the candidate. (Use the \\\"Seek investiture\\\" card when your partners are ready.)\",\"type\":\"paragraph\"}},\"sp_events.second_refuse\":{\"id\":\"sp_events.second_refuse\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 2;\"}],\"content\":{\"content\":\"The clock keeps running towards a new election.\",\"type\":\"paragraph\"}},\"sp_events\":{\"id\":\"sp_events\",\"type\":\"scene\",\"title\":\"Federal Committee: the red lines\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['red_lines_seen'] || 0)===0) && ((Q['elections_held'] || 0) >= 1)) && ((Q['morning_seen'] || 0)===1)) && ((Q['year'] || 0)===2015));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['red_lines_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_events.accept\",\"title\":\"Accept the red lines as written\"},{\"id\":\"@sp_events.soften\",\"title\":\"Accept the principle, but negotiate the wording\"},{\"id\":\"@sp_events.defy\",\"title\":\"Refuse: the leadership must be free to negotiate\"}],\"content\":[{\"type\":\"heading\",\"content\":\"28 December 2015 — The Federal Committee\"},{\"type\":\"paragraph\",\"content\":\"The regional barons arrive at Ferraz with a resolution already drafted. The PSOE will not negotiate with any party that supports a self-determination referendum for Catalonia, and Sánchez must bring any agreement back to the Federal Committee.\"},{\"type\":\"paragraph\",\"content\":\"Susana Díaz's allies call it a guarantee of the party's identity. Your team calls it a cage.\"}],\"countVisitsMax\":1}},\"qualities\":{},\"qdisplays\":{\"coalition_dissent\":{\"id\":\"coalition_dissent\",\"type\":\"qdisplay\",\"content\":[{\"max\":0,\"output\":\"very low\"},{\"min\":1,\"max\":1,\"output\":\"low\"},{\"min\":2,\"max\":2,\"output\":\"medium\"},{\"min\":3,\"max\":3,\"output\":\"high\"},{\"min\":4,\"output\":\"very high\"}]},\"dissent\":{\"id\":\"dissent\",\"type\":\"qdisplay\",\"content\":[{\"max\":4.999,\"output\":\"very low\"},{\"min\":4.999,\"max\":14.999,\"output\":\"low\"},{\"min\":14.999,\"max\":30.999,\"output\":\"medium\"},{\"min\":30.999,\"max\":49.999,\"output\":\"high\"},{\"min\":49.999,\"output\":\"very high\"}]},\"loyalty\":{\"id\":\"loyalty\",\"type\":\"qdisplay\",\"content\":[{\"max\":0.06,\"output\":\"completely disloyal\"},{\"min\":0.06,\"max\":0.19,\"output\":\"very disloyal\"},{\"min\":0.19,\"max\":0.31,\"output\":\"generally disloyal\"},{\"min\":0.31,\"max\":0.41,\"output\":\"mostly disloyal\"},{\"min\":0.41,\"max\":0.54,\"output\":\"divided\"},{\"min\":0.54,\"max\":0.71,\"output\":\"mostly loyal\"},{\"min\":0.71,\"max\":0.95,\"output\":\"generally loyal\"},{\"min\":0.95,\"output\":\"completely loyal\"}]},\"militancy\":{\"id\":\"militancy\",\"type\":\"qdisplay\",\"content\":[{\"max\":0.05,\"output\":\"Nonexistant\"},{\"min\":0.05,\"max\":0.14,\"output\":\"Very low\"},{\"min\":0.14,\"max\":0.24,\"output\":\"Low\"},{\"min\":0.24,\"max\":0.44,\"output\":\"Medium-low\"},{\"min\":0.44,\"max\":0.69,\"output\":\"Medium\"},{\"min\":0.69,\"max\":1,\"output\":\"High\"},{\"min\":1,\"output\":\"Very high\"}]},\"month\":{\"id\":\"month\",\"type\":\"qdisplay\",\"content\":[{\"min\":1,\"max\":1,\"output\":\"January\"},{\"min\":2,\"max\":2,\"output\":\"February\"},{\"min\":3,\"max\":3,\"output\":\"March\"},{\"min\":4,\"max\":4,\"output\":\"April\"},{\"min\":5,\"max\":5,\"output\":\"May\"},{\"min\":6,\"max\":6,\"output\":\"June\"},{\"min\":7,\"max\":7,\"output\":\"July\"},{\"min\":8,\"max\":8,\"output\":\"August\"},{\"min\":9,\"max\":9,\"output\":\"September\"},{\"min\":10,\"max\":10,\"output\":\"October\"},{\"min\":11,\"max\":11,\"output\":\"November\"},{\"min\":12,\"max\":12,\"output\":\"December\"}]},\"relationships\":{\"id\":\"relationships\",\"type\":\"qdisplay\",\"content\":[{\"max\":5,\"output\":\"hostile\"},{\"min\":5,\"max\":14.9,\"output\":\"frigid\"},{\"min\":14.9,\"max\":29.9,\"output\":\"cold\"},{\"min\":29.9,\"max\":39.9,\"output\":\"cool\"},{\"min\":39.9,\"max\":54.9,\"output\":\"neutral\"},{\"min\":54.9,\"max\":64.9,\"output\":\"warm\"},{\"min\":64.9,\"max\":74.9,\"output\":\"friendly\"},{\"min\":74.9,\"output\":\"very friendly\"}]},\"taxation\":{\"id\":\"taxation\",\"type\":\"qdisplay\",\"content\":[{\"max\":-6,\"output\":\"extremely low\"},{\"min\":-5,\"max\":-4,\"output\":\"very low\"},{\"min\":-3,\"max\":-2,\"output\":\"low\"},{\"min\":-1,\"max\":-1,\"output\":\"below baseline\"},{\"min\":0,\"max\":0,\"output\":\"moderate\"},{\"min\":1,\"max\":1,\"output\":\"above baseline\"},{\"min\":2,\"max\":3,\"output\":\"high\"},{\"min\":4,\"max\":5,\"output\":\"very high\"},{\"min\":6,\"output\":\"extremely high\"}]},\"strength\":{\"id\":\"strength\",\"type\":\"qdisplay\",\"content\":[{\"min\":0,\"max\":10,\"output\":\"weak\"},{\"min\":10,\"max\":25,\"output\":\"moderate\"},{\"min\":25,\"max\":40,\"output\":\"strong\"},{\"min\":40,\"max\":60,\"output\":\"very strong\"},{\"min\":60,\"output\":\"dominant\"}]}},\"tagLookup\":{\"sp_exile\":{\"sp_exile.book\":true,\"sp_exile.organise\":true,\"sp_exile.bid\":true,\"sp_exile.bridge\":true,\"sp_exile.exile_funds\":true,\"sp_exile.low_profile\":true,\"sp_exile\":true},\"sp_catalonia\":{\"sp_catalonia.dialogue\":true,\"sp_catalonia.psc\":true,\"sp_catalonia.federal_reform\":true,\"sp_catalonia\":true},\"sp_advisor\":{\"sp_advisers.candidacy\":true,\"sp_advisers.organisation\":true,\"sp_advisers.lastra\":true,\"sp_advisers.redondo\":true,\"sp_advisers.montero\":true,\"sp_advisers\":true},\"sp_event\":{\"sp_events.iglesias_offer\":true,\"sp_world.geringonca\":true,\"sp_leadership.lead_challenge\":true,\"sp_events.pp_round\":true,\"sp_world.brexit\":true,\"sp_leadership.lead_forced\":true,\"sp_world.barcelona_attack\":true,\"sp_leadership.exile\":true,\"sp_world.la_manada\":true,\"sp_events.king_turns\":true,\"sp_events.dissolution\":true,\"sp_leadership.comeback\":true,\"sp_world.cifuentes\":true,\"sp_events.general_election\":true,\"sp_events.regional_elections\":true,\"sp_events.federal_committee\":true,\"sp_leadership.player_line\":true,\"sp_world.aquarius\":true,\"sp_events.primary\":true,\"sp_world.nato_two_percent\":true,\"sp_events.deadlock_vote\":true,\"sp_events.morning_after\":true,\"sp_leadership.auto_government\":true,\"sp_leadership.pp_leader_falls\":true,\"sp_world.tariffs\":true,\"sp_events.gurtel\":true,\"sp_events.cat_referendum_law\":true,\"sp_leadership\":true,\"sp_world.mas_pais\":true,\"sp_events.cat_1o\":true,\"sp_world.cat_sentence\":true,\"sp_events.cat_155\":true,\"sp_world.rivera_resigns\":true,\"sp_events.cat_crisis_end\":true,\"sp_world.covid\":true,\"sp_events.vox_vistalegre\":true,\"sp_events.brussels\":true,\"sp_world.recovery_fund\":true,\"sp_events.gallardon\":true,\"sp_world.emeritus\":true,\"sp_events.black_cards\":true,\"sp_world.ayuso\":true,\"sp_events.vistalegre_podemos\":true,\"sp_world.ceuta\":true,\"sp_events.nine_n\":true,\"sp_world.pardons\":true,\"sp_events.diaz_snap\":true,\"sp_world.la_palma\":true,\"sp_events.rivera_national\":true,\"sp_world.ukraine\":true,\"sp_events.mayors_of_change\":true,\"sp_world.sahara\":true,\"sp_world.pegasus\":true,\"sp_events.syriza\":true,\"sp_world.energy_exception\":true,\"sp_world.nato_madrid\":true,\"sp_events.mas_plebiscite\":true,\"sp_world.eu_presidency\":true,\"sp_world.vox_breakthrough\":true,\"sp_events.dissolution_2015\":true,\"sp_world.vistalegre_two\":true,\"sp_events.finance_crisis\":true,\"sp_world.chalet\":true,\"sp_world.canaries\":true,\"sp_events.finance_ouster\":true,\"sp_events.cat_155_gov\":true,\"sp_world\":true,\"sp_events.partners_price\":true,\"sp_events.king_nominates_psoe\":true,\"sp_events.king_second_round\":true,\"sp_events\":true},\"sp_national\":{\"sp_national.rally\":true,\"sp_national.debate\":true,\"sp_national.corruption\":true,\"sp_national.pensions_campaign\":true,\"sp_national.feminism\":true,\"sp_national.censure\":true,\"sp_national.campaign_ads\":true,\"sp_national.media_appearance\":true,\"sp_national.campaign_tour\":true,\"sp_national.pes_contacts\":true,\"sp_national\":true},\"sp_party\":{\"sp_party.membership\":true,\"sp_party.federal_exec\":true,\"sp_party.ugt\":true,\"sp_party.juventudes\":true,\"sp_party.programme\":true,\"sp_party.agrupaciones\":true,\"sp_party.fundraising\":true,\"sp_party.dues\":true,\"sp_party.intl_network\":true,\"sp_party\":true},\"sp_government\":{\"sp_government.minimum_wage\":true,\"sp_government.memory\":true,\"sp_government.pensions\":true,\"sp_government.labour\":true,\"sp_government.reshuffle\":true,\"sp_government.tax_reform\":true,\"sp_government.foreign_tour\":true,\"sp_government\":true},\"sp_negotiations\":{\"sp_negotiations.podemos_question\":true,\"sp_negotiations.cs_channel\":true,\"sp_negotiations.small_parties\":true,\"sp_negotiations.party_offer\":true,\"sp_negotiations.back_iglesias\":true,\"sp_negotiations\":true}}}"};(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function() {
  'use strict';

  // To avoid the need to include any utility libraries when this is
  // used in a browser, define some helper functions we'd normally
  // rely on libraries for.

  var assert = function(mustBeTrue) {
    /* istanbul ignore if */
    if (!mustBeTrue) {
      throw new Error('Assertion failed.');
    }
  };

  var each = function(array, fn) {
    for (var i = 0; i < array.length; ++i) {
      fn(array[i]);
    }
  };

  var objEach = function(obj, fn) {
    for (var key in obj) {
      fn(key, obj[key]);
    }
  };

  var merge = function() {
    var result = {};
    for (var i = 0; i < arguments.length; ++i) {
      var obj = arguments[i];
      for (var key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  };

  // Credit: Taken from Lodash (MIT License). See CREDITS.
  var isObject = function(value) {
    var type = typeof value;
    return type === 'function' || (value && type === 'object') || false;
  };

  var makeFunctionFromSource = function(source) {
    source = source.trim();
    /*jshint -W054 */
    var fn = new Function('state', 'Q', source);
    /*jshint +W054 */
    fn.source = source;
    return fn;
  };

  var runActions = function(actions, context, state) {
    if (actions === undefined) {
      return;
    }
    each(actions, function(fn) {
      try {
        fn.call(context, state, state.qualities);
      } catch (err) {
        // Ignore errors. TODO: Log them somehow?
        console.log('Error:', err);
      }
    });
  };

  var runPredicate = function(predicate, default_, context, state) {
    var result = default_;
    if (predicate === undefined) {
      return result;
    }
    try {
      result = !!predicate.call(context, state, state.qualities);
    } catch (err) {
      // Ignore errors. TODO: Log them somehow?
      console.log('Error:', err);
    }
    return result;
  };

  var runExpression = function(expression, default_, context, state) {
    var result = default_;
    if (expression === undefined) {
      return result;
    }
    try {
      result = expression.call(context, state, state.qualities);
    } catch (err) {
      // Ignore errors. TODO: Log them somehow?
      console.log('Error in expression', expression, ':', err);
    }
    return result;
  };

  var convertJSONToGame = function(json, callback) {
    var reviver = function(key, value) {
      if (isObject(value) && value.$code !== undefined) {
        return makeFunctionFromSource(value.$code);
      } else {
        return value;
      }
    };

    try {
      var game = JSON.parse(json, reviver);
      return callback(null, game);
    } catch (err) {
      return callback(err);
    }
  };

  var simpleContent = function(text) {
    return [{type:'paragraph', content:text}];
  };

  var getCardinalNumber = function(value) {
    if (Math.floor(value) === value && value >= 0 && value <= 12) {
      // Integer, so use word.
      return ['zero', 'one', 'two', 'three', 'four', 'five', 'six',
              'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][value];
    } else {
      return value.toString();
    }
  };

  var getOrdinalNumber = function(value) {
    if (Math.floor(value) === value && value >= 0) {
      if (value <= 12) {
        return ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth',
                'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh',
                'twelfth'][value];
      } else {
        value = value.toString();
        if (/1[0-9]$/.test(value)) {
          return value + 'th';
        } else {
          var last = value.substr(value.length - 1, 1);
          switch (last) {
            case '1': return value + 'st';
            case '2': return value + 'nd';
            case '3': return value + 'rd';
            default: return value + 'th';
          }
        }
      }
    } else {
      return value.toString();
    }
  };

  var getFudgeDisplay = function(value) {
    if (Math.floor(value) === value) {
      if (value > 3) {
        return 'superb+' + (value - 3);
      } else if (value < -3) {
        return 'terrible' + (value + 3);
      } else {
        switch (value) {
          case  3: return 'superb';
          case  2: return 'great';
          case  1: return 'good';
          case  0: return 'fair';
          case -1: return 'mediocre';
          case -2: return 'poor';
          case -3: return 'terrible';
        }
      }
    } else {
      return value.toString();
    }
  };

  var getUserQDisplay = function(value, qdisplay) {
    for (var i = 0; i < qdisplay.content.length; ++i) {
      var case_ = qdisplay.content[i];
      var min = case_.min;
      var max = case_.max;
      if ((min === undefined || min <= value) &&
          (max === undefined || max >= value)) {
        if (case_.output !== undefined) {
          return case_.output;
        } else {
          return value.toString();
        }
      }
    }
    return value.toString();
  };

  // broad difficulty from https://fallenlondon.wiki/wiki/Broad_difficulty
  
  var calculateBroadDifficulty = function(quality, difficulty, scaler, random) {
    if (!scaler) {
      scaler = 0.6;
    }
    if (scaler > 1) {
      scaler = scaler/100;
    }
    var success_prob = scaler*(quality/difficulty);
    if (success_prob > 1) {
      success_prob = 1;
    }
    return success_prob;
 };

  // narrow difficulty from https://fallenlondon.wiki/wiki/Narrow_difficulty
  var calculateNarrowDifficulty = function(quality, difficulty, increment) {
    if (!increment) {
      increment = 0.1;
    }
    if (increment > 1) {
      increment = increment/100;
    }
    var success_prob = (quality - difficulty)*increment + 0.5;
    if (success_prob > 1) {
      success_prob = 1;
    } else if (success_prob < increment) {
      success_prob = increment;
    }
    return success_prob;
  };

  // this function actually does the roll for success.
  var rollDifficulty = function(success_prob, random) {
    var rn;
    if (random) {
      rn = random.random();

    } else {
      rn = Math.random();
    }
    if (rn < success_prob) {
      return true;
    }
    return false;   
  };


  // use the storynexus adjectives
  var displayDifficulty = function(success_prob) {
    if (success_prob <= 0.1) {
      return "almost impossible";
    } else if (success_prob <= 0.3) {
      return "high-risk";
    } else if (success_prob <= 0.4) {
      return "tough";
    } else if (success_prob <= 0.5) {
      return "very chancy";
    } else if (success_prob <= 0.6) {
      return "chancy";
    } else if (success_prob <= 0.7) {
      return "modest";
    } else if (success_prob <= 0.8) {
      return "very modest";
    } else if (success_prob <= 0.9) {
      return "low risk";
    } else {
      return "straightforward";
    }
  };


  // ------------------------------------------------------------------------

  // Objects with this interface are passed to a game state to have it
  // display content.
  var UserInterface = function() {};
  UserInterface.prototype.beginGame = function() {};
  UserInterface.prototype.displayContent = function(paragraphs, faceImage) {};
  // these are the dendrynexus display functions
  // displays the decks
  UserInterface.prototype.displayDecks = function(decks) {};
  // displays cards in hand
  UserInterface.prototype.displayHand = function(hand) {};
  // displays pinned cards (these are basically an alternate way of displaying choices)
  UserInterface.prototype.displayPinnedCards = function(cards) {};

  UserInterface.prototype.displayChoices = function(choices) {};
  UserInterface.prototype.displayGameOver = function() {
    this.displayContent(simpleContent('Game Over'));
  };
  UserInterface.prototype.removeChoices = function() {};
  // Called when the player makes a choice and new content is about to be
  // added (i.e. isn't called between output when the next scene is arrived
  // at via go-to).
  UserInterface.prototype.beginOutput = function() {};
  UserInterface.prototype.endOutput = function() {};
  UserInterface.prototype.newPage = function() {};
  UserInterface.prototype.setStyle = function(style) {};
  UserInterface.prototype.signal = function(data) {};
  UserInterface.prototype.setBg = function(img) {};
  UserInterface.prototype.setSprites = function(data) {};
  UserInterface.prototype.setSpriteStyle = function(loc, style) {};
  UserInterface.prototype.audio = function(audio) {};
  // Not part of the UI, but allows us to simply subclass.
  UserInterface.makeParentOf = function(OtherConstructor) {
    OtherConstructor.prototype = new UserInterface();
    OtherConstructor.constructor = OtherConstructor;
  };

  // ------------------------------------------------------------------------

  // An engine is given a user interface, the game and the current
  // game state (can be omitted). It is responsible for the logic of
  // the game.
  var DendryEngine = function(ui, game) {
    this.ui = ui;
    this.game = game;
  };

  DendryEngine.prototype.displayGameOver = function() {
    this.ui.displayGameOver();
    return this;
  };

  DendryEngine.prototype.displayChoices = function() {
    // TODO: dendrynexus - if the current scene is a hand, display the decks, hand, and pinned cards.
    var choices = this.getCurrentChoices();
    assert(choices);
    var scene = this.getCurrentScene();
    if (scene.isHand) {
      // separate choices into decks and pinned cards
      var decks = [];
      var pinnedCards = [];
      for (var c of choices) {
        var choiceScene = this.game.scenes[c.id];
        if (choiceScene.isDeck) {
          // if the deck has
          if (!this._drawFromDeck(c.id)) {
            c.canChoose = false;
            c.subtitle = c.unavailableSubtitle || "No cards available from deck.";
          } else {
            c.canChoose = true;
          }
          c.isDeck = true;
          c.image = choiceScene.cardImage;
          decks.push(c);
        } else if (choiceScene.isPinnedCard) {
          c.isDeck = false;
          c.image = choiceScene.cardImage;
          pinnedCards.push(c);
        }
      }
      if (!this.state.currentHands[this.state.sceneId]) {
        this.state.currentHands[this.state.sceneId] = [];
      }
      var currentHand = this.state.currentHands[this.state.sceneId];
      // TODO: check the viewIf/chooseIf conditions for all cards in the current hand, and filter them if they no longer work...
      var handIds = {};
      for (var card of currentHand) {
        handIds[card.id] = card;
      }
      handIds = this.__filterViewable(handIds);
      for (var i = 0; i < currentHand.length; i++) {
        while (currentHand[i] && !handIds[currentHand[i].id]) {
          currentHand.splice(i, 1);
        }
      }
      this.ui.displayDecks(decks);
      this.ui.displayHand(currentHand, scene.maxCards);
      this.ui.displayPinnedCards(pinnedCards);
    } else {
      if (this.state.enableTranscript) {
        this.transcript.push(choices);
      }
      this.ui.displayChoices(choices);
    }
    return this;
  };

  DendryEngine.prototype.displaySceneContent = function(restorePage) {
    var scene = this.getCurrentScene();
    assert(scene);
    // TODO: displaying images
    var faceImage = null;
    if (scene.faceImage) {
      faceImage = scene.faceImage;
    }
    var sceneSignal = scene.signal || this.game.sceneSignal;
    if (sceneSignal !== undefined) {
      this.ui.signal({signal:sceneSignal,
                      event:'scene-display',
                      id:this.state.sceneId});
    }
    if (restorePage) {
      this.ui.newPage();
      this.ui.displayContent(this.state.tempCurrentContent, faceImage);
      this.state.currentContent = this.state.tempCurrentContent.slice();
    } else if (scene.newPage) {
      this.ui.newPage();
      this.state.currentContent = [];
    }
    this.ui.setStyle(scene.style);
    this.ui.removeChoices();

    if (scene.content !== undefined && !restorePage) {
      var displayContent = this._makeDisplayContent(scene.content, true);
      if (this.state.enableTranscript) {
        this.transcript = this.transcript.concat(displayContent);
      }
      this.state.currentContent = this.state.currentContent.concat(displayContent);
      this.ui.displayContent(displayContent, faceImage);
    }
    this._runActions(scene.onDisplay);

    return this;
  };

  DendryEngine.prototype.choose = function(choiceIndex) {
    var choices = this.choiceCache;

    // Check for valid choice.
    assert(choices);
    if (choices.length <= choiceIndex) {
      throw new Error('No choice at index ' + choiceIndex + ', only ' +
                      choices.length + ' choices are available.');
    }

    // Commit the choice.
    var choice = choices[choiceIndex];
    if (!choice.canChoose) {
      throw new Error('Attempted to choose index ' + choiceIndex + ', but ' +
                      'that choice is unavailable.');
    }

    var id = choice.id;
    if (this.state.enableTranscript) {
      this.transcript.push('> ' + choice.title);
    }

    delete this.choiceCache;
    this.goToScene(id);

    return this;
  };

  DendryEngine.prototype.chooseSceneId = function(sceneId) {
    delete this.choiceCache;
    this.goToScene(id);

    return this;
  };

  // TODO: dendrynexus - draw card
  DendryEngine.prototype.drawCard = function(deckId) {
    var currentSceneId = this.state.sceneId;
    var scene = this.getCurrentScene();
    assert(scene);
    
    var currentHand = this.state.currentHands[currentSceneId];
    // return a message saying that there are too many cards
    if (scene.maxCards <= currentHand.length) {
      return {id: null, title: 'no_space_in_hand'};
    }
    // get an available card from deckId
    // card is {id: id, title: title}
    var card = this._drawFromDeck(deckId);
    // distinguish between the "no space left in hand" and "no card in deck" situations?
    if (!card) {
      return {id: null, title: 'no_card_in_deck'};
    }
    this.state.lastDrawnCard = card;
    var image = this.game.scenes[card.id].cardImage;
    card.image = image;
    this.state.currentHands[currentSceneId].push(card);

    // display the hand
    this.ui.displayHand(this.state.currentHands[currentSceneId], scene.maxCards);
    return card;
  };


  // dendrynexus - play a card (remove it from the current hand)
  // should this be the code for pinned cards as well?
  DendryEngine.prototype.playCard = function(cardId) {
    var currentSceneId = this.state.sceneId;
    var currentHand = this.state.currentHands[currentSceneId];
    // remove card from hand
    for (var i = 0; i < currentHand.length; i++) {
      if (currentHand[i].id == cardId) {
        currentHand.splice(i, 1);
        break;
      }
    }
    this.state.lastPlayedCard = this.game.scenes[cardId];
    delete this.choiceCache;
    this.goToScene(cardId);
  };

  DendryEngine.prototype.playPinnedCard = function(cardId) {
    delete this.choiceCache;
    this.goToScene(cardId);
  };

  DendryEngine.prototype.goToScene = function(id) {
    this.state.sceneIdsSinceGoTo = [];
    this.ui.beginOutput();
    this.__changeScene(id);
    this.ui.endOutput();
  };

  DendryEngine.prototype.beginGame = function(rndSeeds) {
    this.random = rndSeeds ? Random.fromSeeds(rndSeeds) : Random.fromUnique();
    this.state = {
      sceneId: null,
      sceneIdsSinceGoTo: [],
      rootSceneId: this.game.rootScene || this.game.firstScene || 'root',
      gameOver: false,
      visits: {},
      qualities: {},
      currentRandomState: null,
      currentContent: [],
      // tempCurrentContent is used for when the
      // player visits the stats or settings pages in order to remember
      // where the previous page was?
      tempCurrentContent: [],
      // prevSpecialSceneId is only set when visiting scene tagged with
      // isSpecial = true, and is the scene before the special scene.
      prevSpecialSceneId: null,
      prevSceneId: null,
      // every time a top-level scene changes,
      // this record the last-visited qualified id within that scene.
      prevTopSceneId: null,
      // jumpScene is defined within a scene file, indicating the scene that
      // @jumpScene will go to. Basically it's used to make subroutines.
      jumpSceneId: null,
      // achievements is a dict of all the current achievements.
      // persist achievements in the browser through localstorage?
      achievements: {},
      // current background image
      bg: null,
      // sceneStack is used for goSub
      sceneStack: [],
      // true if just popped out of a returnScene
      justReturned: false,
      // just returned from a goSubStart
      justReturnedStart: false,
      // just returned from a goSubEnd
      justReturnedEnd: false,
      // sprites is a mapping from location to file
      sprites: {},
      // dendrynexus stuff
      // mapping from sceneId to list of sceneIds - indicating the current hand in each of those scenes.
      currentHands: {},
      // last drawn card
      lastDrawnCard: null,
      lastPlayedCard: null,

      enableTranscript: false,
      // whether or not to disable saves
      disableSaves: false,
    };
    // TODO: transcript
    this.transcript = [];

    this._setUpQualities();
    this._loadAchievements();

    this.ui.beginGame();

    var id = this.game.firstScene || this.state.rootSceneId;
    this.goToScene(id);

    return this;
  };

  DendryEngine.prototype._loadAchievements = function() {
    if (typeof localStorage !== 'undefined') {
        if (localStorage[this.game.title + '_achievements']) {
            this.state.achievements = JSON.parse(
                localStorage[this.game.title + '_achievements']);
            // add a special quality named 'achievement_'
            for (var achievement in this.state.achievements) {
                this.state.qualities['achievement_' + achievement] = 1;
            }
        }
    }
  };

  DendryEngine.prototype.gameOver = function() {
    this.state.gameOver = true;
    this.displayGameOver();
    return this;
  };

  DendryEngine.prototype.isGameOver = function() {
    return this.state.gameOver;
  };

  DendryEngine.prototype.getCurrentScene = function() {
    var scene = this.game.scenes[this.state.sceneId];
    assert(scene !== undefined);
    return scene;
  };

  // Returns the choices for the current scene. Choices are objects
  // with an id and a title property, not to be confused with the
  // option objects in a scene (though options are used to generate
  // choices). Choices are compiled from the options belonging to the
  // current scene.
  DendryEngine.prototype.getCurrentChoices = function() {
    return this.choiceCache;
  };

  // Sets the current state of the engine from an exportable state.
  DendryEngine.prototype.setState = function(state) {
    // Set the state.
    this.state = state;
    this._setUpQualities();
    this.random = Random.fromState(this.state.currentRandomState);
    this._loadAchievements();

    // Display the current state.
    if (this.isGameOver()) {
      this.displayGameOver();
    } else {
      var scene = this.getCurrentScene();
      this.choiceCache = this._compileChoices(scene);
      this.ui.newPage();
      this.ui.removeChoices();
      this.ui.displayContent(this.state.currentContent);
      this.displayChoices();
      this.ui.setSprites(this.state.sprites);
      this.ui.setBg(this.state.bg);
    }
    return this;
  };

  // Returns a data structure for exporting without any accessors or
  // complex classes.
  DendryEngine.prototype.getExportableState = function() {
    // Because we only have complex state in the qualities (they have
    // accessors), and because we save with JSON (which calls
    // accessors correctly), we don't have to worry about giving the
    // actual state. Note that, if you want to keep this object, however,
    // you want to clone it somehow (turning it to and from json,
    // for example), otherwise it will change as the engine updates.
    return this.state;
  };

  // ------------------------------------------------------------------------

  DendryEngine.prototype._getQDisplay = function(value, qDisplayId) {
    switch (qDisplayId) {
    case 'cardinal': case 'number':
      return getCardinalNumber(value);
    case 'ordinal':
      return getOrdinalNumber(value);
    case 'fudge':
      return getFudgeDisplay(value);
    default:
      var qdisplay = this.game.qdisplays[qDisplayId];
      assert(qdisplay !== undefined);
      return getUserQDisplay(value, qdisplay);
    }
  };

  DendryEngine.prototype._evaluateStateDependencies = function(defs) {
    var result = [];

    for (var i = 0; i < defs.length; ++i) {
      var value;
      var def = defs[i];
      var fn = def.fn;
      switch (def.type) {
      case 'insert':
        value = this._runExpression(fn);
        if (def.qdisplay) {
          value = this._getQDisplay(value, def.qdisplay);
        } else {
          value = value.toString();
        }
        break;

      default:
        assert(def.type === 'predicate');
        value = this._runPredicate(fn);
        break;
      }

      // Recurse the resolution into the resulting value, if needed.
      if (value.stateDependencies !== undefined) {
        // We have to resolve the nested state dependencies.
        value = this._makeDisplayContent(value, false);
      }
      result.push(value);
    }
    return result;
  };

  DendryEngine.prototype._mergeStateEvalsInArray = function(array, evals) {
    if (!Array.isArray(array)) {
      array = [array];
    }
    var result = [];
    for (var i = 0; i < array.length; ++i) {
      result = result.concat(this._mergeStateEvals(array[i], evals));
    }
    return result;
  };

  DendryEngine.prototype._mergeStateEvals = function(content, evals) {
    if (content.type === undefined) {
      return [content];
    }

    var result;
    switch (content.type) {
    case 'conditional':
      if (evals[content.predicate]) {
        result = this._mergeStateEvalsInArray(content.content, evals);
      } else {
        result = [];
      }
      break;
    case 'insert':
      result = evals[content.insert];
      break;
    default:
      var newE = {type:content.type};
      newE.content = this._mergeStateEvalsInArray(content.content, evals);
      result = [newE];
      break;
    }
    return result;
  };

  DendryEngine.prototype._makeDisplayContent = function(content, useParas) {
    // Raw content can just be returned.
    if (content.content === undefined) {
      if (Array.isArray(content)) {
        return content;
      } else if (useParas) {
        return [{type:'paragraph', content:content}];
      } else {
        return [content];
      }
    } else if (content.stateDependencies === undefined &&
               content.type !== undefined) {
      return [content];
    }

    // Merge in dependencies if we have them
    var stateDepDefs = content.stateDependencies;
    var displayContent = content.content;
    if (stateDepDefs && stateDepDefs.length > 0) {
      var evals = this._evaluateStateDependencies(stateDepDefs);
      if (!Array.isArray(displayContent)) {
        displayContent = [displayContent];
      }
      displayContent = this._mergeStateEvalsInArray(
        displayContent, evals
      );
    }
    return displayContent;
  };

  DendryEngine.prototype._setUpQualities = function() {
    var _Q = this._qualitiesAccessorsPrivate = {};
    var Q = this.state.qualities;
    var that = this;
    objEach(this.game.qualities, function(id, quality) {
      var min = quality.min;
      var max = quality.max;
      var signal = quality.signal || that.game.qualitySignal;
      var predicate = quality.isValid;
      var needsAccessors = (
        min !== undefined ||
        max !== undefined ||
        signal !== undefined ||
        predicate !== undefined
      );
      if (needsAccessors) {
        if (Q[id] !== undefined) {
          _Q[id] = Q[id];
        }
        Q.__defineGetter__(id, function() {
          return _Q[id];
        });
        Q.__defineSetter__(id, function(value) {
          if (min !== undefined && value < min) {
            value = min;
          }
          if (max !== undefined && value > max) {
            value = max;
          }
          var was = _Q[id];
          _Q[id] = value;

          // Check if the new value is not allowed.
          if (!that._runPredicate(predicate, true)) {
            // Reverse the change.
            _Q[id] = value = was;
          }

          // Signal after the change is made.
          if (signal !== undefined && value !== was) {
            var signalObj = {
              signal: signal,
              event: 'quality-change',
              id: id,
              now: value
            };
            if (was !== undefined) {
              signalObj.was = was;
            }
            that.ui.signal(signalObj);
          }
        });
      }
      if (quality.initial !== undefined && Q[id] === undefined) {
        Q[id] = quality.initial;
      }
    });
  };

  DendryEngine.prototype._runActions = function(actions) {
    runActions(actions, this, this.state);
  };

  DendryEngine.prototype._runPredicate = function(predicate, default_) {
    return runPredicate(predicate, default_, this, this.state);
  };

  DendryEngine.prototype._runExpression = function(expression, default_) {
    return runExpression(expression, default_, this, this.state);
  };

  DendryEngine.prototype.__changeScene = function(id) {
    if (this.state.justReturned) {
        this.state.justReturned = false;
    }
    var scene = null;
    var restorePage = false;
    // if id is 'prevScene', go to the previous scene.
    if (id == 'prevScene') {
      if (this.prevSceneId === null) {
        // this really only comes up on the very first scene of the game.
      }
      scene = this.game.scenes[this.state.prevSceneId];
      id = this.state.prevSceneId;
      assert(scene);
    } else if (id == 'prevTopScene') {
      scene = this.game.scenes[this.state.prevTopSceneId];
      id = this.state.prevTopSceneId;
      assert(scene);
    } else if (id == 'jumpScene') {
      scene = this.game.scenes[this.state.jumpSceneId];
      id = this.state.jumpSceneId;
      assert(scene);
    } else if (id === 'backSpecialScene') {
      scene = this.game.scenes[this.state.prevSpecialSceneId];
      id = this.state.prevSpecialSceneId;
      restorePage = true;
      assert(scene);
      // if prevSpecialSceneId is null, this indicates that
      // we're not within a specialScene, and we can set a jump point.
      this.state.prevSpecialSceneId = null;
    } else {
      scene = this.game.scenes[id];
      assert(scene);
    }


    // Leave previous scene.
    var fromId = this.state.sceneId;
    if (!!fromId) {
      this.state.prevSceneId = fromId;
      // TODO: this doesn't necessarily work... there should be
      // a different classification of top scenes
      if (scene.isTop) {
        this.state.prevTopSceneId = fromId;
      }
      if (scene.isSpecial && this.state.prevSpecialSceneId === null) {
        this.state.tempCurrentContent = this.state.currentContent.slice();
        this.state.prevSpecialSceneId = fromId;
      }
      var from = this.getCurrentScene();
      this._runActions(from.onDeparture);
      var fromSignal = from.signal || this.game.sceneSignal;
      if (fromSignal !== undefined) {
        this.ui.signal({signal:fromSignal,
                        event:'scene-departure',
                        id:this.state.sceneId,
                        'to':id});
      }
    }

    // Arrive at current scene.
    this.state.sceneId = id;
    this.state.sceneIdsSinceGoTo.push(id);

    if (scene.setRoot) {
      this.state.rootSceneId = id;
    }
    if (scene.setJump) {
      this.state.jumpSceneId = scene.setJump;
    }

    if (scene.countVisitsMax !== undefined) {
      if (this.state.visits[id] === undefined) {
        this.state.visits[id] = 1;
      } else if (this.state.visits[id] < scene.countVisitsMax) {
        this.state.visits[id]++;
      }
    }

    if (!restorePage && !this.state.justReturned) {
        // If we go back from a special scene (e.g. the stats page),
        // we probably don't want to run the scene actions again.
        this._runActions(scene.onArrival);
        // TODO: After running onArrival, we should run call if call has
        if (scene.call) {
          var callScene = this.game.scenes[scene.call];
          this._runActions(callScene.onArrival);
        }
    }
    var sceneSignal = scene.signal || this.game.sceneSignal;
    if (sceneSignal !== undefined) {
      var signal = {
        signal: sceneSignal,
        event: 'scene-arrival',
        id: id
      };
      if (!!fromId) {
        signal.from = fromId;
      }
      this.ui.signal(signal);
    }

    // We're done with any code that might generate random numbers
    // (except go-to, which will recurse into this method anyway), so we
    // can store the seed which can be used to replay the behavior
    // from here.
    this.state.currentRandomState = this.random.getState();
    //if (!this.state.justReturned) {
        // if the state has just returned from a goSub, we don't display
        // the content?
        // TODO: i'm not sure what the best logic for this is...
        // Maybe the text pre-gosub should be displayed only after the goSub?
    this.displaySceneContent(restorePage);
    //}
    // display background
    if (scene.setBg) {
        this.state.bg = scene.setBg;
        this.ui.setBg(scene.setBg);
    }
    if (scene.setSprites) {
        this.state.sprites = scene.setSprites;
        this.ui.setSprites(scene.setSprites);
    }
    if (scene.audio) {
        this.ui.audio(scene.audio);
    }
    // TODO: there has got to be a better way of doing this.
    if (scene.setTopLeftStyle) {
        this.ui.setSpriteStyle('topLeft', scene.setTopLeftStyle);
    }
    if (scene.setTopRightStyle) {
        this.ui.setSpriteStyle('topRight', scene.setTopRightStyle);
    }
    if (scene.setBottomLeftStyle) {
        this.ui.setSpriteStyle('bottomLeft', scene.setBottomLeftStyle);
    }
    if (scene.setBottomRightStyle) {
        this.ui.setSpriteStyle('bottomRight', scene.setBottomRightStyle);
    }
    // update achievement
    if (scene.achievement) {
        this.achieve(scene.achievement);

    }

    // Check if we have any reason to leave the scene, or end the game.
    var done = false;
    if (scene.gameOver === true) {
      done = true;
      this.gameOver();
    } else if (scene.goSubEnd && !this.state.justReturnedEnd) {
      // goSub
      var validSubs = [];
      for (var s1 = 0; s1 < scene.goSub.length; ++s1) {
        var sub = scene.goSub[s1];
        if (sub.predicate === undefined ||
            this._runPredicate(sub.predicate)) {
          validSubs.push(sub.id);
        }
      }
    } else if (scene.goTo) {
      // Find all valid gotos.
      var validGoToIds = [];
      for (var i = 0; i < scene.goTo.length; ++i) {
        var goTo = scene.goTo[i];
        if (goTo.predicate === undefined ||
            this._runPredicate(goTo.predicate)) {
          validGoToIds.push(goTo.id);
        }
      }
      if (validGoToIds.length === 1) {
        done = true;
        this.__changeScene(validGoToIds[0]);
      } else if (validGoToIds.length > 1) {
        var randomNumber = this.random.uint32();
        var choice = randomNumber % validGoToIds.length;
        var chosenGoToId = validGoToIds[choice];
        done = true;
        this.__changeScene(chosenGoToId);
      }
    } else if (scene.goToRef) {
      // do some gotoref
      var validRefs = [];
      for (var s = 0; s < scene.goToRef.length; ++s) {
        var ref = scene.goToRef[s];
        if (ref.predicate === undefined ||
            this._runPredicate(ref.predicate)) {
          validRefs.push(ref.id);
        }
      }
      if (validRefs.length === 1) {
        done = true;
        this.__changeScene(this.state.qualities[validRefs[0]]);
      } else if (validRefs.length > 1) {
        var c = this.random.uint32() % validRefs.length;
        var chosenRef = validRefs[c];
        done = true;
        this.__changeScene(this.state.qualities[chosenRef]);
      }
    }

    // dendrynexus: calculate checks
    // WHAT IF scenes have gotos and checks. huh. don't do that. Let's just say that is undefined behavior.
    var hasCheck = false;
    var successProb, isSuccess;
    if (scene.checkQuality && scene.broadDifficulty && scene.checkSuccessGoTo && scene.checkFailureGoTo) {
      var scaler = 0.6;
      if (scene.difficultyScaler) {
        scaler = scene.difficultyScaler;
      }
      successProb = calculateBroadDifficulty(this.state.qualities[scene.checkQuality] || 0, scene.broadDifficulty, scaler);
      hasCheck = true;
    } else if (scene.checkQuality && scene.narrowDifficulty && scene.checkSuccessGoTo && scene.checkFailureGoTo) {
      var increment = 0.1;
      if (scene.difficultyIncrement) {
        increment = scene.difficultyIncrement;
      }
      successProb = calculateNarrowDifficulty(this.state.qualities[scene.checkQuality] || 0, scene.narrowDifficulty, increment);
      hasCheck = true;
    }
    if (hasCheck) {
      isSuccess = rollDifficulty(successProb, this.random); 
      // logic for changing the scene on success/failure of the check
      done = true;
      if (isSuccess) {
        this.__changeScene(scene.checkSuccessGoTo);
      } else {
        this.__changeScene(scene.checkFailureGoTo);
      }
    }

    // If we've not ended, nor found a valid go-to, then we try choices.
    if (!done) {
      this.choiceCache = this._compileChoices(scene);
      if (this.choiceCache === null) {
        // Explicitly disallowing game over keeps us stuck here.
        if (scene.gameOver !== false) {
          this.gameOver();
        }
      } else {
        this.displayChoices();
      }
    }
  };

  DendryEngine.prototype.achieve = function(achievementName) {
    this.state.achievements[achievementName] = 1;
    // add a special quality named 'achievement_'
    this.state.qualities['achievement_' + achievementName] = 1;
    // add a new quality indicating that the achievement has been done for the current game
    this.state.qualities['game_achievement_' + achievementName] = 1;
    // set localStorage for achievement
    if (typeof localStorage !== 'undefined') {
      localStorage[this.game.title + '_achievements'] = JSON.stringify(this.state.achievements);
    }
  };

  DendryEngine.prototype.__getChoiceSelectionData = function(idToInfoMap) {
    var result = [];
    for (var id in idToInfoMap) {
      var optionScene = this.game.scenes[id];
      var optionInfo = idToInfoMap[id];

      optionInfo.order = optionInfo.order || optionScene.order || 0;
      optionInfo.priority = optionInfo.priority || optionScene.priority || 1;
      // Because 'null' is a valid frequency, we can't use || to do this.
      if (optionInfo.frequency === undefined) {
        optionInfo.frequency = optionScene.frequency;
        if (optionInfo.frequency === undefined) {
          optionInfo.frequency = 100;
        }
      }
      optionInfo.selectionPriority = 0; // Used by __filterByPriority

      result.push(optionInfo);
    }
    return result;
  };

  DendryEngine.prototype.__filterViewable = function(idToInfoMap) {
    var result = {};
    for (var id in idToInfoMap) {
      var thisScene = this.game.scenes[id];

      // This id fails if it is past its max visits.
      var maxVisits = thisScene.maxVisits;
      if (maxVisits !== undefined) {
        var visits = this.state.visits[id] || 0;
        if (visits >= maxVisits) {
          continue;
        }
      }

      // Fiter out scenes that can't be viewed.
      var canView = this._runPredicate(thisScene.viewIf, true);
      if (!canView) {
        continue;
      }

      // It passes otherwise.
      result[id] = idToInfoMap[id];
    }
    return result;
  };

  DendryEngine.prototype.__getChoiceIdsFromOptions = function(options) {
    var that = this;

    var choices = {};
    each(options, function(option) {
      // Filter out options that can't be viewed.
      if (!that._runPredicate(option.viewIf, true)) {
        return;
      }

      if (option.id.substr(0, 1) === '@') {
        // This is an id, use it.
        var trimmedId = option.id.substring(1);
        var choice = merge(option, {id:trimmedId});
        choices[trimmedId] = choice;
      } else {
        assert(option.id.substr(0, 1) === '#');
        // This is a tag, add all matching ids.
        var ids = that.game.tagLookup[option.id.substring(1)];
        objEach(ids, function(id) {
          if (choices[id] === undefined) {
            choices[id] = merge(option, {id:id});
          }
        });
      }
    });
    return choices;
  };

  // Code based on Undum (MIT License). See CREDITS.
  DendryEngine.prototype.__filterByPriority = function(choices,
                                                       minChoices,
                                                       maxChoices) {
    assert(minChoices === null ||
           maxChoices === null ||
           maxChoices >= minChoices);
    var that = this;

    var committed = [];
    var candidates = [];
    var choice;

    // Work in descending priority order.
    choices.sort(function(a, b) {
      return b.priority - a.priority;
    });

    // First phase: we make sure we have at least our minimum number
    // of choices, and that we consider the minimum possible number of
    // priorities to reach that minimum.
    var lastPriority;
    for (var i = 0; i < choices.length; ++i) {
      choice = choices[i];
      if (choice.priority !== lastPriority) {
        if (lastPriority !== undefined) {
          // Priority has decreased, use the candidates if there are enough.
          if (minChoices === null || i >= minChoices) {
            break;
          }
        }

        // We're going on, so commit our current candidates.
        committed.push.apply(committed, candidates);
        candidates = [];
        lastPriority = choice.priority;
      }
      candidates.push(choice);
    }

    // Second phase: we commit as many candidates as we can without
    // exceeding our maximum.
    // TODO: think about tag choices vs builtin choices
    var committedChoices = committed.length;
    var totalChoices = committedChoices + candidates.length;
    if (maxChoices === null || maxChoices >= totalChoices) {
      // We can use all the candidates without exceeding our maximum.
      committed.push.apply(committed, candidates);
    } else {
      // Take a subset of the candidates, using their relative frequency.
      each(candidates, function(choice) {
        if (choice.frequency === null) {
          choice.selectionPriority = 0; // Always choose.
        } else {
          choice.selectionPriority = that.random.random() / choice.frequency;
        }
      });
      candidates.sort(function(a, b) {
        return a.selectionPriority - b.selectionPriority;
      });
      var extraChoices = maxChoices - committedChoices;
      var chosen = candidates.slice(0, extraChoices);
      committed.push.apply(committed, chosen);
    }

    return committed;
  };

  DendryEngine.prototype.__getChoiceDisplayData = function(choicesSelected) {
    var choiceOutput = [];
    var numChoosable = 0;

    for (var i = 0; i < choicesSelected.length; ++i) {
      var choice = choicesSelected[i];
      var choiceScene = this.game.scenes[choice.id];

      // Figure out if this choice can be chosen.
      var canChoose = true;
      if (choice.chooseIf) {
        canChoose = this._runPredicate(choice.chooseIf, true);
      }
      if (canChoose && choiceScene.chooseIf) {
        canChoose = this._runPredicate(choiceScene.chooseIf, true);
      }

      var title = choice.title || choiceScene.title;
      assert(title);

      var subtitle = null;
      if (!canChoose) {
        subtitle = choice.unavailableSubtitle ||
                   choiceScene.unavailableSubtitle;
      }
      if (!subtitle) {
        subtitle = choice.subtitle || choiceScene.subtitle;
      }


      var finalChoice = {
        id:choice.id,
        canChoose:canChoose,
        title:this._makeDisplayContent(title, false)
      };
      if (subtitle) {
        finalChoice.subtitle = this._makeDisplayContent(subtitle, false);
      }
      // dendrynexus - add success/failure probabilities, and challenges.
      var successProb;
      if (choiceScene.checkQuality && choiceScene.broadDifficulty && choiceScene.checkSuccessGoTo && choiceScene.checkFailureGoTo) {
        var scaler = 0.6;
        if (choiceScene.difficultyScaler) {
          scaler = choiceScene.difficultyScaler;
        }
        successProb = calculateBroadDifficulty(this.state.qualities[choiceScene.checkQuality] || 0, choiceScene.broadDifficulty, scaler);
        finalChoice.checkQuality = choiceScene.checkQuality;
        finalChoice.successProb = successProb;
        finalChoice.difficulty = displayDifficulty(successProb);
      } else if (choiceScene.checkQuality && choiceScene.narrowDifficulty && choiceScene.checkSuccessGoTo && choiceScene.checkFailureGoTo) {
        var increment = 0.1;
        if (choiceScene.difficultyIncrement) {
          increment = choiceScene.difficultyIncrement;
        }
        successProb = calculateNarrowDifficulty(this.state.qualities[choiceScene.checkQuality] || 0, choiceScene.narrowDifficulty, increment);
        finalChoice.checkQuality = choiceScene.checkQuality;
        finalChoice.successProb = successProb;
        finalChoice.difficulty = displayDifficulty(successProb);
      }

      choiceOutput.push(finalChoice);
      if (canChoose) {
        ++numChoosable;
      }
    }

    return {choices:choiceOutput, numChoosable:numChoosable};
  };

  DendryEngine.prototype._compileChoices = function(scene) {
    assert(scene);

    var options = scene.options;
    var choiceOutput = [];
    var numChoosable = 0;
    if (options !== undefined) {

      var choiceIds = this.__getChoiceIdsFromOptions(options);
      choiceIds = this.__filterViewable(choiceIds);

      var validChoiceData = this.__getChoiceSelectionData(choiceIds);
      var minChoices = scene.minChoices || null;
      var maxChoices = scene.maxChoices || null;
      validChoiceData = this.__filterByPriority(validChoiceData,
                                                minChoices, maxChoices);

      // Sort the result into display order.
      validChoiceData.sort(function(a, b) {
        return a.order - b.order;
      });

      // Now we've chosen our selection, get the final displayable data.
      var data = this.__getChoiceDisplayData(validChoiceData);
      choiceOutput = data.choices;
      numChoosable = data.numChoosable;
    }

    if (numChoosable === 0) {
      // We have no choosable options, so add the default option (NB:
      // this may take us over the max-choices limit).
      var root = this.state.rootSceneId;
      if (root !== this.state.sceneId) {
        var rootSceneChoose = this.game.scenes[root].chooseIf;
        if (!rootSceneChoose || this._runPredicate(rootSceneChoose, true)) {
          choiceOutput.push({id:root, title:'Continue...', canChoose:true});
          ++numChoosable;
        }
      }
    }
    if (numChoosable > 0) {
      return choiceOutput;
    } else {
      return null;
    }
  };


  // dendrynexus - this returns a single available card from the given deck, formatted as an object of the type {id: id, title: title}
  DendryEngine.prototype._drawFromDeck = function(deckId) {
    var scene = this.game.scenes[deckId];
    var viewableScenes = this._compileChoices(scene);
    if (!viewableScenes) {
      return null;
    }
    var choosableScenes = [];
    var currentHand = this.state.currentHands[this.state.sceneId];
    if (!currentHand) {
        currentHand = [];
    }
    currentHand = currentHand.map((x)=>x.id);
    for (var x of viewableScenes) {
      var choiceScene = this.game.scenes[x.id];
      // filter for whether the card is in the hand
      if (x.canChoose && choiceScene.isCard &&  currentHand.indexOf(x.id) < 0) {
        choosableScenes.push(x);
      }
    }
    if (!choosableScenes) {
      return null;
    }
    var randomNumber = this.random.uint32();
    var choice = randomNumber % choosableScenes.length;
    // this.state.currentRandomState = this.random.getState();
    return choosableScenes[choice];
  };

  // ------------------------------------------------------------------------

  // Marsaglia, George (July 2003). 'Xorshift RNGs'.
  // Journal of Statistical Software 8 (14).
  var Random = function(v, w, x, y, z) {
    this.getState = function() {
      return [v, w, x, y, z];
    };
    var uint32Multiply = function(a, b) {
      var aHigh = (a >> 16) & 0xffff;
      var aLow = a & 0xffff;
      var bHigh = (b >> 16) & 0xffff;
      var bLow = b & 0xffff;
      var prodHigh = ((aHigh * bLow) + (aLow * bHigh)) & 0xffff;
      return ((prodHigh << 16) >>> 0) + (aLow * bLow);
    };
    this.uint32 = function() {
      var t = (x ^ (x >>> 7)) >>> 0;
      x = y;
      y = z;
      z = w;
      w = v;
      v = (v ^ (v << 6)) ^ (t ^ (t << 13)) >>> 0;
      return uint32Multiply((y + y + 1), v) >>> 0;
    };
    this.random = function() {
      return this.uint32() * 2.3283064365386963e-10;
    };
  };

  var __next = 1;
  Random.fromUnique = function() {
    var seed = new Date().getTime();
    return Random.fromSeeds([seed, __next++]);
  };

  Random.fromTime = function() {
    return Random.fromSeeds([new Date().getTime()]);
  };

  Random.fromSeeds = function(seeds) {
    var v = 886756453;
    var w = 88675123;
    var x = 123456789;
    var y = 362436069;
    var z = 521288629;

    // The seed hashing function is based on Mash 0.9 (MIT License).
    // See CREDITS.
    var hashSeed = function(data) {
      data = data.toString();
      var n = 0xefc8249d;
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000;
      }
      return (n >>> 0) * 2.3283064365386963e-10;
    };

    for (var i = 0; i < seeds.length; i++) {
      var hashedSeed = hashSeed(seeds[i]) * 0x100000000;
      v ^= hashedSeed;
      w ^= hashedSeed;
      x ^= hashedSeed;
      y ^= hashedSeed;
      z ^= hashedSeed;
    }
    return new Random(v, w, x, y, z);
  };

  Random.fromState = function(state) {
    return new Random(state[0], state[1], state[2], state[3], state[4]);
  };

  // ------------------------------------------------------------------------

  module.exports = {
    makeFunctionFromSource: makeFunctionFromSource,
    runActions: runActions,
    runPredicate: runPredicate,
    runExpression: runExpression,
    convertJSONToGame: convertJSONToGame,
    simpleContent: simpleContent,

    getCardinalNumber: getCardinalNumber,
    getOrdinalNumber: getOrdinalNumber,
    getUserQDisplay: getUserQDisplay,
    getFudgeDisplay: getFudgeDisplay,

    DendryEngine: DendryEngine,
    UserInterface: UserInterface,
    NullUserInterface: UserInterface,

    Random: Random
  };
}());

},{}],2:[function(require,module,exports){
/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function($) {
  'use strict';

  var contentToHTML = require('./content/html');
  var engine = require('../engine');

  var BrowserUserInterface = function(game, $content) {
    this.game = game;
    this.$content = $content;
    this._registerEvents();

    this.dendryEngine = new engine.DendryEngine(this, game);
    // TODO: refactor how the settings work - move it all within a single object
    this.base_settings = {'disable_bg': false, 'animate':false, 'animate_bg': true, 'disable_audio': false, 'show_portraits': true};
    this.disable_bg = false;
    this.animate = false;
    this.animate_bg = true;
    this.disable_audio = false;
    // backgrounds and portraits are 100% optional, and most games will not use them.
    this.show_portraits = true;
    this.fade_time = 600;
    this.bg_fade_out_time = 200;
    this.bg_fade_in_time = 1000;
    this.sound_fade_time = 2000;
    this.contentToHTML = contentToHTML;

    // sprites
    this.spriteLocs = {'topLeft': 1, 'topRight': 1, 'bottomLeft': 1, 'bottomRight': 1};
    // current HTMLAudioElement
    this.currentAudio = null;
    // current audio url
    this.currentAudioURL = '';
    this.audioQueue = [];
    // playlist is used for shuffling...
    this.audioPlaylist = [];
    // flag for determining if we're on a new page, up until the first choice.
    this.onNewPage = false;

    // for saving
    this.save_prefix = game.title + '_' + game.author + '_save';
    this.max_slots = 8; // max save slots
    this.DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric', 
                 month: 'short', 
                 day: 'numeric' };
  };
  engine.UserInterface.makeParentOf(BrowserUserInterface);

  // ------------------------------------------------------------------------
  // Main API

  //load a game as a json file from a url, and then run the game...
  BrowserUserInterface.prototype.loadGame = function(url) {
      var that = this;
      if (!url.endsWith('.json')) { 
          if (url.endsWith('/')) { 
              url = url + 'game.json';
          } else { 
              url = url + '/game.json';
          } 
      } 
      fetch(url)
      .then(response => response.text())
      .then(json => { 
          game = engine.convertJSONToGame(json, function(err, game) {
              if (err) {
                throw err;
              }
              return game;
          });
          that.game = game;
          that.dendryEngine = new engine.DendryEngine(that, game);
          that.dendryEngine.beginGame();
      })
      .catch(err => console.log(err));
  };


  BrowserUserInterface.prototype.displayContent = function(paragraphs, faceImage) {
    var $html = $(contentToHTML.convert(paragraphs));
    // TODO: maybe face image visibility should be controlled by a different setting?
    var hasImage = false;
    if (faceImage && this.show_portraits && !this.disable_bg) {
        hasImage = true;
        // convert faceImage into an html object
        console.log(faceImage);
        //var cardEl = $('<div>').addClass('face-figure');
        var cardEl = document.createElement('div');
        cardEl.className = "face-figure";
        //var $image = $('<img>').addClass('face-img').attr({src : faceImage});
        var image = new Image();
        image.className = "face-img";
        cardEl.appendChild(image);
        $html.splice(1, 0, cardEl);
        image.src = faceImage;
        /*
        if (!this.animate) {
            var that = this;
            image.onload = function() {
                that.$content.append($html);
                console.log('image loaded');
            };
            image.src = faceImage;
        }
        */
    }
    if (this.animate) {
        $html.fadeIn(this.fade_time);
        this.$content.append($html);
    } else {
        if (!hasImage) {
            this.$content.append($html);
        } else {
            this.$content.append($html);
        }
    }
    $html.focus();
    // allow user to add custom stuff on display content (for sidebar in this case)
    if (window && window.onDisplayContent) {
        window.onDisplayContent();
    }
  };

  BrowserUserInterface.prototype.displayGameOver = function() {
    var $p = $('<p>').text(this.getGameOverMsg()).addClass('game-over');
    if (this.animate) {
        $p.fadeIn(this.fade_time);
        this.$content.append($p);
    } else {
        this.$content.append($p);
    }
    $p.focus();
  };

  BrowserUserInterface.prototype.displayChoices = function(choices) {
    var $ul = $('<ul>').addClass('choices');
    for (var i = 0; i < choices.length; ++i) {
      var choice = choices[i];

      var title = contentToHTML.convertLine(choice.title);
      var subtitle = "";
      if (choice.subtitle !== undefined) {
        subtitle = contentToHTML.convertLine(choice.subtitle);
      }

      var $li = $('<li>');
      var $titleHolder = $li;
      if (choice.canChoose) {
        $titleHolder = $('<a>').attr({href: '#', 'data-choice': i});
        $li.html($titleHolder);
      } else {
        $titleHolder.addClass('unavailable');
      }
      $titleHolder.html(title);
      if (choice.checkQuality && choice.difficulty && choice.successProb !== undefined) {
        if (subtitle) {
          subtitle += '<br>';
        }
        subtitle += 'Check: ' + choice.checkQuality + '<br>';
        subtitle += 'Difficulty: ' + choice.difficulty + ' (' + Math.floor(choice.successProb*100) + '%)';
      }
      if (subtitle) {
        $li.append($('<div>').addClass('subtitle').html(subtitle));
      }

      $ul.append($li);
    }
    if (this.animate) {
        $ul.fadeIn(this.fade_time);
        this.$content.append($ul);
    }
    else {
        this.$content.append($ul);
    }
    $ul.focus();
    if (this.onNewPage) {
      this.onNewPage = false;
      if (window && window.onNewPage) {
        window.onNewPage();
      }
    }
  };

  BrowserUserInterface.prototype.newPage = function() {
    if (this.animate) {
        var $content = this.$content;
        this.$content.empty();
        this.$content.children().fadeOut(this.fade_time, function() {
        });
    } else {
        this.$content.empty();
    }
    this.onNewPage = true;

  };

  BrowserUserInterface.prototype.setStyle = function(style) {
    this.$content.removeClass();
    if (style !== undefined) {
      this.$content.addClass(style);
    }
  };

  BrowserUserInterface.prototype.removeChoices = function() {
    $('.choices', this.$content).remove();
    $('.hidden', this.$content).remove();
  };

  BrowserUserInterface.prototype.beginOutput = function() {
    $("#read-marker", this.$content).remove();
    this.$content.append($('<hr>').attr('id', 'read-marker'));
  };

  BrowserUserInterface.prototype.endOutput = function() {
    var $marker = $("#read-marker");
    if (this.animate) {
        if ($marker.length > 0) {
          $('html, body').animate({scrollTop: $marker.offset().top}, this.fade_time);
        } else {
          $('html, body').animate({scrollTop: 0}, this.fade_time);
        }
    }
  };

  BrowserUserInterface.prototype.signal = function(data) {
    // TODO: implement signals - signals contain signal, event, and id
    console.log(data);
    var signal = data.signal;
    var event = data.event; // scene-arrival, scene-display, scene-departure, quality-change
    var scene_id = data.id;
    // TODO: handle this in the game.js for each specific game
    if (window && window.handleSignal) {
        window.handleSignal(signal, event, scene_id);
    }
  };

  // dendrynexus displays
  // displays the hand.
  BrowserUserInterface.prototype.displayHand = function(hand, maxCards) {
    if (window && window.displayHand) {
      window.displayHand(hand, maxCards);
      return null;
    }
    var handDescription = 'Hand - click a card to play.';
    if (window.handDescription) {
      handDescription = window.handDescription;
    }
    if (this.dendryEngine.state.qualities.handDescription) {
      handDescription = this.dendryEngine.state.qualities.handDescription;
    }
    var $handEl = $('.hand');
    var hasOldHand = false;
    if ($handEl.length == 0) {
        $handEl = $('<ul>').addClass('hand');
        this.$content.append($('<hr>'));
        this.$content.append($('<p>').addClass('hand-description').text(handDescription));
    } else {
        $handEl.empty();
        hasOldHand = true;
    }
    // display the hand
    for (var i = 0; i < maxCards; i++) {
      var $cardEl = $('<li>').addClass('card-in-hand');
      if (hand[i]) {
        var card = hand[i];
        // create an <a> element, with an image nested inside.
        var $cardLink = $('<a>').addClass('card').attr({href: '#', 'card-id': card.id, title: card.title});
        var $title = $('<span>').addClass('card-caption').text(card.title);
        // if there is an image, set the image; otherwise, set image to a gradient?
        if (card.image) {
          var $cardImage = $('<img>').addClass('card-img').attr({src: card.image});
          $cardLink.append($cardImage);
        } else {
        }
        if (card.subtitle) {
          var $cardSubtitle = $('<span>').addClass('card-tooltip').text(card.subtitle);
          $cardLink.append($cardSubtitle);
        }
        $cardEl.append($cardLink);
        $cardEl.append($title);
        $handEl.append($cardEl);
      } else {
        var $blankCardDiv = $('<div>').addClass('blank-card');
        $cardEl.append($blankCardDiv);
      }
      $handEl.append($cardEl);
    }
    if (!hasOldHand) {
        this.$content.append($handEl);
    }
  };


  BrowserUserInterface.prototype.displayDecks = function(decks) {
    if (window && window.displayDecks) {
      window.displayDecks(decks);
      return null;
    }
    var deckDescription = 'Decks - click a deck to draw a card.';
    if (window.deckDescription) {
      deckDescription = window.deckDescription;
    }
    if (this.dendryEngine.state.qualities.deckDescription) {
      deckDescription = this.dendryEngine.state.qualities.deckDescription;
    }
    this.$content.append($('<hr>'));
    this.$content.append($('<p>').addClass('deck-description').text(deckDescription));
    var $decksEl = $('<ul>').addClass('decks');
    for (var deck of decks) {
      var $deckEl = $('<li>').addClass('deck');
      // create an <a> element, with an image nested inside.
      var $deckLink = $('<a>').addClass('card').attr({href: '#', 'card-id': deck.id, title: deck.title});
      var $title = $('<span>').addClass('card-caption').text(deck.title);
      // if there is an image, set the image; otherwise, set image to a gradient?
      if (deck.image) {
        var $deckImage = $('<img>').addClass('card-img').attr({src: deck.image});
        $deckLink.append($deckImage);
      } else {
        // TODO: set alternative background for $deckLink to a gradient
      }
      if (deck.subtitle) {
        // if there's a subtitle, create a tooltip
        var $deckSubtitle = $('<span>').addClass('card-tooltip').text(deck.subtitle);
        $deckLink.append($deckSubtitle);
      }
      if (!deck.canChoose) {
        $deckEl = $deckEl.addClass('unavailable-card');
      }
      $deckEl.append($deckLink);
      $deckEl.append($title);
      $decksEl.append($deckEl);
    }
    this.$content.append($decksEl);
  };

  // displays pinned cards for dendrynexus
  BrowserUserInterface.prototype.displayPinnedCards = function(cards) {
    if (cards.length == 0) {
      return null;
    }
    if (window && window.displayPinnedCards) {
      window.displayPinnedCards(cards);
      return null;
    }
    var pinnedCardsDescription = 'Pinned cards - click a card to play.';
    if (window.pinnedCardsDescription) {
      pinnedCardsDescription = window.pinnedCardsDescription;
    }
    if (this.dendryEngine.state.qualities.pinnedCardsDescription) {
      pinnedCardsDescription = this.dendryEngine.state.qualities.pinnedCardsDescription;
    }
    this.$content.append($('<hr>'));
    this.$content.append($('<p>').addClass('pinned-text-description').text(pinnedCardsDescription));
    var $cardsEl = $('<ul>').addClass('pinned-cards');
    for (var card of cards) {
      var $cardEl = $('<li>').addClass('pinned-card');
      // create an <a> element, with an image nested inside.
      var $cardLink = $('<a>').addClass('card').attr({href: '#', 'card-id': card.id, title: card.title});
      var $title = $('<span>').addClass('card-caption').text(card.title);
      // if there is an image, set the image; otherwise, set image to a gradient?
      if (card.image) {
        var $cardImage = $('<img>').addClass('card-img').attr({src: card.image});
        $cardLink.append($cardImage);
      } else {
      }
      if (card.subtitle) {
        var $cardSubtitle = $('<span>').addClass('card-tooltip').text(card.subtitle);
        $cardLink.append($cardSubtitle);
      }
      $cardEl.append($cardLink);
      $cardEl.append($title);
      $cardsEl.append($cardEl);
    }
    this.$content.append($cardsEl);
  };

  // visual extensions

  BrowserUserInterface.prototype.setBg = function(image_url) {
      if (this.disable_bg) {
            $('#bg1').addClass('content_hidden');
            $('#bg1').removeClass('content_visible');
            $('#bg1').css('background-image', 'none'); 
      }
      else if (!image_url || image_url == 'none' || image_url == 'null') {
          if (this.animate_bg) {
            $('#bg1').addClass('content_hidden');
            $('#bg1').removeClass('content_visible');
            setTimeout(function() {
                $('#bg1').css('background-image', 'none'); 
                $('#bg1').removeClass('content_hidden');
                $('#bg1').addClass('content_visible');
            },
            100);
          } else {
              $('#bg1').css('background-image', 'none'); 
          }
      } else if (image_url.startsWith('#') || image_url.startsWith('rgba(') || image_url.startsWith('rgb(')) {
          if (this.animate_bg) {
            $('#bg1').fadeOut(this.bg_fade_out_time, function() {
                $('#bg1').css('background-image', 'none'); 
                $('#bg1').css('background-color', image_url);
            });
            $('#bg1').fadeIn(this.bg_fade_in_time, function() {
                $('#bg2').css('background-image', 'none'); 
            });
            console.log('changing background color ' + image_url);
          } else {
              $('#bg1').css('background-image', 'none'); 
              $('#bg1').css('bacground-color', image_url);
          }
      } else if (image_url.startsWith('linear-gradient(')) {
          if (this.animate_bg) {
            $('#bg1').fadeOut(this.bg_fade_out_time, function() {
                $('#bg1').css('background-image', image_url); 
            });
            $('#bg1').fadeIn(this.bg_fade_in_time, function() {
                $('#bg2').css('background-image', image_url); 
            });
            console.log('changing background gradient ' + image_url);
          } else {
              $('#bg1').css('background-image', image_url); 
          }
      } else {
          if (this.animate_bg) {
            $('#bg1').fadeOut(this.bg_fade_out_time, function() {
                $('#bg1').css('background-image', 'url("' + image_url + '")'); 
            });
            $('#bg1').fadeIn(this.bg_fade_in_time, function() {
                $('#bg2').css('background-image', $('#bg1').css('background-image'));
            });
      } else {
          $('#bg1').css('background-image', 'url("' + image_url + '")'); 
      }
    }
  };

  // set sprites given data
  // data is a list of two-element lists, where the first element is location
  // (one of topLeft, topRight, bottomLeft, bottomRight)
  // and the second element is the sprite.
  BrowserUserInterface.prototype.setSprites = function(data) {
      if (window && window.setSprites) {
          window.setSprites(data);
          return;
      }
      if (!this.show_portraits || data == 'none' || data == 'clear') {
          $('#topLeftSprite').children().fadeOut(this.fade_time, function() {$('#topLeftSprite').empty();});
          $('#topRightSprite').children().fadeOut(this.fade_time, function() {$('#topRightSprite').empty();});
          $('#bottomLeftSprite').children().fadeOut(this.fade_time, function() {$('#bottomLeftSprite').empty();});
          $('#bottomRightSprite').children().fadeOut(this.fade_time, function() {$('#bottomRightSprite').empty();});
          return;
      } else {
          if (data instanceof Array) {
              for (var i = 0; i < data.length; i++) {
                  var loc = data[i][0];
                  var img = data[i][1];
                  this.setSprite(loc, img);
              }
          } else if (data) {
                for (var key in Object.keys(data)) {
                  sprites.push([key, data[key]]);
              }
          }
      }
  };

  BrowserUserInterface.prototype.setSprite = function(loc, img) {
      if (!this.show_portraits) {
          return;
      }
      if (window && window.setSprite) {
          window.setSprite(loc, img);
          return;
      }
      loc = loc.toLowerCase();
      var targetSprite;
      if (loc == 'topleft') {
          targetSprite = $('#topLeftSprite');
      } else if (loc == 'topright') {
          targetSprite = $('#topRightSprite');
      } else if (loc == 'bottomleft') {
          targetSprite = $('#bottomLeftSprite');
      } else if (loc == 'bottomright') {
          targetSprite = $('#bottomRightSprite');
      }
      //targetSprite.empty();
      if (img == 'none' || img == 'clear') {
          delete this.dendryEngine.state.sprites[loc];
          targetSprite.fadeOut(this.fade_time, function() {targetSprite.empty();});
          return;
      } else {
          this.dendryEngine.state.sprites[loc] = img;
          targetSprite.fadeOut(this.fade_time, function() {
              targetSprite.emtpy();
              var image = new Image();
              image.src = img;
              targetSprite.append(image);
              console.log('fadeIn');
              targetSprite.fadeIn(this.fade_time);
          });
      }
  };

  BrowserUserInterface.prototype.setSpriteStyle = function(loc, style) {
      if (window && window.setSpriteStyle) {
          window.setSpriteStyle(loc, style);
          return;
      }
      var targetSprite;
      if (loc == 'topleft') {
          targetSprite = $('#topLeftSprite');
      } else if (loc == 'topright') {
          targetSprite = $('#topRightSprite');
      } else if (loc == 'bottomleft') {
          targetSprite = $('#bottomLeftSprite');
      } else if (loc == 'bottomright') {
          targetSprite = $('#bottomRightSprite');
      } else {
          return;
      }
      targetSprite.css(style);
  };

  // play audio with js
  // audio is a space-separated string with at least one entry.
  // the first entry will be a file url.
  // the second-nth entries are words describing how the file will be played:
  // 'queue' for playing the music next after the current audio ends
  // 'loop' if this music will loop indefinitely.
  // 'nofade' if the sound will be played instantly without a fadein or fadeout.
  // TODO: have a list of audio files...
  BrowserUserInterface.prototype.audio = function(audio) {
      if (this.disable_audio) {
          if (this.currentAudio) {
              this.currentAudio.pause();
              this.currentAudio.loop = false;
          }
          return;
      }
      var audioData = audio.split(' ');
      var audioFiles = [];
      var isLoop = false;
      var isQueue = false;
      var noFade = false;
      var isShuffle = false;
      var isClear = false;
      for (var name of audioData) {
          if (name == 'loop') {
              isLoop = true;
          } else if (name == 'queue') {
              isQueue = true;
          } else if (name == 'nofade') {
              noFade = true;
          } else if (name == 'shuffle') {
              isShuffle = true;
          } else if (name == 'clear') {
              isClear = true;
          } else {
              audioFiles.push(name);
          }
      }
      if (isClear) {
          this.audioPlaylist = [];
      }
      if (audioFiles.length >= 1 || isShuffle) {
          this.audioPlaylist = this.audioPlaylist.concat(audioFiles);
      }
      var audioFile = audioFiles[0];
      var currentAudio = this.currentAudio;
      var fadeTime = this.sound_fade_time;
      var loopCurrent = false;
      var playlist = this.audioPlaylist;
      // stop playing
      if (audioFile == 'null' || audioFile == 'none') {
          if (this.currentAudio) {
              $(currentAudio).animate({volume: 0},
                  this.sound_fade_time,
                  function() {
                      currentAudio.pause();
              });
              this.currentAudio.loop = false;
          }
      } else {
          // fadeout current audio, then fade-in new audio
          console.log('new audio:', audioFile, 'current audio:',  this.currentAudioURL);
          if (this.currentAudio && (this.currentAudioURL == audioFile || isQueue || isShuffle)) {
              if (!currentAudio.ended && !currentAudio.paused) {
                  console.log('adding music to queue');
                  this.audioQueue.push(audioFile);
                  var audioQueue = this.audioQueue;
                  this.currentAudio.onended = function() {
                      var newAudio;
                      if (isQueue) {
                          newAudio = audioQueue.pop();
                          console.log('playing from queue');
                      } else if (isShuffle) {
                          var index = Math.floor(Math.random()*playlist.length);
                          newAudio = playlist[index];
                          console.log('playing from playlist');
                      }
                      if (newAudio) {
                          currentAudio.src = newAudio;
                          console.log('Now playing', newAudio);
                          currentAudio.play();
                          $(currentAudio).animate({volume: 1},
                              fadeTime);
                          window.dendryUI.currentAudioURL = newAudio;
                      }
                  };
              } else {
                  this.currentAudioURL = audioFile;
                  currentAudio.src = audioFile;
                  console.log('Fading in new audio');
                  currentAudio.volume = 0;
                  currentAudio.play();
                  $(currentAudio).animate({volume: 1},
                      fadeTime);
                  this.currentAudio.onended = function() {
                      var newAudio;
                      if (isQueue) {
                          newAudio = audioQueue.pop();
                          console.log('playing from queue');
                      } else if (isShuffle) {
                          var index = Math.floor(Math.random()*playlist.length);
                          newAudio = playlist[index];
                          console.log('playing from playlist');
                      }
                      if (newAudio) {
                          currentAudio.src = newAudio;
                          console.log('Now playing', newAudio);
                          currentAudio.play();
                          $(currentAudio).animate({volume: 1},
                              fadeTime);
                          window.dendryUI.currentAudioURL = newAudio;
                      }
                  };
              }
          } else if (this.currentAudio) {
              // not queue or shuffle, so we stop playing the current audio.
              this.currentAudioURL = audioFile;
              console.log('currentAudio present,  fading out current audio');
              // reset the current audio function
              currentAudio.onended = function() {};
              if (noFade) {
                  currentAudio.pause();
                  currentAudio.src = audioFile;
                  currentAudio.play();
              } else {
                  $(currentAudio).animate({volume: 0},
                      this.sound_fade_time,
                      function() {
                          console.log(currentAudio);
                          currentAudio.src = audioFile;
                          console.log('Fading in new audio');
                          currentAudio.play();
                          $(currentAudio).animate({volume: 1},
                              fadeTime);
                  });
              }
          } else if (!this.currentAudio) {
              this.currentAudio = new Audio(audioFile);
              this.currentAudio.volume = 0;
              this.currentAudio.play();
              $(this.currentAudio).animate({volume: 1}, this.sound_fade_time);
              currentAudio = this.currentAudio;
              if (isShuffle) {
                  this.currentAudio.onended = function() {
                    var index = Math.floor(Math.random()*playlist.length);
                    var newAudio = playlist[index];
                    if (newAudio) {
                       currentAudio.src = newAudio;
                       console.log('playing from shuffle');
                       console.log('Now playing', newAudio);
                       currentAudio.play();
                       $(currentAudio).animate({volume: 1},
                              fadeTime);
                          // asdkfl;;sajd;lkjafdsdsaf;kjldjsfa;kl
                       window.dendryUI.currentAudioURL = newAudio;
                    }
                  };
              }
          }
          if (isLoop) {
              this.currentAudio.loop = true;
          } else {
              this.currentAudio.loop = false;
          }
          // https://stackoverflow.com/questions/7451508/html5-audio-playback-with-fade-in-and-fade-out
      }
  };

  BrowserUserInterface.prototype.saveSettings = function() {
    if (typeof localStorage !== 'undefined') {
        localStorage[this.game.title + '_animate'] = this.animate;
        localStorage[this.game.title + '_disable_bg'] = this.disable_bg;
        localStorage[this.game.title + '_animate_bg'] = this.animate_bg;
        localStorage[this.game.title + '_show_portraits'] = this.show_portraits;
        localStorage[this.game.title + '_disable_audio'] = this.disable_audio;
    }
  };

  // TODO: this could be much cleaner...
  BrowserUserInterface.prototype.loadSettings = function(defaultSettings) {
    var defaults = {animate: false, disable_bg: false, animate_bg: true, 
                    show_portraits: true, disable_audio: false};
    if (typeof localStorage !== 'undefined') {
        for (var prop in defaults) {
            if (defaults.hasOwnProperty(prop)) {
                var lsKey = this.game.title + '_' + prop;
                if (lsKey in localStorage) {
                    this[prop] = localStorage[lsKey] != 'false';
                } else {
                    if (defaultSettings && defaultSettings.hasOwnProperty(prop)) {
                        this[prop] = defaultSettings[prop];
                    } else {
                        this[prop] = defaults[prop];
                    }
                }
            }
        }
    }
  };

  BrowserUserInterface.prototype.toggle_audio = function(enable_audio) {
      if (enable_audio) {
          this.disable_audio = false;
          if (this.currentAudio) {
              this.currentAudio.play();
          }
      } else {
          if (this.currentAudio) {
              this.currentAudio.pause();
              this.currentAudio.loop = false;
          }
          this.disable_audio = true;
      }
  };


  // save functions
  BrowserUserInterface.prototype.autosave = function() {
      var oldData = localStorage[this.save_prefix+'_a0'];
      if (oldData) {
          localStorage[this.save_prefix+'_a1'] = oldData;
          localStorage[this.save_prefix+'_timestamp_a1'] = localStorage[this.save_prefix+'_timestamp_a0'];
      }
      var slot = 'a0';
      var saveString = JSON.stringify(this.dendryEngine.getExportableState());
      localStorage[this.save_prefix + '_' + slot] = saveString;
      var scene = this.dendryEngine.state.sceneId;
      var date = new Date(Date.now());
      date = scene + '\n(' + date.toLocaleString(undefined, this.DateOptions) + ')';
      localStorage[this.save_prefix +'_timestamp_' + slot] = date;
      this.populateSaveSlots(slot + 1, 2);
  };

  BrowserUserInterface.prototype.quickSave = function() {
    var saveString = JSON.stringify(this.dendryEngine.getExportableState());
    localStorage[this.save_prefix + '_q'] = saveString;
    window.alert('Saved.');
  };

  BrowserUserInterface.prototype.saveSlot = function(slot) {
    var saveString = JSON.stringify(this.dendryEngine.getExportableState());
    localStorage[this.save_prefix + '_' + slot] = saveString;
    var scene = this.dendryEngine.state.sceneId;
    var date = new Date(Date.now());
    date = scene + '\n(' + date.toLocaleString(undefined, this.DateOptions) + ')';
    localStorage[this.save_prefix + '_timestamp_' + slot] = date;
    this.populateSaveSlots(slot + 1, 2);
  };

  BrowserUserInterface.prototype.quickLoad = function() {
    if (localStorage[this.save_prefix + '_q']) {
      var saveString = localStorage[this.save_prefix + '_q'];
      this.dendryEngine.setState(JSON.parse(saveString));
      window.alert('Loaded.');
    } else {
      window.alert('No save available.');
    }
  };

  BrowserUserInterface.prototype.loadSlot = function(slot) {
    if (localStorage[this.save_prefix + '_' + slot]) {
      var saveString = localStorage[this.save_prefix + '_' + slot];
      this.dendryEngine.setState(JSON.parse(saveString));
      this.hideSaveSlots();
      window.alert('Loaded.');
    } else {
      window.alert('No save available.');
    }
  };

  BrowserUserInterface.prototype.deleteSlot = function(slot) {
    if (localStorage[this.save_prefix + '_' + slot]) {
      localStorage[this.save_prefix + '_' + slot] = '';
      localStorage[this.save_prefix + '_timestamp_' + slot] = '';
      this.populateSaveSlots(slot + 1, 2);
    } else {
      window.alert('No save available.');
    }
  };

  BrowserUserInterface.prototype.exportSlot = function(slot) {
    if (localStorage[this.save_prefix + '_' + slot]) {
      var data = localStorage[this.save_prefix + '_' + slot];
      var a = document.createElement("a");
      var file = new Blob([data], {type: 'text/plain'});
      a.href = URL.createObjectURL(file);
      a.download = 'save.txt';
      a.click();
    } else {
      window.alert('No save available.');
    }
  };

  BrowserUserInterface.prototype.importSave = function(doc_id) {
      var that = this;
      function onFileLoad(e) {
          var data = e.target.result;
          that.dendryEngine.setState(JSON.parse(data));
          that.hideSaveSlots();
          window.alert('Loaded.');
      }
      var uploader = document.getElementById(doc_id);
      var reader = new FileReader();
      var file = uploader.files[0];
      console.log(uploader.files);
      reader.onload = onFileLoad;
      reader.readAsText(file);
  };

  BrowserUserInterface.prototype.populateSaveSlots = function(max_slots, max_auto_slots) {
    // this fills in the save information
    var that = this;
    function createLoadListener(i) {
      return function(evt) {
        that.loadSlot(i);
      };
    }
    function createSaveListener(i) {
      return function(evt) {
        that.saveSlot(i);
      };
    }
    function createDeleteListener(i) {
      return function(evt) {
        that.deleteSlot(i);
      };
    }
    function createExportListener(i) {
      return function(evt) {
        that.exportSlot(i);
      };
    }
      function populateSlot(id) {
          var save_element = document.getElementById('save_info_' + id);
          var save_button = document.getElementById('save_button_' + id);
          var delete_button = document.getElementById('delete_button_' + id);
          if (localStorage[that.save_prefix + '_' + id]) {
              var timestamp = localStorage[that.save_prefix+'_timestamp_' + id];
              save_element.textContent = timestamp;
              save_button.textContent = "Load";
              save_button.onclick = createLoadListener(id);
              delete_button.onclick = createDeleteListener(id);
          } else {
              save_button.textContent = "Save";
              save_element.textContent = "Empty";
              save_button.onclick = createSaveListener(id);
          }
          try {
              var export_button = document.getElementById('export_button_' + id);
              if (localStorage[that.save_prefix + '_' + id]) {
                  export_button.onclick = createExportListener(id);
              }
          } catch(error) {
          }

      }
      for (var i = 0; i < max_slots; i++) {
          populateSlot(i);
      }
      for (i = 0; i < max_auto_slots; i++) {
          populateSlot('a'+i);
      }

  };

  BrowserUserInterface.prototype.showSaveSlots = function() {
    if (this.dendryEngine.state.disableSaves) {
        window.alert('Saving and loading is currently disabled.');
        return;
    }
    var save_element = document.getElementById('save');
    save_element.style.display = 'block';
    this.populateSaveSlots(this.max_slots, 2);
    var that = this;
    if (!save_element.onclick) {
      save_element.onclick = function(evt) {
        var target = evt.target;
        var save_element = document.getElementById('save');
        if (target == save_element) {
          that.hideSaveSlots();
        }
      };
    }
  };

  BrowserUserInterface.prototype.hideSaveSlots = function() {
    var save_element = document.getElementById('save');
    save_element.style.display = 'none';
  };


  // functions for dealing with options
  BrowserUserInterface.prototype.setOption = function(option, toggle) {
      this[option] = toggle; 
      this.saveSettings();
  };

  BrowserUserInterface.prototype.populateOptions = function() {
    var disable_bg = this.disable_bg;
    var animate = this.animate;
    var animate_bg = this.animate_bg;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (animate_bg) {
        $('#animate_bg_yes')[0].checked = true;
    } else {
        $('#animate_bg_no')[0].checked = true;
    }
  };

  BrowserUserInterface.prototype.showOptions = function() {
      var save_element = document.getElementById('options');
      this.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  this.hideOptions();
              }
          };
      }
  };

  // ------------------------------------------------------------------------
  // Additional methods

  BrowserUserInterface.prototype.getGameOverMsg = function() {
    return 'Game Over (reload to read again)';
  };

  BrowserUserInterface.prototype._registerEvents = function() {
    var that = this;
    this.$content.on('click', 'ul.choices li a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var choice = parseInt($(this).attr('data-choice'));
      that.dendryEngine.choose(choice);
      return false;
    });
    this.$content.on('click', 'ul.choices li', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $('a', this).click();
      return false;
    });
    // dendrynexus - onclick for decks and cards
    this.$content.on('click', 'ul.decks li a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var choice = $(this).attr('card-id');
      that.dendryEngine.drawCard(choice);
      return false;
    });
    this.$content.on('click', 'ul.hand li a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var choice = $(this).attr('card-id');
      that.dendryEngine.playCard(choice);
      return false;
    });
    this.$content.on('click', 'ul.pinned-cards li a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var choice = $(this).attr('card-id');
      that.dendryEngine.playPinnedCard(choice);
      return false;
    });
  };

  // ------------------------------------------------------------------------
  // Run when loaded.

  var main = function() {
    engine.convertJSONToGame(window.game.compiled, function(err, game) {
      if (err) {
        throw err;
      }

      var ui = new BrowserUserInterface(game, $('#content'));
      window.dendryUI = ui;
      // Allow the ui system to be customized before use.
      if (window.dendryModifyUI !== undefined) {
        // If it returns true, then we don't need to begin the game.
        var dontStart = window.dendryModifyUI(ui);
        if (dontStart) {
          return;
        }
      }
      ui.dendryEngine.beginGame();
    });
  };
  $(main);

}(jQuery));

},{"../engine":1,"./content/html":3}],3:[function(require,module,exports){
/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function() {
  'use strict';

  var _contentObjectToHTML = function(contentObj) {
    if (contentObj.type === undefined) {
      // if the game defines the function window.displayText, then that function is called to format the text.
      // this is used for game-specific formatting.
      if (typeof(window) !== "undefined" && window.displayText) {
          contentObj = window.displayText(contentObj);
      }
      return contentObj;
    } else {
      switch (contentObj.type) {
      case 'emphasis-1':
        return '<em>' + _contentToHTML(contentObj.content) + '</em>';
      case 'emphasis-2':
        return '<strong>' + _contentToHTML(contentObj.content) + '</strong>';
      case 'emphasis-3':
        return '<code>' + _contentToHTML(contentObj.content) + '</code>';
      case 'hidden':
        return '<span class="hidden">' + _contentToHTML(contentObj.content) +
          '</span>';
      case 'line-break':
        return '<br>';

      // We can't handle elements that require state-dependency.
      // raw html for magic
      case 'magic':
        return contentObj.content;
      case 'insert':
        /* falls through */
      case 'conditional':
        throw new Error(
          contentObj.type + ' should have been evaluated by now.'
          );
      }
    }
  };

  var _contentToHTML = function(content) {
    if (Array.isArray(content)) {
      var result = [];
      for (var i = 0; i < content.length; ++i) {
        var contentObj = content[i];
        result.push(_contentObjectToHTML(contentObj));
      }
      return result.join('');
    } else {
      return _contentObjectToHTML(content);
    }
  };

  var _paragraphsToHTML = function(paragraphs) {
    var result = [];
    for (var i = 0; i < paragraphs.length; ++i) {
      var paragraph = paragraphs[i];
      switch (paragraph.type) {
      case 'heading':
        result.push('<h1>');
        result.push(_contentToHTML(paragraph.content));
        result.push('</h1>');
        break;
      case 'paragraph':
        result.push('<p>');
        result.push(_contentToHTML(paragraph.content));
        result.push('</p>');
        break;
      case 'quotation':
        result.push('<blockquote>');
        result.push(_contentToHTML(paragraph.content));
        result.push('</blockquote>');
        break;
      case 'attribution':
        result.push('<blockquote class="attribution">');
        result.push(_contentToHTML(paragraph.content));
        result.push('</blockquote>');
        break;
      case 'magic':
        result.push(paragraph.content);
        break;
      case 'hrule':
        result.push('<hr>');
        break;
      }
    }
    return result.join('');
  };

  module.exports = {
    convert: _paragraphsToHTML,
    convertLine: _contentToHTML
  };
}());

},{}]},{},[2]);
