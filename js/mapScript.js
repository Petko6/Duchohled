var map;

var bounds = [
  [48.5, 12.1], // Jihozápadní roh
  [51.1, 18.9], // Severovýchodní roh
];

document.addEventListener("DOMContentLoaded", function () {
  // Vytvoření mapy
  map = L.map("map", {
    center: [50, 15], // Střed ČR
    zoom: 7, // Úroveň přiblížení
    maxBounds: bounds, // Nastavení hranic
    maxBoundsViscosity: 0.7, // Zajišťuje, že mapa bude zcela držena uvnitř hranic
  });

  L.tileLayer('https://tile.jawg.io/4d82d3b9-0ca1-4b9d-a6d0-c598dd8291c7/{z}/{x}/{y}{r}.png?access-token=Vljwn5szVctkG5hh1b5nR3oHzd3T9mW1gSO66SwVJ53KL70VC4sl3rezA1OpAcqt', {
    maxZoom: 10,
    minZoom: 7,
  }).addTo(map);

  // Data pro hrady
  var castles = [
    {
      name: "Houska",
      coords: [50.485, 14.653],
      icon: "./media/erby/hrad_houska.png",
      url: "/duchohled/houska.html",
      divId: "houska",
    },
    {
      name: "Loket",
      coords: [50.185, 12.751],
      icon: "./media/erby/loket.png",
      url: "/duchohled/loket.html",
      divId: "loket",
    },
    {
      name: "Rožmberk",
      coords: [48.615, 14.372],
      icon: "./media/erby/rozmberk.png",
      url: "/duchohled/rozmberk.html",
      divId: "rozmberk",
    },
    {
      name: "Radyně",
      coords: [49.663, 13.432],
      icon: "./media/erby/radyne_u_plzne.png",
      url: "/duchohled/radyne.html",
      divId: "radyne",
    },
    {
      name: "Vrškamýk",
      coords: [49.651, 14.093],
      icon: "./media/erby/hrad_vrskamyk.png",
      url: "/duchohled/vrskamyk.html",
      divId: "vrskamyk",
    },
    {
      name: "Kašperk",
      coords: [49.171, 13.563],
      icon: "./media/erby/kasperk.png",
      url: "/duchohled/kasperk.html",
      divId: "kasperk",
    },
  ];

  // Přidání hradů do mapy
  castles.forEach((castle) => {
    var castleIcon = L.icon({
      iconUrl: castle.icon,
      iconSize: [32, 32], // Velikost ikonky
      iconAnchor: [16, 32], // Kotvení ve spodní části ikony
      popupAnchor: [0, -32], // Popisek se zobrazí nad ikonou
      className: `pin-${castle.divId}`,
    });

    var marker = L.marker(castle.coords, {
      icon: castleIcon,
    })
      .addTo(map)
      .bindTooltip(castle.name, {
        permanent: true,
        direction: "bottom",
        offset: [0, 0],
        className: `label-${castle.divId}`,
      });

    let label = document.querySelector(`.label-${castle.divId}`);
    let castlecell = document.getElementById(castle.divId); // Najdeme odpovídající text
    castlecell.style.background = `url('./media/hrady/${castle.divId}.webp') no-repeat center/cover`;

    // Otevření odkazu při kliknutí na pin
    marker.on("click", function () {
      window.open(castle.url, "_blank");
    });

    // Přidáme hover efekty
    marker.on("mouseover", () => {
      castlecell.classList.add("highlight"); // Zvýrazní text
      label.classList.add("label-highlight");
    });

    marker.on("mouseout", () => {
      castlecell.classList.remove("highlight"); // Vrátí zpět
      label.classList.remove("label-highlight");
    });

    // Přidáme hover efekt i pro div seznamu
    castlecell.addEventListener("mouseover", () => {
      castlecell.classList.add("highlight");
      label.classList.add("label-highlight");
    });

    castlecell.addEventListener("mouseout", () => {
      castlecell.classList.remove("highlight");
      label.classList.remove("label-highlight");
    });

    castlecell.addEventListener("click", function () {
      window.open(castle.url);
    })
  });
});
