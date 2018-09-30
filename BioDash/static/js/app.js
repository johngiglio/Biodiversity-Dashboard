function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel





  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(`/metadata/${sample}`).then((metadata)=>{
      console.log(metadata)
    
    // Use `.html("") to clear any existing metadata
    d3.select('#sample-metadata').html("")
    var panel = d3.select('#sample-metadata');
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(metadata).forEach(function([key, value]) {
      panel.append("p").text(`${key}: ${value}`)
    })
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
})}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then((sampledata)=>{

    // @TODO: Build a Bubble Chart using the sample data
    var bubData = [{
      x:sampledata.otu_ids,
      y:sampledata.sample_values,
      text:sampledata.otu_labels,
      mode:'markers',
      marker:{size:sampledata.sample_values,
              color:sampledata.otu_ids}
    }];
    var bubLayout = {
      height: 600,
      width: 1500
    };
    Plotly.newPlot('bubble', bubData, bubLayout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [{
      values:sampledata.sample_values.slice(0,10),
      labels:sampledata.otu_ids.slice(0,10),
      type:'pie',
      hoverinfo:sampledata.otu_labels.slice(0,10)
    }];
  var pieLayout = {
    height: 400,
    width: 500
  };
  Plotly.newPlot('pie', pieData, pieLayout)
})

    
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
