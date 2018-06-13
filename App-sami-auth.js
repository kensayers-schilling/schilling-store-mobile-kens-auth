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

let currentUser = null;

let baseURL = "http://schillingschoolpoc-test.us-east-1.elasticbeanstalk.com";



/**

 * Our home screen where we land when we open the app.

 */

class HomeScreen extends React.Component {



    constructor(props){

        super(props);

        this.state = {isLoading: true};



    }




    // load the products from the service on start up of this page

    componentDidMount(){

        fetch('http://schillingschoolpoc-test.us-east-1.elasticbeanstalk.com/product/index.json?max=100')

            .then((response) => response.json())

            .then((responseJson) => {



                products = responseJson;



            })

            .catch((error) =>{

                console.error(error);

            });

        fetch('http://schillingschoolpoc-test.us-east-1.elasticbeanstalk.com/category/index.json')

            .then((response) => response.json())

            .then((responseJson) => {



                categories = responseJson;



            })

            .catch((error) =>{

                console.error(error);

            });

        fetch('http://schilling-school-store-dev.us-east-1.elasticbeanstalk.com/manufacturer/index.json')

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

    }



    render() {

        if(this.state.isLoading){

            return(

                <View style={{flex: 1, padding: 20}}>

                    <ActivityIndicator/>

                </View>

            )

        }
        const loggedInView = <View>
            <IconEntypo.Button name="arrow-left" backgroundColor="#808080" onPress={() => {currentUser = null; this.props.navigation.navigate('Logout')}}>Logout</IconEntypo.Button>
            <IconEntypo.Button name="man" backgroundColor="#808080" onPress={() => this.props.navigation.navigate ('Update')}>Profile</IconEntypo.Button>
            <IconEntypo.Button name="folder" backgroundColor="#808080" onPress={() => this.props.navigation.navigate('ProductStack')}>Products</IconEntypo.Button>
        </View>;
        const loggedOutView = <View>
            <IconEntypo.Button name="login" backgroundColor="#808080" onPress={() => {currentUser = {"username":"sami_smith", "password":"123456789"}; this.props.navigation.navigate('Login')}}>Login</IconEntypo.Button>
            <IconEntypo.Button name="folder" backgroundColor="#808080" onPress={() => this.props.navigation.navigate('Register')}>Register</IconEntypo.Button>
        </View>;

        return (

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                <View style={{width: 400, height: 600, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white', margin: 1, textAlign: 'center'}}> Welcome to the Schilling Store!</Text>
                    <Image source={{uri:"http://www.schillingschool.org/wp-content/uploads/schilling-logo1.jpg"}} style={{width:250,height:250}}/>



                    {currentUser === null ? loggedOutView : loggedInView}

                </View>
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

                    this.props.navigation.navigate('Home')

                } else {

                    console.log(res);
                    this.props.navigation.navigate('Error')

                }



            })

            .catch((error) =>{

                console.error(error);

            });

    }

    render() {



        return (

            <View  style={{width: 400, height: 700, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>

                <View>

                    <Text style={{color:'white'}}>User Name:</Text>

                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100, color: 'white'}}

                        onChangeText={(text) => this.state.userName = text}

                        autoCapitalize='none'

                        value={this.state.userName}

                    />

                </View>

                <View>

                    <Text style={{color:'white'}}>Password:</Text>

                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100, color: 'white'}}

                        onChangeText={(text) => this.state.password = text}

                        autoCapitalize='none'

                        value={this.state.password}

                    />

                </View>

                <IconEntypo.Button name="login" backgroundColor="#808080" onPress={() => {this.doLogin(); this.props.navigation.navigate('Home')}}>Login</IconEntypo.Button>

                <IconEntypo.Button name="folder" backgroundColor="#808080" onPress={() => this.props.navigation.navigate('Register')}>Register</IconEntypo.Button>

            </View>

        );

    }

}


class ErrorScreen extends React.Component {
    render(){
        return (
            <View  style={{width: 375, height: 650, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white', size: '42'}}>Invalid username or password. </Text>
                <IconEntypo.Button name="login" backgroundColor="#808080" onPress={() => {this.props.navigation.navigate('Login')}}>Retry Login</IconEntypo.Button>



            </View>
        );

    }
}



class LogoutScreen extends React.Component {

    render() {



        return (

            <View  style={{width: 400, height: 700, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>

                <IconEntypo.Button name="box" backgroundColor="#808080" onPress={() => {currentUser = null; this.props.navigation.navigate('Home')}}>Logout</IconEntypo.Button>

            </View>

        );

    }

}

class UpdateScreen extends React.Component {

    constructor(props) {

        super(props);

        this.state = currentUser


        }




    doUpdate() {

        fetch('http://schillingschoolpoc-test.us-east-1.elasticbeanstalk.com/user/update', {

            method: 'PASS',

            headers: {

                'Accept': 'application/json',

                'Content-Type': 'application/json',

            },

            body: JSON.stringify(this.state.currentUser)

        })

            .then((response) => response.json())

            .then((responseJson) => {

                return responseJson.movies;

            })

            .catch((error) => {

                console.error(error);

            });



    };

    render() {



        return (

        <ScrollView>

            <View  style={{width: 400, height: 700, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>

                <Text style={{color:'white',size: 34}}>Profile</Text>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Username:</Text>


                    <TextInput

                        style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                        onChangeText={(text) => this.state.userName = text}

                        value={this.state.userName}

                    />

                </View>
                <View>

                    <Text style={{color:'white', textAlign: 'center'}}>Password:</Text>

                    <TextInput

                        style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                        onChangeText={(text) => this.state.password = text}

                        value={this.state.password}

                    />

                </View>


                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Name on Card:</Text>


                    <TextInput

                        style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                        onChangeText={(text) => this.state.nameOnCard = text}

                        value={this.state.nameOnCard}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Card Number:</Text>


                    <TextInput

                        style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                        onChangeText={(text) => this.state.cardNumber = text}

                        value={this.state.cardNumber}

                    />


                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Exp Month:</Text>

                    <TextInput

                        style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                        onChangeText={(text) => currentUser.expirationMonth = parseInt(text)}

                        value={`${currentUser.expirationMonth}`}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Exp Year:</Text>

                    <TextInput

                        style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                        onChangeText={(text) => currentUser.expirationYear = parseInt(text)}

                        value={`${currentUser.expirationYear}`}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Card Code:</Text>

                    <TextInput

                        style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                        onChangeText={(text) => currentUser.cardCode = parseInt(text)}

                        value={`${currentUser.cardCode}`}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Email</Text>


                    <TextInput

                        style={{height: 30, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}


                        onChangeText={(text) => this.state.email = text}

                        value={this.state.email}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Address:</Text>

                    <TextInput

                        style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                        onChangeText={(text) => this.state.address = text}

                        value={this.state.address}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>City:</Text>

                    <TextInput

                        style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                        onChangeText={(text) => this.state.city = text}

                        value={this.state.city}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>State:</Text>

                    <TextInput

                        style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                        onChangeText={(text) => this.state.state = text}

                        value={this.state.state}

                    />

                </View>



                <IconEntypo.Button name="arrow-right" backgroundColor="#808080" onPress={() => {this.doUpdate(); this.props.navigation.navigate('Home')}}>Temporary Update</IconEntypo.Button>

            </View>
        </ScrollView>

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

        }



    doRegister(){

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



    };

    render() {



        return (
        <ScrollView>

            <View  style={{width: 400, height: 700, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>


                <Text style={{color:'white'}}>Register</Text>

                <View>
                    <Text style={{color:'white',textAlign: 'center'}}>Username</Text>


                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}

                        onChangeText={(text) => this.state.newUser.userName = text}

                        value={this.state.newUser.userName}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Password</Text>

                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}

                        onChangeText={(text) => this.state.newUser.password = text}

                        value={this.state.newUser.password}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Name on Card</Text>


                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}

                        onChangeText={(text) => this.state.newUser.nameOnCard = text}

                        value={this.state.newUser.nameOnCard}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Card Number</Text>


                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}


                        onChangeText={(text) => this.state.newUser.cardNumber = text}

                        value={this.state.newUser.cardNumber}

                    />

                </View>

                <View>

                    <Text style={{color: 'white',textAlign: 'center'}}>Card Code</Text>

                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}

                        onChangeText={(text) => this.state.newUser.cardCode = parseInt(text)}

                        value={`${this.state.newUser.cardCode}`}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Exp Month</Text>


                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}


                        onChangeText={(text) => this.state.newUser.expirationMonth = parseInt(text)}

                        value={`${this.state.newUser.expirationMonth}`}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Exp Year</Text>


                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}

                        onChangeText={(text) => this.state.newUser.expirationYear = parseInt(text)}

                        value={`${this.state.newUser.expirationYear}`}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Email</Text>


                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}


                        onChangeText={(text) => this.state.newUser.email = text}

                        value={this.state.newUser.email}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>Address</Text>


                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}


                        onChangeText={(text) => this.state.newUser.address = text}

                        value={this.state.newUser.address}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>City</Text>


                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}


                        onChangeText={(text) => this.state.newUser.city = text}

                        value={this.state.newUser.city}

                    />

                </View>

                <View>

                    <Text style={{color:'white',textAlign: 'center'}}>State</Text>


                    <TextInput

                        style={{height: 40, borderColor:'white', borderWidth: 1, width: 100,color:'white',textAlign:'center'}}


                        onChangeText={(text) => this.state.newUser.state = text}

                        value={this.state.newUser.state}

                    />

                </View>





                <IconEntypo.Button name="box" backgroundColor="#808080" onPress={() => {this.doRegister(); this.props.navigation.navigate('Home')}}>Register</IconEntypo.Button>

           </View>
        </ScrollView>


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

            <View style={{width: 375, height: 600, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>

                <Text style={{color: 'white'}}>Search Screen (sorted by {this.state.sortBy})</Text>

                <View style={styles.toolBar}>

                    <Button style={styles.toolButton} title="Name" onPress={() => this.setState({sortBy:"Name"})}/>

                    <Button style={styles.toolButton} title="Category" onPress={() => this.setState({sortBy:"Category"})}/>

                    <Button style={styles.toolButton} title="Manufacturer" onPress={() => this.setState({sortBy:"Manufacturer"})}/>

                    <Icon.Button name="shopping-cart" backgroundColor="#808080" onPress={() => this.props.navigation.navigate('Cart')}/>

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

                                <Text style={{fontSize:24, textAlign: 'center', color: 'white'}}>Name: {product.name}</Text>

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {id:product.id})}>

                                    <Image

                                        source={{uri:product.pic}} style={{width:100,height:80}}

                                    />

                                </TouchableOpacity>

                                <Text style={{fontsize:24, textAlign: 'center', color: 'white'}}>Category: {categories.find(function(item) {return item.id === product.category.id}).name}</Text>

                                <Text style={{fontsize:24, textAlign: 'center', color: 'white'}}>Manufacturer: {manufacturers.find(function(item) {return item.id === product.manufacturer.id}).name}</Text>

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
            "user":{
                "id":1
            },

            "quantity": 1,

            "number": "KS" + orderNumber++

        })

    }

    render() {

        const { params } = this.props.navigation.state;

        const id = params ? params.id : null;

        const product = products.find((prod) => {return prod.id === id});

        // for the product passed (as id) show more detail

        return (




            <View style={{width: 400, height: 700, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 24, color: 'white'}}>Details Screen</Text>

                <View style={styles.toolBar}>

                    <Icon.Button name="home" backgroundColor="#808080" onPress={() => this.props.navigation.navigate('HomeStack')}/>

                    <Icon.Button name="shopping-cart" backgroundColor="#808080" onPress={() => this.props.navigation.navigate('Cart')}/>

                </View>



                <Image source={{uri:product.pic}} style={{width:200,height:200, borderColor: '#808080', borderWidth: 2}}/>

                <View style={{width: 400, height: 100, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white', textAlign: 'center'}}>Name: {product.name}</Text>

                    <Text style={{color: 'white', textAlign: 'center'}}>Description: {product.description}</Text>

                    <Text style={{color: 'white', textAlign: 'center'}}>Price: {product.price}</Text>
                </View>
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

            <View style={{width: 400, height: 700, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>

                <Text style={{color: 'white'}}>Cart {orders.length}</Text>

                <View style={styles.toolBar}>

                    <Icon.Button name="home" backgroundColor="#808080" onPress={() => this.props.navigation.navigate('HomeStack')}/>

                </View>

                <ScrollView>

                    {

                        orders.map((productOrder, index) =>

                            <View key={productOrder.id} style={styles.item}>

                                <Text style={{color: 'white'}}>Name: {products.find((prod) => {return prod.id === productOrder.product.id}).name}</Text>

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {id:product.id})}>

                                    <Image

                                        source={{uri:products.find((prod) => {return prod.id === productOrder.product.id}).pic}} style={{width:100,height:80}}

                                    />

                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss()} accessible={false}>

                                        <TextInput

                                            style={{height: 40, borderColor:'gray', borderWidth: 1, width: 100, color: 'white', textAlign: 'center'}}

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

        this.state = currentUser

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

            <View style={{width: 375, height: 600, backgroundColor: '#808080',alignItems: 'center', justifyContent: 'center'}}>

                <Text style={{color: 'white'}}>Purchase Screen</Text>

                <View style={styles.toolBar}>

                    <Icon.Button name="home" backgroundColor="#808080" onPress={() => this.props.navigation.navigate('HomeStack')}/>

                    <Icon.Button name="shopping-cart" backgroundColor="#808080" onPress={() => this.props.navigation.navigate('Cart')}/>

                </View>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

                    <View>

                        <Text style={{textAlign: 'center', color: 'white'}}>Items: {orders.length}</Text>

                        <View style={{flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 30, margin: 2, borderColor: 'white', borderWidth: 1, backgroundColor: '#808080', height: 450, width: 400}}>
                            <View style={styles.outerContainer}>

                                <Text style={{color: 'white', textAlign: 'center'}}>Name on Card: </Text>

                                <TextInput

                                    style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                                    onChangeText={(text) => this.setState({nameOnCard:text})}

                                    value={this.state.nameOnCard}

                                />


                            </View>

                            <View style={styles.outerContainer}>

                                <Text style={{color: 'white', textAlign: 'center'}}>Card Number:</Text>

                                <TextInput

                                    style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                                    onChangeText={(text) => this.setState({cardNumber:text})}

                                    value={this.state.cardNumber}

                                />

                            </View>

                            <View style={styles.outerContainer}>

                                <Text style={{color: 'white', textAlign: 'center'}}>Exp (mm/yy):</Text>

                                <TextInput

                                    style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                                    onChangeText={(text) => currentUser.expirationMonth = parseInt(text)}

                                    value={`${currentUser.expirationMonth}`}

                                />

                                <TextInput

                                    style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                                    onChangeText={(text) => currentUser.expirationYear = parseInt(text)}

                                    value={`${currentUser.expirationYear}`}

                                />

                            </View>

                            <View style={styles.outerContainer}>

                                <Text style={{color: 'white', textAlign: 'center'}}>Card Code:</Text>

                                <TextInput

                                    style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                                    onChangeText={(text) => currentUser.cardCode = parseInt(text)}

                                    value={`${currentUser.cardCode}`}

                                />

                            </View>

                            <View style={styles.outerContainer}>

                                <Text style={{color: 'white', textAlign: 'center'}}>Address:</Text>

                                <TextInput

                                    style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                                    onChangeText={(text) => this.setState({address:text})}

                                    value={this.state.address}

                                />

                            </View>

                            <View style={styles.outerContainer}>

                                <Text style={{color: 'white', textAlign: 'center'}}>City:</Text>

                                <TextInput

                                    style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                                    onChangeText={(text) => this.setState({city:text})}

                                    value={this.state.city}

                                />

                            </View>

                            <View style={styles.outerContainer}>

                                <Text style={{color: 'white', textAlign: 'center'}}>State:</Text>

                                <TextInput

                                    style={{height: 30, borderColor:'gray', borderWidth: 1, width: 100, borderColor: 'white', color: 'white', alignItems: 'center', textAlign: 'center'}}

                                    onChangeText={(text) => this.setState({state:text})}

                                    value={this.state.state}

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
        Update: {
            screen: UpdateScreen,
        },
        Error: {
            screen: ErrorScreen,
        },




    },

    {

        initialRouteName: 'Home',

    }

);



/**

 * For switching between home and products.

 */

const RootStack = SwitchNavigator(

    {

        HomeStack: HomeStack,

        ProductStack: ProductStack

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

        borderColor: 'white',

        borderWidth: 1,

        backgroundColor: '#808080',



    },

    container: {

        paddingTop: 5

    },


    toolButton: {

        backgroundColor: '#808080',

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

        borderColor: 'white',

        borderWidth: 1

    },

    submitButton: {

        backgroundColor: '#808080',

        padding: 10,

        margin: 15,

        height: 40,

    },

    submitButtonText:{

        color: 'white'

    }

})

