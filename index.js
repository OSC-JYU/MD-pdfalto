const Koa			= require('koa');
const Router		= require('koa-router');
const { koaBody }	= require('koa-body');
const multer 		= require('@koa/multer');
const json			= require('koa-json')
const path 			= require('path')
const fs 			= require('fs-extra')
const { v4: uuidv4 } = require('uuid');
const exec          = require("child_process").exec;

const util          = require("util");
const execPromise   = util.promisify(exec);

var app				= new Koa();
var router			= new Router();

app.use(json({ pretty: true, param: 'pretty' }))
app.use(koaBody());

const upload = multer({
	dest: './uploads/',
	fileSize: 1048576
});


// ******* ROUTES ************

router.get('/', function (ctx) {
	ctx.body = 'pdfalto API for MessyDesk'
})

router.post('/process', upload.fields([
    { name: 'request', maxCount: 1 },
    { name: 'content', maxCount: 1 }
  ]), async function (ctx) {

    let output = {response: {
        type: "stored",
        uri: []
    }}
    console.log(ctx.request.files)
    const requestFilepath = ctx.request.files['request'][0].path
    const contentFilepath = ctx.request.files['content'][0].path

    try {
        var dirname = uuidv4()
        await fs.mkdir(path.join('data', dirname))

	var requestJSON = await fs.readJSON(requestFilepath, 'utf-8')
	if(typeof requestJSON === 'string')
            requestJSON = JSON.parse(requestJSON)
	console.log(requestJSON.params)
        const task = requestJSON.params.task
        delete requestJSON.params.task
    
        if(task == 'pdf2alto') {
            await execPromise(`./pdfalto ${contentFilepath} data/${dirname}/alto.xml`)
            output.response.uri = [`/files/${dirname}/alto.xml`]
        } 

        await fs.unlink(contentFilepath)
        await fs.unlink(requestFilepath)
    } catch (e) {
        console.log(e.message)
        try {
            await fs.unlink(contentFilepath)
            await fs.unlink(requestFilepath)
        } catch(e) {
            console.log('Removing of temp files failed')
        }

    }
	ctx.body = output
})


router.get('/files/:dir/:file', async function (ctx) {
    var input_path = path.join('data', ctx.request.params.dir, ctx.request.params.file)
    const src = fs.createReadStream(input_path);
    ctx.set('Content-Disposition', `attachment; filename=${ctx.request.params.file}`);
    ctx.type = 'application/octet-stream';
    ctx.body = src
})


app.use(router.routes());

var set_port = process.env.PORT || 8500
var server = app.listen(set_port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log('md-pdfalto running at http://%s:%s', host, port)
})


// ******* ROUTES ENDS ************



 
/**
 * child_process.exec(command[, options][, callback])
 * command - Command to execute. You can have space separated arguments if the command accepts any args
 * options - You can give options like Environment variables required for the child process
 * callback - function which will be called with the output when the process terminates.
 *     error - If any errors are thrown during the process exception
 *     stdout - Any data that gets returned by the process
 *     stderr - Any error that is logged by the process
 */
