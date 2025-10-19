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



## 4. Jelenlegi üzleti folyamatok modellje



## 5. Igényelt üzleti folyamatok modellje



## 6. Funkcionális követelmények



## 7. Nem funkcionális követelmények



## 8. Adatkezelési követelmények



## 9. Használati esetek



## 10. Rendszerintegrációs követelmények



## 11. Minőségi követelmények



## 12. Tesztelési és karbantartási követelmények


