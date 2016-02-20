function Slider() {

    var frameNumber = 0;

    var stepSize = 300;

    var sliderObject;
    var tMin = null;
    var tMax = null;

    var playing = false;
    var repeat = false;
    var expand = false;

    var step = 0.01;

    var currentMin = 0;
    var currentMin = 0;

    var oldDuration = {};

    this.increaseStep = function(){

        step *= 1.25;

    };

    this.decreaseStep = function(){

        step *= 0.75;

    };

    function updateShaderAttributes(from, to) {

        epochMin = from - tMin;
        epochMax = to - tMin;

    }

    this.increaseHandles = function(){

        if (sliderObject) {

            var addThis = ((currentMax - currentMin) / 25 ) / 2;
            currentMin -= addThis;
            currentMax += addThis;

            sliderObject.update({
                from: currentMin,
                to: currentMax
            });

        }

    };

    this.decreaseHandles = function(){

        if (sliderObject) {

            var addThis = ((currentMax - currentMin) / 25 ) / 2;
            currentMin += addThis;
            currentMax -= addThis;

            sliderObject.update({
                from: currentMin,
                to: currentMax
            });

        }

    };


    function togglePlay() {

        if (playing) {

            $('#play span').toggleClass("glyphicon-pause");
            playing = !playing;

        } else {

            if (currentMax === tMax) {

                // this order matters
                currentMax = tMin + (currentMax - currentMin);
                currentMin = tMin;
                playing = true;

            } else {

                playing = !playing;

            }

            $('#play span').toggleClass("glyphicon-pause");

        }

    }

    function toggleRepeat() {

        if (repeat) {

            $('#repeat span').toggleClass("text-muted");

        } else {

            $('#repeat span').toggleClass("text-muted");

        }

        repeat = !repeat;

    }

    function toggleExpand() {

        if (playing) {

            togglePlay();

        }

        if (expand) {

            sliderObject.update({
                from: oldDuration.oldMin,
                to: oldDuration.oldMax
            });

            $('#expand span').toggleClass("glyphicon-minus");

        } else {

            console.log(currentMin, currentMax);
            oldDuration.oldMin = currentMin;
            oldDuration.oldMax = currentMax;

            sliderObject.update({
                from: tMin,
                to: tMax
            });
            $('#expand span').toggleClass("glyphicon-minus");

        }

        expand = !expand;

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
        $('#expand').on('click', toggleExpand);

        //playing = true;
        //repeat = true;
        //expand = true;

        //togglePlay();
        toggleRepeat();
        //toggleExpand();

    };


    this.setLimits = function (min, max) {

        tMin = min;
        tMax = max;

        var diff = tMax - tMin;
        currentMin = tMin;
        currentMax = tMin + (diff / 25);
        step = diff / stepSize;


        sliderObject.update({
            hide_min_max: false,
            hide_from_to: false,
            min: tMin,
            max: tMax,
            from: currentMin,
            to: currentMax,
            prettify: function (num) {
                return moment(num, "X").format("MMM Do, hh:mm A");
            },
            onChange: function (data) {
                updateShaderAttributes(data.from, data.to);
                currentMin = data.from;
                currentMax = data.to;
            },
            onUpdate: function (data) {
                updateShaderAttributes(data.from, data.to);
            }

        });

        $('#slider').fadeIn(1000, function () {

            $('#buttons').slideDown();
        });


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

                        // order matters here
                        currentMax = tMin + (currentMax - currentMin);
                        currentMin = tMin;

                    } else {

                        togglePlay();

                    }

                    //sliderObject.update({
                    //    from: currentMin,
                    //    to: currentMax
                    //});


                } else {

                    currentMin += step;
                    currentMax += step;

                }

                sliderObject.update({
                    from: currentMin,
                    to: currentMax
                });


            }


        }


    };


}
