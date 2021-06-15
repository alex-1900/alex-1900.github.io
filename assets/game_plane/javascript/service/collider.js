(function () {
    "use strict"

    /**
     * background client
     * @param id
     * @param canvas
     * @constructor
     *
     * @extends {AbstructClient}
     */
    function Collider(id, canvas) {
        AbstructClient.call(this, id, canvas)
        this.enemyCollision = {} // 可与 enemy 碰撞的
        this.enemyQuadTree = new QuadTree({
            x: -100,
            y: -100,
            width: app.env.width + 200,
            height: app.env.height + 200
        })
    }
    extend(Collider, AbstructClient)

    Collider.prototype.update = function(timestamp) {
        var that = this
        Object.values(this.enemyCollision).forEach(function (options) {
            var enemies = that.enemyQuadTree.findAll(options)
            var hero = options.payload
            enemies.forEach(function (enemyOpt) {
                var enemy = enemyOpt.payload
                var xDiff = hero.x - (enemy.x + enemy.width)
                if (xDiff > 0 && xDiff < (hero.width + enemy.width)) {
                    var yDiff = (enemy.y + enemy.height) - hero.y
                    if (yDiff > 0 && yDiff < (hero.height + enemy.height)) {
                        hero.onCollide(enemy)
                        enemy.onCollide(hero)
                    }
                }
            })
        })
    }

    Collider.prototype.listenCollideWithHero = function (options) {
        this.enemyQuadTree.update(options)
    }

    Collider.prototype.listenCollideWithEnemy = function (options) {
        this.enemyCollision[options.id] = options
    }

    window.Collider = Collider
})()
