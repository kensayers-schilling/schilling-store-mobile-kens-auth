import React from 'react';
import { TouchableHighlight, Picker, ActivityIndicator, Keyboard, TouchableWithoutFeedback, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Button, View, Text, Alert, FlatList } from 'react-native';
import { SwitchNavigator, StackNavigator, DrawerNavigator,} from 'react-navigation';
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
let currentUser = null;
let baseURL = "http://schillingschoolpoc-test.us-east-1.elasticbeanstalk.com/";
// let baseURL = "http://localhost:8080";

/**
 * Our home screen where we land when we open the app.
 */

class HomeScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Home',
    };

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

        const showLogout = () =>{
            Alert.alert(
                'Logout?',
                'Are you sure you want to log this device out?',
                [
                    {text: 'Cancel', onPress:() => {}, style: 'cancel'},
                    {text: 'OK', onPress:() => {currentUser = null;this.props.navigation.navigate('Login')}},
                ],
                { cancelable: false }
            )
        }

        const loggedInView = <View>
            <TouchableHighlight style={styles.menuButton} underlayColor='#fff' onPress={() => {showLogout()}}><Text style={styles.menuText}>Logout</Text></TouchableHighlight>
            <TouchableHighlight style={styles.menuButton} underlayColor='#fff' onPress={() => this.props.navigation.navigate('Search')}><Text style={styles.menuText}>Products</Text></TouchableHighlight>
        </View>;
        const loggedOutView = <View>
            <TouchableHighlight style={styles.loggedOutButton} underlayColor='#fff' onPress={() => {this.props.navigation.navigate('Login')}}><Text style={styles.menuText}>Login</Text></TouchableHighlight>
            <TouchableHighlight style={styles.loggedOutButton} underlayColor='#fff' onPress={() => this.props.navigation.navigate('Register')}><Text style={styles.menuText}>Register</Text></TouchableHighlight>
        </View>;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={{uri:"http://www.schillingschool.org/wp-content/uploads/schilling-logo1.jpg"}} style={{width:250,height:250}}/>
                {currentUser === null ? loggedOutView : loggedInView}
            </View>
        );
    }
}

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userName: '',password: ''}
    };
    doLogin() {
        fetch(baseURL + '/user/authenticate.json', {
            headers: {
                userName: this.state.userName,
                password: this.state.password
            }
        })
            .then((response) => {
                    const statusCode = response.status;
                    const data = statusCode === 200 ? response.json() : {};
                    return Promise.all([statusCode, data]);
                }
            )
            .then(([res, data]) => {

                console.log(res);
                if (res === 200) {
                    currentUser = data;
                    this.props.navigation.navigate('MainStack')
                } else {
                    console.log(res);
                }

            })
            .catch((error) => {
                console.error(error);
            });
    }
    render() {

        return (
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                        <Text>User Name</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => {this.state.userName = text}}
                            autoCapitalize='none'
                            underlineColorAndroid= 'transparent'
                        />
                    </View>
                    <View>
                        <Text>Password</Text>
                        <TextInput
                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                            onChangeText={(text) => this.state.password = text}
                            autoCapitalize='none'
                            underlineColorAndroid= 'transparent'
                        />
                    </View>

                    <TouchableHighlight style={styles.loggedOutButton} underlayColor='#fff' onPress={() => {this.doLogin()}}><Text style={styles.menuText}>Login</Text></TouchableHighlight>
                    <TouchableHighlight style={styles.loggedOutButton} underlayColor='#fff' onPress={() => {this.props.navigation.navigate('Register')}}><Text style={styles.menuText}>Register</Text></TouchableHighlight>
                    <TouchableHighlight style={styles.loggedOutButton} underlayColor='#fff' onPress={() => {this.state.userName = 'FredTestItem'; this.state.password = 'camelCase'}}><Text style={styles.menuText}>William is lazy</Text></TouchableHighlight>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}


class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newUser: {
                "cardNumber": "0000000000000000",
                //"userName": "",
                "expirationYear": 2018,
                "zipCode": "0",
                "cardCode": 0,
                "state": "n/a",
                "address": "n/a",
                "expirationMonth": 1,
                "city": "n/a",
                //"password": "",
                "cardType": "Visa",
                "nameOnCard": "n/a",
                "email": "testemail@gmail.com"
            }
        }
    };

    ShowProblem(statusMessage){
        Alert.alert(
            'Uh oh',
            'There was a problem: ' + statusMessage,
            [
                {text: 'OK', onPress:() => {currentUser = null;this.props.navigation.navigate('OutStack')}},
            ],
            { cancelable: false }
        )
    }

    doRegister() {
        console.log(this.state.newUser);
        fetch(baseURL + '/user/save.json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.newUser)
        })
            .then((response) => {
                if(response.ok){
                    console.log('User created');
                    currentUser = this.state.newUser;
                    this.props.navigation.navigate('InStack');
                    response.json();
                }else {
                    console.log('User creation failed');
                    currentUser = null;
                    this.props.navigation.navigate('OutStack');
                }
                 response.json()

            })
            .then((responseJson) => {
                //console.log(responseJson);
                //return responseJson.movies;
            })
            .catch((error) => {
                console.error(error);
            });
        //currentUser = this.state.newUser;
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
                </View>
                <TouchableHighlight style={styles.loggedOutButton} underlayColor='#fff' onPress={() => {this.doRegister();}}><Text style={styles.menuText}>Register</Text></TouchableHighlight>
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
                    <TouchableHighlight style={styles.toolButton} underlayColor='#fff' onPress={() => {this.setState({sortBy:"Name"})}}><Text style={styles.toolText}>Name</Text></TouchableHighlight>
                    <TouchableHighlight style={styles.toolButton} underlayColor='#fff' onPress={() => {this.setState({sortBy:"Category"})}}><Text style={styles.toolText}>Category</Text></TouchableHighlight>
                    <TouchableHighlight style={styles.toolButton} underlayColor='#fff' onPress={() => {this.setState({sortBy:"Manufacturer"})}}><Text style={styles.toolText}>Manufacturer</Text></TouchableHighlight>
                </View>
                <ScrollView>
                    {
                        products.map((product, index) =>
                            <TouchableOpacity key={product.id} onPress={() => this.props.navigation.navigate('Details', {id:product.id})}>
                                <View style={styles.item}>
                                    <View style={styles.outerContainer}>
                                        <Image
                                            source={{uri:product.pic}} style={{width:100,height:80}}
                                        />
                                        <Text style={styles.itemTitle}>Name: {product.name}</Text>
                                    </View>
                                    <Text>Category: {categories.find(function(item) {return item.id === product.category.id}).name}</Text>
                                    <Text>Manufacturer: {manufacturers.find(function(item) {return item.id === product.manufacturer.id}).name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </ScrollView>

                <TouchableHighlight style={styles.toolButton} underlayColor='#fff' onPress={() => {this.props.navigation.navigate('Cart')}}><Text style={styles.toolText}>Cart</Text></TouchableHighlight>
            </View>
        );
    }
}

/**
 * Our details screen.  Shows one product in detail.
 */
class DetailsScreen extends React.Component {
    addToCart(productId, quantity) {
        orders.push({
            "product": {
                "id": productId
            },
            "user": {
                "id": currentUser.id
            },
            "quantity": 1,
            "number": "WB" + orderNumber++,
        })
    }
    render() {
        const { params } = this.props.navigation.state;
        const id = params ? params.id : null;
        const product = products.find((prod) => {return prod.id === id});
        return (
            <View style={{flex:1}}>
            <ScrollView style={{flex:1}} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Details Screen</Text>
                <View style={styles.toolBar}>
                    <TouchableHighlight style={styles.toolButton} underlayColor='#fff' onPress={() => {this.props.navigation.navigate('Home')}}><Text style={styles.toolText}>Home</Text></TouchableHighlight>
                    <TouchableHighlight style={styles.toolButton} underlayColor='#fff' onPress={() => {this.props.navigation.navigate('Cart')}}><Text style={styles.toolText}>Cart</Text></TouchableHighlight>
                </View>
                <Image source={{uri:product.pic}} style={{width:400,height:320}}/>
                <Text>Name: {product.name}</Text>
                <Text>Description: {product.description}</Text>
                <Text>Price: {product.price}</Text>

                <TouchableHighlight style={styles.menuButton} underlayColor='#fff' onPress={() => {this.addToCart(product.id)}}><Text style={styles.menuText}>Add to Cart</Text></TouchableHighlight>
                <TouchableHighlight style={styles.menuButton} underlayColor='#fff' onPress={() => {this.props.navigation.goBack(null)}}><Text style={styles.menuText}>Cancel</Text></TouchableHighlight>
            </ScrollView>
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
        let i = 0;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Cart {orders.length}</Text>
                <View style={styles.toolBar}>
                    <TouchableHighlight style={styles.toolButton} underlayColor='#fff' onPress={() => {this.props.navigation.navigate('Home')}}><Text style={styles.toolText}>Home</Text></TouchableHighlight>
                </View>
                <ScrollView>
                    {
                        orders.map((productOrder, index) =>
                            <View key={i++} style={styles.item}>
                                <Text>Name: {products.find((prod) => {return prod.id === productOrder.product.id}).name}</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {id:product.id})}>
                                    <Image
                                        source={{uri:products.find((prod) => {return prod.id === productOrder.product.id}).pic}} style={{width:100,height:80}}
                                    />
                                </TouchableOpacity>
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss()} accessible={false}>
                                    <TextInput
                                        style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100, textAlign: 'center'}}
                                        keyboardType = 'numeric'
                                        onChangeText={(text) => productOrder.quantity = text}
                                        defaultValue={JSON.stringify(productOrder.quantity)}
                                    />
                                </TouchableWithoutFeedback>
                                <Text>Price: {products.find((prod) => {return prod.id === productOrder.product.id}).price}</Text>
                            </View>
                        )
                    }
                    <TouchableHighlight style={styles.menuButton} underlayColor='#fff' onPress={() => {this.props.navigation.navigate('Purchase')}}><Text style={styles.menuText}>Buy</Text></TouchableHighlight>
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
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Purchase Screen</Text>
                <View style={styles.toolBar}>
                    <TouchableHighlight style={styles.toolButton} underlayColor='#fff' onPress={() => {this.props.navigation.navigate('Home')}}><Text style={styles.toolText}>Home</Text></TouchableHighlight>
                    <TouchableHighlight style={styles.toolButton} underlayColor='#fff' onPress={() => {this.props.navigation.navigate('Cart')}}><Text style={styles.toolText}>Cart</Text></TouchableHighlight>
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View>
                        <Text>Items: {orders.length}</Text>
                        <View style={styles.item}>
                            <View style={styles.outerContainer}>
                                <Text>Name on Card:</Text>
                                <TextInput
                                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100, textAlign: 'center'}}
                                    onChangeText={(text) => currentUser.nameOnCard = text}
                                    defaultValue={currentUser.nameOnCard}
                                />
                            </View>
                            <View style={styles.outerContainer}>
                                <Text>Card Number:</Text>
                                <TextInput
                                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100, textAlign: 'center'}}
                                    onChangeText={(text) => currentUser.cardNumber = text}
                                    defaultValue={currentUser.cardNumber}
                                />
                            </View>
                            <View style={styles.outerContainer}>
                                <Text>Expiration (mm/yy):</Text>
                                <TextInput
                                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100, textAlign: 'center'}}
                                    onChangeText={(text) => currentUser.expirationMonth = parseInt(text)}
                                    defaultValue={`${currentUser.expirationMonth}`}
                                />
                                <TextInput
                                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100, textAlign: 'center'}}
                                    onChangeText={(text) => currentUser.expirationYear = parseInt(text)}
                                    defaultValue={`${currentUser.expirationYear}`}
                                />
                            </View>
                            <View style={styles.outerContainer}>
                                <Text>Code:</Text>
                                <TextInput
                                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100, textAlign: 'center'}}
                                    onChangeText={(text) => currentUser.cardCode = parseInt(text)}
                                    defaultValue={`${currentUser.cardCode}`}
                                />
                            </View>
                        </View>
                        <TouchableHighlight style={styles.menuButton} underlayColor='#fff' onPress={() => {this.doPurchase(); this.props.navigation.navigate('Home')}}><Text style={styles.menuText}>Purchase</Text></TouchableHighlight>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

/**
 * The editing screen where you can edit your profile information
 */

class EditingScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tempUser: {
                "cardNumber": "0000000000000000",
                "expirationYear": 2018,
                "zipCode": "0",
                "cardCode": 0,
                "state": "n/a",
                "address": "n/a",
                "expirationMonth": 1,
                "city": "n/a",
                "cardType": "Visa",
                "nameOnCard": "n/a",
                "email": "testemail@gmail.com"
            },
        };
    }
    saveUser() {
        fetch(baseURL + '/user/update.json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.tempUser)
        })
            .then((response) => {
                if(response.ok){
                    console.log('User updated');
                    currentUser = this.state.tempUser;
                    Alert.alert('Update Successful!', 'Successfully updated your profile!');
                }else {
                    console.log('User update failed');
                    Alert.alert('Update failed', 'Failed to update your profile');
                }
                console.log(response);
                response.json().then((responseJson) => console.log(responseJson));

            })
            .catch((error) => {
                console.error(error);
            });
        //currentUser = this.state.newUser;
    }
    render(){
        return(
            <ScrollView style={{flex: 1}} contentContainerStyle = {{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>General Information: </Text>

                <Text>Username: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.cardNumber = text}
                    defaultValue ={currentUser.userName}
                />

                <Text>Password: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.password = text}
                    defaultValue ={currentUser.password}

                />

                <Text>Email: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.cardNumber = text}
                    defaultValue ={currentUser.email}
                />

                <Text/>


                <Text style={{fontWeight: 'bold'}}>Card Information: </Text>

                <Text>Card Number: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.cardNumber = text}
                    defaultValue ={currentUser.cardNumber}
                />

                <Text>Card Type: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.cardType = text}
                    defaultValue ={currentUser.cardType}
                />

                <Text>Name on Card: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.nameOnCard = text}
                    defaultValue ={currentUser.nameOnCard}
                />

                <Text>Expiration Month: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.expirationMonth = text}
                    defaultValue ={currentUser.expirationMonth}
                />

                <Text>Expiration Year: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.expirationYear = text}
                    defaultValue ={currentUser.expirationYear}
                />

                <Text>Card Code: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.cardCode = text}
                    defaultValue ={currentUser.cardCode}
                />


                <Text/>
                <Text style={{fontWeight: 'bold'}}>Delivery Information: </Text>

                <Text>Address: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.address = text}
                    defaultValue ={currentUser.address}
                />

                <Text>City: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.city = text}
                    defaultValue ={currentUser.city}
                />

                <Text>State: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.state = text}
                    defaultValue ={currentUser.state}
                />

                <Text>Zip Code: </Text>
                <TextInput
                    style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100}}
                    onChangeText={(text) => this.state.tempUser.zipCode = text}
                    defaultValue ={currentUser.zipCode}
                />

                <TouchableHighlight style={styles.menuButton} underlayColor='#fff' onPress={() => {this.saveUser(); this.props.navigation.navigate('ProfileScreen')}}><Text style={styles.menuText}>Save</Text></TouchableHighlight>
                <TouchableHighlight style={styles.menuButton} underlayColor='#fff' onPress={() => {this.props.navigation.goBack()}}><Text style={styles.menuText}>Cancel</Text></TouchableHighlight>


            </ScrollView>
        )
    }

}

/**
 * The profile screen where you can view information about your profile
 */
class ProfileScreen extends React.Component {
    constructor(props){
        super(props);
    }




    render(){
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>General Information: </Text>
                <Text>Username: {currentUser.userName ? currentUser.userName : 'No Username'}</Text>
                <Text>Password: {currentUser.password ? currentUser.password : 'No Password'}</Text>
                <Text>Email: {currentUser.email ? currentUser.email : 'n/a'}</Text>
                <Text/>
                <Text style={{fontWeight: 'bold'}}>Card Information: </Text>
                <Text>Card Number: {currentUser.cardNumber ? currentUser.cardNumber : 'n/a'}</Text>
                <Text>Card Type: {currentUser.cardType ? currentUser.cardType : 'n/a'}</Text>
                <Text>Name on Card: {currentUser.nameOnCard ? currentUser.nameOnCard : 'n/a'}</Text>
                <Text>Expiration Month: {currentUser.expirationMonth ? currentUser.expirationMonth : 'n/a'}</Text>
                <Text>Expiration Year: {currentUser.expirationYear ? currentUser.expirationYear : 'n/a'}</Text>
                <Text>Card Code: {currentUser.cardCode ? currentUser.cardCode : 'n/a'}</Text>
                <Text/>
                <Text style={{fontWeight: 'bold'}}>Delivery Information: </Text>
                <Text>Address: {currentUser.address ? currentUser.address : 'n/a'}</Text>
                <Text>City: {currentUser.city ? currentUser.city : 'n/a'}</Text>
                <Text>State: {currentUser.state ? currentUser.state : 'n/a'}</Text>
                <Text>Zip Code: {currentUser.zipCode ? currentUser.zipCode : 'n/a'}</Text>

                <TouchableHighlight style={styles.menuButton} underlayColor='#fff' onPress={() => {this.props.navigation.navigate('Editing')}}><Text style={styles.menuText}>Edit</Text></TouchableHighlight>
            </View>
        )
    }

}
/**
 * The stack for purchasing a product.
 */
const ProductStack = DrawerNavigator(
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

const LoginStack = StackNavigator({
    Home: { screen: HomeScreen },
    Login: { screen: LoginScreen },
    Register: { screen: RegisterScreen },
    },
    {
        initialRouteName: 'Home',
        headerMode: 'float',
        navigationOptions: {
            headerStyle: {backgroundColor: 'red'},
            title: 'You are not logged in'
    }
});

const MainStack = DrawerNavigator({
    Home: {
        screen: HomeScreen
    },
    Products: {
        screen: StackNavigator({
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
                headerMode: 'none',
            }
        )
    },
    Profile: {
        screen: StackNavigator({
                Profile: {
                    screen: ProfileScreen
                },
                Editing: {
                    screen: EditingScreen
                },
            },
            {
                initialRouteName: 'Profile',
                headerMode: 'none',
            })
    },


});

const MainNavigation = StackNavigator({
    MainStack: { screen: MainStack }
}, {
    headerMode: 'float',
    navigationOptions: ({navigation}) => ({
        headerStyle: {backgroundColor: 'green'},
        title: 'Welcome, ' + currentUser.userName,
        headerLeft: <Text onPress={() => navigation.navigate('DrawerOpen')}>Menu</Text>
    })
});

const OutStack = DrawerNavigator(
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
    },
    {
        initialRouteName: 'Home',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#11362D',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },

    }
);

const InStack = DrawerNavigator(
    {
        Home: {
            screen: HomeScreen
        },
        Products: {
            screen: StackNavigator({
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
            )
        },
        Profile: {
            screen: StackNavigator({
                Profile: {
                    screen: ProfileScreen
                },
                Editing: {
                    screen: EditingScreen
                },
            },
                {
                    initialRouteName: 'Profile',

            })
        },

    });

const PrimaryNavigation = StackNavigator({
    loginStack: { screen: LoginStack },
    MainStack: { screen: MainNavigation }
}, {
    // Default config for all screens
    headerMode: 'none',
    title: 'Main',
    initialRouteName: 'loginStack'
});

/**
 * For switching between home and products.
 */
const RootStack = SwitchNavigator(
    {
        PrimaryNav: PrimaryNavigation,
       // OutStack: OutStack,
        //InStack: InStack,
        //ProductStack: ProductStack
    },
    {
        initialRoutName: 'PrimaryNav'
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
        padding: 0,
        margin: 2,
        borderColor: '#2a4944',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    outerContainer: {
        paddingTop: 10,
        alignItems: 'center',
        flexDirection: 'column',
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        top:50,
        paddingTop: 5
    },
    toolButton: {
        backgroundColor: 'green',
        width: '33%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    toolText:{
        fontSize: 15,
        color:'#fff',
        textAlign:'center',
        textAlignVertical: 'center'
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
    },
    menuButton: {
        marginRight:40,
        marginLeft:40,
        marginTop:10,
        paddingTop:20,
        paddingBottom:20,
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor:'green',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuText:{
        fontSize: 20,
        color:'#fff',
        textAlign:'center',
    },
    loggedOutButton:{
        marginRight:40,
        marginLeft:40,
        marginTop:10,
        paddingTop:20,
        paddingBottom:20,
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor:'red',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
});