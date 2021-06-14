(function(window, document) {
    "use strict"
    /**
     * requestAnimationFrame 的兼容函数
     * @param {TimerHandler} timerHandler
     */
    function compatibleRequestAnimationFrame(timerHandler) {
        setTimeout(timerHandler, 1000 / 60);
    }

    /**
     * cancelAnimationFrame 的兼容函数
     * @param {Number} handle
     */
    function compatibleCancelAnimationFrame(handle) {
        clearTimeout(handle);
    }

    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        compatibleRequestAnimationFrame;

    window.cancelAnimationFrame = window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        compatibleCancelAnimationFrame;

    /**
     * 继承器
     * @param {any} child 子类
     * @param {any} parent 父类
     *
     * @return {any} 继承后的子类
     */
    window.extend = function(child, parent) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        return child;
    };

    /**
     * 全屏显示
     * @param {HTMLElement} element (e.g. document.documentElement.requestFullScreen())
     */
    window.requestFullScreen = function() {
        var element = document.documentElement;
        var requestMethod = element.requestFullScreen ||
            element.webkitRequestFullScreen ||
            element.mozRequestFullScreen ||
            element.msRequestFullScreen;
        if (requestMethod) {
            requestMethod.call(element);
        }
        else if (typeof window.ActiveXObject !== "undefined") {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    window.gifKeyToCanvases = function (key) {
        var imageRepository = app.get('imageRepository')
        var reader = imageRepository.get(key)
        var canvases = []
        for (var i = 0; i < reader.numFrames(); i++) {
            var frameInfo = reader.frameInfo(i)
            frameInfo.pixels = new Uint8ClampedArray(reader.width * reader.height * 4)
            reader.decodeAndBlitFrameRGBA(i, frameInfo.pixels)

            var bufferCanvas = document.createElement('canvas')
            var bufferContext = bufferCanvas.getContext('2d')
            bufferCanvas.width = reader.width
            bufferCanvas.height = reader.height
            var imageData = bufferContext.createImageData(frameInfo.width, frameInfo.height)
            imageData.data.set(frameInfo.pixels)
            bufferContext.putImageData(imageData, -frameInfo.x, -frameInfo.y)
            canvases.push(bufferCanvas)
        }
        return canvases
    }

    window.createLayerCanvas = function (zIndex) {
        zIndex = zIndex ? zIndex : 0
        var env = app.get('env')
        var canvas = document.createElement('canvas')
        canvas.width = env.width
        canvas.height = env.height
        canvas.style.zIndex = zIndex
        canvas.getContext('2d')
        return canvas
    }

    window.outsideLimit = function (width, height, x, y) {
        var scaling = app.env.width / 600
        var sizeX = width * scaling
        var sizeY = height * scaling
        return (
            (x < -sizeX) || (x > app.env.width + sizeX)
            || (y < -sizeY) || (y > app.env.height + sizeY)
        )
    }

    window.shoot = function (x, y, incrX, incrY) {
        var canvas = app.get('bulletLayerCanvas')
        return app.attachClient(function (id) {
            return new BulletClient(id, canvas, x, y, incrX, incrY)
        })
    }

    window.enemy = function (x, y, incrX, incrY, shootMod) {
        var canvas = app.get('enemyLayerCanvas')
        return app.attachClient(function (id) {
            return new EnemyClient(id, canvas, x, y, incrX, incrY, shootMod)
        })
    }

})(window, document);
