var width    = 80,
    height   = 80,
    endAngle = 2 * Math.PI;

var svghtml = selectSvg("div.arc-svg-html", width, height);

var svgcss = selectSvg("div.arc-svg-css", width, height);

var svgjavascript = selectSvg("div.arc-svg-javascript", width, height);

var svgjQuery = selectSvg("div.arc-svg-jQuery", width, height);

var svgbootstrap = selectSvg("div.arc-svg-bootstrap", width, height);

var svgd3js = selectSvg("div.arc-svg-d3js", width, height);

var svggit = selectSvg("div.arc-svg-git", width, height);

function render(innerRadius) {
    var html = [
        {startAngle: 0, endAngle: 0.8 * endAngle}
    ];
    var css = [
        {startAngle: 0, endAngle: 0.8 * endAngle}
    ];
    var javascript = [
        {startAngle: 0, endAngle: 0.6 * endAngle}
    ];
    var jQuery = [
        {startAngle: 0, endAngle: 0.7 * endAngle}
    ];
    var bootstrap = [
        {startAngle: 0, endAngle: 0.7 * endAngle}
    ];
    var d3js = [
        {startAngle: 0, endAngle: 0.5 * endAngle}
    ];
    var git = [
        {startAngle: 0, endAngle: 0.5 * endAngle}
    ];
    var back = [
        {startAngle: 0, endAngle: endAngle}
    ];

    // html技能
    drawArc(svghtml, innerRadius, back, html, "#E8E8E8", "#3F4344", 'Html');

    // css技能
    drawArc(svgcss, innerRadius, back, css, "#E8E8E8", "#3F4344", 'CSS');

    //javascript技能
    drawArc(svgjavascript, innerRadius, back, javascript, "#E8E8E8", "#3F4344", 'JavaScript');

    //jQuery技能
    drawArc(svgjQuery, innerRadius, back, jQuery, "#E8E8E8", "#3F4344", 'jQuery');

    //bootstrap技能
    drawArc(svgbootstrap, innerRadius, back, bootstrap, "#E8E8E8", "#3F4344", 'Bootstrap');

    //bootstrap技能
    drawArc(svgd3js, innerRadius, back, d3js, "#E8E8E8", "#3F4344", 'D3.js');

    //git技能
    drawArc(svggit, innerRadius, back, git, "#E8E8E8", "#3F4344", 'git');
}
render(34);

function selectSvg(element, width, height){
    return d3.select(element).append("svg")
        .attr("class", "pie")
        .attr("height", height)
        .attr("width", width);
}

function drawArc(svg, innerRadius, back, data, colorBack, colorFront, text){
    var arc = d3.svg.arc().outerRadius(40).innerRadius(innerRadius);//此处有问题innerRadius
    svg.select("g").remove();
    svg.append('g')
    .attr("transform", "translate(40,40)")
    .selectAll("path.arc")
    .data(back)
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("fill", colorBack)
    .attr("d", function(d, i){
        return arc(d, i); // <-D
    });
    svg.append("g")
    .attr("transform", "translate(40,40)")
    .selectAll("path.arc")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("fill", colorFront)
    .transition().duration(1000)
    .attrTween("d", function (d) { //渐变函数
        var start = {startAngle: 0, endAngle: 0}; // <-A
        var interpolate = d3.interpolate(start, d); // <-B
            return function (t) {
                return arc(interpolate(t)); // <-C
            };
        });
    svg.select('g').append('text')
    .text(text)
    .attr('text-anchor','middle')
    .attr('dominant-baseline', 'middle');
}


var widthLine = 240,
    heightLine = 120,
    margin = 20,
    x = d3.scale.linear() // <-A
        .domain([0, 5])
        .range([margin, widthLine - margin]),
    y = d3.scale.linear() // <-B
        .domain([0, 4])
        .range([heightLine - margin, margin]);

var data = [ // <-C
    [
        {x: 1, y: 1},{x: 2, y: 1},{x: 3, y: 3},
        {x: 4, y: 1},{x: 5, y: 2},{x: 6, y: 2}
    ]
];

var line = d3.svg.line() // <-D
        .x(function(d){return x(d.x);})
        .y(function(d){return y(d.y);});

var svg = d3.select(".edu-left .chart").append("svg");

svg.attr("height", heightLine)
    .attr("width", widthLine);

 svg.selectAll("path")
        .data(data)
        .enter()
        .append("path") // <-E
        .attr("class", "line")
        .attr("d", function(d){return line(d);}) // <-F
        .attr('attribute', 'value');

renderAxes(svg);

function renderAxes(svg){ // <-G
    var xAxis = d3.svg.axis()
            .scale(x.range([0, quadrantWidth()]))
            .orient("bottom")
            .ticks(7);
    var yAxis = d3.svg.axis()
            .scale(y.range([quadrantHeight(), 0]))
            .orient("left")
            .ticks(4);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", function(){
            return "translate(" + xStart()
                + "," + yStart() + ")";
        })
        .call(xAxis)
        .append('text')
        .text('学期')
        .attr('dx', '150px')
        .attr('dy', '-0.5em');

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", function(){
            return "translate(" + xStart()
                + "," + yEnd() + ")";
        })
        .call(yAxis)
        .append('text')
        .text('专业排名')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .attr('dy', '1.5em');
}
    
function xStart(){
    return margin;
}        

function yStart(){
    return heightLine - margin;
}

function xEnd(){
    return widthLine - margin;
}

function yEnd(){
    return margin;
}

function quadrantWidth(){
    return widthLine - 2 * margin;
}

function quadrantHeight(){
    return heightLine - 2 * margin;
}