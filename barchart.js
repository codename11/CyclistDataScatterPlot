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
            const m = { top: 80, right: 40, bottom: 40, left: 40 };

            //Getting data.
            console.log(dataset);
            const svg = d3.select("#demo")
                  .append("svg")
                  .attr("width", w + m.left + m.right*2)
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
                return d-1;//Compensating.
            });

            //Calculating last year in dataset.
            let maxYear = d3.max(years, (d) => {
                return d+1;//Compensating.
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
                .attr("transform", "translate("+m.left+", "+ h +")")
                .attr("class", "tick axis")
                .attr("id", "x-axis")
                .call(xAxis);

            //Appending y axis to chart.
            g.append("g")
                .attr("transform", "translate("+m.left+", 0)")
                .attr("class", "tick axis")
                .attr("id", "y-axis")
                .attr("fill", "red")
                .call(yAxis);

            //Creating tooltip element.
            const tooltip = d3.select('#demo')
                .append('div')
                .attr('id', 'tooltip')
                .style('opacity', 0);

            svg.selectAll("circle")
                .data(dataset)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("fill", (d, i) => {

                    return d.Doping === "" ? "orange" : "navy";

                })
                .attr("data-xvalue", (d,i) => {
                    //Setting data-xvalue attribute with value.
                    return d.Year;
                })
                .attr("data-yvalue", (d,i) => {
                    //Setting data-yvalue attribute with value.
                    let timeArr = d.Time.split(':');
                    let time1 = new Date(1970, 0, 1, 0, timeArr[0], timeArr[1]);
                    return time1;
                })
                .attr("cx", (d, i) => xScale(d.Year) + m.left*2)
                .attr("cy", (d, i) => {
                    let timeArr = d.Time.split(':');
                    let time1 = new Date(1970, 0, 1, 0, timeArr[0], timeArr[1]);
                    return yScale(time1) + m.top;

                })
                .attr("r", 5)
                //Setting tooltip made from absolutely positioned div.
                .on('mouseover', (d, i) => {

                    tooltip.style('opacity', 0.5);
                    tooltip.html("<div>"+d.Name+": "+d.Nationality+"</div><div style='margin-bottom: 5px;'>Year: "+d.Year+", Time: "+d.Time+"</div><div>"+d.Year+" "+d.Doping+"</div>");
                    tooltip.attr("data-year", d.Year);

                })
                .on('mouseout', (d) => {
                    tooltip.style('opacity', 0);
                });

                //Draw the Doping Label:
                svg.append("text")
                    .attr("id", "title")
                    .attr("class", "headline")
                    .attr("x", w / 2)
                    .attr("y", m.top/2)
                    .attr("font-family", "sans-serif")
                    .attr("fill", "green")
                    .attr("text-anchor", "middle")
                    .text("Doping in Professional Bicycle Racing"); 

                //Draw the Doping Sub-Label:
                svg.append("text")
                    .attr("id", "title")
                    .attr("class", "headline1")
                    .attr("x", w / 2)
                    .attr("y", m.top/1.3)
                    .attr("font-family", "sans-serif")
                    .attr("fill", "green")
                    .attr("text-anchor", "middle")
                    .text("35 Fastest times up Alpe d'Huez");

                //Draw the Minutes side Label:
                svg.append("text")
                    .attr("class", "headline1")
                    .attr("x", w / 3.6)
                    .attr("y", h / 2.8)
                    .attr("transform", "translate(-180,530) rotate(-90)")
                    .attr("font-family", "sans-serif")
                    .attr("fill", "green")
                    .attr("text-anchor", "middle")
                    .text("Time in Minutes");

                d3.select("#demo")
                    .append('table')
                    .attr('id', 'legend')
                    .attr("font-family", "sans-serif")
                    .html("<tr><td>No doping allegations</td><td class='dop'></td></tr> <tr><td>Riders with doping allegations</td><td class='nodop'></td></tr>");

                    let elem = document.getElementById("legend");
                    elem.style.position = "absolute";
                    elem.style.top = (h / 2) + "px";
                    elem.style.left = w - (m.left * 3) + "px";

                document.addEventListener("mouseover", (e) => {

                    if(e.target.className.baseVal === "dot"){
                        
                        let xVal = e.target.cx.baseVal.value;
                        let yVal = e.target.cy.baseVal.value;
                        tooltip.style("left", xVal + 40 + "px");
                        tooltip.style("top", yVal - 20 + "px");

                    }
                    
                });

        },
        error: (xhr, ajaxOptions, thrownError) => {

            console.log(xhr, ajaxOptions, thrownError);
            
        }

    });

});