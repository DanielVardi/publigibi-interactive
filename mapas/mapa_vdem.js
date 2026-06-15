const vdem = {
    // Democracias Liberais (4)
    752:4,578:4,208:4,246:4,352:4,528:4,56:4,276:4,
    40:4,756:4,442:4,372:4,826:4,250:4,724:4,620:4,
    380:4,300:4,470:4,233:4,428:4,440:4,203:4,703:4,
    705:4,191:4,124:4,36:4,554:4,392:4,410:4,376:4,
    188:4,858:4,152:4,
    // Democracias Eleitorais (3)
    840:3,76:3,484:3,32:3,170:3,604:3,591:3,214:3,
    710:3,288:3,686:3,72:3,516:3,894:3,360:3,496:3,
    642:3,100:3,616:3,8:3,498:3,51:3,268:3,804:3,
    598:3,218:3,600:3,68:3,388:3,780:3,740:3,454:3,
    694:3,270:3,728:3,
    // Autocracias Eleitorais (2)
    356:2,792:2,348:2,50:2,586:2,818:2,12:2,231:2,
    834:2,800:2,646:2,716:2,398:2,417:2,862:2,222:2,
    116:2,24:2,508:2,729:2,504:2,400:2,788:2,31:2,
    608:2,764:2,566:2,414:2,478:2,466:2,706:2,332:2,
    562:2,324:2,
    // Autocracias Fechadas (1)
    156:1,643:1,408:1,104:1,704:1,682:1,364:1,760:1,
    232:1,112:1,192:1,784:1,418:1,4:1,558:1,795:1,
    887:1,434:1,
};

const cores   = { 4:"#27ae60", 3:"#2980b9", 2:"#e67e22", 1:"#c0392b" };
const rotulos = { 4:"Democracia Liberal", 3:"Democracia Eleitoral",
                  2:"Autocracia Eleitoral", 1:"Autocracia Fechada" };

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
            .attr("fill", d => cores[vdem[+d.id]] || "#1a1a1a")
            .attr("d", path)
            .on("click", function(event, d) {
                g.selectAll(".pais-cor.selecionado").classed("selecionado", false);
                d3.select(this).classed("selecionado", true);
                const nome = nomesPaises[+d.id] || "País (" + d.id + ")";
                const cat = vdem[+d.id];
                if (cat) {
                    painelInfo.innerHTML = "<strong>" + nome + "</strong> — "
                        + rotulos[cat]
                        + " <small style='color:#555'>(V-Dem 2025)</small>";
                } else {
                    painelInfo.innerHTML = "<strong>" + nome + "</strong> — sem classificação V-Dem disponível";
                }
            });
    })
    .catch(() => { painelInfo.textContent = "Erro ao carregar o mapa."; });
