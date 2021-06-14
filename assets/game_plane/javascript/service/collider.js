(function () {
    "use strict"

    function treeAttach(collection, client) {
        var width = app.env.width
        var height = app.env.height
        var ax = width / 2
        var ay = height / 4
    }

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
        this.heroCollision = []  // 可与 hero 碰撞的
        this.enemyCollision = [] // 可与 enemy 碰撞的
    }
    extend(Collider, AbstructClient)

    Collider.prototype.update = function(timestamp) {

    }

    Collider.prototype.heroCollider = function (client) {
        treeAttach(this.heroCollision, client)
    }

    Collider.prototype.enemyCollider = function (client) {
        treeAttach(this.enemyCollision, client)
    }

    window.Collider = Collider
})()
