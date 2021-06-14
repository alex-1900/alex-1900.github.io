(function() {
    "use strict"

    /**
     * background client
     * @param id
     * @param canvas
     * @param x
     * @param y
     * @param incrX
     * @param incrY
     * @constructor
     *
     * @extends {AbstructClient}
     */
    function BulletClient(id, canvas, x, y, incrX, incrY) {
        AbstructClient.call(this, id, canvas)
        this.incrX = incrX
        this.incrY = incrY
        this.size = 5
        this.scaling = app.get('env').width / 600
        this.state = {
            x: x,
            y: y,
            px: x,
            py: y
        }
    }
    extend(BulletClient, AbstructClient)

    BulletClient.prototype.update = function(timestamp) {
        if (outsideLimit(this.size * 2, this.size * 2, this.state.x, this.state.y)) {
            return this.terminate()
        }
        this.setStates({
            px: this.state.x,
            py: this.state.y,
            x: this.state.x + this.incrX,
            y: this.state.y + this.incrY
        })
    }

    BulletClient.prototype.render = function() {
        var r = this.size * this.scaling
        this.ctx.clearRect(this.state.px - 2*r, this.state.py - 2*r, 4*r, 4*r)
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.fillStyle = '#778899'
        this.ctx.arc(
            this.state.x,
            this.state.y,
            r,
            0,
            2*Math.PI
        )
        this.ctx.fill()
        this.ctx.closePath()
        this.ctx.restore()
    }

    window.BulletClient = BulletClient
})()
