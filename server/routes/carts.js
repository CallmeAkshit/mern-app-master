const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const UserCredential = require('../models/user-credential');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Cart = require('../models/cart');

//Get a cart
router.get('/sessions/:sessionid',(req,res) => {
    if (!req.body) {
        res.status(400).send({error: "Empty body sent in request"});
        return;
    }
    const sessionId = req.params.sessionid;
    Cart.findOne({ sessionId: sessionId }).then(cart => {
        res.send(cart);
    }).catch(() => {
        res.status(500).send({ error: "Internal Server Error" });
    });
})
//Add a new product to Cart
router.post('/', (req, res) => {
    if (!req.body) {
        res.status(400).send({error: "Empty body sent in request"});
        return;
    }
    const { sessionId, cartItems } = req.body;

    if (!sessionId) {
        res.status(400).send({error: "sessionId not present in request"});
        return;
    }

    if (!cartItems) {
        res.status(400).send({error: "cartItems not present in request"});
        return;
    }

    Cart.findOne({ sessionId }).then( cart => {
        //if cart already exists
        if (cart) 
        {
            console.log('Cart already exists');
            cart.cartItems.push(cartItems);
            cart.save().then(() => {
                res.status(204).send('Item Added to cart');
            }).catch(() => {
                res.status(500).send("Error while adding item to cart" );
            });
            // const updateQuery = {$push: cartItems};
            // console.log(updateQuery);
            // Cart.updateOne({ sessionId: sessionId }, updateQuery).save().then(() => {
            //     res.status(204).send('Item Added to cart');
            // }).catch(() => {
            //     res.status(500).send("Error while adding item to cart" );
            // });
    
            // Cart.updateOne(
            //     {sessionId: sessionId},
            //     {
            //       $push: {
            //           Pair: cartItems
            //       }  
            //     }
            // ),
            // (err, result)=>
            // {
            //     if(err)
            //     {
            //         console.log(err);
            //         res.status(400).send('Error while adding item to cart');
            //     }
            //     else
            //     {
            //         res.status(201).send('Item Added to cart');
            //     }
            // }
            //cart.cartItems = cartItems;
            // cart.save().then(() => {console.log("Cart Item added in DB");})
            // .then(() => {
            //     res.status(201).send({ id: sessionId });})
            return;
        }

       //if cart doesn't exist
        const cartEntity = new Cart({ sessionId, cartItems});

        cartEntity.save().then(() => {
            res.status(201).send({ id: sessionId });

        });
    }).catch(() => {
        res.status(500).send({ error: "Internal Server Error" });
    });
})

//Update an existing product in Cart
router.put('/',(req,res) =>
{
    if (!req.body) {
        res.status(400).send({error: "Empty body sent in request"});
        return;
    }
    const { sessionId, productId, qty} = req.body;
    if (!sessionId) {
        res.status(400).send({error: "sessionId not present in request"});
        return;
    }

    if (!productId) {
        res.status(400).send({error: "productId not present in request"});
        return;
    }
    if (!qty) {
        res.status(400).send({error: "qty not present in request"});
        return;
    }
    Cart.findOne({ sessionId }).then( cart => 
    {   
        if (cart) 
        {
            //console.log(cart.cartItems[0].productId);

            for (let i = 0; i < cart.cartItems.length; i++) { 
                if(cart.cartItems[i].productId === productId)
                {
                    cart.cartItems[i].qty = qty;
                }
              }
            console.log(cart.cartItems);
            cart.save().then(() => {
                res.status(204).send('Item updated to cart');
            }).catch((err) => {
                res.status(500).send(err);
            });
            // const updateQuery = {'$set':{'cartItems': JSON.stringify(cart)} };
            // Cart.updateOne({ 'sessionId': sessionId }, updateQuery).then(() => {
            //     res.status(204).send('Item updated to cart');
            // }).catch((err) => {
            //     res.status(500).send(err);
            // });
            // Cart.updateOne(
            //     {productId: productId},
            //     {
            //       $set: {
            //           qty: qty
            //       }  
            //     }
            // ),
            // (err, result)=>
            // {
            //     if(err)
            //     {
            //         console.log(err);
            //         res.status(400).send('Error while updating quantity of item in cart');
            //     }
            //     else
            //     {
            //         res.status(201).send('Item qty updated to cart');
            //     }
            // }
            // cart.save().then(() => {
            //     console.log("Cart Item added in DB");
            // })
            // .then(() => {
            //     res.status(201).send({ id: sessionId });
            // })
            return;
        }
        else
        {
            res.send('Invalid Session Id passed');
        }
        
    })

})
// //Remove an item from Cart DELETE /api/cart/<item-id>
// router.delete('/', (req, res) => {
//     if (!req.body) {
//         res.status(400).send({error: "Empty body sent in request"});
//         return;
//     }
//     const { sessionId, productId } = req.body;

//     if (!sessionId) {
//         res.status(400).send({error: "sessionId not present in request"});
//         return;
//     }

//     if (!productId) {
//         res.status(400).send({error: "productId not present in request"});
//         return;
//     }

//     Cart.updateOne( // select your doc in moongo
//         { sessionId: sessionId}, // your query, usually match by _id
//         { $remove: { results: { $elemMatch: { productId: productId } } } }, // item(s) to match from array you want to pull/remove
//         { multi: true } // set this to true if you want to remove multiple elements.
//     ).then(cart => {
//         cart.save().then(() => {
//             console.log("Product Removed");
//         })
//     }).then(() => {
//         res.status(201).send({ id: sessionId });
//     })
    
//     return;
// })

module.exports = router;