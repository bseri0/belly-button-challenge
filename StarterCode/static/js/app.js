var dataUrl = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

function initialize() {
    d3.json(dataUrl).then(function(dataResponse) {
        console.log("Look at this data:", dataResponse);

        var dropDown = d3.select("#selDataset");

        for(var i = 0; i < dataResponse.names.length; i++) {
            dropDown.append("option").text(dataResponse.names[i]).property("value", dataResponse.names[i]);
        }

        var firstItem = dataResponse.names[0];
        makeDemoInfo(firstItem);
        makeBarChart(firstItem);
        makeBubbleChart(firstItem);
        makeGaugeChart(firstItem);
    });
}

function makeDemoInfo(id) {
    d3.json(dataUrl).then(function(data) {
        var filteredMeta = data.metadata.filter(function(item) {
            return item.id == id;
        })[0];

        var infoPanel = d3.select("#sample-metadata");
        infoPanel.html("");

        for (var key in filteredMeta) {
            infoPanel.append("p").text(key + ": " + filteredMeta[key]);
        }
    });
}

function makeBarChart(id) {
    d3.json(dataUrl).then(function(data) {
        var samples = data.samples.filter(function(item) {
            return item.id === id;
        })[0];

        var trace = {
            x: samples.sample_values.slice(0, 10).reverse(),
            y: samples.otu_ids.slice(0, 10).map(function(otuID) { return "OTU " + otuID; }).reverse(),
            text: samples.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var layout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", [trace], layout);
    });
}

function makeBubbleChart(id) {
    d3.json(dataUrl).then(function(data) {
        var samples = data.samples.filter(function(item) {
            return item.id === id;
        })[0];

        var trace = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            }
        };

        var layout = {
            title: "Bacteria Cultures Per Sample",
            showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot("bubble", [trace], layout);
    });
}

function makeGaugeChart(id) {
    d3.json(dataUrl).then(function(data) {
        var meta = data.metadata.filter(function(item) {
            return item.id == id;
        })[0];

        var data = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: meta.wfreq,
            title: { text: "Washes Per Week" },
            type: "indicator",
            mode: "gauge+number"
        }];

        Plotly.newPlot("gauge", data);
    });
}

function optionChanged(newID) {
    makeDemoInfo(newID);
    makeBarChart(newID);
    makeBubbleChart(newID);
    makeGaugeChart(newID);
}

initialize();