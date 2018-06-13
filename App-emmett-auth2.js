import React from 'react';
import { TouchableHighlight, Picker, ActivityIndicator, Keyboard, TouchableWithoutFeedback, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Button, View, Text } from 'react-native';
import { SwitchNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEntypo from 'react-native-vector-icons/Entypo';


console.disableYellowBox = true;

/**
 * A simple collection of products to use until we get them from the service.
 * @type {*[]}
 */
let products = [
    {'id':0, 'name':'Product 1', 'description':'p 1', 'price':1.00, 'pic':'https://images.yourstory.com/2016/08/125-fall-in-love.png'},
    {'id':1, 'name':'Product 2', 'description':'p 2', 'price':2.00, 'pic':'https://www.kullabs.com/uploads/Product-Review-Writing-Services.jpg'},
    {'id':2, 'name':'Product 3', 'description':'p 3', 'price':3.00, 'pic':'https://sloanreview.mit.edu/content/uploads/2017/08/MAG-FR-Oestreicher-Singer-Product-Recommendation-Viral-Marketing-Social-Media-Network-Ecommerce-1200-1200x627.jpg'},
    {'id':3, 'name':'Product 4', 'description':'p 4', 'price':4.00, 'pic':'http://www.analystconsult.com/wp-content/uploads/2015/10/Smart-Ways-to-Successfully-Launch-a-New-Product-analyst-consult.jpg'},
    {'id':4, 'name':'Product 5', 'description':'p 5', 'price':5.00, 'pic':'http://www.siyawoman.com/wp-content/uploads/2015/09/product.png'}
];

/**
 * Placeholders for the collections we retrieve from the services.
 * @type {Array}
 */
let categories = [];
let manufacturers = [];
let orders = [];
let category = "All";
let orderNumber = 0;
let joinRewards = false;
let currentUser = null;
const initialState = {
    //...
};
let baseURL = "http://schillingschoolpoc-test.us-east-1.elasticbeanstalk.com";

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userName:'',password:''}
    };
    doLogin() {
        fetch(baseURL + '/user/authenticate.json', {
            headers: {
                userName: this.state.userName,
                password: this.state.password
            }})
            .then((response) => response.json())
            .then((responseJson) => {

                currentUser = responseJson;

            })
            .catch((error) =>{
                console.error(error);
            });
    }
    render() {

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <Text>User Name</Text>
                    <TextInput
                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                        onChangeText={(text) => this.state.userName = text}
                        autoCapitalize='none'
                        value={this.state.userName}
                    />
                </View>
                <View>
                    <Text>Password</Text>
                    <TextInput
                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                        onChangeText={(text) => this.state.password = text}
                        autoCapitalize='none'
                        value={this.state.password}
                    />
                </View>
                <IconEntypo.Button name="box" backgroundColor="#3b5998" onPress={() => {this.doLogin(); this.props.navigation.navigate('Home')}}>Login</IconEntypo.Button>
                <IconEntypo.Button name="box" backgroundColor="#3b5998" onPress={() => this.props.navigation.navigate('Register')}>Register</IconEntypo.Button>
            </View>
        );
    }
}

class LogoutScreen extends React.Component {
    render() {

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <IconEntypo.Button name="box" backgroundColor="#3b5998" onPress={() => {currentUser = null; this.props.navigation.navigate('Home')}}>Logout</IconEntypo.Button>
            </View>
        );
    }
}

class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newUser: {
                "cardNumber": "4234123412341234",
                "userName": "jack_bubba",
                "expirationYear": 2022,
                "zipCode": "45152",
                "cardCode": 123,
                "state": "Ohio",
                "address": "1 Main St",
                "expirationMonth": 2,
                "city": "Morrow",
                "password": "xyzxyzxyz",
                "cardType": "Visa",
                "nameOnCard": "Jack Bubba",
                "email": "jack@bubba.com"
            }
        }
    };
    doRegister() {
        fetch(baseURL + '/user/save.json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.newUser)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson.movies;
            })
            .catch((error) => {
                console.error(error);
            });
        currentUser = this.state.newUser;
    };
    render() {

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Register</Text>
                <View>
                    <Text>User Name</Text>
                    <TextInput
                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                        onChangeText={(text) => this.state.newUser.userName = text}
                        value={this.state.newUser.userName}
                    />
                </View>
                <View>
                    <Text>Password</Text>
                    <TextInput
                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                        onChangeText={(text) => this.state.newUser.password = text}
                        value={this.state.newUser.password}
                    />
                    <Text>Email</Text>
                    <TextInput
                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                        onChangeText={(text) => this.state.newUser.email = text}
                        value={this.state.newUser.email}
                    />
                    <Text>Card Type</Text>
                    <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.newUser.cardType = text}
                    value={this.state.newUser.cardType}
                    placeholder="Visa, Discover, American Express, or Master Card"
                    />
                    <Text>Name on Card</Text>
                    <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.newUser.nameOnCard = text}
                    value={this.state.newUser.nameOnCard}
                    placeholder="First Name and Last Name"
                    />
                    <Text>Card Number</Text>
                    <TextInput
                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                        onChangeText={(text) => this.state.newUser.cardNumber = text}
                        value={this.state.newUser.cardNumber}
                        placeholder="Card Number"
                    />
                    <Text>Expiration Month</Text>
                    <TextInput
                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                        onChangeText={(text) => this.state.newUser.expirationMonth = text}
                        value={this.state.newUser.expirationMonth}
                        placeholder="Month"
                    />
                    <Text>Expiration Year</Text>
                    <TextInput
                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                        onChangeText={(text) => this.state.newUser.expirationYear = text}
                        value={this.state.newUser.expirationYear}
                        placeholder="Year"
                    />
                </View>
                <IconEntypo.Button name="login" backgroundColor="#3b5998" onPress={() => {this.doRegister(); this.props.navigation.navigate('Home')}}>Register</IconEntypo.Button>
            </View>
        );
    }
}

class ForgotScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = { isLoading: true}
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.itemTitle}>Too Bad!</Text>
                <IconEntypo.Button name="login" backgroundColor="#3b5998"
                                   onPress={() => this.props.navigation.navigate('LoginStack')}>Login</IconEntypo.Button>
            </View>
        )
    }
}
/**
 * Our home screen where we land when we open the app.
 */
class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true}
    }

    state = initialState;
    resetState = () => {
        this.setState(initialState);
    };

    // load the products from the service on start up of this page
    componentDidMount() {
        fetch(baseURL + '/product/index.json?max=100')
            .then((response) => response.json())
            .then((responseJson) => {

                products = responseJson;

            })
            .catch((error) => {
                console.error(error);
            });
        fetch(baseURL + '/category/index.json')
            .then((response) => response.json())
            .then((responseJson) => {

                categories = responseJson;

            })
            .catch((error) => {
                console.error(error);
            });
        fetch(baseURL + '/manufacturer/index.json')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false
                }, function () {
                });
                manufacturers = responseJson;

            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {


        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        const loggedInView = <View>
            <IconEntypo.Button name="login" backgroundColor="#3b5998" onPress={() => {
                currentUser = null;
                this.props.navigation.navigate('Logout')
            }}>Logout</IconEntypo.Button>
            <IconEntypo.Button name="box" backgroundColor="#3b5998"
                               onPress={() => this.props.navigation.navigate('ProductStack')}>Products</IconEntypo.Button>
            <IconEntypo.Button name="user" backgroundColor="#3b5998"
                               onPress={() => this.props.navigation.navigate('UserStack')}
            >User Info</IconEntypo.Button>

        </View>;
        const loggedOutView = <View>
            <IconEntypo.Button name="login" backgroundColor="#3b5998" onPress={() => {
                currentUser = {"username": "jackbubba", "password": "1234"};
                this.props.navigation.navigate('LoginStack')
            }}>Login</IconEntypo.Button>
            <IconEntypo.Button name="box" backgroundColor="#3b5998"
                               onPress={() => this.props.navigation.navigate('ProductStack')}>Products</IconEntypo.Button>
        </View>;

        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                {currentUser != null ? <Text style={styles.itemTitle}>{currentUser != null ? currentUser.username : ""}</Text> : ""}
                <Text style={styles.schillingTitle}>The Schilling Store</Text>
                <Image source={{uri: "http://www.schillingschool.org/wp-content/uploads/schilling-logo1.jpg"}}
                       style={{width: 250, height: 250}}/>
                <IconEntypo.Button name="info" backgroundColor="#3b5998"
                                   onPress={() => this.props.navigation.navigate('InfoStack')}>Info</IconEntypo.Button>
                {currentUser === null ? loggedOutView : loggedInView}
            </View>);
    }
}

class UserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true}
    }

    state = initialState;
    resetState = () => {
        this.setState(initialState);
    };


    render() {

        if(joinRewards === false) {


            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.schillingTitle}>The Schilling Store</Text>
                    <Image source={{uri: "http://www.schillingschool.org/wp-content/uploads/schilling-logo1.jpg"}}
                           style={{width: 250, height: 250}}/>
                    <Text style={styles.itemTitle}>{currentUser.name}</Text>
                    <Text style={styles.itemTitle}>Password:</Text>
                    <Text>{currentUser.password}</Text>
                    <Text style={styles.itemTitle}>E-mail:</Text>
                    <Text style={styles.item}>{currentUser.email}</Text>
                    <Text style={styles.itemTitle}>Not a Rewards Member</Text>
                    <Button style={{height: 50, width: 80}} title="Join Rewards"
                            color="#0FD862"
                            onPress={() => {
                                joinRewards = true;
                                this.resetState()
                            }}/>
                    <Text style={styles.itemTitle}>Credit Info:</Text>
                    <View style={styles.outerContainer}>
                        <Text style={styles.itemTitle}>Card Number:</Text>
                        <Text>{currentUser.cardNumber}</Text>
                    </View>
                    <View style={styles.outerContainer}>
                        <Text>Expiration Year:</Text>
                        <Text>{currentUser.expirationYear}</Text>
                        <Text>Expiration Month</Text>
                        <Text>{currentUser.expirationMonth}</Text>
                    </View>
                    <View style={styles.outerContainer}>
                        <Text>Code:</Text>
                        <Text>{currentUser.cardCode}</Text>
                        <Button style={{height: 50, width: 80}} title="Home"
                                color="#0FD862"
                                onPress={() => {
                                    this.props.navigation.navigate('HomeStack')
                                }}/>
                    </View>
                </View>
            );
        }
        if(joinRewards !== false) {


            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.schillingTitle}>The Schilling Store</Text>
                    <Image source={{uri: "http://www.schillingschool.org/wp-content/uploads/schilling-logo1.jpg"}}
                           style={{width: 250, height: 250}}/>
                    <Text style={styles.itemTitle}>{currentUser.name}</Text>
                    <Text style={styles.itemTitle}>Password:</Text>
                    <Text>{currentUser.password}</Text>
                    <Text style={styles.itemTitle}>E-mail:</Text>
                    <Text style={styles.item}>{currentUser.email}</Text>
                    <Text style={styles.itemTitle}>You are a Rewards Member</Text>
                    <Button style={{height: 50, width: 80}} title="Leave Rewards"
                            color="#0FD862"
                            onPress={() => {
                                joinRewards = false;
                                this.resetState()
                            }}/>
                    <Text style={styles.itemTitle}>Credit Info:</Text>
                    <View style={styles.outerContainer}>
                        <Text style={styles.itemTitle}>Card Number:</Text>
                        <Text>{currentUser.cardNumber}</Text>
                    </View>
                    <View style={styles.outerContainer}>
                        <Text>Expiration Year:</Text>
                        <Text>{expirationYear}</Text>
                        <Text>Expiration Month:</Text>
                        <Text>{expirationMonth}</Text>
                    </View>
                    <View style={styles.outerContainer}>
                        <Text>Code:</Text>
                        <Text>532932</Text>
                        <Button style={{height: 50, width: 80}} title="Home"
                                color="#0FD862"
                                onPress={() => {
                                    this.props.navigation.navigate('HomeStack')
                                }}/>
                    </View>
                </View>
            );
        }
    }
}

class ManufacturerScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sortBy: "Name"}
    }

    render() {


        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.itemTitle}> Our Manufacturers:</Text>
                <ScrollView>
                    {
                        manufacturers.map((manufacturer, index) =>
                            <TouchableOpacity key={manufacturer.id}
                                              onPress={() => this.props.navigation.navigate('Details', {id: manufacturer.id})}>
                                <View style={styles.item}>
                                    <View style={styles.outerContainer}>
                                        <Text style={styles.itemTitle}>{manufacturer.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </ScrollView>
                <Button title="Categories"
                        onPress={() => this.props.navigation.navigate('Category')}/>
                <Button title="Home"
                        onPress={() => this.props.navigation.navigate('HomeStack')}/>

            </View>

        );

    }
}

class CategoryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sortBy: "Name"}
    }

    render() {


        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.itemTitle}> Our Categories:</Text>
                <ScrollView>
                    {
                        categories.map((category, index) =>
                            <TouchableOpacity key={category.id}
                                              onPress={() => this.props.navigation.navigate('Details', {id: category.id})}>
                                <View style={styles.item}>
                                    <View style={styles.outerContainer}>
                                        <Text style={styles.itemTitle}>{category.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </ScrollView>
                <Button title="Manufacturers"
                        onPress={() => this.props.navigation.navigate('Manufacturer')}/>
                <Button title="Home"
                        onPress={() => this.props.navigation.navigate('HomeStack')}/>
            </View>

        );

    }
}

/**
 * Our Search Screen when we look for our product.
 */
class SearchScreen extends React.Component {
    constructor(props){
        super(props);
        this.state ={ sortBy: "Name"}
    }

    render() {
        products.sort((a,b) => {
            if (this.state.sortBy === "Category") {
                let aCat = categories.find((cat) => {return cat.id === a.category.id});
                let bCat = categories.find((cat) => {return cat.id === b.category.id});
                return aCat.name < bCat.name ? -1 : aCat.name > bCat.name ? 1 : 0
            } else if (this.state.sortBy === "Manufacturer") {
                let aMfg = manufacturers.find((mfg) => {return mfg.id === a.manufacturer.id});
                let bMfg = manufacturers.find((mfg) => {return mfg.id === b.manufacturer.id});
                return aMfg.name < bMfg.name ? -1 : aMfg.name > bMfg.name ? 1 : 0
            } else {
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
            }
        });
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Search Screen (sorted by {this.state.sortBy})</Text>
                <View style={styles.toolBar}>
                    <Button style={styles.toolButton} title="Name" onPress={() => this.setState({sortBy:"Name"})}/>
                    <Button style={styles.toolButton} title="Category" onPress={() => this.setState({sortBy:"Category"})}/>
                    <Button style={styles.toolButton} title="Manufacturer" onPress={() => this.setState({sortBy:"Manufacturer"})}/>
                    <Icon.Button name="shopping-cart" backgroundColor="#3b5998" onPress={() => this.props.navigation.navigate('Cart')}/>
                </View>
                {/*<Text>Category: {this.state.category}</Text>*/}
                {/*<Picker*/}
                {/*selectedValue={this.state.category}*/}
                {/*style={{ height: 50, width: 100 }}*/}
                {/*onValueChange={(itemValue, itemIndex) => this.setState({category: itemValue})}>*/}
                {/*<Picker.Item label="All" value="All"/>*/}
                {/*{*/}
                {/*categories.map((cat, index) =>*/}
                {/*<Picker.Item label={cat.name} value={cat.name} />*/}
                {/*)*/}
                {/*}*/}
                {/*</Picker>*/}
                // for each product, create a little view of it
                <ScrollView>
                    {
                        products.map((product, index) =>
                            <TouchableOpacity key={product.id} onPress={() => this.props.navigation.navigate('Details', {id:product.id})}>
                                <View style={styles.item}>
                                    <View style={styles.outerContainer}>
                                        <Image
                                            source={{uri:product.pic}} style={{width:100,height:80}}
                                        />
                                        <Text style={styles.itemTitle}>{product.name}</Text>
                                    </View>
                                    <Text>Category: {categories.find(function(item) {return item.id === product.category.id}).name}</Text>
                                    <Text>Made By: {manufacturers.find(function(item) {return item.id === product.manufacturer.id}).name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </ScrollView>
                <Button
                    title="Home"
                    onPress={() => this.props.navigation.navigate('HomeStack')}
                />
            </View>
        );
    }
}

/**
 * Our details screen.  Shows one product in detail.
 */
class DetailsScreen extends React.Component {
    addToCart(productId) {
        orders.push({
            "product": {
                "id": productId
            },
            "user": {
                "id": currentUser.id
            },
            "quantity": 1,
            "number": "KS" + orderNumber++,
        })
    }
    render() {
        const { params } = this.props.navigation.state;
        const id = params ? params.id : null;
        const product = products.find((prod) => {return prod.id === id});
        // for the product passed (as id) show more detail
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Details Screen</Text>
                <View style={styles.toolBar}>
                    <Icon.Button name="home" backgroundColor="#3b5998" onPress={() => this.props.navigation.navigate('HomeStack')}/>
                    <Icon.Button name="shopping-cart" backgroundColor="#3b5998" onPress={() => this.props.navigation.navigate('Cart')}/>
                </View>
                <Text>Name: {product.name}</Text>
                <Image source={{uri:product.pic}} style={{width:400,height:320}}/>
                <Text>Description: {product.description}</Text>
                <Text>Price: {product.price}</Text>
                <Button
                    title="Add to Cart"
                    onPress={() => {
                        this.addToCart(product.id)
                    }}
                />
                <Button
                    title="Cancel"
                    onPress={() => this.props.navigation.navigate('HomeStack')}
                />
            </View>
        );
    }
}

/**
 * The cart screen where we can purchase the product.
 */
class CartScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {quantity:1}
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Items in Cart: {orders.length}</Text>
                <View style={styles.toolBar}>
                    <Icon.Button name="home" backgroundColor="#3b5998" onPress={() => this.props.navigation.navigate('HomeStack')}/>
                </View>
                <ScrollView>
                    {
                        orders.map((productOrder, index) =>
                            <View key={productOrder.id} style={styles.item}>
                                <Text>Name: {products.find((prod) => {return prod.id === productOrder.product.id}).name}</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {id:product.id})}>
                                    <Image
                                        source={{uri:products.find((prod) => {return prod.id === productOrder.product.id}).pic}} style={{width:100,height:80}}
                                    />
                                </TouchableOpacity>
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss()} accessible={false}>
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                        keyboardType = 'numeric'
                                        onChangeText={(text) => productOrder.quantity = text}
                                        value={JSON.stringify(productOrder.quantity)}
                                    />
                                </TouchableWithoutFeedback>
                                <Text>Price: {products.find((prod) => {return prod.id === productOrder.product.id}).price}</Text>
                            </View>
                        )
                    }
                    <Button
                        title="Buy"
                        onPress={() =>
                        {
                            this.props.navigation.navigate('Purchase')
                        }
                        }
                    />
                </ScrollView>
            </View>
        );
    }
}

/**
 * The purchase screen where we input our payment information and complete the transaction.
 */
class PurchaseScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name:'name', cardNumber:'', expMo:'', expYear:'', code:''};
    }
    doPurchase() {
        orders.map((order, index) => {
            fetch('http://schilling-school-store-dev.us-east-1.elasticbeanstalk.com/productOrder/save.json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            })
        });
        orders = [];
    };
    render() {
        let purchase = {"name":"?"};
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Purchase Screen</Text>
                <View style={styles.toolBar}>
                    <Icon.Button name="home" backgroundColor="#3b5998" onPress={() => this.props.navigation.navigate('HomeStack')}/>
                    <Icon.Button name="shopping-cart" backgroundColor="#3b5998" onPress={() => this.props.navigation.navigate('Cart')}/>
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View>
                        <Text>Items: {orders.length}</Text>
                        <View style={styles.item}>
                            <View style={styles.outerContainer}>
                                <Text>Name on Card:</Text>
                                <TextInput
                                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                    onChangeText={(text) => this.setState({name:text})}
                                    value={this.state.name}
                                    placeholder={currentUser.nameOnCard}
                                />
                            </View>
                            <View style={styles.outerContainer}>
                                <Text>Card Number:</Text>
                                <TextInput
                                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                    onChangeText={(text) => this.setState({cardNumber:text})}
                                    value={this.state.cardNumber}
                                    placeholder={currentUser.cardNumber}
                                />
                            </View>
                            <View style={styles.outerContainer}>
                                <Text>Expiration (mm/yy):</Text>
                                <TextInput
                                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                    onChangeText={(text) => this.setState({expMo:text})}
                                    value={this.state.expMo}
                                    placeholder={currentUser.expirationMonth}
                                />
                                <TextInput
                                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                    onChangeText={(text) => this.setState({expYear:text})}
                                    value={this.state.expYear}
                                    placeholder={currentUser.expirationYear}
                                />
                            </View>
                            <View style={styles.outerContainer}>
                                <Text>Code:</Text>
                                <TextInput
                                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                    onChangeText={(text) => this.setState({code:text})}
                                    value={this.state.code}
                                    placeholder={currentUser.cardCode}
                                />
                            </View>
                        </View>
                        <Button
                            title="Purchase"
                            onPress={() =>
                            {
                                this.doPurchase(),
                                    this.props.navigation.navigate('HomeStack')
                            }
                            }
                        />
                        <Button
                            title="Home"
                            onPress={() => this.props.navigation.navigate('HomeStack')}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

/**
 * The stack for purchasing a product.
 */
const ProductStack = StackNavigator(
    {
        Search: {
            screen: SearchScreen,
        },
        Details: {
            screen: DetailsScreen,
        },
        Cart: {
            screen: CartScreen,
        },
        Purchase: {
            screen: PurchaseScreen,
        },
    },
    {
        initialRouteName: 'Search',
    }
);

const ForgotStack = StackNavigator(
    {
        Forgot: {
            screen: ForgotScreen,
        }
    },
    {
        initialRouteName: 'Forgot',
    }
);
const LoginStack = StackNavigator(
    {
        Login: {
            screen: LoginScreen,
        },
        Register: {
            screen: RegisterScreen,
        }
    },
    {
        initialRouteName: 'Login',
    }
);
/**
 * The stack for our home.
 */
const HomeStack = StackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        Logout: {
            screen: LogoutScreen,
        }
    },
    {
        initialRouteName: 'Home',
    }
);

const UserStack = StackNavigator(
    {
        UserInfo: {
            screen: UserScreen,
        }
    },
    {
        initialRouteName: 'UserInfo'
    }
);

const InfoStack = StackNavigator(
    {
        Manufacturers: {
            screen: ManufacturerScreen,
        },
        Category: {
            screen: CategoryScreen,
        },
    },
    {
        initialRouteName: 'Manufacturers',
    }
);
/**
 * For switching between home and products.
 */
const RootStack = SwitchNavigator(
    {
        HomeStack: HomeStack,
        InfoStack: InfoStack,
        ForgotStack: ForgotStack,
        LoginStack: LoginStack,
        UserStack: UserStack,
        ProductStack: ProductStack
    },
    {
        initialRouteName: 'HomeStack'
    }
);

/**
 * Basic setup of our app
 */
export default class App extends React.Component {
    render() {
        return <RootStack />;
    }
}

/**
 * Some lovely styling.
 */
export const styles = StyleSheet.create ({
    item: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 0,
        margin: 2,
        borderColor: '#2a4944',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    outerContainer: {
        paddingTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    schillingTitle: {
        fontSize: 80,
        fontWeight: 'bold',
    },
    container: {
        paddingTop: 5
    },
    toolButton: {
        backgroundColor: 'green',
        width: '40%',
        height: 40
    },
    toolBar: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1
    },
    submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        margin: 15,
        height: 40,
    },
    submitButtonText:{
        color: 'white'
    }
})