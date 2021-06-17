(function() {
    "use strict"

    function heroCampActionBuilder(collider, client, tags) {
        return function () {
            collider.setCollector('heroBullets', {
                id: client.id,
                x: client.state.x - client.size,
                y: client.state.y - client.size,
                width: client.imageWidth,
                height: client.imageheight,
                payload: client
            }, tags)
        }
    }

    function enemyCampActionBuilder(collider, client) {
        return function () {
            collider.setCollector('enemyBullets', {
                id: client.id,
                x: client.state.x - client.size,
                y: client.state.y - client.size,
                width: client.imageWidth,
                height: client.imageheight,
                payload: client
            })
        }
    }

    /**
     * background client
     * @param id
     * @param canvas
     * @param x
     * @param y
     * @param incrX
     * @param incrY
     * @param camp 1 hero  2 enemy
     * @constructor
     *
     * @extends {AbstructClient}
     */
    function BulletClient(id, canvas, x, y, incrX, incrY, camp) {
        AbstructClient.call(this, id, canvas)
        this.collider = app.get('collider')
        this.incrX = incrX
        this.incrY = incrY
        this.scaling = app.get('env').width / 600
        this.size = 5 * this.scaling
        this.imageWidth = this.size * 2
        this.imageheight = this.size * 2

        this.camp = camp
        if (camp === 1) {
            this.campAction = heroCampActionBuilder(this.collider, this, ['enemies'])
        } else {
            this.campAction = enemyCampActionBuilder(this.collider, this)
        }

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

        this.campAction()
    }

    BulletClient.prototype.render = function() {
        var r = this.size
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

    BulletClient.prototype.onCollide = function (entity) {
        if (this.camp === 1) {
            this.collider.removeCollectorItem('heroBullets', this.id)
        } else {
            this.collider.removeQuadTreeItem('enemyBullets', this.id)
        }

        var r = this.size
        this.ctx.clearRect(this.state.x - 2*r, this.state.y - 2*r, 4*r, 4*r)
        this.terminate()
    }

    window.BulletClient = BulletClient
})()
