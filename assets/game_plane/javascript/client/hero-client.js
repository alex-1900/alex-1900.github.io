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
    function HeroClient(id, canvas) {
        AbstructClient.call(this, id, canvas)
        var env = app.get('env')
        app.listen('ctrlHandlerMoved', this.ctrlHandlerMoved.bind(this))
        this.images = gifKeyToCanvases('hero')
        this.scaling = env.width / 600
        this.state = {
            x: env.width / 2 - this.images[0].width / 2,
            y: env.height - this.images[0].height * 1.5,
            px: 0,
            py: 0,
            diffX: 0,
            diffY: 0,
            imageIndex: 0
        }
    }

    extend(HeroClient, AbstructClient)

    HeroClient.prototype.update = function(timestamp) {
        if (this.isOvertime(timestamp, 150)) {
            this.setStates({
                imageIndex: (this.state.imageIndex + 1) % this.images.length
            })
        }

        this.setStates({
            px: this.state.x,
            py: this.state.y,
            x: this.state.x + this.state.diffX,
            y: this.state.y + this.state.diffY
        })
    }

    HeroClient.prototype.render = function() {
        var image = this.images[this.state.imageIndex]
        this.ctx.clearRect(this.state.px, this.state.py, image.width * this.scaling, image.height * this.scaling)
        for (var i = 0; i <= this.state.imageIndex; i++) {
            var _image = this.images[i]
            this.ctx.drawImage(
                _image,
                this.state.x,
                this.state.y,
                _image.width * this.scaling,
                _image.height * this.scaling
            );
        }
    }

    HeroClient.prototype.ctrlHandlerMoved = function (data) {
        this.setStates({
            diffX: data.x / 10,
            diffY: data.y / 10
        })
    }

    window.HeroClient = HeroClient
})()
