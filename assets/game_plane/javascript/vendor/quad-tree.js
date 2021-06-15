(function() {
    "use strict"

    window._counter = 0
    window.idMap = {}
    window.nodes = {}

    function QuadTree(boundBox, level) {
        this.id = _counter++
        this.maxObjects = 3
        this.bounds = boundBox || {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this.objects = []
        this.nodes = []
        this.level = level || 0
        this.maxLevels = 5
        nodes[this.id] = this
    }

    QuadTree.prototype.clear = function () {
        this.objects = []
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
        for (var i = 0, len = this.objects.length; i < len; i++) {
            returnedObjects.push(this.objects[i])
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
        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (this.nodes[0] == null) {
                this.split()
            }
            var i = 0
            while (i < this.objects.length) {
                var _quadrant = this.getQuadrant(this.objects[i])
                if (_quadrant !== -1) {
                    this.nodes[_quadrant].update((this.objects.splice(i, 1))[0])
                }
                else {
                    i++
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
            nodes[valueObj.nodeId].objects.splice(valueObj.index, 1)
            // delete nodes[valueObj.nodeId].objects[valueObj.index]
            console.log('777777')
        }

        if (needDelete || !valueObj) {
            var len = this.objects.push(obj)
            idMap[obj.id] = {
                nodeId: this.id,
                index: len - 1
            }
        }
    }

    window.QuadTree = QuadTree
})()
