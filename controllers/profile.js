const handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('no matching user')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
}

const handleProfileNameUpdate = (req, res, db) => {
    const { id } = req.params;
    const { name } = req.body.formInput
    db('users')
        .where({ id })
        .update({ name })
        .then(resp => {
            if (resp) {
                res.json("success")
            } else {
                res.status(400).json("Unable to update")
            }
        })
        .catch(err => res.status(400).json("Error updating user"))
}

const handleProfilePictureUpdate = (req, res, db) => {
    const { id } = req.params;
    const { profile_picture_url } = req.body
    db('users')
        .where({ id })
        .update({ profile_picture_url })
        .then(resp => {
            if (resp) {
                res.json("success")
            } else {
                res.status(400).json("Unable to update")
            }
        })
        .catch(err => res.status(400).json("Error updating user"))
}

module.exports = {
    handleProfileGet,
    handleProfileNameUpdate,
    handleProfilePictureUpdate
}