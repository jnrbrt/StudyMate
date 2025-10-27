# StudyMate AI – Követelményspecifikáció

## 1. A projekt célja és indoklása

A **StudyMate AI** célja, hogy egy olyan webes tanulástámogató platformot biztosítson, amely az egyéni tanulást mesterséges intelligenciával segíti.  
A rendszer az oktatásban tapasztalható egyik legnagyobb problémát célozza meg: a **személyre szabott visszajelzés** és az **aktív tanulás hiányát**.

A felhasználó feltöltheti saját jegyzeteit, a rendszer ezeket automatikusan elemzi, összefoglalja és interaktív tanulási anyaggá alakítja.  
A tanuló a feltöltött anyagból generált kvízeken keresztül gyakorolhat, a rendszer pedig az eredményei alapján **személyre szabott tanulási javaslatokat** kínál.

A projekt célja egy **felhasználóbarát, mesterséges intelligenciával támogatott tanulási környezet** kialakítása, amely hatékonyabbá és motiválóbbá teszi az önálló tanulást.

---

## 2. Jelenlegi helyzet leírása

A tanulók jelenleg több, egymástól független platformon kezelik a tanulási anyagaikat. Ezek a rendszerek nem kommunikálnak egymással, a tanulás folyamata **szétszabdalt, manuális és passzív**.

### Jellemző problémák
- A jegyzetek feldolgozása időigényes és nehezen kereshető  
- Nincs automatizált tudásmérés  
- A visszajelzés hiányos vagy teljesen hiányzik  
- A fejlődés nem követhető, nincsenek mérhető eredmények  
- A tanuló nem kap iránymutatást, hogy mely témákra érdemes koncentrálnia  

A jelenlegi környezet nem támogatja az **önálló, adaptív tanulást** – ezt a szerepet a StudyMate AI veszi át.

---

## 3. Vágyálomrendszer leírása

A **StudyMate AI** egy **integrált, intelligens tanulási platform**, amely a tanulás minden lépését egy helyen biztosítja.

### A felhasználó
- Feltöltheti jegyzeteit szövegesen vagy PDF-ben  
- A rendszer AI segítségével összefoglalót készít a tartalomból  
- Automatikusan generál kvízkérdéseket  
- Lehetőséget ad ezek megválaszolására és az eredmények mentésére  
- A személyes tanulási teljesítmény alapján tanácsokat és gyakorló feladatokat kap  

A cél egy **proaktív tanulási segéd**, amely felismeri a felhasználó gyenge pontjait, és ezekre építve javaslatokat ad az ismétléshez és fejlődéshez.

---

## 4. Jelenlegi üzleti folyamatok modellje

- A tanulók több, különálló eszközt használnak (pl. Word, Notion, Google Docs, Quizlet)  
- A tanulási anyagok tárolása decentralizált, a feldolgozás manuális  
- A tudásellenőrzés nem egységes, gyakran önértékelésre épül  
- A tanulás nem mérhető, az előrehaladásról nincs adatszintű visszajelzés  
- A rendszeres gyakorlás motivációja alacsony, nincs személyre szabott útmutatás  

Ezek a problémák indokolják egy **központosított, AI-alapú tanulási rendszer** bevezetését.

## 5. Igényelt üzleti folyamatok modellje

A **StudyMate AI** működési folyamata:

1. **Jegyzetfeltöltés és tárolás**  
   A felhasználó feltölti a tananyagot, amit a rendszer automatikusan feldolgoz és tárol.  

2. **Összefoglaló generálása**  
   Az AI lényegkiemelő összefoglalót készít a dokumentumból, segítve az ismétlést.  

3. **Kvízgenerálás**  
   A rendszer 5 kérdésből álló kvízt készít a jegyzet tartalmából.  

4. **Kvízkitöltés és értékelés**  
   A felhasználó kitölti a tesztet, a rendszer automatikusan pontoz és tárolja az eredményt.  

5. **AI Study Coach**  
   Az AI elemzi a korábbi eredményeket, javaslatokat tesz a fejlődésre, és új gyakorló kérdéseket is készít.  

6. **Profil és statisztika**  
   A felhasználó követheti a fejlődését, megtekintheti a korábbi kvízeket és az AI tanácsait.


## 6. Funkcionális követelmények

- Jegyzetek feltöltése és szerkesztése (szöveg, PDF)  
- Automatikus szövegfeldolgozás és mentés  
- AI-alapú összefoglalók készítése (OpenAI API integráció)  
- AI által generált kvízkérdések létrehozása  
- Kvízek kitöltése és automatikus pontozás  
- Felhasználói statisztika megjelenítése (eredmények, előrehaladás)  
- AI Study Coach tanulási javaslatokkal és gyakorló feladatokkal  
- Felhasználói hitelesítés (JWT token)  
- Profiloldal: beállítások, jegyzetek, kvízek, tanulási javaslatok  
- Adatbiztonsági előírások betartása (titkosítás, jogosultságkezelés)

## 7. Nem funkcionális követelmények

- Reszponzív, felhasználóbarát kezelőfelület (React + TailwindCSS)  
- Minden művelet gyors végrehajtása (<2 másodperc válaszidő)  
- Megbízható backend szolgáltatás (Node.js + Express)  
- Stabil adatkezelés (MongoDB, Mongoose ORM)  
- Kódminőségi és biztonsági szabványok betartása  
- Többeszközös támogatás (mobil, tablet, desktop)  
- Hibakezelés minden fő funkciónál (érvénytelen fájl, API-hiba stb.)

---

## 8. Használati esetek

### Jegyzetfeltöltés
- Felhasználó kiválasztja a fájlt vagy beírja a szöveget  
- Rendszer feldolgozza és menti a jegyzetet  

### Összefoglaló generálása
- Felhasználó gombnyomásra kéri az AI-tól az összefoglalót  
- A rendszer az eredményt elmenti és megjeleníti  

### Kvízkérdések létrehozása és kitöltése
- AI kérdéseket generál → felhasználó válaszol → rendszer pontoz  

### AI Study Coach javaslatainak megtekintése
- AI kiértékeli a korábbi kvízeket és személyre szabott javaslatokat ad  

### Profil és statisztika
- Felhasználó megtekinti fejlődési adatait, pontszámait és ajánlásait

---

## 9. Minőségi követelmények


