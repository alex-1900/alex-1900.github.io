(function () {
    "use strict"

    window.activities = []

    for (var i = 0; i < 5; i++) {
        activities.push({
            t: 300, script: function (app, heroClient) {
                enemy(0, 100, 6, 5, function (timestamp) {
                    if (this.isOvertime(timestamp, 800)) {
                        // shoot(
                        //     this.state.x + this.halfSize,
                        //     this.state.y + this.imageHeight,
                        //     0, 5
                        // )
                    }
                })
            }
        })
    }

    for (i = 0; i < 5; i++) {
        activities.push({
            t: 300, script: function (app, heroClient) {
                enemy(app.env.width, 200, -6, 5, function (timestamp) {
                    if (this.isOvertime(timestamp, 800)) {
                        // shoot(
                        //     this.state.x + this.halfSize,
                        //     this.state.y + this.imageHeight,
                        //     0, 5
                        // )
                    }
                })
            }
        })
    }

    /**
     * background client
     * @param id
     * @param canvas
     * @constructor
     *
     * @extends {AbstructClient}
     */
    function Composer(id, canvas, heroClient) {
        AbstructClient.call(this, id, canvas)
        this.heroClient = heroClient
        this.state = {
            timestamp: 0,
            locked: false,
            lockTime: 0
        }
    }
    extend(Composer, AbstructClient)

    Composer.prototype.update = function(timestamp) {
        if (
            this.state.locked
            && (timestamp - this.state.timestamp >= this.state.lockTime)
        ) {
            this.state.locked = false
        }

        if (!this.state.locked && activities.length > 0) {
            var activity = activities.shift()
            this.state.locked = true
            this.state.lockTime = activity.t
            activity.script(app, this.heroClient)
            this.state.timestamp = timestamp
        }
    }

    window.Composer = Composer
})()
