// Operações de mineração de empresas canadenses no exterior
// nivel: 3=grande presença, 2=média, 1=menor
const minCanada = {
    // África
    894:{ nivel:3, empresas:"First Quantum (Kansanshi, Sentinel)", mineral:"Cobre" },
    180:{ nivel:3, empresas:"Ivanhoe (Kamoa-Kakula), Lundin (Tenke Fungurume)", mineral:"Cobre" },
    834:{ nivel:2, empresas:"Barrick (Bulyanhulu, North Mara)", mineral:"Ouro" },
    466:{ nivel:2, empresas:"Barrick (Loulo-Gounkoto), B2Gold (Fekola)", mineral:"Ouro" },
    854:{ nivel:3, empresas:"Endeavour (Houndé, Mana), Iamgold (Essakane)", mineral:"Ouro" },
    686:{ nivel:2, empresas:"Endeavour (Sabodala-Massawa), Iamgold (Boto)", mineral:"Ouro" },
    478:{ nivel:2, empresas:"Kinross (Tasiast), First Quantum (Guelb Moghrein)", mineral:"Ouro / Cobre" },
    288:{ nivel:2, empresas:"Kinross (Chirano), Galiano Gold", mineral:"Ouro" },
    384:{ nivel:2, empresas:"Endeavour Mining (Ity, Agbaou)", mineral:"Ouro" },
    516:{ nivel:2, empresas:"B2Gold (Otjikoto)", mineral:"Ouro" },
    710:{ nivel:2, empresas:"Ivanhoe Mines (Platreef)", mineral:"Platina / Paládio" },
    324:{ nivel:1, empresas:"SRG Mining, B2Gold (exploração)", mineral:"Grafite / Ouro" },
    566:{ nivel:1, empresas:"diversas junior miners", mineral:"Ouro" },
    // América Latina
    152:{ nivel:3, empresas:"Teck (QB2, Carmen de Andacollo), Lundin (Caserones)", mineral:"Cobre" },
    604:{ nivel:3, empresas:"Teck (Antamina), Hudbay (Constancia), Pan American Silver", mineral:"Cobre / Prata" },
    484:{ nivel:3, empresas:"Pan American Silver, MAG Silver, Alamos Gold, Torex Gold", mineral:"Prata / Ouro" },
    32: { nivel:2, empresas:"Barrick (Veladero), Lithium Americas (Cauchari), Lundin", mineral:"Ouro / Lítio" },
    76: { nivel:3, empresas:"Kinross (Paracatu), Lundin (Chapada), Equinox Gold", mineral:"Ouro" },
    214:{ nivel:2, empresas:"Barrick (Pueblo Viejo)", mineral:"Ouro" },
    591:{ nivel:2, empresas:"First Quantum (Cobre Panamá — suspenso 2023)", mineral:"Cobre" },
    218:{ nivel:2, empresas:"Lundin Gold (Fruta del Norte)", mineral:"Ouro" },
    740:{ nivel:1, empresas:"Iamgold (Rosebel, Saramacca)", mineral:"Ouro" },
    320:{ nivel:1, empresas:"Hudbay (Fenix), Pan American Silver", mineral:"Níquel / Prata" },
    68: { nivel:1, empresas:"Pan American Silver (San Vicente)", mineral:"Prata" },
    // Europa
    620:{ nivel:2, empresas:"Lundin Mining (Neves-Corvo)", mineral:"Cobre / Estanho" },
    752:{ nivel:1, empresas:"Agnico Eagle, Lundin (Zinkgruvan)", mineral:"Ouro / Zinco" },
    246:{ nivel:2, empresas:"Agnico Eagle (Kittilä)", mineral:"Ouro" },
    300:{ nivel:2, empresas:"Eldorado Gold (Kassandra, Olympias, Skouries)", mineral:"Ouro" },
    792:{ nivel:2, empresas:"Eldorado Gold (Efemçukuru), Alamos Gold", mineral:"Ouro" },
    642:{ nivel:1, empresas:"Gabriel Resources (Rosia Montana)", mineral:"Ouro" },
    // Ásia / Pacífico
    496:{ nivel:2, empresas:"Ivanhoe / Turquoise Hill (Oyu Tolgoi)", mineral:"Cobre / Ouro" },
    417:{ nivel:1, empresas:"Centerra Gold (Kumtor — nacionalizado 2021)", mineral:"Ouro" },
    586:{ nivel:2, empresas:"Barrick (Reko Diq — em desenvolvimento)", mineral:"Cobre / Ouro" },
    608:{ nivel:1, empresas:"B2Gold (Masbate)", mineral:"Ouro" },
    598:{ nivel:1, empresas:"Barrick (Porgera)", mineral:"Ouro" },
    36: { nivel:1, empresas:"diversas junior miners", mineral:"Ouro / Lítio" },
};

const cores = { 3:"#FFB700", 2:"#B87800", 1:"#7A5000" };

const width = 1008, height = 651;
const svg = d3.select("#mapa-svg");
const painelInfo = document.getElementById("info-painel");

const projection = d3.geoNaturalEarth1()
    .scale(155)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);
const g = svg.append("g");

const zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", e => g.attr("transform", e.transform));

svg.call(zoom);

window.zoomIn    = () => svg.transition().duration(300).call(zoom.scaleBy, 1.6);
window.zoomOut   = () => svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.6);
window.resetZoom = () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(function(world) {
        g.selectAll(".pais-cor")
            .data(topojson.feature(world, world.objects.countries).features)
            .join("path")
            .attr("class", "pais-cor")
            .attr("id", d => "pais-" + d.id)
            .attr("fill", d => {
                const dados = minCanada[+d.id];
                return dados ? cores[dados.nivel] : "#1a1a1a";
            })
            .attr("d", path)
            .on("click", function(event, d) {
                g.selectAll(".pais-cor.selecionado").classed("selecionado", false);
                d3.select(this).classed("selecionado", true);
                const nome = nomesPaises[+d.id] || "País (" + d.id + ")";
                const dados = minCanada[+d.id];
                if (dados) {
                    painelInfo.innerHTML =
                        "<strong>" + nome + "</strong> — "
                        + dados.mineral
                        + " &nbsp;|&nbsp; "
                        + dados.empresas;
                } else {
                    painelInfo.innerHTML = "<strong>" + nome + "</strong> — sem operações de mineração canadense documentadas";
                }
            });
    })
    .catch(() => { painelInfo.textContent = "Erro ao carregar o mapa."; });
