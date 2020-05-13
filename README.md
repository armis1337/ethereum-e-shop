# Ethereum E-Shop

## Internetine zaidimu parduotuve Ethereum blockchain'e

### 3 Vartotoju grupes:  

**Normal User** - Gali pirkti zaidimus, palikti atsiliepima, pranesti apie klaida, prasyti refundo, redaguoti savo profili.  
**Seller** - Negali pirkti zaidimu, palikti atsiliepimu, pranesti klaidu bei prasyti refundu. Gali kurti zaidimus, perziureti savo sukurtus zaidimus, gali juos redaguoti, istrinti.  
**Admin** - Negali pirkti, palikti atsiliepimu, pranesti klaidu bei prasyti refundo. Gali kurti zaidimus, juos redaguoti, trinti (taip pat ir kitu varototju sukurtus zaidimus). Gali priskirti kita vartotoja tam tikrai grupei (jei vartotojas atitinka reikalavimus). Gali patvirtinti arba atmesti refund prasyma. 


## Todo list
* ### Iteracija 1
  * [x] Parduotuves info atvaizdavimas (parduodamu zaidimu skaicius, is viso nupirktu zaidimu sk,...)
  * [x] Zaidimu pridejimas i parduotuve pardavimui (tik administratoriui)
  * [x] Visu parduodamu zaidimu sarasas
  * [x] Zaidimo info puslapis (foto/video, kurejai, aprasymas, isleidimo metai, parduotu kopiju skaicius, t.t.)
  * [x] Zaidimu pirkimas (paprastiems vartotojams)

* ### Iteracija 2
  * [x] Admin sasaja - Esamu zaidimu redagavimas
  * [x] Vartotoju grupes Sellers sukurimas
  * [x] Admin sasaja - Vartotoju priskyrimas "sellers" grupei
  * [x] Zaidimu pridejimas bei ju redagavimas "sellers" grupes nariams
  * [x] Sutvarkyt viska normaliai  - perrasytas visas .js funkcionalumas 

* ### Iteracija 3
  * [x] Vartotojo profilio puslapis - informacijos atvaizdavimas: visi turimi zaidimai, ju pirkimo data t.t. 
  * [x] Pinigu uz zaidima susigrazinimas (refund) paprastiems vartotojams
  * [x] Pardaveju profilio puslapis - Aprasymo, email, metu redagavimas
  * [x] Administratoriaus sasaja - refund prasymu perziurejimas, patvirtinimas arba atmetimas
 
* ### Iteracija 4
  * [x] Zaidimo info puslapis paprastiems vartotojams - Galimybe vertinti zaidima (x/10), palikti atsiliepima
  * [x] Zaidimo info puslapis paprastiems vartotojams - Galimybe pranesti apie klaida (report a bug)
  * [x] Zaidimo info puslapis pardavejams - 1.4 + Skaityti atsiliepimus bei pranesimus apie klaidas
  * [x] Zaidimo info puslapis pardavejams - Pazymeti klaida kaip istaisyta
  * [x] Zaidimo info puslapis administratoriams - Visa info paprastiems vartotojams + info pardavejams

## Reikalavimai
```
ganache personal etherum blockchain - https://www.trufflesuite.com/ganache
node package manager (apt-get install npm)
metamask for browser - https://metamask.io/download.html
```		
## Kaip pasileisti
```
$ "./Downloads/ganache-2.*-linux-x86_64.AppImage --no-sandbox" > quickstart (ethereum)
pridekite ganache tinkla i metamask - HTTP://127.0.0.1:1337
$ ./launch.sh
```
## Jeigu nepasileidzia (dazniausiai restartuojant)
```
ganache > settings > accounts & keys - autogenerate hd mnemonic: on
restart ganache
$ ./launch.sh
logout out of metamask
login with new mnemonic
```