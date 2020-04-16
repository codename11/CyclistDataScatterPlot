$(document).ready(() => {

    let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
    $.ajax({
        url: url, 
        success: (response) => {

            let dataset = JSON.parse(response);

            // Dimensions of chart.
            const w = 800;
            const h = 600;
            
            //Margin to be set between chart and outher container.
            const m = { top: 40, right: 40, bottom: 40, left: 40 };

            //Getting data.
            console.log(dataset);
            const svg = d3.select("#demo")
                  .append("svg")
                  .attr("width", w + m.left + m.right)
                  .attr("height", h + m.top + m.bottom);

            //Translating axises to accomodate for margin.If we don't, ticks and numbers would look cut of.
            const g = svg.append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

            //How many dots are. Number of element in array are the number of dots.
            let dotsQuantity = dataset.length;

            //Calculating dots width. Width of chart divided by how many dots are. Result is width for individual bar.
            //let dotRadius = w / barsQuantity;

            //Getting year parts from dataset.
            let years = dataset.map(item => {
                return item.Year;
            });

            //Calculating first year in dataset.
            let minYear = d3.min(years, (d) => {
                return d-1;
            });

            //Calculating last year in dataset.
            let maxYear = d3.max(years, (d) => {
                return d+1;
            });
            
            //Setting x axis.
            let xScale = d3.scaleLinear()
                    .range([0, w])//Actual x axis length.
                    .domain([minYear, maxYear]);//Setting values from zero to max year on x axis.

            //Drawing y axis.
            const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

            //Get all h:m:s and convert them into dateTime.
            let times = dataset.map(item => {
                var time = item.Time.split(':');
                return new Date(1970, 0, 1, 0, time[0], time[1]);
            });
            
            let yScale = d3.scaleTime()
            .range([0, h])//Actual y axis length.
            .domain(d3.extent(times));//Setting values from zero to max value on y axis.

            //Drawing y axis.
            let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
            
            //Appending x axis to chart.
            g.append("g")
                .attr("transform", "translate(0, "+ h +")")
                .attr("class", "tick axis")
                .attr("id", "x-axis")
                .call(xAxis);

            //Appending y axis to chart.
            g.append("g")
                .attr("transform", "translate(0, 0)")
                .attr("class", "tick axis")
                .attr("id", "y-axis")
                .attr("fill", "red")
                .call(yAxis);

        },
        error: (xhr, ajaxOptions, thrownError) => {

            console.log(xhr, ajaxOptions, thrownError);
            
        }

    });

});