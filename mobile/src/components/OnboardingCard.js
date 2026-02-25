import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function OnboardingCard({
  item,
  currentIndex,
  total,
  onJoinPress,
  onLoginPress,
}) {
  return (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.dotsRow}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.activeDot]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: item.color }]}
          onPress={onJoinPress}
        >
          <Text style={styles.buttonText}>Join the movement!</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLoginPress}>
          <Text style={styles.login}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: width,
    height: height,
  },
  imageContainer: {
    flex: 0.8,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    flex: 0.2,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 25,
    alignItems: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 17,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
    marginBottom: 10,
    height: 30,
  },
  dotsRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  login: {
    fontSize: 14,
    color: "#3b302c",
    textDecorationLine: "underline",
  },
});
