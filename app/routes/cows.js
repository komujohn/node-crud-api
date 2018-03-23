/**
 * Holds the defination of the cows routes
 */

const jwt = require('jsonwebtoken');
const token_key = 'verySecretKey';

var mongoObjectID = require('mongodb').ObjectID

module.exports = function (app, db) {

    /**
     * Accepts the username and password.
     * Returns a JTW token and the list of available routes
     * TODO validate the login detail
     */
    app.post('/', (req, res) => {
        //Mock user cowObject received from post.
        //Save token locally and add to Header Bearer <token> in subsequent API calls
        //accepts POST

        if (typeof(req.body.username) === undefined || typeof(req.body.password) === undefined) {
            res.json({
                error: 'Both username and password are required. Ensure Content-Type is application/x-www-form-urlencoded'
            });
            return;
        }


        //generate the JWT token
        jwt.sign(req.body, token_key, (err, token) => {
            res.json({
                token,
                routes: [
                    {path: '/cows', description: 'lists all the cows', 'methods': 'get'}
                ]
            })
        })
    })

    /**
     * Creates a new cow object
     * accepts POST
     */
    app.post('/cows', verifyToken, (req, res) => {
        jwt.verify(req.token, token_key, (err, authData) => {
            if (err) {
                res.json({
                    error: 'Could not verify your token.Regenerate the token and try again'
                })
            } else {
                //check required parameters
                if (typeof(req.body.name) === undefined || typeof(req.body.age) === undefined || typeof(req.body.production) === undefined || typeof(req.body.weight) === undefined) {
                    res.send({'error': 'Ensure Content-Type is application/x-www-form-urlencoded.name,age,production,weight fields are required '})
                }
                else{
                    var Cow = {
                        name: req.body.name,
                        age: req.body.age,
                        production: req.body.production,
                        weight: req.body.weight
                    };
                    db.collection('cows').insert(Cow, (err, result) => {
                        if (err) {
                            res.send({'error': 'There was an error, contact admin'})
                        } else {
                            res.send(result.ops[0])
                        }
                    })
                }
            }
        })
    })

    /**
     * Get the cow By ID
     * accepts GET
     */
    app.get('/cows/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, token_key, (err, authData) => {
            if (err) {
                res.json({
                    error: 'Could not verify your token.Regenerate the token and try again'
                })
            } else {

                db.collection('cows').findOne( {'_id': new mongoObjectID(req.params.id)}, (err, item) => {
                    if (err) {
                        res.send({'error': 'There was an error, contact admin'})
                    } else {
                        res.send(item)
                    }
                })
            }
        })
    })
    /**
     * List all cos
     * accepts GET
     */
    app.get('/cows', verifyToken, (req, res) => {
        jwt.verify(req.token, token_key, (err, authData) => {
            if (err) {
                res.json({
                    error: 'Could not verify your token.Regenerate the token and try again'
                })
            } else {
                db.collection('cows').find().toArray((err, cows) => {
                    if (err) {
                        res.send({'error': 'There was an error, contact admin'})
                    } else {
                        res.send(cows)
                        console.log(cows)
                    }
                })
            }
        })
    })

    /**
     * Delete cow by object ID
     * accepts DELETE
     *
     */
    app.delete('/cows/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, token_key, (err, authData) => {
            if (err) {
                res.json({
                    error: 'Could not verify your token.Regenerate the token and try again'
                })
            } else {
                var id = req.params.id;
                var cowObject = {'_id': new mongoObjectID(id)};
                db.collection('cows').remove(cowObject, (err, item) => {
                    if (err) {
                        res.send({'error': 'There was an error, contact admin'})
                    } else {
                        res.send(Cow.name + ' deleted ')
                    }
                })
            }
        })
    })

    /**
     * Update Cow by object ID
     * accepts PUT
     */
    app.put('/cows/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, token_key, (err, authData) => {
            if (err) {
                res.json({
                    error: 'Could not verify your token.Regenetate the token and try again'
                })
            } else {
                var id = req.params.id;
                var cowObject = {'_id': new mongoObjectID(id)};
                var Cow = {
                    name: req.body.name,
                    age: req.body.age,
                    production: req.body.production,
                    weight: req.body.weight
                };
                db.collection('cows').update(cowObject, Cow, (err, item) => {
                    if (err) {
                        res.send({'error': 'There was an error, contact admin'})
                    } else {
                        res.send( Cow.name + ' updated! ')
                    }
                })
            }
        })
    })

    function absoluteURl(theURl) {
        return url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.originalUrl,
        });
    }
    function verifyToken(req, res, next) {
        var bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(' ');
            var bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        }
        else {

            res.json({
                error: 'You dont have an the correct access token. Generate one and retry'
            })
        }
    }
}