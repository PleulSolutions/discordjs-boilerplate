const CustomCronJob = require("../classes/CustomCronJob");

class MorningCronJob extends CustomCronJob{
    constructor(){
        super('00', '00', '9', func)
    }
}

function func() {
    console.log("asdbhasdlkiasd");
}

module.exports = MorningCronJob;