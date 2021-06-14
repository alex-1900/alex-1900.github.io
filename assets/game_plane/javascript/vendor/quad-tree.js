(function() {
    "use strict"

    function QuadTree(boundBox, lvl) {
        var maxObjects = 10
        this.bounds = boundBox || {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        var objects = []
        this.nodes = []
        var level = lvl || 0
        var maxLevels = 5
    }
})()
