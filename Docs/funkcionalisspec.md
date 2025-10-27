# StudyMate AI – Funkcionális specifikáció

## 1. Rendszeráttekintés

A StudyMate AI egy webalapú, mesterséges intelligenciával támogatott tanulási rendszer, amely lehetővé teszi a felhasználók számára, hogy saját tananyagaikat feltöltsék, majd azokat automatikusan feldolgozza, összefoglalja és kvízek formájában gyakoroltatja.  
A rendszer célja, hogy személyre szabott tanulási élményt nyújtson, és aktív, adatvezérelt támogatást biztosítson az önálló tanuláshoz.

### Fő technológiai rétegek

- **Frontend (React + TailwindCSS):** felhasználói interakciók kezelése, vizuális megjelenítés, dinamikus komponensek, statisztikák megjelenítése, grafikonok és interaktív kvízek.  
- **Backend (Node.js + Express):** üzleti logika, REST API, adatfeldolgozás, hitelesítés, jogosultságkezelés, PDF- és fájlkezelés.  
- **Adatbázis (MongoDB):** strukturált és dokumentum alapú adatok tárolása, több gyűjtemény kezelése a felhasználók, jegyzetek, kvízek és AI-javaslatok számára.  
- **AI-integrációs réteg:** OpenAI API használata az összefoglalók, kvízkérdések és személyre szabott tanulási javaslatok generálásához.  

A rendszer moduláris felépítése biztosítja a bővíthetőséget, a karbantarthatóságot és a skálázhatóságot, lehetővé téve új funkciók, kvíztípusok, AI-algoritmusok vagy közösségi modulok integrálását.

---

## 2. Projekt leírása

A StudyMate AI célja egy integrált tanulástámogató platform létrehozása, amely minden lépésben támogatja a felhasználót: jegyzetfeltöltéstől az összefoglaláson át a kvízkitöltésig és az AI-alapú tanulási javaslatokig.  

### Információfeldolgozási lánc

1. **Jegyzetfeltöltés:** szöveges vagy PDF formátumban.  
2. **Automatikus összefoglaló:** AI elemzi a tananyagot és rövid, tanulásra optimalizált összefoglalót készít.  
3. **Kvízgenerálás:** AI kérdések készítése az anyag alapján, interaktív kitöltéshez.  
4. **Eredmény-elemzés:** a rendszer rögzíti a felhasználó teljesítményét, pontszámokat és statisztikát készít.  
5. **AI Study Coach:** személyre szabott tanulási javaslatok és gyakorló kérdések a gyenge pontok erősítésére.

### Fő modulok és funkcióik

- **Jegyzetfeltöltő modul:** fájl- és szövegkezelés, CRUD műveletek, PDF-feldolgozás, hibakezelés, metaadatok mentése.  
- **AI-feldolgozó modul:** OpenAI integráció, promptok kezelése, aszinkron hívások, cache-elés, AI-válaszok feldolgozása és tárolása.  
- **Kvízrendszer:** kérdések generálása, kitöltés, pontozás, eredmények mentése, ismétlésre optimalizált folyamatok.  
- **AI Study Coach:** teljesítményelemzés, gyenge pontok azonosítása, tanulási javaslatok és gyakorló feladatok automatikus készítése.  
- **Profil és statisztika modul:** eredmények megjelenítése, grafikonok, előrehaladás követése, összesített statisztikák.

---

## 3. Vágyálomrendszer leírása

A vágyálomrendszer ideális állapota, hogy a felhasználó minden tanulási tevékenységet egyetlen platformon végezzen, az AI pedig aktívan részt vegyen a tanulási folyamatban:

- **Összefoglalás és kvíz:** a felhasználó azonnali, személyre szabott anyagot kap.  
- **AI adaptív viselkedés:** a rendszer alkalmazkodik a felhasználó tanulási mintázataihoz.  
- **Folyamatos fejlődés:** az AI a felhasználói interakciók alapján finomhangolja a javaslatokat.  
- **Teljes tanulási nyomon követés:** jegyzetek, kvízek és tanulási javaslatok egy helyen.

---

## 4. Jelenlegi üzleti folyamatok modellje

A hallgatók jelenleg különálló eszközöket használnak, ami:

- széttagolt, manuális feldolgozást eredményez,  
- nehezíti a tudás mérését,  
- csökkenti a motivációt a rendszeres gyakorlásra.

A StudyMate AI automatizált, adatvezérelt megoldást kínál: feldolgozza az anyagokat, mérhetővé teszi a tudást, és egyéni tanulási útvonalat ajánl.

---

## 5. Igényelt üzleti folyamatok modellje

A StudyMate AI működése:

1. **Jegyzetfeltöltés és tárolás** – PDF vagy szöveg feldolgozása, metaadatok mentése.  
2. **AI összefoglaló készítése** – tanulásra optimalizált rövid összefoglaló.  
3. **Kvízkérdések előállítása** – 5–10 kérdés generálása, lehetőség különböző nehézségi szintekre.  
4. **Kvízkitöltés és értékelés** – automatikus pontozás, statisztikai adatok rögzítése.  
5. **AI Study Coach javaslatok** – gyenge pontok azonosítása, új gyakorló feladatok.

A felhasználó végül teljes képet kap a tanulás előrehaladásáról, a hiányosságokról és a további teendőkről.

## 6. Funkcionális követelmények

- **Jegyzetfeltöltés:** szöveges vagy PDF formátum, ellenőrzés és feldolgozás, hibaüzenet hibás fájl esetén.  
- **Jegyzetek kezelése:** szerkesztés, törlés, metaadatok kezelése, verziókövetés.  
- **AI-összefoglalók készítése:** három bekezdéses tömör összefoglaló, mentés az adatbázisba.  
- **Kvízkérdések generálása:** 5–10 kérdés, több válaszlehetőség, interaktív kitöltés.  
- **Kvíz kitöltése és értékelése:** pontozás, válaszok mentése, statisztikák, gyenge pontok jelzése.  
- **AI Study Coach:** teljesítményelemzés, ismétlési javaslatok, új gyakorló kérdések.  
- **Profil és statisztika:** grafikonok, összesített pontszámok, beállítások módosítása.  
- **Hitelesítés és jogosultságkezelés:** JWT token, adatok kizárólag a megfelelő felhasználó számára.  
- **Hibakezelés:** minden funkcióhoz hibaüzenet és naplózás.

## 7. Nem funkcionális követelmények

- **Felhasználói élmény:** intuitív, átlátható, könnyen navigálható.  
- **Reszponzív design:** mobil, tablet, desktop kompatibilitás.  
- **Teljesítmény:** válaszidő <2 másodperc, AI-hívások optimalizált cache-eléssel.  
- **Megbízhatóság:** 99,5%-os rendelkezésre állás, hibatűrő működés, adatmentés.  
- **Biztonság:** HTTPS, jelszó-hash, jogosultságkezelés, API hozzáférések korlátozása.  
- **Skálázhatóság:** horizontális bővíthetőség több ezer felhasználóhoz.  
- **Bővíthetőség:** moduláris felépítés, új AI-funkciók, kvíztípusok és közösségi funkciók integrálhatók.  
- **Hibakezelés és naplózás:** minden kritikus esemény naplózása, riasztás lehetősége.

## 8. Adatkezelési követelmények

### Kezelt entitások

- **User:** azonosító, név, e-mail, jelszó hash, regisztráció dátuma.  
- **Note:** cím, tartalom, AI-összefoglaló, generált kvízkérdések, metaadatok.  
- **QuizResult:** felhasználóhoz és jegyzethez kapcsolódó pontszámok, válaszok, kitöltés dátuma.  
- **AiAdvice:** AI által generált tanulási javaslatok, gyakorló kérdések, generálás dátuma.

### Adatvédelmi szabályok

- Titkosított adatátvitel (HTTPS).  
- Felhasználónként elkülönített adatok, más felhasználó nem fér hozzá.  
- GDPR-kompatibilis adatkezelés, átlátható jogosultságok és adat-hozzáférés.

## 9. Használati esetek

### 9.1 Jegyzetfeltöltés

- Felhasználó új jegyzetet ad hozzá.  
- Rendszer ellenőrzi a formátumot, menti a jegyzetet, és értesíti a felhasználót a sikeres feltöltésről.  
- Hibás fájl esetén hibaüzenet jelenik meg, és a jegyzet nem kerül mentésre.

### 9.2 Összefoglaló generálása

- Felhasználó gombnyomással kéri az AI-tól az összefoglalót.  
- AI feldolgozza a tartalmat, három bekezdéses összefoglalót készít, elmenti az adatbázisba.  
- Felhasználó megtekintheti, szerkesztheti és mentheti az összefoglalót.

### 9.3 Kvízkitöltés

- AI generálja a kérdéseket és válaszlehetőségeket.  
- Felhasználó kitölti a kvízt, a rendszer pontoz, statisztikát készít, és az AI Study Coach számára rögzíti az eredményeket.  
- Felhasználó láthatja azonnali visszajelzésként az eredményt, részletes elemzéssel a gyenge pontokról.

### 9.4 AI Study Coach

- AI kiértékeli az összes korábbi kvízt, azonosítja a gyenge területeket, és javaslatot ad további gyakorlásra.  
- Lehetőséget ad új gyakorló kérdések azonnali megoldására.

### 9.5 Profil és statisztika

- Felhasználó áttekintheti korábbi jegyzeteit, eredményeit, AI-javaslatait.  
- Grafikonok és statisztikák szemléltetik a fejlődést, a kitöltött kvízek számát, az átlagpontszámot és a gyenge témaköröket.

## 10. Rendszerintegrációs követelmények

- **Backend:** Node.js + Express REST API, moduláris felépítés.  
- **Frontend:** React + TailwindCSS, dinamikus komponensek, grafikonok, kvíz-interakciók.  
- **Adatbázis:** MongoDB (Mongoose ORM), strukturált dokumentumok, indexelt keresés.  
- **AI integráció:** OpenAI API (GPT-4-turbo vagy újabb modell), prompt-kezelés, aszinkron feldolgozás.  
- **PDF feldolgozás:** pdf-parse vagy pdfjs-dist, szövegkinyerés és metaadatok mentése.  
- **Grafikonok:** Chart.js vagy Recharts, vizualizált előrehaladás.  
- **Hitelesítés:** JWT token alapú.  
- **Fájlfeltöltés:** biztonságos, validált, metaadatokkal ellátott.

## 11. Minőségi követelmények



## 12. Tesztelési és karbantartási követelmények


