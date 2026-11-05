# Tehtävä 6: Web-analytiikka ja CORS

## Analytiikan hyödyntäminen
Web-analytiikkaa voidaan käyttää sovelluksen kävijämäärien, mahdollisten suorituskykyongelmien, tai vaikkapa virheiden seurantaan. 

## CORS-ongelmien välttäminen
CORS-virhe tulee silloin kun selain estää datan hakemisen toisesta osoitteesta johtuen tietoturvasyistä. Ratkaisu olisi:
Hakupyyntöjen salliminen taustapalvelimen asetuksissa 
tai
Pyyntöjen kierrättäminen oman palvelimen kautta jolloin selain luuolee niiden tulevan samasta lähteestä