function Interface(simulator) {

    function enableForceDirected() {

        console.log('force-directed');
        simulator.velocityUniforms.layoutPositions.value = generateZeroedPositionTexture(nodesAndEdges, nodesWidth);
        temperature = 100;

    }

    function enableCircular() {

        console.log('circular');
        simulator.velocityUniforms.layoutPositions.value = generateCircularLayout(nodesAndEdges, nodesWidth);
        temperature = 1000;

    }


    this.init = function () {

        var container = document.createElement('div');
        container.id = 'layouts';

        var button1 = document.createElement('button');
        button1.id = 'forceDirected';
        $(button1).addClass("btn btn-primary");
        $(button1).append("<span class='glyphicon glyphicon-heart-empty' aria-hidden='true'></span>");


        var button2 = document.createElement('button');
        button2.id = 'circular';
        $(button2).addClass("btn btn-primary");
        $(button2).append("<span class='glyphicon glyphicon-asterisk' aria-hidden='true'></span>");


        container.appendChild(button1);
        container.appendChild(document.createElement('br'));
        container.appendChild(button2);
        document.body.appendChild(container);


        $('#forceDirected').on('click', enableForceDirected);
        $('#circular').on('click', enableCircular);
    };


}