import { Map, List } from "immutable";
import r from "./random";
import { pipe } from "ramda";
import { getEffective, getEffectiveOpponent } from "./effects";
import services from "../data/services";
import { ScheduleGame, MatchResult } from "../types/base";
