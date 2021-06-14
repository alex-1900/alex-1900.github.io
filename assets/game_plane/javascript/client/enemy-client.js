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
     * @param {Function} shootMod
     * @constructor
     *
     * @extends {AbstructClient}
     */
    function EnemyClient(id, canvas, x, y, incrX, incrY, shootMod) {
        AbstructClient.call(this, id, canvas)
        this.incrX = incrX
        this.incrY = incrY
        this.shootMod = shootMod
        if (this.shootMod) {
            this.shootMod.bind(this)
        }
        this.scaling = app.get('env').width / 600
        this.image = app.get('imageRepository').get('enemySmall')
        this.imageWidth = this.image.width * this.scaling
        this.imageHeight = this.image.height * this.scaling
        this.halfSize = this.imageWidth / 2
        this.state = {
            x: x,
            y: y,
            px: x,
            py: y
        }
    }
    extend(EnemyClient, AbstructClient)

    EnemyClient.prototype.update = function(timestamp) {
        if (outsideLimit(this.image.width, this.image.height, this.state.x, this.state.y)) {
            return this.terminate()
        }
        this.setStates({
            px: this.state.x,
            py: this.state.y,
            x: this.state.x + this.incrX,
            y: this.state.y + this.incrY
        })

        if (this.shootMod) {
            this.shootMod(timestamp)
        }
    }

    EnemyClient.prototype.render = function() {
        this.ctx.clearRect(
            this.state.px,
            this.state.py,
            this.imageWidth,
            this.imageHeight
        )
        this.ctx.drawImage(
            this.image,
            this.state.x,
            this.state.y,
            this.imageWidth,
            this.imageHeight
        )
    }

    window.EnemyClient = EnemyClient
})()
