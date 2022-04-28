const Clarifai = require('clarifai')

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.API_CLARIFAI}`);

const models = {
    face: 'a403429f2ddf4b49b307e318f00e528b',
    celebrity: 'e466caa0619f444ab97497640cefc4dc',
    general: 'aaa03c23b3724a16a56b629203edc62c',
    color: 'eeed0b6733a644cea07cf4c60f87ebb7',
    food: 'bd367be194cf45149e75f01d59f77ba7'
}

const handleApiCall = (req, res) => {
    if (req.body.mode === 'demographics') {
        stub.PostWorkflowResults(
            {
                workflow_id: "Demographics",
                inputs: [{data: {image: {url: req.body.input}}}]
            },
            metadata,
            (err, response) => {
                if (err) {
                    res.status(400).json('unable to work with API')
                }
                else {
                    res.json(response)
                }
            }
        )
    } else {
        stub.PostModelOutputs(
            {
                model_id: models[req.body.mode],
                inputs: [{data: {image: {url: req.body.input}}}]
            },
            metadata,
            (err, response) => {
                if (err) {
                    res.status(400).json('unable to work with API')
                }
                else {
                    res.json(response)
                }
            }
        )
    }
}

const handleImage = (req, res, db) => {
    const { id } = req.body
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}