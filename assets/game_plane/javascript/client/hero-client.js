(function() {
    "use strict"

    /**
     * background client
     * @param id
     * @param canvas
     * @constructor
     *
     * @extends {AbstructClient}
     */
    function HeroClient(id, canvas) {
        AbstructClient.call(this, id, canvas)
        var imageRepository = app.get('imageRepository')
        this.image = imageRepository.get('hero')
        console.log(this.image)
    }

    extend(HeroClient, AbstructClient)

    window.HeroClient = HeroClient
})()
