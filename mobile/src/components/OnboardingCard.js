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
        <View style={styles.contentTop}>
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
        </View>

        <View style={styles.actionWrap}>
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
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 46,
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -18,
  },
  contentTop: {
    width: "100%",
    alignItems: "center",
  },
  actionWrap: {
    width: "100%",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 18,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#e35c43",
    width: 26,
    borderRadius: 8,
  },
  button: {
    width: "88%",
    paddingVertical: 16,
    borderRadius: 28,
    marginBottom: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  login: {
    fontSize: 16,
    color: "#3b302c",
    textDecorationLine: "underline",
  },
});
