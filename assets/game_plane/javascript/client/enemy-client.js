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
    function EnemyClient(id, canvas, x, y, incrX, incrY, onUpdate) {
        AbstructClient.call(this, id, canvas)
        this.collider = app.get('collider')
        this.incrX = incrX
        this.incrY = incrY
        this.onUpdate = onUpdate
        if (this.onUpdate) {
            this.onUpdate.bind(this)
        }
        var imageNormal = app.get('imageRepository').get('enemySmall')
        this.imagesDie = gifKeyToCanvases('enemySmallBlast')
        this.scaling = app.get('env').width / 600
        this.image = imageNormal
        this.imageWidth = imageNormal.width * this.scaling
        this.imageHeight = imageNormal.height * this.scaling
        this.isTerminate = false
        this.collideOnce = true
        this.halfSize = this.imageWidth / 2
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

        if (this.onUpdate) {
            this.onUpdate(timestamp)
        }
        !this.isTerminate && this.collider.setQuadTree('enemies', {
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
        }
    }

    EnemyClient.prototype.terminate = function() {
        this.ctx.clearRect(
            this.state.x,
            this.state.y,
            this.imageWidth,
            this.imageHeight
        )
        this.collider.removeQuadTreeItem('enemies', this.id)
        app.detachClient(this.id)
    }

    window.EnemyClient = EnemyClient
})()
