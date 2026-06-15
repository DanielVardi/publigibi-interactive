const reservas = {
    156: 44000, 76: 21000, 643: 21000, 356: 6900,
     36:  4200, 704:  3300, 840:  2300, 304: 1500,
    266:  1000, 834:   890, 124:   830, 710:  790,
    764:   290, 404:   100, 516:    49, 800:   47,
    508:    18,
};

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

const vals = Object.values(reservas);
const colorScale = d3.scaleLog()
    .domain([d3.min(vals), d3.max(vals)])
    .range(["#0a2a50", "#00bfff"])
    .clamp(true);

// Legenda
const legendaEl = document.getElementById("legenda");
[18, 100, 1000, 5000, 21000, 44000].forEach(v => {
    const item = document.createElement("div");
    item.className = "legenda-item";
    const box = document.createElement("div");
    box.className = "legenda-cor";
    box.style.background = colorScale(v);
    const label = document.createElement("span");
    label.textContent = v >= 1000 ? (v / 1000).toFixed(0) + "M t" : v + " mil t";
    item.appendChild(box);
    item.appendChild(label);
    legendaEl.appendChild(item);
});
const semDados = document.createElement("div");
semDados.className = "legenda-item";
semDados.innerHTML = '<div class="legenda-cor" style="background:#111;border:1px solid #333"></div><span>Sem dados</span>';
legendaEl.appendChild(semDados);

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(function(world) {
        g.selectAll(".pais-cor")
            .data(topojson.feature(world, world.objects.countries).features)
            .join("path")
            .attr("class", "pais-cor")
            .attr("id", d => "pais-" + d.id)
            .attr("fill", d => {
                const v = reservas[+d.id];
                return v ? colorScale(v) : "#111";
            })
            .attr("d", path)
            .on("click", function(event, d) {
                g.selectAll(".pais-cor.selecionado").classed("selecionado", false);
                d3.select(this).classed("selecionado", true);
                const nome = nomesPaises[+d.id] || "País (" + d.id + ")";
                const v = reservas[+d.id];
                if (v) {
                    const fmt = v >= 1000
                        ? (v / 1000).toFixed(0) + " milhões de toneladas"
                        : v + " mil toneladas";
                    painelInfo.innerHTML = "<strong>" + nome + "</strong> — " + fmt + " de terras raras";
                } else {
                    painelInfo.innerHTML = "<strong>" + nome + "</strong> — sem dados de reservas documentadas";
                }
            });
    })
    .catch(() => { painelInfo.textContent = "Erro ao carregar o mapa."; });
