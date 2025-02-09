import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", //
    position: 'relative'
  },
  cartPosition: {
    position: 'absolute',
    top: 650,
    right: 20,
    zIndex: 100,
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
   
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  margin: {
    margin: 5,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    height: 100,
    paddingBottom: 20,
    paddingTop: 5,
  },
  tabBarIcon: {
    width: 35,
    height: 35,
  },
  tabBarLabel: {
    fontSize: 13,
    paddingBottom: 5,
  },
  container_home_header: {
    backgroundColor: '#EE4D2D', // Shopee orange color
    padding: 12,
    paddingTop: 50
  },
  container_account_header: {
    backgroundColor: '#EE4D2D',
    padding: 20,

  },
  addressContainer: {
    marginBottom: 8,
    // backgroundColor: '#ccc'
  },
  accountHeaderContainer: {
    marginBottom: 8, flexDirection: 'row'

  },
  deliverText: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  homeHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    height: 40,
    // marginHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1, borderRadius: 8,
    margin: 5
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0dcdc',
    paddingHorizontal: 20,
    height: 40,
    borderColor: '#d8d8d8',
    borderWidth: 0, borderRadius: 8,
    margin: 5, width: '70%'
  },
  searcherContainer: {
    flexDirection: 'row',


  },
  searchText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#000',


  },
  cancelInput: {
    borderRadius: 8, margin: 5,
    marginLeft: 1, width: '10%', alignItems: 'center', justifyContent: 'center'

  },
  safeArea: {
    // backgroundColor: '#EE4D2D',
  },

  menuContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#FF5722",
    margin: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  mainCategoryImg: {
    width: 60,
    height: 60,
    backgroundColor: "#f1f1f1", //#f1f1f1 mau nay ne
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  itemMainCategories: {
    backgroundColor: '#f8f9fa',
    alignItems: 'center', 
    marginRight: 15, 
    height: 100, 
    elevation: 5, 
    borderRadius: 15, 
    paddingHorizontal: 5
  },
  scrollMainCategories: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    height: 1,
    marginBottom: 0,
    paddingHorizontal: 10
  },
  nearRestaurant: {
    paddingHorizontal: 15, fontSize: 24, fontWeight: "bold",
    paddingVertical: 3, marginVertical: 2, backgroundColor: "#f8f9fa", //#f8f9fa
  },
  listHeader: {
    height: 55, alignItems: 'center', justifyContent: 'center'
  },
  headerLine: {
    color: '#333', fontSize: 21, fontWeight: 'bold'
  },
  flatListNearRestaurant: {
    flexDirection: "row", padding: 10,
    borderRadius: 8, backgroundColor: '#fff', marginBottom: 5,
    
  },
  flatListNearRestaurantImage: {
    width: 100, height: 100, borderRadius: 5
  },
  filterButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 5,
    alignSelf: 'center', backgroundColor: '#EE4D2D', width: 150
  },
  loginInput: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: "#FF5722",
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: 'center'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  restaurantContainer: {
    marginBottom: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 10
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingLeft: 80,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,

    marginRight: 10,
    borderWidth: 1, borderColor: '#f5f5f5'
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 12,
    color: "#666",
  },

  restaurantImage: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginRight: 10,

  },
  restaurantDetails: {
    fontSize: 12,
    color: "#777",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    marginLeft: 17,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    marginHorizontal: 10
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  optionSelected: {
    backgroundColor: '#EE4D2D',
  },
  optionText: {
    color: '#000',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },

});