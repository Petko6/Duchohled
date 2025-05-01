import { initMap } from "./systems/Map.js";
import { createMarker } from "./components/marker.js";
import { AnimateMarker } from "./systems/Animate.js";

// Define castles with details for markers and list items
let castles = [
  {
    name: "Houska",
    coords: [50.485, 14.653],
    icon: "../media/erby/houska.svg",
    url: "../media/hrady/houska.webp",
    scarytour:
      "V Kokořínském dole (10 km od hradu) zažiješ 'Noční stezku magie'. Tato oblast je spojená s keltskými rituály a starými českými pověstmi o čarodějnicích. Průvodce tě provede hlubokými lesy a ukáže ti skalní oltář, kde se prý konaly obětiny. V noci les vydává podivné zvuky, a někteří návštěvníci hlásí pocit, že je někdo sleduje.",
    food: "V kavárně 'Pekelná brána' (1 km od hradu) si dej 'Pekelný oheň' – pálivé chili con carne s kukuřičným chlebem a zakysanou smetanou, podávané v hliněném hrnci. K pití doporučuji 'Démonův nápoj' – horkou čokoládu s chilli a skořicí, která zahřeje i nejchladnější noc. Na dezert je tu 'Propastní koláč' – oříškový dort s karamelem a šlehačkou.",
    hotel:
      "Chata 'U Brány' v lese poblíž hradu je ideální pro lovce záhad. Dřevěné pokoje jsou vybaveny starými mapami a knihami o nadpřirozenu. K dispozici je i vybavení pro 'lov duchů' – svítilny a deníky pro záznamy. V noci můžeš slyšet vytí větru nebo podivné šramoty z lesa. Snídaně zahrnuje domácí marmelády a pečivo.",
    car: "Parkoviště je 700 m od hradu, přístupné po štěrkové cestě.",
    train:
      "Nejbližší nádraží je v Mšeně (10 km). Z Mšena jede autobus do Hous, odkud je to 1 km pěšky po lesní pěšině.",
  },
  {
    name: "Loket",
    coords: [50.185, 12.751],
    icon: "../media/erby/loket.svg",
    url: "../media/hrady/loket.webp",
    scarytour:
      "Svatošské skály (5 km od hradu) jsou obestřeny pověstí o zkamenělých svatebčanech, kteří byli potrestáni za svou pýchu. Připoj se k 'Večerní procházce s legendami', kde tě průvodce provede mezi bizarními skalními útvary, jejichž tvary připomínají lidské postavy. V noci, když se zvedne vítr, skály vydávají podivné zvuky, jako by někdo šelestil sukní.",
    food: "V hospodě 'U Alchymisty' si vychutnáš 'Alchymistické pivo' – jantarový ležák s bylinnou příchutí, podávaný v cínových korbelech. K jídlu doporučuji 'Kámen mudrců' – pečené kuře s medovo-hořčičnou omáčkou, bramborovými noky a grilovanou zeleninou. Na dezert si dej 'Elixír věčnosti' – panna cottu s levandulí a lesním ovocem, která chutná jako kouzlo samo.",
    hotel:
      "Hotel 'Loketský duch' v historickém centru Lokte nabízí pokoje s kamennými zdmi, dřevěnými podlahami a výhledem na hrad nebo řeku Ohři. Každý pokoj má starožitný nábytek a svíčky, které vytváří tajuplnou atmosféru. Hosté mohou zažít vyprávění o místních strašidlech nebo si půjčit mapu na noční procházku městem. Někteří hlásí podivné zvuky z podlahy.",
    car: "Parkoviště je 500 m od hradu, přístupné po dlážděné ulici.",
    train:
      "Loket má vlastní nádraží. Z nádraží je to 1 km pěšky přes malebné město, podél řeky.",
  },
  {
    name: "Rožmberk",
    coords: [48.615, 14.372],
    icon: "../media/erby/rozmberk.svg",
    url: "../media/hrady/rozmberk.webp",
    scarytour:
      "U řeky Vltavy (3 km od hradu) zažiješ 'Noční plavbu s pověstmi'. Na dřevěné lodi tě průvodce provede příběhy o vodních duších, utopencích a ztracených pokladech Rožmberků. V mlze nad Vltavou se zdá, jako by se hladina pohybovala sama od sebe, a někteří tvrdí, že slyšeli ženský pláč z vody. Plavba končí u starého mlýna, jehož ruiny působí jako brána do jiného času.",
    food: "V hradní restauraci 'U Bílé paní' si dej 'Polévku Bílé paní' – krémovou česnekovou polévku s bylinkami, podávanou s křupavými krutony a kapkou smetany. Hlavním chodem je 'Rožmberský meč' – grilované vepřové s brusinkovou omáčkou a pečenými bramborami, podávané na dřevěném prkně. K pití zkus 'Perchtin nápoj' – horký bylinný čaj s medem a citronem, který zahřeje i v chladných hradních zdech.",
    hotel:
      "Přespěj přímo na hradě v 'Komnatách Bílé paní'. Tyto pokoje jsou zařízeny v renesančním stylu s baldachýnovými postelemi, gobelíny a svíčkami. Okna mají výhled na Vltavu, a v noci můžeš zahlédnout pohybující se stíny. Personál vypráví o hostech, kteří cítili chladné závaně nebo slyšeli kroky v chodbách. Snídaně zahrnuje domácí pečivo a místní sýry.",
    car: "Parkoviště je přímo u hradu.",
    train:
      "Nejbližší nádraží je v Českém Krumlově (20 km). Z Krumlova jede autobus do Rožmberka nad Vltavou, odkud je to 1 km pěšky podél řeky.",
  },
  {
    name: "Radyně",
    coords: [49.663, 13.432],
    icon: "../media/erby/radyne.svg",
    url: "../media/hrady/radyne.webp",
    scarytour:
      "Vrch Radyně (2 km od hradu) skrývá prastará pohřebiště z doby bronzové, o nichž se říká, že jsou prokletá. Připoj se k 'Lovu duchů' – večerní procházce s průvodcem, který ti ukáže kamenné mohyly a vypráví o rituálech, jež zde kdysi probíhaly. Místo je obklopeno hustým lesem, a v mlze působí, jako bys vstoupil do jiného světa. Někteří návštěvníci tvrdí, že cítili chladné doteky na zádech.",
    food: "V kavárně 'U Staré věže' na úpatí vrchu si dopřej 'Čarodějnický nápoj' – kávu s kardamomem, skořicí a špetkou chilli, podávanou v keramických hrncích. K tomu ochutnej 'Duchovní koláč' – tvarohový koláč s borůvkami a mákem, jehož recept prý pochází od místní věštkyně. Pro odvážné je tu 'Elixír noci' – bylinný likér s hořkou příchutí.",
    hotel:
      "Penzion 'Radyně Mystika' nabízí pokoje v gotickém stylu s vitrážovými okny a těžkými závěsy. Každý pokoj je pojmenován po místní pověsti, například 'Pokoj Černého rytíře'. Hosté mohou zažít noční vyprávění strašidelných příběhů nebo si půjčit staré knihy o místních záhadách. Penzion je obklopen zahradou s kamennými sochami, které v noci vrhají zvláštní stíny.",
    car: "Parkoviště je 2 km od hradu, přístupné po lesní cestě.",
    train:
      "Nejbližší nádraží je v Plzni (15 km). Z Plzně jede autobus do Starého Plzence, odkud je to 2 km pěšky po stezce přes pole a les.",
  },
  {
    name: "Vrškamýk",
    coords: [49.651, 14.093],
    icon: "../media/erby/vrskamyk.svg",
    url: "../media/hrady/vrskamyk.webp",
    scarytour:
      "Vrškamýcký les (1 km od hradu) nabízí 'Noční procházku záhad'. Průvodce tě provede stezkami, kde se prý objevují světélka a šeptající stíny. Hlavním cílem je 'Čarodějnický kruh' – mýtina s kameny, o níž se říká, že je místem starých rituálů. V noci mýtina působí, jako by byla oddělena od světa, a někteří návštěvníci cítí tíhu na hrudi.",
    food: "V piknikové oblasti u zříceniny si vychutnáš svačinu z místního stánku 'Lesní duch'. Doporučuji 'Rytířský bochník' – čerstvě upečený chléb s bylinkovým sýrem, sušeným masem a nakládanou zeleninou, podávaný na dřevěném talíři. K pití si dej 'Lesní mlhu' – bylinný čaj s medem a mátou, podávaný v termosce. Na dezert je tu 'Stínový koláček' – ovesný sušenka s brusinkami a oříšky.",
    hotel:
      "Kemp 'Pod hvězdami' v srdci Vrškamýckého lesa nabízí stany a dřevěné přístřešky obklopené stromy. Každý stan je vybaven lucernami a přikrývkami, a večer můžeš sedět u ohně a poslouchat příběhy o místních duších. Ticho lesa je občas přerušeno podivnými zvuky, které mohou být jen větrem… nebo něčím jiným. Snídaně zahrnuje ovesnou kaši s ovocem.",
    car: "Parkoviště je 500 m od hradu, přístupné po polní cestě.",
    train:
      "Nejbližší nádraží je v Jesenici (15 km). Z Jesenice jede autobus do obce Vrškamýk, odkud je to 1 km pěšky po lesní stezce.",
  },
  {
    name: "Kašperk",
    coords: [49.171, 13.563],
    icon: "../media/erby/kasperk.svg",
    url: "../media/hrady/kasperk.webp",
    scarytour:
      "V Národním parku Šumava (5 km od hradu) leží prastarý lesní komplex Povydří, kde podle legend žije keltská bytost Swiza, která mění lidi v kameny. Prozkoumej stezku Povydří s místním průvodcem, který tě provede temnými háji a ukáže ti 'Kamennou tvář' – skalní útvar, o němž se říká, že je zakletý šlechtic. Atmosféru umocňují zvuky přírody a občasné mlhy, které místu dodávají nadpřirozený nádech.",
    food: "V šumavské krčmě 'U Šplhavce' (2 km od hradu) si vychutnáš 'Šplhavcův guláš', pikantní pokrm z divočiny podávaný s domácím chlebem a bylinkovým máslem. K pití doporučuji 'Swizin elixír' – tmavé pivo s nádechem borovicové pryskyřice, které evokuje šumavské tajemství. Na dezert si dej 'Lesní stín' – čokoládový dort s malinami, inspirovaný temnotou lesů.",
    hotel:
      "Přespěj v hostinci 'Pod Kašperkem', historické budově s kamennými zdmi a dřevěnými trámy, kde prý občas straší duch hradního strážce. Pokoje jsou zařízeny v rustikálním stylu, a v noci můžeš slyšet podivné zvuky z podkroví, což jen umocní mystickou atmosféru. Hostinec nabízí i vyprávění šumavských pověstí u krbu.",
    car: "Parkoviště je 1 km od hradu, přístupné po zpevněné cestě.",
    train:
      "Nejbližší nádraží je v Sušici (20 km). Odtud jede autobus do Kašperských Hor, odkud je to 3 km pěšky po značené stezce lesem.",
  },
];

// Initialize map and markers after DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  let map;

  // Initialize map for non-mobile devices

  map = await initMap("tourmap", false, castles); // Initialize Leaflet map

  // Create markers for each castle
  castles.forEach(async function (castle) {
    let marker;
    let markerElement;

    // Create marker with icon and coordinates
    marker = await createMarker(map, castle.icon, castle.coords, {
      className: `pin-${castle.divId}`,
    });

    // Bind tooltip with castle name
    marker.bindTooltip(castle.name, {
      permanent: true,
      direction: "bottom",
      offset: [0, 0],
      className: `castle-${castle.divId}-toolip`,
    });

    markerElement = marker.getElement();
    // Animate marker with custom press callback
    AnimateMarker(markerElement, null, null, null, () => {
      // Update DOM with castle details
      document.getElementById("contact").classList.remove("hidefooter");
      document.getElementById("click-info-text").classList.add("hidden");
      document.getElementById("castle-info").classList.remove("hidden");
      document.getElementById(
        "castle-img"
      ).style.background = `url("${castle.url}") center/cover`;
      document.getElementById("castle-name").innerHTML = castle.name;
      document.getElementById("scarytour").innerHTML = castle.scarytour;
      document.getElementById("food").innerHTML = castle.food;
      document.getElementById("hotel").innerHTML = castle.hotel;
      document.getElementById("car").innerHTML = castle.car;
      document.getElementById("train").innerHTML = castle.train;

      // Scroll to #scrollhere after DOM update
      requestAnimationFrame(() => {
        const scrollTarget = document.querySelector("#scrollhere");
        if (scrollTarget) {
          scrollTarget.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to target
        }
      });
    });
  });
});
