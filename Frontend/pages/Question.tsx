import React, { useState, useEffect } from "react"
import { Image, View, StyleSheet, TouchableOpacity, Text } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { GrTrophy } from "react-icons/gr"
import LottieView from "lottie-react-native"
import { jwtDecode } from "jwt-decode"
import { io } from "socket.io-client"
import { Socket } from "socket.io-client"

interface DecodedToken {
  id: string
  name: string
}
const Question = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const handlePress = (option: number) => {
    setSelectedOption(option)
  }
  // untuk select jawaban dan warna background berubah end

  const [correctAnswer, setCorrectAnswer] = useState<number>(2) // Set the correct answer
  const [user, setUser] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("user") + ""
    const { id, name } = jwtDecode<DecodedToken>(token)
    setUser({ id, name })

    const newSocket = io("https://lemming-merry-amoeba.ngrok-free.app", {
      extraHeaders: { "ngrok-skip-browser-warning": "true" },
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("startGame", () => {
        // Handle start game event
        // Update UI or perform any necessary actions
      })

      socket.on("question", (question) => {
        // Handle receiving questions event
        setCorrectAnswer(question.answer)
        setTimer(15)
        setSelectedOption(null)
      })

      socket.on("endGame", (data) => {
        // Handle end game event
        // Update UI or perform any necessary actions
      })

      socket.on("disconnect", () => {
        // Handle disconnect event
        // Update UI or perform any necessary actions
      })

      return () => {
        socket.off("startGame")
        socket.off("question")
        socket.off("endGame")
        socket.off("disconnect")
        // ... (other socket.off events)
      }
    }
  }, [socket, selectedOption])
  // untuk select jawaban dan warna background berubah start

  //timer for the question start
  const [timer, setTimer] = useState(15)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1
        } else {
          clearInterval(interval) // Stop the interval when the timer reaches 0
          return 0
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  //timer for the question end

  const isCorrect = selectedOption === correctAnswer
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image style={styles.background} source={require("../assets/bg2.png")} />
      <View
        style={{
          width: 40,
          height: 40,
          top: 100,
          position: "relative",
          marginTop: -90,
          marginLeft: 345,
        }}
      >
        <LottieView
          source={require("../assets/lottivew/trophy.json")}
          autoPlay
          loop
        />
        <Text
          style={{
            color: "white",
            fontSize: 15,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: -5,
          }}
        >
          1220
        </Text>
      </View>
      <Text
        style={{
          fontSize: 30,
          marginTop: 160,
          fontWeight: "bold",
          color: "white",
        }}
      >
        {timer < 10 ? `0${timer}` : timer}
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          top: -100,
        }}
      >
        <Image
          style={styles.imageQuestion}
          source={require("../assets/content1.jpeg")}
        />
        <TouchableOpacity onPress={() => handlePress(1)}>
          <View
            style={[
              styles.listQuestion,
              selectedOption === 1
                ? { backgroundColor: isCorrect ? "green" : "yellow" }
                : null,
            ]}
          >
            <Text style={styles.nameQuestion}>lee min gooo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress(2)}>
          <View
            style={[
              styles.listQuestion,
              selectedOption === 2
                ? { backgroundColor: isCorrect ? "green" : "yellow" }
                : null,
            ]}
          >
            <Text style={styles.nameQuestion}>lee min gooo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress(3)}>
          <View
            style={[
              styles.listQuestion,
              selectedOption === 3
                ? { backgroundColor: isCorrect ? "green" : "yellow" }
                : null,
            ]}
          >
            <Text style={styles.nameQuestion}>lee min gooo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress(4)}>
          <View
            style={[
              styles.listQuestion,
              selectedOption === 4
                ? { backgroundColor: isCorrect ? "green" : "yellow" }
                : null,
            ]}
          >
            <Text style={styles.nameQuestion}>lee min gooo</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Question
const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  listQuestion: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    width: 250,
    height: 40,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  nameQuestion: {
    flex: 1,
    fontSize: 16,
    height: 40,
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  imageQuestion: {
    // position: "absolute",
    marginTop: 100,
    width: 250,
    height: 250,
    borderRadius: 10,
  },
})
