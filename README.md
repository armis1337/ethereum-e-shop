# ethereum e shop

swx all

## todo list
* iteracija 1
  * [x] Parduotuves info atvaizdavimas (parduodamu zaidimu skaicius, is viso nupirktu zaidimu sk,...)
  * [x] Zaidimu pridejimas i parduotuve pardavimui (tik administratoriui)
  * [x] Visu parduodamu zaidimu sarasas
  * [x] Zaidimo info puslapis (foto/video, kurejai, aprasymas, isleidimo metai, parduotu kopiju skaicius, t.t.)
  * [x] Zaidimu pirkimas (paprastiems vartotojams)
\  
* iteracija 2
  * [x] Admin sasaja - Esamu zaidimu redagavimas
  * [x] Vartotoju grupes Sellers sukurimas
  * [x] Admin sasaja - Vartotoju priskyrimas "sellers" grupei
  * [x] Zaidimu pridejimas bei ju redagavimas "sellers" grupes nariams
\  
* iteracija 3
  * [ ] Vartotojo profilio puslapis - informacijos atvaizdavimas: visi turimi zaidimai, ju pirkimo data t.t. 
  * [ ] Pinigu uz zaidima susigrazinimas (refund) paprastiems vartotojams
  * [ ] Pardaveju profilio puslapis - Aprasymo redagavimas, nuotraukos keitimas (?)
  * [ ] Administratoriaus sasaja - refund prasymu perziurejimas, patvirtinimas arba atmetimas
\  
* iteracija 4
  * [ ] Zaidimo info puslapis paprastiems vartotojams - Galimybe vertinti zaidima (x/10), palikti atsiliepima
  * [ ] Zaidimo info puslapis paprastiems vartotojams - Galimybe pranesti apie klaida (report a bug)
  * [ ] Zaidimo info puslapis pardavejams - 1.4 + Skaityti atsiliepimus bei pranesimus apie klaidas
  * [ ] Zaidimo info puslapis pardavejams - Pazymeti klaida kaip istaisyta
  * [ ] Zaidimo info puslapis administratoriams - Visa info paprastiems vartotojams + info pardavejams

### requirements to run
```
ganache personal etherum blockchain
node package manager (apt-get install npm)
truffle framework (npm install -g truffle)  
metamask for browser
```		
```
npm install
truffle migrate --reset
npm run dev
```
#### jeigu metamaskas pisa prota
```
ganache > settings > accounts & keys - autogenerate hd mnemonic: on
restart ganache
$ ./launch.sh
logout out of metamask
login with new mnemonic
```
