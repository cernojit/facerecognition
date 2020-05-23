

const handleRegister = ( req, res, db, bcrypt) => {
	const { name, password, email } = req.body;
	if( !name || !password || !email) {
		return res.status(400).json('Some fields left blank')
	}
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
				name: name,
				email: loginEmail[0],
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback) // in case anything fails it rollback the changes
	})
	.catch(err => res.status(400).json('Unable to register.'))	
};

module.exports = {
	handleRegister: handleRegister
};