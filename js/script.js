
/* Haetaan tarvittavat elementit HTML:stä */
const searchBtn = document.getElementById("searchBtn"); /* Hae-nappi */
const artistInput = document.getElementById("artistInput"); /* Tekstikenttä johon käyttäjä syöttää artistin nimen */
const artistInfoDiv = document.getElementById("artistInfo"); /* Tähän tulee artistin tiedot + albumit */

/* Mahdollistaa haun myös Enterillä */
artistInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); /* Estetään lomakkeen mahdollinen oletustoiminta */
    searchBtn.click(); /* Simuloidaan hakunapin painallus */
  }
});

/* Kun käyttäjä klikkaa hakunappia, suoritetaan haku */
searchBtn.addEventListener("click", () => {
  const artist = artistInput.value.trim(); /* Haetaan syötetty artistin nimi ja poistetaan turhat välilyönnit */
  if (!artist) return; /* Jos kenttä on tyhjä, ei tehdä mitään */

  const apiKey = "f1cb549fe40d6e3cc98eac0a6f6273ba"; /* Oma Last.fm API-avain */

  /* Luodaan URL artistin tietojen hakua varten */
  const infoUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`;

  /* Lähetetään pyyntö artistin tietoja varten */
  fetch(infoUrl)
    .then(res => res.json()) /* Muutetaan vastaus JSON-muotoon */
    .then(data => {
      if (data.error) {
        /* Jos artistia ei löydy, näytetään virheilmoitus */
        artistInfoDiv.innerHTML = "<p>Artist not found.</p>";
        return;
      }

      const artistData = data.artist; /* Talletetaan artistin tiedot */
      const image = artistData.image?.[2]['#text'] || ""; /* Artistin kuva (koko 2), jos saatavilla */

      /* Näytetään artistin nimi ja kuvaus vasemmalla */
      artistInfoDiv.innerHTML = `
        <div class="main-content">
          <div class="artist-info">
            <h2>${artistData.name}</h2>
            <p>${artistData.bio.content}</p> <!-- Artistin kuvaus (koko sisältö) -->
          </div>
          <div class="album-list" id="albumListContainer"></div> <!-- Tähän tulee albumit -->
        </div>
      `;

      const albumListContainer = document.getElementById("albumListContainer"); /* Haetaan albumilistadiv uudestaan */

      /* Luodaan URL artistin albumien hakua varten */
      const albumsUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`;

      /* Haetaan artistin albumit */
      fetch(albumsUrl)
        .then(res => res.json()) /* Muutetaan albumit JSON-muotoon */
        .then(albumData => {
          if (albumData.error) {
            albumListContainer.innerHTML = "<p>No albums found.</p>"; /* Jos albumeja ei ole */
            return;
          }

          /* Käydään jokainen albumi läpi ja lisätään näkyviin */
          albumData.topalbums.album.forEach(album => {
            const image = album.image?.[2]['#text'] || ""; /* Albumin kuva, jos saatavilla */
            const albumCard = document.createElement("div"); /* Luodaan uusi div albumille */
            albumCard.classList.add("album"); /* Lisätään diviin album-luokka (tyylit) */
            albumCard.innerHTML = `
              <img src="${image}" alt="${album.name}"> <!-- Albumin kansikuva -->
              <h3>${album.name}</h3> <!-- Albumin nimi -->
            `;
            albumListContainer.appendChild(albumCard); /* Lisätään albumi näkymään */
          });
        });
    });
});
