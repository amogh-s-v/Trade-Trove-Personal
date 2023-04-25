import express from "express"
import cors from "cors"
import mongoose from "mongoose"


const app = express()
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})
const User = new mongoose.model("User", userSchema)

const cartItemSchema = new mongoose.Schema({
    _id: { type: String },
    owner: String,
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, default: 1 },
    uploader: { type: String },
});
const CartItem = mongoose.model('CartItem', cartItemSchema);

const itemSchema = mongoose.Schema({
    title: String,
    image: String,
    description: String,
    price: Number,
    uploader: String
}, { timestamps: false })
const Item = mongoose.model('Item', itemSchema);

const orderSchema = mongoose.Schema({
    items: Array,
    buyer: String,
    address: String,
    country: String,
    pincode: String,
    contact: String,
    upi: String,
    price: Number,
}, { timestamps: true })
const Order = mongoose.model('Order', orderSchema);


app.get("/items", async (req, res) => {
    try {
        const item = await Item.find()

        res.status(200).json(item);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
})


app.post("/items", async (req, res) => {
    const item = new Item(req.body);
    try {
        console.log(item)
        await item.save();
        res.status(201).json(item);
    } catch (error) {
    }
})

app.post("/login", (req, res) => {
    const { email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successfull", user: user, success: 1 })
            } else {
                res.send({ message: "Password didn't match", success: 0 })
            }
        } else {
            res.send({ message: "User not registered", success: 0 })
        }
    })
})

app.post('/addtocart', async (req, res) => {
    const { product, user } = req.body;
    try {
        console.log(product._id);
        const exist = await CartItem.findOne({ _id: product._id });
        if (exist) {
            exist.qty += 1;
            await exist.save();
        } else {
            const newCartItem = new CartItem({ ...product });
            if (!newCartItem._id.endsWith("_" + user.name)){
                newCartItem._id = newCartItem._id.replace(/_[^_]*$/, "") + "_" + user.name;
            }
            newCartItem.owner = user.name;
            await newCartItem.save();
        }
        res.sendStatus(200);
    } catch (err) {
        console.error('Error handling cart request', err);
        res.sendStatus(500);
    }
});

app.post('/removefromcart', async (req, res) => {
    const { product, user } = req.body;
    try {
        const exist = await CartItem.findOne({  _id: product._id });
        if (exist.qty === 1) {
            await exist.remove();
        }
        else {
            exist.qty -= 1;
            await exist.save();
        }
        res.sendStatus(200);
    } catch (err) {
        console.error('Error handling cart request', err);
        res.sendStatus(500);
    }
});

app.post("/cart", async (req, res) => {
    const { user } = req.body;
    let cartitem;

    const getUser = new Promise((resolve, reject) => {
        if (user) {
            resolve(user);
        } else {
            reject('User not found');
        }
    });

    try {
        const fetchedUser = await getUser;
        console.log(fetchedUser.name);
        cartitem = await CartItem.find({ owner: user.name });
        res.status(200).json(cartitem);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: 'Error finding cart items.' });
    }
});



app.get('/getIMG', function (req, res) {
    res.sendFile('E:/Amogh/PES/Semester-VI/CC/Project/TradeTrove/delivery_app.png');
})

app.post('/order', async (req, res) => {
    const {order, totalPrice} = req.body;
    const orderdetails = new Order(order);
    try {
        orderdetails.price = totalPrice;
        await orderdetails.save();
        await CartItem.remove({ owner: orderdetails.buyer })
        res.status(201).json(orderdetails);
    } catch (error) {
    }
})

app.post('/orderhistory', async (req, res) => {
    const { user } = req.body;
    let orders;
    try {
        console.log(user.name)
        orders = await Order.find({ buyer: user.name });
        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
})

app.post("/register", (req, res) => {
    const { name, email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "User already registerd" })
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "Successfully Registered, Please login now." })
                }
            })
        }
    })

})

app.get('/contact', function (req, res) {
    res.sendFile('D:/Amogh/WT_Project/frontend/contact.html');
})


const mongodb = "mongodb://localhost:27017/TradeTrove";
const PORT = process.env.PORT || 9002;
mongoose.connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => app.listen(PORT, console.log(`Server running on ${PORT}`))).catch(err => console.log(err));