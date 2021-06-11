(function () {
    "use strict"

    function ElementFactory() {
        this.env = app.get('env')
    }

    ElementFactory.prototype.createLayerCanvas = function (zIndex) {
        zIndex = zIndex ? zIndex : 0;
        var canvas = document.createElement('canvas')
        canvas.width = this.env.width
        canvas.height = this.env.height
        canvas.style.zIndex = zIndex;
        canvas.getContext('2d')
        return canvas
    }

    window.ElementFactory = ElementFactory;
})()
