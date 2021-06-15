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
        this.collider = app.get('collider')
        this.incrX = incrX
        this.incrY = incrY
        this.shootMod = shootMod
        if (this.shootMod) {
            this.shootMod.bind(this)
        }
        var imageNormal = app.get('imageRepository').get('enemySmall')
        this.imagesDie = gifKeyToCanvases('enemySmallBlast')
        this.scaling = app.get('env').width / 600
        this.image = imageNormal
        this.imageWidth = imageNormal.width * this.scaling
        this.imageHeight = imageNormal.height * this.scaling
        this.isTerminate = false
        this.collideOnce = true
        this.state = {
            x: x,
            y: y,
            px: x,
            py: y,
            terminateTimestamp: 0
        }
    }
    extend(EnemyClient, AbstructClient)

    EnemyClient.prototype.update = function(timestamp) {
        if (outsideLimit(this.imageWidth, this.imageHeight, this.state.x, this.state.y)) {
            return this.terminate()
        }

        if (this.isTerminate) {
            if (timestamp - this.state.terminateTimestamp >= 100) {
                this.state.terminateTimestamp = timestamp
                var image = this.imagesDie.shift()
                if (image) {
                    this.image = image
                } else {
                    return this.terminate()
                }
            }
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
        this.collider.listenCollideWithHero({
            id: this.id,
            x: this.state.x,
            y: this.state.y,
            width: this.imageWidth,
            height: this.imageHeight,
            payload: this
        })
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

    EnemyClient.prototype.onCollide = function (hero) {
        if (this.collideOnce) {
            this.isTerminate = true
            this.image = this.imagesDie.shift()
            this.collideOnce = false
            this.collider.removeEnemyCamp(this.id)
        }
    }

    EnemyClient.prototype.terminate = function() {
        this.ctx.clearRect(
            this.state.x,
            this.state.y,
            this.imageWidth,
            this.imageHeight
        )
        app.detachClient(this.id)
    }

    window.EnemyClient = EnemyClient
})()
