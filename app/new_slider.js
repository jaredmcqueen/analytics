function Slider() {

    var frameNumber = 0;

    var stepSize = 250;

    var sliderObject;
    var tMin = null;
    var tMax = null;

    var playing = false;
    var repeat = false;

    var step = 0.1;

    var currentMin = 0;
    var currentMin = 0;


    function togglePlay() {

        if (playing) {

            $('#play').text('play')

        } else {

            $('#play').text('pause')

        }

        playing = !playing;
        console.log('play is now', playing);

    }

    function toggleRepeat() {

        if (repeat) {

            $('#repeat').text('repeat off')

        } else {

            $('#repeat').text('repeat on')

        }

        repeat = !repeat;
        console.log('repeat is now', repeat);

    }


    this.init = function () {

        $("#range").ionRangeSlider({

            type: 'double',
            hide_min_max: true,
            hide_from_to: true,
            grid: false,
            drag_interval: true

        });

        // init event handlers for buttons

        sliderObject = $("#range").data("ionRangeSlider");

        $('#repeat').on('click', toggleRepeat);
        $('#play').on('click', togglePlay);


        //$('#expand').on('click', function () {
        //
        //    //if (keepGoing) stopLoop();
        //    //
        //    //sliderObject.update({
        //    //    from: sliderObject.options.min,
        //    //    to: sliderObject.options.max
        //    //});
        //
        //});


    };


    this.setLimits = function (min, max) {

        tMin = min;
        tMax = max;

        var diff = tMax - tMin;
        currentMin = tMin;
        currentMax = diff / 25;
        step = diff / stepSize;

        sliderObject.update({
            hide_min_max: false,
            hide_from_to: false,
            min: tMin,
            max: tMax,
            from: currentMin,
            to: currentMax,
            //prettify: function (num) {
            //    return moment(num, "X").format("MMM Do, hh:mm A");
            //},
            onChange: function (data) {
                //updateShaderAttributes(data.from, data.to);
                currentMin = data.from;
                currentMax = data.to;
            },
            onUpdate: function (data) {

                //updateShaderAttributes(data.from, data.to);
            }

        });

        $('#buttons').slideDown();


    };


    this.update = function () {


        if (tMin != null && tMax != null) {

            if (playing) {

                //console.log('frame:', frameNumber);
                //frameNumber++;

                // test to see if we're at the end


                if (currentMax >= tMax) {

                    currentMax = tMax;


                    if (repeat) {

                        var diff = tMax - tMin;
                        currentMin = tMin;
                        currentMax = diff / 25;

                    }

                    sliderObject.update({
                        from: currentMin,
                        to: currentMax
                    });

                    togglePlay();

                } else {

                    currentMin += step;
                    currentMax += step;

                    sliderObject.update({
                        from: currentMin,
                        to: currentMax
                    });

                }


            }


        }


    };


}
