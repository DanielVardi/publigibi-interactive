const polos = [
    { nome:"Ashburn, Virginia (EUA)",           lat:39.0,  lon:-77.5,  cap:2000, tipo:"terra" },
    { nome:"Dallas, Texas (EUA)",               lat:32.8,  lon:-96.8,  cap:800,  tipo:"terra" },
    { nome:"Silicon Valley (EUA)",              lat:37.4,  lon:-122.0, cap:700,  tipo:"terra" },
    { nome:"Chicago (EUA)",                     lat:41.9,  lon:-87.6,  cap:500,  tipo:"terra" },
    { nome:"Seattle (EUA)",                     lat:47.6,  lon:-122.3, cap:400,  tipo:"terra" },
    { nome:"Toronto, Canadá",                   lat:43.7,  lon:-79.4,  cap:300,  tipo:"terra" },
    { nome:"Dublin, Irlanda",                   lat:53.3,  lon:-6.3,   cap:600,  tipo:"terra" },
    { nome:"Frankfurt, Alemanha",               lat:50.1,  lon:8.7,    cap:700,  tipo:"terra" },
    { nome:"Amsterdam, Países Baixos",          lat:52.4,  lon:4.9,    cap:500,  tipo:"terra" },
    { nome:"Londres, Reino Unido",              lat:51.5,  lon:-0.1,   cap:450,  tipo:"terra" },
    { nome:"Paris, França",                     lat:48.9,  lon:2.3,    cap:300,  tipo:"terra" },
    { nome:"Estocolmo, Suécia",                 lat:59.3,  lon:18.1,   cap:300,  tipo:"terra" },
    { nome:"Tóquio, Japão",                     lat:35.7,  lon:139.7,  cap:500,  tipo:"terra" },
    { nome:"Singapura",                         lat:1.4,   lon:103.8,  cap:400,  tipo:"terra" },
    { nome:"Mumbai, Índia",                     lat:19.1,  lon:72.9,   cap:300,  tipo:"terra" },
    { nome:"Pequim, China",                     lat:39.9,  lon:116.4,  cap:800,  tipo:"terra" },
    { nome:"Xangai, China",                     lat:31.2,  lon:121.5,  cap:700,  tipo:"terra" },
    { nome:"Guangzhou, China",                  lat:23.1,  lon:113.3,  cap:400,  tipo:"terra" },
    { nome:"Hong Kong",                         lat:22.3,  lon:114.2,  cap:350,  tipo:"terra" },
    { nome:"Sydney, Austrália",                 lat:-33.9, lon:151.2,  cap:250,  tipo:"terra" },
    { nome:"São Paulo, Brasil",                 lat:-23.6, lon:-46.7,  cap:200,  tipo:"terra" },
    { nome:"Joanesburgo, África do Sul",        lat:-26.2, lon:28.0,   cap:150,  tipo:"terra" },
    { nome:"Lingang — Submarino (China, 24MW)", lat:30.9,  lon:122.5,  cap:240,  tipo:"submarino" },
    { nome:"Lingshui — Submarino (China)",      lat:18.5,  lon:110.0,  cap:200,  tipo:"submarino" },
];

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

const rScale = d => Math.sqrt(d.cap / 10);

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
                painelInfo.innerHTML = "<strong>" + nome + "</strong>";
            });

        g.selectAll(".dot-terra")
            .data(polos.filter(p => p.tipo === "terra"))
            .join("circle")
            .attr("class", "dot-terra")
            .attr("cx", d => { const c = projection([d.lon, d.lat]); return c ? c[0] : -999; })
            .attr("cy", d => { const c = projection([d.lon, d.lat]); return c ? c[1] : -999; })
            .attr("r", d => rScale(d))
            .on("click", function(event, d) {
                event.stopPropagation();
                g.selectAll(".pais.selecionado").classed("selecionado", false);
                painelInfo.innerHTML = "<strong>" + d.nome + "</strong> — ~" + d.cap + " MW";
            });

        g.selectAll(".dot-sub")
            .data(polos.filter(p => p.tipo === "submarino"))
            .join("circle")
            .attr("class", "dot-sub")
            .attr("cx", d => { const c = projection([d.lon, d.lat]); return c ? c[0] : -999; })
            .attr("cy", d => { const c = projection([d.lon, d.lat]); return c ? c[1] : -999; })
            .attr("r", d => rScale(d))
            .on("click", function(event, d) {
                event.stopPropagation();
                g.selectAll(".pais.selecionado").classed("selecionado", false);
                painelInfo.innerHTML = "<strong>" + d.nome + "</strong> — ~" + d.cap + " MW";
            });
    })
    .catch(() => { painelInfo.textContent = "Erro ao carregar o mapa."; });
