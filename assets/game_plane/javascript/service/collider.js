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
    function Collider(id) {
        AbstructClient.call(this, id, null)
        this.heroCollision = {} // 可与 enemy 碰撞的 hero 方单位
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
        Object.values(this.heroCollision).forEach(function (options) {
            var enemies = that.enemyQuadTree.findAll([], options)
            var hero = options.payload
            enemies.forEach(function (enemy) {
                if (that.check({
                    x: options.x,
                    y: options.y,
                    width: options.width,
                    height: options.height
                }, {
                    x: enemy.state.x,
                    y: enemy.state.y,
                    width: enemy.imageWidth,
                    height: enemy.imageHeight
                })) {
                    hero.onCollide && hero.onCollide(enemy)
                    enemy.onCollide && enemy.onCollide(hero)
                }
            })
        })
    }

    Collider.prototype.check = function (rect1, rect2) {
        if (
            (rect1.x < rect2.x + rect2.width) &&
            (rect1.x + rect1.width > rect2.x) &&
            (rect1.y < rect2.y + rect2.height) &&
            (rect1.y + rect1.height > rect2.y)
        ) {
            return true
        }
        return false
    }

    Collider.prototype.listenCollideWithHero = function (options) {
        this.enemyQuadTree.update(options)
    }

    Collider.prototype.listenCollideWithEnemy = function (options) {
        this.heroCollision[options.id] = options
    }

    Collider.prototype.removeEnemyCamp = function (id) {
        this.enemyQuadTree.remove(id)
    }

    Collider.prototype.removeHeroCamp = function (id) {
        delete this.heroCollision[id]
    }

    window.Collider = Collider
})()
