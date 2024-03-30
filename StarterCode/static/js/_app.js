// The URL with data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the JSON data and initialize dropdown and first set of plots
function init() {
    d3.json(url).then((data) => {
        const dropdownMenu = d3.select("#selDataset");
        data.names.forEach((name) => dropdownMenu.append("option").text(name).property("value", name));
        
        // Initialize plots with the first name
        updateAll(data, data.names[0]);
    });
}

// Update demographic info, bar chart, bubble chart, and gauge chart
function updateAll(data, selectedValue) {
    updateDemo(data.metadata.filter(meta => meta.id == selectedValue)[0]);
    updateCharts('bar', data.samples.filter(sample => sample.id === selectedValue)[0]);
    updateCharts('bubble', data.samples.filter(sample => sample.id === selectedValue)[0], true);
    updateGauge(data.metadata.filter(meta => meta.id == selectedValue)[0].wfreq);
    updateGauge(data.metadata.filter(meta => meta.id == selectedValue)[1].wfreq);
    

}

function updateDemo(metadata) {
    const demographicInfo = d3.select("#sample-metadata").html("");
    Object.entries(metadata).forEach(([key, value]) => demographicInfo.append("h5").text(`${key}: ${value}`));
}

function updateCharts(chartId, sampleData, isBubble = false) {
    const yVals = sampleData.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
    const trace = {
        x: isBubble ? sampleData.otu_ids : sampleData.sample_values.slice(0, 10).reverse(),
        y: isBubble ? sampleData.sample_values : yVals,
        text: isBubble ? sampleData.otu_labels : sampleData.otu_labels.slice(0, 10).reverse(),
        mode: isBubble ? 'markers' : '',
        marker: isBubble ? {size: sampleData.sample_values, color: sampleData.otu_ids, colorscale: "Portland"} : {color: "rgb(240,128,128)"},
        type: isBubble ? 'scatter' : 'bar',
        orientation: isBubble ? '' : 'h'
    };
    const layout = isBubble ? {xaxis: {title: "OTU ID"}} : {};
    Plotly.newPlot(chartId, [trace], layout);
}

function updateGauge(wfreq) {
    const data = [{
        domain: {x: [0, 1], y: [0, 1]},
        value: wfreq,
        title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: {range: [null, 9]},
            steps: [
                // Define your gauge chart color steps here
            ],
            threshold: {
                line: {color: "red", width: 4},
                thickness: 0.75,
                value: wfreq
            }
        }
    }];
    Plotly.newPlot('gauge', data);
}

// Handle change in dropdown selection
function optionChanged(newSample) {
    d3.json(url).then((data) => updateAll(data, newSample));
}

init();