(function () {
    "use strict"

    var activities = []

    modRightFormation(activities, 20, 100, 600)
    // modLeftFormation(activities, 5, 200, 600)

    /**
     * background client
     * @param id
     * @param canvas
     * @param heroClient
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
