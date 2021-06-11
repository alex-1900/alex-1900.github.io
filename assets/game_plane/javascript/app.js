(function () {
    "use strict"

    function App(environment, element) {
        this.env = environment
        this.set('env', environment)
        this.element = element
        this.element = this._buildAppElements(element)
        this._process = this._process.bind(this)
    }

    App.prototype = {
        constructor: App,
        clients: {},
        container: {},
        frames: [],
        state: {
            isRunning: false,
            frameId: 0,
            accumulator: 0
        }
    }

    App.prototype.set = function (name, entry) {
        this.container[name] = entry
    }

    App.prototype.get = function (name) {
        return this.container[name]
    }

    App.prototype.start = function() {
        if (!this.state.isRunning) {
            this._setState('isRunning', true)
            requestAnimationFrame(this._process)
        }
    }

    App.prototype.pause = function() {
        this._setState('isRunning', false)
    }

    App.prototype.stop = function() {
        this.pause()
        for (var i in this.clients) {
            this.clients[i].terminate()
        }
        this.clients = {}
        this.element.innerText = ''
        this.frames = []
    }

    App.prototype.attachClient = function(callback) {
        var nextClientId = this.state.accumulator
        var client = callback(nextClientId)
        if (client instanceof AbstructClient) {
            this.clients[nextClientId] = client
            this._setState('accumulator', nextClientId + 1)
            return client
        }
        throw new Error('需要返回 AbstractClient 实例')
    }

    App.prototype.detachClient = function(clientId) {
        delete this.clients[clientId];
    }

    App.prototype._process = function(timestamp) {
        if (this.state.isRunning) {
            for (var i in this.clients) {
                var client = this.clients[i]
                if (client instanceof AbstructClient) {
                    client.update(timestamp)
                    if (client.isSynchronized()) {
                        client.render()
                        client.sync()
                    }
                }
            }
            this.state.frameId = requestAnimationFrame(this._process)
        } else {
            // 必须在 _process 里终止，否则会串号
            cancelAnimationFrame(this.state.frameId)
        }
    }

    App.prototype._setState = function(key, value) {
        this.state[key] = value
    }

    App.prototype._buildAppElements = function(element) {
        element.style.width = this.env.width + 'px'
        element.style.height = this.env.height + 'px'
        element.ontouchstart
            = element.ontouchend
            = element.ontouchmove
            = element.ontouchcancel
            = function(event) {event.preventDefault()}
        return element
    }

    window.App = App
})()
