(function() {
    "use strict"

    function ImageRepository(files) {
        this.files = files
        this.promises = []
        this.eachLoadHandle = null
        this.data = {}
    }

    ImageRepository.prototype._loadByFileName = function(key, fileName) {
        if (/\.gif$/.test(fileName)) {
            var xhr = new XMLHttpRequest()
            xhr.open('GET', fileName)
            xhr.responseType = 'arraybuffer'
            var that = this
            return new Promise((function(resolve, reject) {
                xhr.onload = (function () {
                    var reader = new GifReader(new Uint8Array(xhr.response))
                    return resolve(this._onImageLoad(reader, key))
                }).bind(that)
                xhr.onabort = function (event) {
                    reject(event)
                }
                xhr.send()
            }))
        }
        return new Promise((function(resolve, reject) {
            var image = new Image()
            image.setAttribute('src', fileName)
            image.onload = (function() {
                return resolve(this._onImageLoad(image, key))
            }.bind(this))
            image.onabort = (function(event) {
                reject(event)
            }.bind(this))
        }).bind(this))
    }

    ImageRepository.prototype._onImageLoad = function(image, key) {
        if (typeof(this.eachLoadHandle) === 'function') {
            this.eachLoadHandle(image, key)
        }
        this.data[key] = image
        return image
    }

    ImageRepository.prototype.attach = function(key, fileName) {
        this.promises.push(this._loadByFileName(key, fileName))
    }

    ImageRepository.prototype.onEachLoaded = function(callback) {
        this.eachLoadHandle = callback
    }

    ImageRepository.prototype.load = function() {
        for (var key in this.files) {
            var fileName = this.files[key]
            this.attach(key, fileName)
        }
        var data = this.data
        return Promise.all(this.promises).then(function(images) {
            return data
        })
    }

    ImageRepository.prototype.get = function (key) {
        return this.data[key]
    }

    window.ImageRepository = ImageRepository
})()
