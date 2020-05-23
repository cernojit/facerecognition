const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'e7c4df1bc49e47b6b065e574a9b75743'
});

const handleImageUrl = (req, res) => {
	app.models
	  .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	  .then(data => {res.json(data)})
	  .catch(err => res.status(400).json('unable to get API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users')
  .where('id', '=', id)
  .increment('entries', 1)	
  .returning('entries')
  .then(entries => res.json(entries[0]))
  .catch(err => res.status(400).json('unable to get entries'))
};

module.exports = {
	handleImage,
	handleImageUrl
};