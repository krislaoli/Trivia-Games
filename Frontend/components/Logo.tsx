import { Image, StyleSheet, View } from "react-native"
import React from "react"
const logo = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo1} source={require("../assets/logo1.png")} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo1: {
    width: 400,
    height: 400,
    position: "relative",
    marginTop: 40,
    marginRight: 20,
  },
})
export default logo
