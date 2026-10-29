# Scouting Pallavolo · 1.0

PWA statica senza dipendenze, account o server applicativo. Dati solo nel browser del dispositivo; backup e ripristino JSON. Massimo 14 convocati, 5 set, T indipendenti per set, matrice di azioni ripetibili per rally, annullamento, risultati e report stampabile/salvabile in PDF.

Codici: battuta e muro `+` punto, `=` errore; ricezione e attacco `+`, `=`, `#`. Il numero totale è automatico. Nessun gesto assegna automaticamente il punto: il rally si chiude con Punto casa o Punto trasferta. Difesa e alzata escluse.

## Pubblicare su GitHub e Cloudflare Pages

1. Crea su GitHub un repository `SCOUTING_PALLAVOLO`, senza dati degli atleti. Carica README.md, package.json, tests e la cartella **dist completa**. Non caricare `.openai` o i backup JSON personali.
2. Nel pannello Cloudflare scegli **Workers & Pages → Create application → Pages → Connect to Git** (i nomi dei pulsanti possono variare). Collega GitHub e scegli il repository.
3. Branch di produzione: `main`. Preset framework: `None`. Comando di build: vuoto. Directory di output: `dist`. Directory radice: lascia vuota.
4. Avvia il deployment e apri l’URL HTTPS assegnato da Pages. I successivi push sul branch main avvieranno nuovi deployment.

Alternativa senza Git: in Pages scegli caricamento diretto e carica **il contenuto di dist**, con index.html nella radice del pacchetto. Questa modalità non configura il collegamento automatico a GitHub: scegli Connect to Git se vuoi gli aggiornamenti automatici.

## Uso

Apri online almeno una volta e aspetta “Offline pronto”. Inserisci la rosa, crea la partita e scegli fino a 14 convocati. Imposta le T per gli atleti in campo. Le T riordinano la tabella, non sono un registro ufficiale delle sostituzioni.

Desktop/tablet: tutti i gesti nella matrice. Telefono: selettore del gesto per mantenere leggibili nomi e celle. Ogni tocco aggiunge un evento al rally e incrementa il contatore del set. Punto casa/trasferta consolida il rally. Annulla rimuove l’ultima azione oppure riapre il rally appena chiuso e toglie il relativo punto. Il report comprende anche le azioni di un rally aperto, con avviso.

Chiudi set e passa al successivo. I set chiusi sono in sola lettura, l’ultimo è riapribile. A tre set vinti o al quinto set chiuso la partita termina. È possibile terminarla anche manualmente per gare ridotte. Il punteggio non standard richiede conferma.

Risultati → Stampa / Salva PDF usa la finestra di stampa del dispositivo. Seleziona “Salva come PDF”. Si tratta di un report base con punteggi, conteggi e KPI per battuta/muro; non attribuisce significati o percentuali di efficacia ai codici di ricezione/attacco.

## Dati e aggiornamenti

- I dati restano su quel browser, dispositivo e indirizzo del sito. Aprire l’app su un altro dominio o dispositivo non trasferisce le partite: usa il backup JSON.
- Prima di cancellare dati del browser esporta un backup. Non usare modalità privata per conservare partite.
- L’import sostituisce l’archivio dopo validazione e conferma.
- Per una nuova release modifica il nome della cache in dist/sw.js. Il service worker aggiornato diventa attivo dopo la chiusura delle vecchie schede, evitando aggiornamenti durante uno scout.
- Nessun tracking, font remoto, database o libreria CDN.

## Verifica

Node.js 22 o successivo: `npm test`. Per provare l’interfaccia usa un server statico HTTPS o localhost che serva dist. Non aprire index.html con file://: moduli JavaScript e service worker richiedono un’origine HTTP/HTTPS.
