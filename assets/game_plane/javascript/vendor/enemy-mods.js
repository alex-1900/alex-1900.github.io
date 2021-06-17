(function () {
    "use strict"

    window.modRightFormation = function (activities, num, y, t) {
        for (var i = 0; i < num; i++) {
            activities.push({
                t: t, script: function (app, heroClient) {
                    enemy(0, y, 2, 1, function (timestamp) {
                        if (this.isOvertime(timestamp, 1500)) {
                            shoot(
                                this.state.x + this.halfSize,
                                this.state.y + this.imageHeight,
                                0, 5, 2
                            )
                        }
                    })
                }
            })
        }
        console.log(activities)
    }

    window.modLeftFormation = function (activities, num, y, t) {
        for (var i = 0; i < num; i++) {
            activities.push({
                t: t, script: function (app, heroClient) {
                    enemy(app.env.width, y, -2, 1, function (timestamp) {
                        if (this.isOvertime(timestamp, 1500)) {
                            shoot(
                                this.state.x + this.halfSize,
                                this.state.y + this.imageHeight,
                                0, 5, 2
                            )
                        }
                    })
                }
            })
        }
    }
})()
