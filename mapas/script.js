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
        g.selectAll(".pais")
            .data(topojson.feature(world, world.objects.countries).features)
            .join("path")
            .attr("class", "pais")
            .attr("id", d => "pais-" + d.id)
            .attr("d", path)
            .on("click", function(event, d) {
                g.selectAll(".pais.selecionado").classed("selecionado", false);
                d3.select(this).classed("selecionado", true);
                const nome = nomesPaises[+d.id] || "País (" + d.id + ")";
                painelInfo.innerHTML = "Você selecionou: <strong>" + nome + "</strong>";
            });
    })
    .catch(() => { painelInfo.textContent = "Erro ao carregar o mapa."; });
