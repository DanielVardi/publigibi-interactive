const portosChina = [
    // Europa
    { nome:"Pireu, Grécia",              lat:37.94, lon:23.62,  empresa:"COSCO (67% Piraeus Port Authority)",    tipo:"controle"  },
    { nome:"Valencia, Espanha",           lat:39.44, lon:-0.32,  empresa:"COSCO / Noatum Terminals",             tipo:"controle"  },
    { nome:"Bilbao, Espanha",             lat:43.35, lon:-3.05,  empresa:"COSCO / Noatum Terminals",             tipo:"controle"  },
    { nome:"Hamburgo, Alemanha",          lat:53.55, lon:9.97,   empresa:"COSCO (24,9% HHLA Terminal Tollerort)",tipo:"parcial"   },
    { nome:"Rotterdam, Países Baixos",    lat:51.93, lon:4.45,   empresa:"COSCO (35% Euromax Terminal)",         tipo:"parcial"   },
    { nome:"Vado Ligure, Itália",         lat:44.27, lon:8.44,   empresa:"COSCO / APM joint venture",            tipo:"parcial"   },
    // África
    { nome:"Doraleh, Djibuti",            lat:11.60, lon:43.15,  empresa:"China Merchants Port (70%)",           tipo:"controle"  },
    { nome:"Mombaça, Quênia",             lat:-4.04, lon:39.67,  empresa:"ExIm Bank / concessão operacional",    tipo:"concessao" },
    { nome:"Dar es Salaam, Tanzânia",     lat:-6.82, lon:39.29,  empresa:"COSCO / TICTS",                        tipo:"parcial"   },
    { nome:"Maputo, Moçambique",          lat:-25.96,lon:32.57,  empresa:"China Merchants (Matola Terminal)",    tipo:"parcial"   },
    { nome:"Lekki (Lagos), Nigéria",      lat:6.45,  lon:3.78,   empresa:"China Harbour Engineering",            tipo:"controle"  },
    { nome:"Kribi, Camarões",             lat:2.95,  lon:9.91,   empresa:"China Harbour Engineering + concessão",tipo:"concessao" },
    { nome:"Lomé, Togo",                  lat:6.13,  lon:1.28,   empresa:"investimento e parceria operacional",  tipo:"parceria"  },
    { nome:"Conakry, Guiné",              lat:9.54,  lon:-13.68, empresa:"China Merchants Port",                 tipo:"parcial"   },
    { nome:"Dakar, Senegal",              lat:14.69, lon:-17.44, empresa:"China Merchants Port",                 tipo:"parcial"   },
    { nome:"Luanda, Angola",              lat:-8.84, lon:13.23,  empresa:"influência via dívida / empréstimos",  tipo:"concessao" },
    // Oriente Médio
    { nome:"Haifa Bay Port, Israel",      lat:32.82, lon:35.00,  empresa:"SIPG — Shanghai Int'l Port (25 anos)",tipo:"concessao" },
    { nome:"Porto Khalifa, EAU",          lat:24.80, lon:54.62,  empresa:"COSCO Shipping Ports",                 tipo:"parcial"   },
    { nome:"Duqm, Omã",                   lat:19.66, lon:57.71,  empresa:"CSCEC + zona industrial chinesa",      tipo:"parceria"  },
    { nome:"Salalah, Omã",                lat:17.02, lon:54.09,  empresa:"COSCO (participação em terminal)",     tipo:"parcial"   },
    // Ásia
    { nome:"Hambantota, Sri Lanka",       lat:6.12,  lon:81.12,  empresa:"China Merchants Port (70%, 99 anos)", tipo:"controle"  },
    { nome:"Gwadar, Paquistão",           lat:25.12, lon:62.33,  empresa:"China Overseas Port Holding (40 anos)",tipo:"controle"  },
    { nome:"Kyaukpyu, Mianmar",           lat:19.42, lon:93.55,  empresa:"CITIC Group",                         tipo:"parcial"   },
    { nome:"Chittagong, Bangladesh",      lat:22.33, lon:91.82,  empresa:"em negociação / interesse declarado",  tipo:"parceria"  },
    { nome:"Sihanoukville, Camboja",      lat:10.61, lon:103.53, empresa:"investimento direto chinês",           tipo:"parceria"  },
    { nome:"Kuantan, Malásia",            lat:3.80,  lon:103.33, empresa:"parque industrial CN-MY integrado",    tipo:"parceria"  },
    { nome:"Kuala Tanjung, Indonésia",    lat:3.35,  lon:99.45,  empresa:"China Merchants Port",                 tipo:"parcial"   },
    // Pacífico / Américas
    { nome:"Chancay, Peru",               lat:-11.56,lon:-77.27, empresa:"COSCO Shipping Ports (60%) — inaugurado 2024", tipo:"controle" },
    { nome:"Mariel, Cuba",                lat:22.99, lon:-82.75, empresa:"desenvolvimento conjunto",              tipo:"parceria"  },
    { nome:"Tulagi, Ilhas Salomão",       lat:-9.10, lon:160.15, empresa:"acordo de segurança 2022",              tipo:"parceria"  },
    { nome:"Balboa, Panamá (Canal Sul)",  lat:8.95,  lon:-79.57, empresa:"Hutchison Ports HK (concessão)", tipo:"concessao" },
    { nome:"Cristóbal, Panamá (Canal N.)",lat:9.35,  lon:-79.92, empresa:"Hutchison Ports HK (concessão)", tipo:"concessao" },
];

const coresTipo = {
    controle:  "#FF3333",
    parcial:   "#FF8800",
    concessao: "#FFD700",
    parceria:  "#33AAFF",
};

const rotulosTipo = {
    controle:  "Controle maioritário",
    parcial:   "Participação parcial",
    concessao: "Concessão / Arrendamento",
    parceria:  "Parceria / Interesse",
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

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(function(world) {
        // Base B&W
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

        // Dots de portos
        g.selectAll(".dot-porto")
            .data(portosChina)
            .join("circle")
            .attr("class", "dot-porto")
            .attr("cx", d => { const c = projection([d.lon, d.lat]); return c ? c[0] : -999; })
            .attr("cy", d => { const c = projection([d.lon, d.lat]); return c ? c[1] : -999; })
            .attr("r", 6)
            .attr("fill", d => coresTipo[d.tipo])
            .on("click", function(event, d) {
                event.stopPropagation();
                g.selectAll(".pais.selecionado").classed("selecionado", false);
                painelInfo.innerHTML =
                    "<strong>" + d.nome + "</strong>"
                    + " &nbsp;·&nbsp; " + rotulosTipo[d.tipo]
                    + "<br><small style='color:#888'>" + d.empresa + "</small>";
            });
    })
    .catch(() => { painelInfo.textContent = "Erro ao carregar o mapa."; });
