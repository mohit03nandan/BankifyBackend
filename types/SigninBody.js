const zod = require("zod");


const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})


module.exports = signinBody;