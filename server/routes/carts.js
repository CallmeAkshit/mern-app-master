const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const UserCredential = require('../models/user-credential');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Cart = require('../models/cart');

//Get a cart
router.get('/me',(req,res) => {
    if (!req.body) {
        res.status(400).send({error: "Empty body sent in request"});
        return;
    }
    const sessionId = req.session.id;
    Cart.findOne({ sessionId: sessionId }).then(cart => {
        if(cart)
        {
            res.status(201).send(cart);
        }
        else
        {
            res.status(201).send({result:'No cart'});
        }
        
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
    const {cartItem } = req.body;
    const sessionId = req.session.id;
    if (!sessionId) {
        res.status(400).send({error: "sessionId not present in request"});
        return;
    }

    if (!cartItem) {
        res.status(400).send({error: "cartItems not present in request"});
        return;
    }

    Cart.findOne({ sessionId }).then( cart => {
        //if cart already exists
        if (cart) 
        {
            console.log('Cart already exists');
            cart.cartItems.push(cartItem);
            cart.totalAmount = cart.totalAmount + cartItem.qty*cartItem.pricePerUnit;
            cart.save().then(() => {
                res.status(201).send('Item Added to cart');
            }).catch(() => {
                res.status(500).send("Error while adding item to cart" );
            });
            
            return;
        }

       //if cart doesn't exist
        const cartEntity = new Cart({ sessionId, cartItems: cartItem, totalAmount:cartItem.qty*cartItem.pricePerUnit});

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
    const sessionId = req.session.id;
    const { productId, qty} = req.body;
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
            var oldQty ;
            for (let i = 0; i < cart.cartItems.length; i++) { 
                if(cart.cartItems[i].productId === productId)
                {
                    oldQty = cart.cartItems[i].qty;
                    console.log(oldQty);
                    cart.cartItems[i].qty = qty;
                    cart.totalAmount = cart.totalAmount + cart.cartItems[i].qty*cart.cartItems[i].pricePerUnit - oldQty*cart.cartItems[i].pricePerUnit;
                    
                }
              }
            console.log(cart.cartItems);
            cart.save().then(() => {
                res.status(204).send({result:'Item updated to cart'});
            }).catch((err) => {
                res.status(500).send(err);
            });
            
            return;
        }
        else
        {
            res.send({error:'Invalid Session Id passed'});
        }
        
    })

})
//Remove an item from Cart DELETE /api/cart/<item-id>
router.delete('/', (req, res) => {
    if (!req.body) {
        res.status(400).send({error: "Empty body sent in request"});
        return;
    }
    const sessionId = req.session.id;
    const { productId } = req.body;

    if (!sessionId) {
        res.status(400).send({error: "sessionId not present in request"});
        return;
    }

    if (!productId) {
        res.status(400).send({error: "productId not present in request"});
        return;
    }

    Cart.findOne({ sessionId }).then( cart => {
        //if cart already exists
        if (cart) 
        {
            for (let i = 0; i < cart.cartItems.length; i++) { 
                if(cart.cartItems[i].productId === productId)
                {
                    cart.totalAmount = cart.totalAmount  - cart.cartItems[i].qty*cart.cartItems[i].pricePerUnit;
                    cart.cartItems[i].remove();
                }
              }
            console.log('Cart Item deleted');
            cart.save().then(() => {
                res.status(201).send({result:'Item deleted from cart'});
            }).catch(() => {
                res.status(500).send({error:"Error while adding item to cart" });
            });
           
            return;
        }

        else
        {
            res.send({error:'Invalid Session Id passed'});
        }
    }).catch(() => {
        res.status(500).send({ error: "Internal Server Error" });
    });
    return;
})

    
//     return;
// })

module.exports = router;