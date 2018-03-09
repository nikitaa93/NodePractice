//use packages to be used

let express    = require('express');
let app        = express();
let bodyParser = require('body-parser');
let User       = require('./app/models/user')
let  validator = require('validator');



// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



//connecting to monggose databse

let mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/UserDB')
.then(function(res){
    console.log(res)
})


//setting port
let port       = process.env.PORT || 8085;
let router     = express.Router();

router.use((req,res,next)=>{
    console.log("Middleware");
    next();
});


router.get('/',(req,res)=>{
    res.json({ message : "Welcome "});
});



router.route('/users')

    // create a user (accessed at POST http://localhost:8085/api/users)
    //Task1 : saving data into databse
    .post((req, res) => {
        var user = new User();      // create a new instance of the user model
        user.name = req.body.name;
        user.email = req.body.email;
        user.username = req.body.username;
        user.save(
             (err) => {
             if (err){
                 res.json({
                    status: "error",
                    message : err

                })
               
            }else{
                res.json({
                    status : "ok",
                    data   : 'Unique id of user created by mongo'
                })
                
            }

            
         });

        

    })

    .get((req, res)=> {
        User.find((err, users) => {
            if (err)
                res.send(err);

            res.json(users);
        });
    });


    router.route('/users/:user_id')
    // get the user with that id (accessed at GET http://localhost:8085/api/users/:user_id)
    //Task2 - Display user details by ID
    .get((req, res)=> {
        User.findById(req.params.user_id, (err, user)=> {

            if (err)
                res.json({
                    status: "error",
                    message : err

                });

            //user.name = req.body.name;
            res.json({
                status : 'ok',
                message : user
            }
            )
        });
    })


    // update the user with this id (accessed at PUT http://localhost:8085/api/users/:user_id)
    //Task3 - Update user's name only
    .put((req, res)=> {

        // use our user model to find the user we want
        User.findById(req.params.user_id, (err, user)=> {

            if (err){
                res.json({
                    status: "error",
                    message : err

                });
            }
            
            
            //Validation for Only name can be updated
            if(req.body.email.length>0||req.body.username.length>0){
                res.json({
                    status: 'error',
                    message : 'Only name can be updated'

                });
            }

            user.name = req.body.name;  // update the users info
              

            // save the user
            user.save(function(err) {
                if (err){
                    res.json({
                        status: "error",
                        message : err

                    });
                }
                res.json({
                    status: "ok",
                    data : user._id,
                    message : user
                }
                );
               
            });

        })
    })
    
    //Task4
    .delete((req,res)=>{

        User.remove({
                _id:req.params.user_id
            },(err,bear)=>{
            if (err)
                res.send(err);

                res.json({
                    status: "error",
                    data : null,
                    message : 'Successfully Deleted'
                });
        });
    })
 

app.use('/api',router);

app.listen(port);
console.log(port);

