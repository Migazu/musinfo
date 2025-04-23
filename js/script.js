document.getElementById("searchBtn").addEventListener("click", () => {
  const artist = document.getElementById("artistInput").value.trim();
  if (!artist) return;

  const apiKey = "f1cb549fe40d6e3cc98eac0a6f6273ba"; // API avain
  const infoUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`;
  const albumsUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`;

  // Haetaan artistin tiedot
  fetch(infoUrl)
    .then(res => res.json())
    .then(data => {
      const artistDiv = document.getElementById("artistInfo");
      if (data.error) {
        artistDiv.innerHTML = "<p>Couldn't find that artist</p>";
        return;
      }
      const artistInfo = data.artist;
      artistDiv.innerHTML = `
        <h2>${artistInfo.name}</h2>
        <p>${artistInfo.bio.summary.split('<a')[0]}</p>
      `;
    });

  // Haetaan top-albumit
  fetch(albumsUrl)
    .then(res => res.json())
    .then(data => {
      const albumDiv = document.getElementById("albums");
      albumDiv.innerHTML = "";
      if (data.error) {
        albumDiv.innerHTML = "<p>No albums were found</p>";
        return;
      }

      data.topalbums.album.slice(0, 5).forEach(album => {
        albumDiv.innerHTML += `
          <div class="album">
            <h3>${album.name}</h3>
            <img src="${album.image[2]['#text']}" alt="${album.name} kansi" />
          </div>
        `;
      });
    });
});
