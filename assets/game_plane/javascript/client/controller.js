(function() {
    "use strict"

    function Controller(id, handleElement, shotBtnElement) {
        AbstructClient.call(this, id, null)
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

        var eventNameStart = this.env.type === 'PC' ? 'onmousedown' : 'ontouchstart'
        var eventNameMove = this.env.type === 'PC' ? 'onmousemove' : 'ontouchmove'
        var eventNameEnd = this.env.type === 'PC' ? 'onmouseup' : 'ontouchend'

        this.handleElement[eventNameStart] = this.handlerStart.bind(this)
        document.body[eventNameMove] = this.handlerMove.bind(this)
        document.body[eventNameEnd] = this.handlerEnd.bind(this)
        // this.handleElement.onmouseleave = this.handlerEnd.bind(this)
    }

    extend(Controller, AbstructClient)

    Controller.prototype.handlerStart = function (event) {
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

    Controller.prototype.handlerMove = function (event) {
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
            this.handleElement.style.top = this.top + fixY + 'px'
            this.handleElement.style.left = this.left + fixX + 'px'
        }
    }

    Controller.prototype.handlerEnd = function (event) {
        if (this.env.type === 'PC') {
            event.preventDefault();
        }
        this.state.touching = false
        this.handleElement.style.top = this.top + 'px'
        this.handleElement.style.left = this.left + 'px'
    }

    window.Controller = Controller
})()
