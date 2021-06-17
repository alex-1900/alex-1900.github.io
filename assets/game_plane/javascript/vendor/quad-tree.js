(function() {
    "use strict"

    window._counter = 0
    window.idMap = {}
    window.nodes = {}

    function QuadTree(boundBox, level) {
        this.id = _counter++
        this.maxObjects = 6
        this.bounds = boundBox || {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this.objects = {}
        this.nodes = []
        this.level = level || 0
        this.maxLevels = 3
        nodes[this.id] = this
    }

    QuadTree.prototype.clear = function () {
        this.objects = {}
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].clear()
        }
        this.nodes = []
        _counter = 1
        idMap = {}
        nodes = {}
    }

    QuadTree.prototype.findAll = function (returnedObjects, obj) {
        var index = this.getQuadrant(obj)
        if (index !== -1 && this.nodes.length) {
            this.nodes[index].findAll(returnedObjects, obj)
        }
        for (var i in this.objects) {
            returnedObjects.push(this.objects[i].payload)
        }
        return returnedObjects
    }

    QuadTree.prototype.getQuadrant = function (obj) {
        var index = -1
        var verticalMidpoint = this.bounds.x + this.bounds.width / 2
        var horizontalMidpoint = this.bounds.y + this.bounds.height / 2
        var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint)
        var bottomQuadrant = (obj.y > horizontalMidpoint)
        if (
            obj.x < verticalMidpoint
            && obj.x + obj.width < verticalMidpoint
        ) {
            if (topQuadrant) {
                index = 1
            } else if (bottomQuadrant) {
                index = 2
            }
        } else if (obj.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0
            } else if (bottomQuadrant) {
                index = 3
            }
        }
        return index
    }

    QuadTree.prototype.update = function (obj) {
        if (this.nodes.length) {
            var quadrant = this.getQuadrant(obj)
            if (quadrant !== -1) {
                return this.nodes[quadrant].update(obj)
            }
        }

        this.saveObject(obj)
        if (Object.keys(this.objects).length > this.maxObjects && this.level < this.maxLevels) {
            if (this.nodes[0] == null) {
                this.split()
            }

            for (var i in this.objects) {
                var o = this.objects[i]
                var _quadrant = this.getQuadrant(o)
                if (_quadrant !== -1) {
                    delete this.objects[o.id]  // id is the key
                    this.nodes[_quadrant].update(o)
                }
            }
        }
    }

    QuadTree.prototype.split = function () {
        var subWidth = (this.bounds.width / 2) | 0
        var subHeight = (this.bounds.height / 2) | 0
        var level = this.level + 1

        this.nodes[0] = new QuadTree({
            x: this.bounds.x + subWidth,
            y: this.bounds.y,
            width: subWidth,
            height: subHeight
        }, level)

        this.nodes[1] = new QuadTree({
            x: this.bounds.x,
            y: this.bounds.y,
            width: subWidth,
            height: subHeight
        }, level)

        this.nodes[2] = new QuadTree({
            x: this.bounds.x,
            y: this.bounds.y + subHeight,
            width: subWidth,
            height: subHeight
        }, level)

        this.nodes[3] = new QuadTree({
            x: this.bounds.x + subWidth,
            y: this.bounds.y + subHeight,
            width: subWidth,
            height: subHeight
        }, level)
    }

    QuadTree.prototype.saveObject = function (obj) {
        var valueObj = idMap[obj.id]
        var needDelete = valueObj && this.id !== valueObj.nodeId
        if (needDelete) {
            delete nodes[valueObj.nodeId].objects[valueObj.index]
        }

        if (needDelete || !valueObj) {
            this.objects[obj.id] = obj
            idMap[obj.id] = {
                nodeId: this.id,
                index: obj.id
            }
        }
    }

    QuadTree.prototype.remove = function (id) {
        var valueObj = idMap[id]
        if (valueObj) {
            delete nodes[valueObj.nodeId].objects[valueObj.index]
            delete idMap[id]
        }
    }

    window.QuadTree = QuadTree
})()
