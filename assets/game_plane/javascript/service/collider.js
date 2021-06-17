(function () {
    "use strict"

    function factoryQuadTree() {
        return new QuadTree({
            x: -100,
            y: -100,
            width: app.env.width + 200,
            height: app.env.height + 200
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
    function Collider(id) {
        AbstructClient.call(this, id, null)
        this.heroCollision = {} // 可与 enemy 碰撞的 hero 方单位
        this.enemyQuadTree = factoryQuadTree()

        this.collectors = {}
        this.trees = {}
    }
    extend(Collider, AbstructClient)

    // options: {id, x, y, width, height, payload}

    Collider.prototype.update = function(timestamp) {
        this.checkWithTree(this.heroCollision, this.enemyQuadTree)
        var that = this
        Object.values(this.collectors).forEach(function (item) {
            for (var name in that.trees) {
                var tree = that.trees[name]
                item.tags.forEach(function (tag) {
                    if (tag === name) {
                        that.checkWithTree(item.options, tree)
                    }
                })
            }
        })
    }

    Collider.prototype.setQuadTree = function (name, options) {
        if (!this.trees[name]) {
            this.trees[name] = factoryQuadTree()
        }
        this.trees[name].update(options)
    }

    Collider.prototype.removeQuadTreeItem = function (name, id) {
        if (this.trees[name]) {
            this.trees[name].remove(id)
        }
    }

    Collider.prototype.setCollector = function (name, options, tags) {
        if (!this.collectors[name]) {
            this.collectors[name] = {options: {}}
        }
        this.collectors[name].tags = tags || []
        this.collectors[name].options[options.id] = options
    }

    Collider.prototype.removeCollectorItem = function (name, id) {
        if (this.collectors[name].options[id]) {
            delete this.collectors[name].options[id]
        }
    }

    Collider.prototype.checkWithTree = function (collector, quadTree) {
        var that = this
        Object.values(collector).forEach(function (option) {
            var treePayloads = quadTree.findAll([], option)
            var collectPayload = option.payload
            treePayloads.forEach(function (treePayload) {
                if (that.check({
                    x: option.x,
                    y: option.y,
                    width: option.width,
                    height: option.height
                }, {
                    x: treePayload.state.x,
                    y: treePayload.state.y,
                    width: treePayload.imageWidth,
                    height: treePayload.imageHeight
                })) {
                    collectPayload.onCollide && collectPayload.onCollide(treePayload)
                    treePayload.onCollide && treePayload.onCollide(collectPayload)
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

    window.Collider = Collider
})()
