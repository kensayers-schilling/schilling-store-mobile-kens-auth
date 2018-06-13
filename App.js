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
let tSortBy = "Name"
let currentUser = null;
let baseURL = "http://schillingschoolpoc-test.us-east-1.elasticbeanstalk.com/";
// let baseURL = "http://localhost:8080";

/**
 * Our home screen where we land when we open the app.
 */
class HomeScreen extends React.Component {

    constructor(props){
        super(props);
        this.state ={ isLoading: true}
    }

    // load the products from the service on start up of this page
    componentDidMount(){
        fetch(baseURL + '/product/index.json?max=100')
            .then((response) => response.json())
            .then((responseJson) => {

                products = responseJson;

            })
            .catch((error) =>{
                console.error(error);
            });
        fetch(baseURL + '/category/index.json')
            .then((response) => response.json())
            .then((responseJson) => {

                categories = responseJson;

            })
            .catch((error) =>{
                console.error(error);
            });
        fetch(baseURL + '/manufacturer/index.json')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false
                }, function(){
                });
                manufacturers = responseJson;

            })
            .catch((error) =>{
                console.error(error);
            });
    };

    render() {
        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        const loggedInView = <View>
            <IconEntypo.Button name="box" backgroundColor="#3b5998" onPress={() => {currentUser = null; this.props.navigation.navigate('Logout')}}>Logout</IconEntypo.Button>
            <IconEntypo.Button name="box" backgroundColor="#3b5998" onPress={() => this.props.navigation.navigate('ProductStack')}>Products</IconEntypo.Button>
            <IconEntypo.Button name="box" backgroundColor="#3b5998" onPress={() => this.props.navigation.navigate('Profile')}>Profile</IconEntypo.Button>
        </View>;
        const loggedOutView = <View>
            <IconEntypo.Button name="box" backgroundColor="#3b5998" onPress={() => {currentUser = {"username":"jackbubba", "password":"1234"}; this.props.navigation.navigate('Login')}}>Login</IconEntypo.Button>
            <IconEntypo.Button name="box" backgroundColor="#3b5998" onPress={() => this.props.navigation.navigate('Register')}>Register</IconEntypo.Button>
        </View>;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {currentUser != null ? <Text>{currentUser != null ? currentUser.userName : ""}</Text> : ""}
                <Image source={{uri:"http://www.schillingschool.org/wp-content/uploads/schilling-logo1.jpg"}} style={{width:250,height:250}}/>
                {currentUser === null ? loggedOutView : loggedInView}
            </View>
        );
    }
}

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

class ProfileScreen extends React.Component {
    render() {
        return(
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text> User Name: {currentUser.userName} </Text>
                <Text> Password: {currentUser.password} </Text>
                <Text> Email: {currentUser.email} </Text>
                <Text> Address: {currentUser.address} </Text>
                <Text> City: {currentUser.city} </Text>
                <Text> State: {currentUser.state} </Text>
                <Text> Zip Code: {currentUser.zipCode} </Text>
                <Text> Name On Card: {currentUser.nameOnCard} </Text>
                <Text> Card Number: {currentUser.cardNumber} </Text>
                <Text> Expiration Date: {currentUser.expirationMonth}/{currentUser.expirationYear} </Text>
                <Text> Card Type: {currentUser.cardType} </Text>
                <Text> Card Code: {currentUser.cardCode} </Text>
                <Button
                    title="Home"
                    onPress={() => this.props.navigation.navigate('Home')}
                />
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
                <ScrollView>
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
                    </View>
                    <View>
                        <Text>Card Number</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.cardNumber = text}
                            value={this.state.newUser.cardNumber}
                        />
                    </View>
                    <View>
                        <Text>Expiration Year (yyyy)</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.expirationYear = text}
                            value={this.state.newUser.expirationYear}
                        />
                    </View>
                    <View>
                        <Text>Expiration Month (mm)</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.expirationMonth = text}
                            value={this.state.newUser.expirationMonth}
                        />
                    </View>
                    <View>
                        <Text>Card Type</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.cardType = text}
                            value={this.state.newUser.cardType}
                        />
                    </View>
                    <View>
                        <Text>Card Code</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.cardCode = text}
                            value={this.state.newUser.cardCode}
                        />
                    </View>
                    <View>
                        <Text>Name on Card</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.nameOnCard = text}
                            value={this.state.newUser.nameOnCard}
                        />
                    </View>
                    <View>
                        <Text>Address</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.address = text}
                            value={this.state.newUser.address}
                        />
                    </View>
                    <View>
                        <Text>City</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.city = text}
                            value={this.state.newUser.city}
                        />
                    </View>
                    <View>
                        <Text>State</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.state = text}
                            value={this.state.newUser.state}
                        />
                    </View>
                    <View>
                        <Text>Zip Code</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.zipCode = text}
                            value={this.state.newUser.zipCode}
                        />
                    </View>
                    <View>
                        <Text>Email</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.newUser.email = text}
                            value={this.state.newUser.email}
                        />
                    </View>
                </ScrollView>
                <IconEntypo.Button name="box" backgroundColor="#3b5998" onPress={() => {this.doRegister(); this.props.navigation.navigate('Home')}}>Register</IconEntypo.Button>
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
    }

    render() {
        this.state ={ sortBy:tSortBy};
        products.sort((a,b) => {
            if (this.state.sortBy === "Category A-Z") {
                let aCat = categories.find((cat) => {return cat.id === a.category.id});
                let bCat = categories.find((cat) => {return cat.id === b.category.id});
                return aCat.name < bCat.name ? -1 : aCat.name > bCat.name ? 1 : 0
            } else if (this.state.sortBy === "Manufacturer A-Z") {
                let aMfg = manufacturers.find((mfg) => {return mfg.id === a.manufacturer.id});
                let bMfg = manufacturers.find((mfg) => {return mfg.id === b.manufacturer.id});
                return aMfg.name < bMfg.name ? -1 : aMfg.name > bMfg.name ? 1 : 0
            } else if (this.state.sortBy === "Category Z-A") {
                let aCat = categories.find((cat) => {return cat.id === a.category.id});
                let bCat = categories.find((cat) => {return cat.id === b.category.id});
                return aCat.name < bCat.name ? 1 : aCat.name > bCat.name ? -1 : 0
            } else if (this.state.sortBy === "Manufacturer Z-A") {
                let aMfg = manufacturers.find((mfg) => {return mfg.id === a.manufacturer.id});
                let bMfg = manufacturers.find((mfg) => {return mfg.id === b.manufacturer.id});
                return aMfg.name < bMfg.name ? -1 : aMfg.name > bMfg.name ? 1 : 0
            } else if (this.state.sortBy === "Price H-L") {
                return a.price < b.price ? 1 : a.price > b.price ? -1 : 0
            } else if (this.state.sortBy === "Price L-H") {
                return a.price < b.price ? -1 : a.price > b.price ? 1 : 0
            } else if (this.state.sortBy === "Name Z-A") {
                return a.name < b.name ? 1 : a.name > b.name ? -1 : 0
            } else {
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
            }
        });
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Search Screen (sorted by {this.state.sortBy})</Text>
                <View style={styles.toolBar}>
                    <Button style={styles.toolButton} title="Filters" onPress={() => this.props.navigation.navigate('FilterStack')}/>
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
                            <View key={product.id} style={styles.item}>
                                <Text>Name: {product.name}</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {id:product.id})}>
                                    <Image
                                        source={{uri:product.pic}} style={{width:100,height:80}}
                                    />
                                </TouchableOpacity>
                                <Text>Category: {categories.find(function(item) {return item.id === product.category.id}).name}</Text>
                                <Text>Manufacturer: {manufacturers.find(function(item) {return item.id === product.manufacturer.id}).name}</Text>
                                <Text>Price: ${product.price}</Text>
                                <Button
                                    title="Details"
                                    onPress={() => this.props.navigation.navigate('Details', {id:product.id})}
                                />
                            </View>
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
                <Text>Price: ${product.price}</Text>
                <Button
                    title="Add to Cart"
                    onPress={() => {
                        this.addToCart(product.id)
                        this.props.navigation.navigate('Cart')
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


class FilterScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text> Modify your search by changing your filter </Text>
                <Button title="Name A-Z" onPress= {() =>{
                    this.props.navigation.navigate('ProductStack');
                    tSortBy = "Name A-Z"}
                }/>
                <Button title="Name Z-A" onPress= {() =>{
                    this.props.navigation.navigate('ProductStack');
                    tSortBy = "Name Z-A"}
                }/>
                <Button title="Category A-Z" onPress= {() =>{
                    this.props.navigation.navigate('ProductStack');
                    tSortBy = "Category A-Z"}
                }/>
                <Button title="Manufacturer A-Z" onPress= {() =>{
                    this.props.navigation.navigate('ProductStack');
                    tSortBy = "Manufacturer A-Z"}
                }/>
                <Button title="Category Z-A" onPress= {() =>{
                    this.props.navigation.navigate('ProductStack');
                    tSortBy = "Category Z-A"}
                }/>
                <Button title="Manufacturer Z-A" onPress= {() =>{
                    this.props.navigation.navigate('ProductStack');
                    tSortBy = "Manufacturer Z-A"}
                }/>
                <Button title="Price High-Low" onPress= {() =>{
                    this.props.navigation.navigate('ProductStack');
                    tSortBy = "Price H-L"}
                }/>
                <Button title="Price Low-High" onPress= {() =>{
                    this.props.navigation.navigate('ProductStack');
                    tSortBy = "Price L-H"}
                }/>
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
                <Text> Your Cart</Text>
                <Text>Your Cart has {orders.length} orders.</Text>
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
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss()} accessible={false}>
                                        <TextInput
                                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                            keyboardType = 'numeric'
                                            onChangeText={(text) => productOrder.quantity = text}
                                            value={JSON.stringify(productOrder.quantity)}
                                        />
                                    </TouchableWithoutFeedback>
                                </TouchableOpacity>
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
            fetch(baseURL + '/productOrder/save.json', {
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
            <ScrollView>
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
                                    <Text>Home Address:</Text>
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                        onChangeText={(text) => currentUser.address = text}
                                        value={currentUser.address}
                                    />
                                </View>
                                <View style={styles.outerContainer}>
                                    <Text>City:</Text>
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                        onChangeText={(text) => currentUser.city = text}
                                        value={currentUser.city}
                                    />
                                </View>
                                <View style={styles.outerContainer}>
                                    <Text>State:</Text>
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                        onChangeText={(text) => currentUser.state = text}
                                        value={currentUser.state}
                                    />
                                </View>
                                <View style={styles.outerContainer}>
                                    <Text>Zip Code:</Text>
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                        onChangeText={(text) => currentUser.zipCode = text}
                                        value={currentUser.zipCode}
                                    />
                                </View>
                                <View style={styles.outerContainer}>
                                    <Text>Name on Card:</Text>
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                        onChangeText={(text) => currentUser.nameOnCard = text}
                                        value={currentUser.nameOnCard}
                                    />
                                </View>
                                <View style={styles.outerContainer}>
                                    <Text>Card Number:</Text>
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                        onChangeText={(text) => currentUser.cardNumber = text}
                                        value={currentUser.cardNumber}
                                    />
                                </View>
                                <View style={styles.outerContainer}>
                                    <Text>Expiration (mm/yyyy):</Text>
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                        onChangeText={(text) => currentUser.expirationMonth = parseInt(text)}
                                        value={`${currentUser.expirationMonth}`}
                                    />
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                        onChangeText={(text) => currentUser.expirationYear = parseInt(text)}
                                        value={`${currentUser.expirationYear}`}
                                    />
                                </View>
                                <View style={styles.outerContainer}>
                                    <Text>Code:</Text>
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                                        onChangeText={(text) => currentUser.cardCode = parseInt(text)}
                                        value={`${currentUser.cardCode}`}
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
            </ScrollView>
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

/**
 * The stack fo our home.
 */
const HomeStack = StackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        Login: {
            screen: LoginScreen,
        },
        Register: {
            screen: RegisterScreen,
        },
        Logout: {
            screen: LogoutScreen,
        },
        Profile: {
            screen: ProfileScreen,
        },
    },
    {
        initialRouteName: 'Home',
    }
);

const FilterStack = StackNavigator(
    {
        Filter: {
            screen: FilterScreen,
        }
    },
    {
        initialRouteName: 'Filter',
    }
);

/**
 * For switching between home and products.
 */
const RootStack = SwitchNavigator(
    {
        HomeStack: HomeStack,
        ProductStack: ProductStack,
        FilterStack: FilterStack
    },
    {
        initialRoutName: 'HomeStack'
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
        alignItems: 'center',
        padding: 30,
        margin: 2,
        borderColor: '#2a4944',
        borderWidth: 1,
        backgroundColor: '#d2f7f1'
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