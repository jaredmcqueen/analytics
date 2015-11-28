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

    function enableSpherical() {

        console.log('spherical');
        simulator.velocityUniforms.layoutPositions.value = generateSphericalLayout(nodesAndEdges, nodesWidth);
        temperature = 1000;

    }


    function enableHelix() {

        console.log('helix');
        simulator.velocityUniforms.layoutPositions.value = generateHelixLayout(nodesAndEdges, nodesWidth);
        temperature = 1000;

    }

    function enableGrid() {

        console.log('grid');
        simulator.velocityUniforms.layoutPositions.value = generateGridLayout(nodesAndEdges, nodesWidth);
        temperature = 1000;

    }


    this.init = function () {

        var container = document.createElement('div');
        container.id = 'layouts';

        var forceDirected = document.createElement('button');
        forceDirected.id = 'forceDirected';
        $(forceDirected).addClass("btn btn-primary");
        $(forceDirected).append("<span class='glyphicon glyphicon-heart-empty' aria-hidden='true'></span>");


        var circular = document.createElement('button');
        circular.id = 'circular';
        $(circular).addClass("btn btn-primary");
        $(circular).append("<span class='glyphicon glyphicon-asterisk' aria-hidden='true'></span>");

        var spherical = document.createElement('button');
        spherical.id = 'spherical';
        $(spherical).addClass("btn btn-primary");
        $(spherical).append("<span class='glyphicon glyphicon-ok-circle' aria-hidden='true'></span>");

        var helix = document.createElement('helix');
        helix.id = 'helix';
        $(helix).addClass("btn btn-primary");
        $(helix).append("<span class='glyphicon glyphicon-leaf' aria-hidden='true'></span>");

        var grid = document.createElement('grid');
        grid.id = 'grid';
        $(grid).addClass("btn btn-primary");
        $(grid).append("<span class='glyphicon glyphicon-sunglasses' aria-hidden='true'></span>");


        container.appendChild(forceDirected);
        container.appendChild(document.createElement('br'));
        container.appendChild(circular);
        container.appendChild(document.createElement('br'));
        container.appendChild(spherical);
        container.appendChild(document.createElement('br'));
        container.appendChild(helix);
        container.appendChild(document.createElement('br'));
        container.appendChild(grid);
        document.body.appendChild(container);


        $('#forceDirected').on('click', enableForceDirected);
        $('#circular').on('click', enableCircular);
        $('#spherical').on('click', enableSpherical);
        $('#helix').on('click', enableHelix);
        $('#grid').on('click', enableGrid);
    };


}