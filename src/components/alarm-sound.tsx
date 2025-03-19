import { faCheck, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";
import { Alarms } from "../types/alarms";
import { useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import { useMutation } from "@tanstack/react-query";
import { AlarmSources } from "../types/alarm-sources";
import { MapContext } from "../context/map-context";

interface Props {
  name: string;
  alarm: Alarms;
}

export default function AlarmSound({ name, alarm }: Props) {
  const theme = useTheme();
  const { alarmSound, setAlarmSound } = useContext(MapContext);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } else {
        const { sound } = await Audio.Sound.createAsync(AlarmSources[alarm]);
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
      <Card
        mode="outlined"
        style={{
          borderRadius: 15,
          flex: 1,
          borderColor:
            alarm === alarmSound ? theme.colors.primary : theme.colors.outline,
        }}
        onPress={() => setAlarmSound(alarm)}
      >
        <Card.Content
          style={{
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              color:
                alarm === alarmSound
                  ? theme.colors.primary
                  : theme.colors.onBackground,
            }}
          >
            {name}
          </Text>

          {alarm === alarmSound ? (
            <FontAwesomeIcon
              icon={faCheck}
              color={theme.colors.primary}
              size={23}
            ></FontAwesomeIcon>
          ) : null}
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
