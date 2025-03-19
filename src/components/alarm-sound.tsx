import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";
import { Alarms } from "../types/alarms";
import { useEffect, useState } from "react";
import { Audio, AVPlaybackSource } from "expo-av";
import { useMutation } from "@tanstack/react-query";

interface Props {
  name: string;
  alarm: Alarms;
  alarmSrc: AVPlaybackSource;
}

export default function AlarmSound({ name, alarm, alarmSrc }: Props) {
  const theme = useTheme();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } else {
        const { sound } = await Audio.Sound.createAsync(alarmSrc);
        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded && status.didJustFinish) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
          }
        });
        setSound(sound);
        await sound.playAsync();
      }
    },
  });

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <Card mode="outlined" style={{ borderRadius: 15, flex: 1 }}>
        <Card.Content style={{ height: 60, justifyContent: "center" }}>
          <Text style={{ fontSize: 17 }}>{name}</Text>
        </Card.Content>
      </Card>

      <IconButton
        mode="contained"
        containerColor={
          sound ? theme.colors.errorContainer : theme.colors.primary
        }
        iconColor="white"
        icon={({ color }) =>
          sound ? (
            <FontAwesomeIcon icon={faStop} color={color}></FontAwesomeIcon>
          ) : (
            <FontAwesomeIcon icon={faPlay} color={color}></FontAwesomeIcon>
          )
        }
        loading={isPending}
        onPress={() => mutate()}
      ></IconButton>
    </View>
  );
}
