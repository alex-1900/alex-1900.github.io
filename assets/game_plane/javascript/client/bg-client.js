(function() {
    "use strict"

    /**
     * background client
     * @param id
     * @param canvas
     * @constructor
     *
     * @extends {AbstructClient}
     */
    function BgClient(id, canvas) {
        AbstructClient.call(this, id, canvas)
        var env = app.get('env')
        var imageRepository = app.get('imageRepository')
        this.image = imageRepository.get('map')
        this.imageWidth = env.width
        this.imageHeight = env.height

        this.state = {
            cvsY1: 0,
            cvsY2: -this.imageHeight
        }
    }

    extend(BgClient, AbstructClient)

    BgClient.prototype.update = function(timestamp) {
        if (this.isOvertime(timestamp, 30)) {
            this.setStates({
                cvsY1: this.state.cvsY1 >= this.imageHeight ? 0 : this.state.cvsY1 + 1,
                cvsY2: this.state.cvsY1 - this.imageHeight,
            })
        }
    }

    BgClient.prototype.render = function() {
        this.ctx.drawImage(
            this.image, 0, 0,
            this.image.width, this.image.height,
            0, this.state.cvsY1, this.imageWidth, this.imageHeight
        );
        this.ctx.drawImage(
            this.image, 0, 0,
            this.image.width, this.image.height,
            0, this.state.cvsY2, this.imageWidth, this.imageHeight
        )
    }

    window.BgClient = BgClient
})()
