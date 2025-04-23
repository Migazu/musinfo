
// Haetaan elementit
const searchBtn = document.getElementById("searchBtn");
const artistInput = document.getElementById("artistInput");
const artistInfoDiv = document.getElementById("artistInfo");

// Klikattaessa hakunappia tehdään API-kutsut
searchBtn.addEventListener("click", () => {
  const artist = artistInput.value.trim();
  if (!artist) return;

  const apiKey = "f1cb549fe40d6e3cc98eac0a6f6273ba";

  // Haetaan artistin tiedot
  const infoUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`;

  fetch(infoUrl)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        artistInfoDiv.innerHTML = "<p>Artist not found.</p>";
        return;
      }

      const artistData = data.artist;
      const image = artistData.image?.[2]['#text'] || "";

      // Artistin tiedot vasempaan reunaan
      artistInfoDiv.innerHTML = `
        <div class="main-content">
          <div class="artist-info">
            <h2>${artistData.name}</h2>
            <p>${artistData.bio.content}</p>
          </div>
          <div class="album-list" id="albumListContainer"></div>
        </div>
      `;

      // Laitetaan albumit oikealle puolelle oikeaan kohtaan
      const albumListContainer = document.getElementById("albumListContainer");

      // Haetaan artistin albumit
      const albumsUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`;

      fetch(albumsUrl)
        .then(res => res.json())
        .then(albumData => {
          if (albumData.error) {
            albumListContainer.innerHTML = "<p>No albums found.</p>";
            return;
          }

          // Luodaan jokaisesta albumista näkyvä kortti
          albumData.topalbums.album.forEach(album => {
            const image = album.image?.[2]['#text'] || "";
            const albumCard = document.createElement("div");
            albumCard.classList.add("album");
            albumCard.innerHTML = `
              <img src="${image}" alt="${album.name}">
              <h3>${album.name}</h3>
            `;
            albumListContainer.appendChild(albumCard);
          });
        });
    });
});
