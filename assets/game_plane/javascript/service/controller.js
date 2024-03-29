(function() {
    "use strict"

    function Controller(handleElement, shotBtnElement) {
        this.handleElement = handleElement
        this.shotBtnElement = shotBtnElement
        this.env = app.get('env')

        this.top = 25;
        this.left = 25;

        this.state = {
            shootTimestamp: 0,
            startX: 0,
            startY: 0,
            shootIntervalNumber: 0,
            shotKey: false,
            isShotting: false,
            touching: false
        }
    }

    Controller.prototype.setHandlerListener = function () {
        var eventNameStart = this.env.type === 'PC' ? 'onmousedown' : 'ontouchstart'
        var eventNameMove = this.env.type === 'PC' ? 'onmousemove' : 'ontouchmove'
        var eventNameEnd = this.env.type === 'PC' ? 'onmouseup' : 'ontouchend'
        this.handleElement[eventNameStart] = this.ctrlHandlerStart.bind(this)
        document.body[eventNameMove] = this.ctrlHandlerMove.bind(this)
        document.body[eventNameEnd] = this.ctrlHandlerEnd.bind(this)
    }

    Controller.prototype.setShootingListener = function () {
        var eventNameStart = this.env.type === 'PC' ? 'onmousedown' : 'ontouchstart'
        var eventNameEnd = this.env.type === 'PC' ? 'onmouseup' : 'ontouchend'
        this.shotBtnElement[eventNameStart] = (function (event) {
            event.preventDefault();
            app.dispatch('shootingStart', null)
        }).bind(this)
        this.shotBtnElement[eventNameEnd] = function (event) {
            event.preventDefault();
            app.dispatch('shootingStop', null)
        }
        window.onkeydown = function (event) {
            if (event.key === 'a') {
                app.dispatch('shootingStart', null)
            }
        }
        window.onkeyup = function (event) {
            if (event.key === 'a') {
                app.dispatch('shootingStop', null)
            }
        }
    }

    Controller.prototype.ctrlHandlerStart = function (event) {
        if (this.env.type === 'PC') {
            event.preventDefault();
        }
        this.state.touching = true
        var finger = event
        if (this.env.type !== 'PC') {
            finger = event.targetTouches[0]
        }
        this.state.startX = finger.clientX;
        this.state.startY = finger.clientY;
    }

    Controller.prototype.ctrlHandlerMove = function (event) {
        if (this.env.type === 'PC') {
            event.preventDefault();
        }
        if (this.state.touching) {
            var finger = event
            if (this.env.type !== 'PC') {
                finger = event.targetTouches[0];
            }
            var fixX = finger.clientX - this.state.startX
            var fixY = finger.clientY - this.state.startY

            var longSide = Math.sqrt(Math.pow(fixX, 2) + Math.pow(fixY, 2))
            if (longSide > 25) {
                var proportion = 25 / longSide
                fixX = fixX * proportion
                fixY = fixY * proportion
            }
            app.dispatch('ctrlHandlerMoved', {
                x: fixX,
                y: fixY
            })
            this.handleElement.style.top = this.top + fixY + 'px'
            this.handleElement.style.left = this.left + fixX + 'px'
        }
    }

    Controller.prototype.ctrlHandlerEnd = function (event) {
        if (this.env.type === 'PC') {
            event.preventDefault();
        }
        app.dispatch('ctrlHandlerMoved', {
            x: 0,
            y: 0
        })
        this.state.touching = false
        this.handleElement.style.top = this.top + 'px'
        this.handleElement.style.left = this.left + 'px'
    }

    window.Controller = Controller
})()
