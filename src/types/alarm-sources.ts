import { AVPlaybackSource } from "expo-av";
import { Alarms } from "./alarms";

export class AlarmSources {
  public static [Alarms.CHIPTUNE]: AVPlaybackSource = require("../assets/audio/chiptune.wav");
  public static [Alarms.MORNING_JOY]: AVPlaybackSource = require("../assets/audio/morningjoy.wav");
  public static [Alarms.OVERSIMPLIFIED]: AVPlaybackSource = require("../assets/audio/oversimplified.wav");
}
