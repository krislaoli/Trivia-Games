import React, { useState, useEffect } from "react"
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { FaEdit } from "react-icons/fa"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { jwtDecode } from "jwt-decode"

interface Player {
  id: string
  name: string
  score: number
  diamonds?: number
}

interface DecodedToken {
  id: string
  name: string
}
interface Question {
  id: string
  image_question: string
  A: string
  B: string
  C: string
  D: string
  answer: string
}
const dummyData = [
  { id: 1, avatar: require("../assets/avatar1.png"), name: "Guru Besar" },
  { id: 2, avatar: require("../assets/avatar2.png"), name: "Maell Lee" },
  { id: 3, avatar: require("../assets/avatar3.png"), name: "Yuda Prasetio" },
  { id: 4, avatar: require("../assets/avatar4.png"), name: "Bambang" },
]
type YourNavWigatorProps = {
  FindMatch: undefined
  Question: undefined
}
const FindMatch = () => {
  const token = localStorage.getItem("user") + ""
  const { id, name } = jwtDecode<DecodedToken>(token)
  const [socket, setSocket] = useState<any>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const navigation = useNavigation<StackNavigationProp<YourNavWigatorProps>>()
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    if (socket) {
      socket.on("startGame", (players: Player[]) => {
        setPlayers(players)
      })

      socket.on("question", (question: Question) => {
        setCurrentQuestion(question)
        setSelectedAnswer(null)
        setIsAnswerCorrect(null)
      })

      socket.on(
        "revealAnswer",
        (data: { correctAnswer: string; playerChoices: any[] }) => {
          // Check if the selected answer is correct
          const isCorrect = selectedAnswer === data.correctAnswer
          setIsAnswerCorrect(isCorrect)

          // Update the score for the current player
          if (isCorrect) {
            setPlayers((prevPlayers) =>
              prevPlayers.map((player) => {
                if (player.id === socket.id) {
                  // Assuming the player's ID matches the socket ID
                  return { ...player, score: (player.score = +1) } // Update score
                }
                return player
              })
            )
          }
        }
      )

      socket.on("endGame", (data: { rankedPlayers: Player[] }) => {
        setPlayers(data.rankedPlayers)
        setCurrentQuestion(null)
        Alert.alert("Game Over", "The game has ended. Check the final scores!")
      })

      socket.on("disconnect", () => {
        Alert.alert("Disconnected", "You have been disconnected from the game.")
        setSocket(null)
        setCurrentQuestion(null)
        setPlayers([])
      })

      return () => {
        socket.off("startGame")
        socket.off("question")
        socket.off("revealAnswer")
        socket.off("endGame")
        socket.off("disconnect")
      }
    }
  }, [socket, selectedAnswer])
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

  useEffect(() => {
    if (timer === 0) {
      navigation.navigate("Question")
    }
  }, [timer, navigation])

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image style={styles.background} source={require("../assets/bg2.png")} />
      <View>
        <TouchableOpacity
          style={styles.buttonClose}
          // onPress={toggleModalDiamond}
        >
          <FontAwesome
            style={styles.buttonCloseText}
            name="times"
            size={24}
            color="black"
            width={100}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 100,
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
          {timer < 10 ? `0${timer}` : timer}
        </Text>
        <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
          Finding Oppenent
        </Text>
        <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
          4/4
        </Text>

        {dummyData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.button}>
            <Image style={styles.logo2} source={item.avatar} />
            <Text style={styles.input}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default FindMatch

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  editIcon: {
    marginLeft: 10,
    marginRight: 5,
    color: "black",
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 40,
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    width: 300,
    height: 50,
    borderRadius: 10,
    marginTop: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logo2: {
    width: 40,
    height: 40,
    marginLeft: 10,
    backgroundColor: "white",
  },
  buttonClose: {
    padding: 1,
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
    height: 30,
    width: 30,
    marginTop: 10,
    marginLeft: 350,
  },
  buttonCloseText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 26,
  },
})
