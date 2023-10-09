const NavBarBtn = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('ScreenName')}>
          <Text>menu</Text>
        </TouchableOpacity>
      </View>
    );
}

export default NavBarBtn;