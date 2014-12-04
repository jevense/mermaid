/**
 * Created by knut on 14-11-23.
 */

var sq = require('./parser/sequenceDiagram').parser;
sq.yy = require('./sequenceDb');

/**
 * Draws a flowchart in the tag with id: id based on the graph definition in text.
 * @param text
 * @param id
 */
module.exports.draw = function (text, id) {
    sq.yy.clear();
    sq.parse(text);

    var actors = sq.yy.getActors();
    var actorKeys = sq.yy.getActorKeys();

    var i;
    //console.log('Len = ' + )
    for(i=0;i<actorKeys.length;i++){
        var key = actorKeys[i];

        //console.log('Doing key: '+key)

        var startMargin = 50;
        var margin = 50;
        var width = 150;
        var height = 65;
        var yStartMargin = 10;

        console.log('x=: '+(startMargin  + i*margin +i*150))

        var cont = d3.select('#'+id);
        var g = cont.append("g");
        actors[actorKeys[i]].x = startMargin  + i*margin +i*150;
        actors[actorKeys[i]].y = yStartMargin;
        actors[actorKeys[i]].width = yStartMargin;
        actors[actorKeys[i]].height = yStartMargin;

        var center = actors[actorKeys[i]].x +(width/2);

        g.append("line")
            .attr("x1", center)
            .attr("y1", yStartMargin)
            .attr("x2", center)
            .attr("y2", 2000)
            .attr("stroke-width", '0.5px')
            .attr("stroke", '#999')

        g.append("rect")
            .attr("x", startMargin  + i*margin +i*150)
            .attr("y", yStartMargin)
            .attr("fill", '#eaeaea')
            .attr("stroke", '#666')
            .attr("width", width)
            .attr("height", height)
            .attr("rx", 3)
            .attr("ry", 3)
        g.append("text")      // text label for the x axis
            .attr("x", startMargin  + i*margin +i*width + 75)
            .attr("y", yStartMargin+37.5)
            .style("text-anchor", "middle")
            .text(actors[actorKeys[i]].description)
            ;


    }


    var messages = sq.yy.getMessages();

    // Setup arrow head
    // define marker
    cont.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("refX", 5) /*must be smarter way to calculate shift*/
        .attr("refY", 2)
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0,0 V 4 L6,2 Z"); //this is actual shape for arrowhead




    var verticalPos = startMargin + 30;
    messages.forEach(function(msg){

        console.log('start',msg.from);
        console.log('actor',actors[msg.from]);

        verticalPos = verticalPos + 40;
        var startx = actors[msg.from].x + width/2;
        var stopx = actors[msg.to].x + width/2;
        var txtCenter = startx + (stopx-startx)/2;
        console.log('txtCenter',txtCenter);
        console.log(txtCenter);
        console.log(msg.message);

        //Make an SVG Container
        //Draw the line
        if(msg.type===1){
            var circle = g.append("line")
                .attr("x1", startx)
                .attr("y1", verticalPos)
                .attr("x2", stopx)
                .attr("y2", verticalPos)
                .attr("stroke-width", 2)
                .attr("stroke", "black")
                .style("stroke-dasharray", ("3, 3"))
                .attr("class", "link")
                .attr("marker-end", "url(#arrowhead)")
            //.attr("d", diagonal);
        }
        else{
            var circle = g.append("line")
                .attr("x1", startx)
                .attr("y1", verticalPos)
                .attr("x2", stopx)
                .attr("y2", verticalPos)
                .attr("stroke-width", 2)
                .attr("stroke", "black")
                .attr("class", "link")
                .attr("marker-end", "url(#arrowhead)")
            //.attr("d", diagonal);
        }

        g.append("text")      // text label for the x axis
            .attr("x", txtCenter)
            .attr("y", verticalPos-10)
            .style("text-anchor", "middle")
            .text(msg.message);
    });



    cont.attr("height", verticalPos + 40);

};
