import { Player, QuestionDefinition, TeamId } from "@/types";
import { slugify } from "@/lib/utils";

interface SeedPlayerInput extends Omit<Player, "id" | "voiceIntro"> {
  introTag: string;
}

function createPlayer(input: SeedPlayerInput): Player {
  const teamLabel = input.teamId.toUpperCase();

  return {
    ...input,
    id: slugify(`${input.teamId}-${input.name}`),
    voiceIntro: `Hey, I'm ${input.name}, ${input.introTag} for ${teamLabel}.`
  };
}

function playerList(teamId: TeamId, players: SeedPlayerInput[]) {
  return players.map((player) => createPlayer({ ...player, teamId }));
}

export const SEED_PLAYERS: Player[] = [
  ...playerList("csk", [
    {
      name: "Ruturaj Gaikwad",
      teamId: "csk",
      role: "Batsman",
      jerseyNumber: 31,
      country: "India",
      age: 28,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["anchor", "captain", "opener", "youngster", "match-winner"],
      bio: "Elegant top-order batter who keeps the innings calm before accelerating.",
      achievements: ["IPL title winner", "Orange Cap contender", "CSK captain"],
      introTag: "the composed opener and current leader",
      stats: {
        matches: 66,
        runs: 2380,
        wickets: 0,
        strikeRate: 136.9,
        battingAverage: 41.4,
        bestPerformance: "108 vs RR"
      }
    },
    {
      name: "MS Dhoni",
      teamId: "csk",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 7,
      country: "India",
      age: 44,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm medium",
      traits: ["legend", "captain", "wicketkeeper", "finisher", "match-winner"],
      bio: "Iconic finisher and master strategist with one of the calmest minds in cricket.",
      achievements: ["Multiple IPL titles", "Former India captain", "Legendary finisher"],
      introTag: "the finisher known for calm under pressure",
      stats: {
        matches: 264,
        runs: 5243,
        wickets: 0,
        strikeRate: 137.5,
        battingAverage: 39.7,
        bestPerformance: "84* vs RCB"
      }
    },
    {
      name: "Ravindra Jadeja",
      teamId: "csk",
      role: "All-Rounder",
      jerseyNumber: 8,
      country: "India",
      age: 37,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Slow left-arm orthodox",
      traits: ["all-rounder", "left-hander", "spin", "match-winner", "legend"],
      bio: "World-class all-rounder who changes games with bat, ball, and electric fielding.",
      achievements: ["IPL title winner", "India all-format star", "Elite fielder"],
      introTag: "the all-round game changer with rocket fielding",
      stats: {
        matches: 245,
        runs: 2959,
        wickets: 160,
        strikeRate: 129.8,
        battingAverage: 27.3,
        bestPerformance: "62* and 3/20 vs RCB"
      }
    },
    {
      name: "Devon Conway",
      teamId: "csk",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 88,
      country: "New Zealand",
      age: 34,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm medium",
      traits: ["foreign", "left-hander", "anchor", "wicketkeeper", "opener"],
      bio: "Technically polished left-hander who anchors and finishes smartly.",
      achievements: ["World-class T20 opener", "IPL title winner"],
      introTag: "the elegant left-handed run machine",
      stats: {
        matches: 26,
        runs: 924,
        wickets: 0,
        strikeRate: 141.7,
        battingAverage: 48.6,
        bestPerformance: "92* vs PBKS"
      }
    },
    {
      name: "Shivam Dube",
      teamId: "csk",
      role: "All-Rounder",
      jerseyNumber: 25,
      country: "India",
      age: 31,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm medium",
      traits: ["left-hander", "aggressive", "middle-order", "all-rounder", "match-winner"],
      bio: "Clean six-hitter who can turn the middle overs into a launch pad.",
      achievements: ["Power-hitting specialist", "India T20 finisher"],
      introTag: "the towering six-hitter from the middle order",
      stats: {
        matches: 65,
        runs: 1577,
        wickets: 7,
        strikeRate: 146.4,
        battingAverage: 31.2,
        bestPerformance: "95* vs KKR"
      }
    },
    {
      name: "Matheesha Pathirana",
      teamId: "csk",
      role: "Bowler",
      jerseyNumber: 81,
      country: "Sri Lanka",
      age: 24,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm fast",
      traits: ["foreign", "pace", "death-bowler", "youngster", "match-winner"],
      bio: "Slingy fast bowler famous for yorkers at the death.",
      achievements: ["Death overs specialist", "High-impact wicket taker"],
      introTag: "the sling-shot death bowler with deadly yorkers",
      stats: {
        matches: 20,
        runs: 12,
        wickets: 34,
        strikeRate: 60,
        battingAverage: 6,
        bestPerformance: "4/28 vs MI"
      }
    }
  ]),
  ...playerList("rcb", [
    {
      name: "Virat Kohli",
      teamId: "rcb",
      role: "Batsman",
      jerseyNumber: 18,
      country: "India",
      age: 37,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm medium",
      traits: ["aggressive", "anchor", "legend", "india-captain", "opener", "match-winner"],
      bio: "One of the greatest batters of his era, blending hunger, class, and intensity.",
      achievements: ["Former India captain", "IPL Orange Cap winner", "RCB icon"],
      introTag: "former RCB captain and one of the best batters in the world",
      stats: {
        matches: 260,
        runs: 8190,
        wickets: 4,
        strikeRate: 132.2,
        battingAverage: 39.8,
        bestPerformance: "113 vs PBKS"
      }
    },
    {
      name: "Faf du Plessis",
      teamId: "rcb",
      role: "Batsman",
      jerseyNumber: 13,
      country: "South Africa",
      age: 41,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["foreign", "captain", "aggressive", "opener", "match-winner"],
      bio: "Explosive senior opener with fearless intent against pace and spin.",
      achievements: ["Former RCB captain", "Global T20 leader"],
      introTag: "the fearless South African opener who loves big nights",
      stats: {
        matches: 145,
        runs: 4571,
        wickets: 0,
        strikeRate: 136.6,
        battingAverage: 36.9,
        bestPerformance: "96 vs LSG"
      }
    },
    {
      name: "Glenn Maxwell",
      teamId: "rcb",
      role: "All-Rounder",
      jerseyNumber: 32,
      country: "Australia",
      age: 38,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["foreign", "aggressive", "all-rounder", "spin", "middle-order", "match-winner"],
      bio: "Unpredictable superstar capable of changing a game in ten balls.",
      achievements: ["World champion", "Explosive all-round threat"],
      introTag: "the explosive all-round entertainer from Australia",
      stats: {
        matches: 139,
        runs: 2810,
        wickets: 39,
        strikeRate: 156.1,
        battingAverage: 24.8,
        bestPerformance: "95 vs PBKS"
      }
    },
    {
      name: "Mohammed Siraj",
      teamId: "rcb",
      role: "Bowler",
      jerseyNumber: 73,
      country: "India",
      age: 32,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm fast",
      traits: ["pace", "powerplay-specialist", "match-winner"],
      bio: "High-energy fast bowler known for seam movement and new-ball bursts.",
      achievements: ["India pace spearhead", "Powerplay wicket-taker"],
      introTag: "the fiery fast bowler who attacks with the new ball",
      stats: {
        matches: 95,
        runs: 104,
        wickets: 96,
        strikeRate: 58.2,
        battingAverage: 7.4,
        bestPerformance: "4/21 vs KKR"
      }
    },
    {
      name: "Rajat Patidar",
      teamId: "rcb",
      role: "Batsman",
      jerseyNumber: 97,
      country: "India",
      age: 32,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["aggressive", "middle-order", "match-winner"],
      bio: "Stylish middle-order batter who thrives when the scoring rate climbs.",
      achievements: ["IPL playoff century", "Spin-hitting specialist"],
      introTag: "the stylish middle-order stroke maker",
      stats: {
        matches: 29,
        runs: 873,
        wickets: 0,
        strikeRate: 151.8,
        battingAverage: 34.9,
        bestPerformance: "112* vs LSG"
      }
    },
    {
      name: "Dinesh Karthik",
      teamId: "rcb",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 19,
      country: "India",
      age: 41,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["wicketkeeper", "finisher", "legend", "middle-order"],
      bio: "Veteran wicketkeeper-finisher with nerve in pressure chases.",
      achievements: ["India wicketkeeper", "Elite finisher"],
      introTag: "the veteran keeper who loves finishing thrillers",
      stats: {
        matches: 257,
        runs: 4842,
        wickets: 0,
        strikeRate: 135.6,
        battingAverage: 26.2,
        bestPerformance: "97* vs RR"
      }
    }
  ]),
  ...playerList("mi", [
    {
      name: "Rohit Sharma",
      teamId: "mi",
      role: "Batsman",
      jerseyNumber: 45,
      country: "India",
      age: 39,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["legend", "captain", "india-captain", "opener", "match-winner"],
      bio: "Elegant opener with a record of big-match batting and title-winning leadership.",
      achievements: ["Multiple IPL titles as captain", "Former India captain"],
      introTag: "the title-winning opener with effortless pull shots",
      stats: {
        matches: 262,
        runs: 6768,
        wickets: 15,
        strikeRate: 131.2,
        battingAverage: 29.2,
        bestPerformance: "109* vs KKR"
      }
    },
    {
      name: "Hardik Pandya",
      teamId: "mi",
      role: "All-Rounder",
      jerseyNumber: 33,
      country: "India",
      age: 33,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm fast-medium",
      traits: ["captain", "aggressive", "all-rounder", "pace", "finisher", "match-winner"],
      bio: "Dynamic seam-bowling all-rounder built for high-pressure moments.",
      achievements: ["IPL-winning captain", "India white-ball star"],
      introTag: "the pace-bowling all-rounder built for pressure",
      stats: {
        matches: 141,
        runs: 2602,
        wickets: 64,
        strikeRate: 146.1,
        battingAverage: 28.3,
        bestPerformance: "91 vs KKR"
      }
    },
    {
      name: "Jasprit Bumrah",
      teamId: "mi",
      role: "Bowler",
      jerseyNumber: 93,
      country: "India",
      age: 32,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm fast",
      traits: ["pace", "death-bowler", "powerplay-specialist", "match-winner"],
      bio: "Unique fast bowler with impossible angles, yorkers, and control.",
      achievements: ["India pace ace", "Multiple IPL titles"],
      introTag: "the fast-bowling genius with unplayable yorkers",
      stats: {
        matches: 133,
        runs: 69,
        wickets: 165,
        strikeRate: 44.4,
        battingAverage: 8.1,
        bestPerformance: "5/10 vs KKR"
      }
    },
    {
      name: "Suryakumar Yadav",
      teamId: "mi",
      role: "Batsman",
      jerseyNumber: 63,
      country: "India",
      age: 36,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm medium",
      traits: ["aggressive", "middle-order", "match-winner"],
      bio: "360-degree batter who can dismantle fields with pure imagination.",
      achievements: ["India T20 captaincy experience", "Explosive stroke maker"],
      introTag: "the 360-degree batter with outrageous range",
      stats: {
        matches: 154,
        runs: 3811,
        wickets: 0,
        strikeRate: 145.4,
        battingAverage: 33.4,
        bestPerformance: "103* vs GT"
      }
    },
    {
      name: "Ishan Kishan",
      teamId: "mi",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 23,
      country: "India",
      age: 28,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["wicketkeeper", "left-hander", "aggressive", "opener", "youngster"],
      bio: "Explosive wicketkeeper-opener who attacks the powerplay.",
      achievements: ["India wicketkeeper-batter", "Powerplay striker"],
      introTag: "the left-handed keeper who attacks from ball one",
      stats: {
        matches: 119,
        runs: 2964,
        wickets: 0,
        strikeRate: 135.3,
        battingAverage: 29.6,
        bestPerformance: "99 vs RCB"
      }
    },
    {
      name: "Tilak Varma",
      teamId: "mi",
      role: "Batsman",
      jerseyNumber: 9,
      country: "India",
      age: 23,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["left-hander", "youngster", "middle-order", "match-winner"],
      bio: "Bright young left-hander with calm shot-making against both pace and spin.",
      achievements: ["Young India prospect", "Reliable middle-order scorer"],
      introTag: "the young left-hander with composure beyond his age",
      stats: {
        matches: 43,
        runs: 1156,
        wickets: 0,
        strikeRate: 142.5,
        battingAverage: 38.5,
        bestPerformance: "84* vs RCB"
      }
    }
  ]),
  ...playerList("gt", [
    {
      name: "Shubman Gill",
      teamId: "gt",
      role: "Batsman",
      jerseyNumber: 77,
      country: "India",
      age: 27,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["captain", "anchor", "opener", "youngster", "match-winner"],
      bio: "Graceful opener with timing, composure, and a huge appetite for runs.",
      achievements: ["Orange Cap winner", "GT captain", "India opener"],
      introTag: "the elegant opener who makes batting look easy",
      stats: {
        matches: 103,
        runs: 3471,
        wickets: 0,
        strikeRate: 136.6,
        battingAverage: 37.3,
        bestPerformance: "129 vs MI"
      }
    },
    {
      name: "Rashid Khan",
      teamId: "gt",
      role: "Bowler",
      jerseyNumber: 19,
      country: "Afghanistan",
      age: 28,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["foreign", "spin", "mystery-spinner", "match-winner", "finisher"],
      bio: "Mystery leg-spinner and lower-order game changer with bat and ball.",
      achievements: ["Global T20 superstar", "IPL title winner"],
      introTag: "the mystery spinner who can also smash quick runs",
      stats: {
        matches: 121,
        runs: 545,
        wickets: 152,
        strikeRate: 169.8,
        battingAverage: 14.7,
        bestPerformance: "4/24 vs SRH"
      }
    },
    {
      name: "David Miller",
      teamId: "gt",
      role: "Batsman",
      jerseyNumber: 10,
      country: "South Africa",
      age: 37,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["foreign", "left-hander", "finisher", "middle-order", "match-winner"],
      bio: "Powerful left-handed finisher famous for closing out tense chases.",
      achievements: ["Global finisher", "IPL title winner"],
      introTag: "the left-handed finisher who loves clutch chases",
      stats: {
        matches: 132,
        runs: 2930,
        wickets: 0,
        strikeRate: 139.5,
        battingAverage: 35.7,
        bestPerformance: "101* vs RCB"
      }
    },
    {
      name: "Mohammed Shami",
      teamId: "gt",
      role: "Bowler",
      jerseyNumber: 11,
      country: "India",
      age: 36,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm fast",
      traits: ["pace", "powerplay-specialist", "match-winner"],
      bio: "Seam-up strike bowler who attacks the stumps relentlessly.",
      achievements: ["Purple Cap winner", "India fast bowler"],
      introTag: "the seam bowler who makes the ball talk early",
      stats: {
        matches: 110,
        runs: 86,
        wickets: 127,
        strikeRate: 49.4,
        battingAverage: 8.6,
        bestPerformance: "4/11 vs DC"
      }
    },
    {
      name: "Sai Sudharsan",
      teamId: "gt",
      role: "Batsman",
      jerseyNumber: 66,
      country: "India",
      age: 24,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["left-hander", "youngster", "anchor", "opener"],
      bio: "Silky left-hander who builds innings without losing scoring tempo.",
      achievements: ["Emerging batting star", "Consistent top-order scorer"],
      introTag: "the young left-hander with a mature top-order game",
      stats: {
        matches: 25,
        runs: 1034,
        wickets: 0,
        strikeRate: 141.2,
        battingAverage: 47.0,
        bestPerformance: "103 vs CSK"
      }
    },
    {
      name: "Rahul Tewatia",
      teamId: "gt",
      role: "All-Rounder",
      jerseyNumber: 7,
      country: "India",
      age: 33,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["left-hander", "finisher", "all-rounder", "spin", "match-winner"],
      bio: "Unorthodox finisher who keeps nerve in wild final overs.",
      achievements: ["Famous chase finisher", "Impact all-round option"],
      introTag: "the clutch finisher who thrives in chaos",
      stats: {
        matches: 95,
        runs: 1013,
        wickets: 32,
        strikeRate: 142.9,
        battingAverage: 27.4,
        bestPerformance: "40* vs PBKS"
      }
    }
  ]),
  ...playerList("kkr", [
    {
      name: "Andre Russell",
      teamId: "kkr",
      role: "All-Rounder",
      jerseyNumber: 12,
      country: "West Indies",
      age: 38,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm fast",
      traits: ["foreign", "aggressive", "all-rounder", "pace", "finisher", "match-winner"],
      bio: "One of the most destructive T20 all-rounders ever.",
      achievements: ["Multiple MVP seasons", "Power-hitting icon"],
      introTag: "the muscle-bound all-rounder who can end games in a blink",
      stats: {
        matches: 135,
        runs: 2484,
        wickets: 115,
        strikeRate: 174.2,
        battingAverage: 30.7,
        bestPerformance: "88* and 4/32 vs CSK"
      }
    },
    {
      name: "Sunil Narine",
      teamId: "kkr",
      role: "All-Rounder",
      jerseyNumber: 74,
      country: "West Indies",
      age: 38,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["foreign", "mystery-spinner", "spin", "all-rounder", "opener", "match-winner"],
      bio: "Mystery spinner and surprise opener who breaks games open.",
      achievements: ["Multiple IPL titles", "MVP winner"],
      introTag: "the mystery spinner who can also blitz the powerplay",
      stats: {
        matches: 180,
        runs: 1788,
        wickets: 187,
        strikeRate: 165.1,
        battingAverage: 18.6,
        bestPerformance: "109 vs RR"
      }
    },
    {
      name: "Rinku Singh",
      teamId: "kkr",
      role: "Batsman",
      jerseyNumber: 35,
      country: "India",
      age: 29,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["left-hander", "finisher", "middle-order", "match-winner"],
      bio: "Fearless finisher who backs himself in the final overs.",
      achievements: ["Legendary chase cameo", "India T20 finisher"],
      introTag: "the left-handed finisher who never thinks the game is over",
      stats: {
        matches: 56,
        runs: 1025,
        wickets: 0,
        strikeRate: 148.9,
        battingAverage: 33.1,
        bestPerformance: "48* vs GT"
      }
    },
    {
      name: "Shreyas Iyer",
      teamId: "kkr",
      role: "Batsman",
      jerseyNumber: 41,
      country: "India",
      age: 32,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["captain", "anchor", "middle-order", "match-winner"],
      bio: "Composed middle-order leader who handles spin with authority.",
      achievements: ["IPL title-winning captain", "India batter"],
      introTag: "the elegant middle-order captain with calm control",
      stats: {
        matches: 131,
        runs: 3386,
        wickets: 0,
        strikeRate: 129.6,
        battingAverage: 32.9,
        bestPerformance: "96 vs DC"
      }
    },
    {
      name: "Varun Chakravarthy",
      teamId: "kkr",
      role: "Bowler",
      jerseyNumber: 29,
      country: "India",
      age: 35,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["spin", "mystery-spinner", "match-winner"],
      bio: "Mystery spinner who thrives in middle overs with sharp variations.",
      achievements: ["India mystery spinner", "Middle-overs enforcer"],
      introTag: "the mystery spinner who thrives on deception",
      stats: {
        matches: 71,
        runs: 29,
        wickets: 83,
        strikeRate: 48.2,
        battingAverage: 9.6,
        bestPerformance: "5/20 vs DC"
      }
    },
    {
      name: "Phil Salt",
      teamId: "kkr",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 28,
      country: "England",
      age: 30,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["foreign", "wicketkeeper", "aggressive", "opener"],
      bio: "Aggressive wicketkeeper-opener who puts bowlers on the back foot immediately.",
      achievements: ["Explosive powerplay scorer", "England T20 regular"],
      introTag: "the wicketkeeper-opener who attacks from the very start",
      stats: {
        matches: 21,
        runs: 653,
        wickets: 0,
        strikeRate: 176.0,
        battingAverage: 34.4,
        bestPerformance: "89* vs LSG"
      }
    }
  ]),
  ...playerList("srh", [
    {
      name: "Pat Cummins",
      teamId: "srh",
      role: "All-Rounder",
      jerseyNumber: 30,
      country: "Australia",
      age: 33,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm fast",
      traits: ["foreign", "captain", "all-rounder", "pace", "match-winner"],
      bio: "Fast-bowling leader with composure, bounce, and useful lower-order hitting.",
      achievements: ["World Cup-winning captain", "SRH captain"],
      introTag: "the pace-bowling leader who stays cool under pressure",
      stats: {
        matches: 60,
        runs: 515,
        wickets: 66,
        strikeRate: 151.1,
        battingAverage: 18.4,
        bestPerformance: "3/26 and 35* vs RR"
      }
    },
    {
      name: "Travis Head",
      teamId: "srh",
      role: "Batsman",
      jerseyNumber: 62,
      country: "Australia",
      age: 33,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["foreign", "left-hander", "aggressive", "opener", "match-winner"],
      bio: "Explosive left-handed opener who transforms powerplays into carnage.",
      achievements: ["World Cup final hero", "High-tempo opener"],
      introTag: "the left-handed opener who changes matches in the powerplay",
      stats: {
        matches: 31,
        runs: 962,
        wickets: 2,
        strikeRate: 172.7,
        battingAverage: 36.9,
        bestPerformance: "102 vs RCB"
      }
    },
    {
      name: "Abhishek Sharma",
      teamId: "srh",
      role: "All-Rounder",
      jerseyNumber: 4,
      country: "India",
      age: 26,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Slow left-arm orthodox",
      traits: ["left-hander", "aggressive", "all-rounder", "spin", "youngster", "opener"],
      bio: "Left-handed aggressor who can chip in with spin and dynamic fielding.",
      achievements: ["India T20 opener", "Explosive powerplay specialist"],
      introTag: "the left-handed dasher who attacks from the first over",
      stats: {
        matches: 68,
        runs: 1598,
        wickets: 11,
        strikeRate: 157.8,
        battingAverage: 28.5,
        bestPerformance: "75 vs MI"
      }
    },
    {
      name: "Heinrich Klaasen",
      teamId: "srh",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 45,
      country: "South Africa",
      age: 35,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["foreign", "wicketkeeper", "aggressive", "middle-order", "match-winner"],
      bio: "One of the cleanest spin-hitters in world cricket.",
      achievements: ["Elite middle-over destroyer", "South Africa wicketkeeper"],
      introTag: "the wicketkeeper destroyer who smashes spin into orbit",
      stats: {
        matches: 35,
        runs: 1162,
        wickets: 0,
        strikeRate: 171.2,
        battingAverage: 39.8,
        bestPerformance: "104 vs RCB"
      }
    },
    {
      name: "Bhuvneshwar Kumar",
      teamId: "srh",
      role: "Bowler",
      jerseyNumber: 15,
      country: "India",
      age: 36,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm medium-fast",
      traits: ["pace", "powerplay-specialist", "legend", "match-winner"],
      bio: "Swing bowler with an elite new-ball record and calm temperament.",
      achievements: ["Two Purple Caps", "Swing bowling specialist"],
      introTag: "the swing specialist who owns the powerplay",
      stats: {
        matches: 186,
        runs: 309,
        wickets: 193,
        strikeRate: 47.8,
        battingAverage: 12.1,
        bestPerformance: "5/19 vs PBKS"
      }
    },
    {
      name: "T Natarajan",
      teamId: "srh",
      role: "Bowler",
      jerseyNumber: 4,
      country: "India",
      age: 35,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Left-arm fast-medium",
      traits: ["left-hander", "pace", "death-bowler", "match-winner"],
      bio: "Left-arm yorker specialist who thrives at the death.",
      achievements: ["Yorker specialist", "India pace option"],
      introTag: "the left-arm death specialist with icy nerves",
      stats: {
        matches: 61,
        runs: 12,
        wickets: 67,
        strikeRate: 46.2,
        battingAverage: 8.4,
        bestPerformance: "4/19 vs DC"
      }
    }
  ]),
  ...playerList("rr", [
    {
      name: "Sanju Samson",
      teamId: "rr",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 11,
      country: "India",
      age: 32,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["captain", "wicketkeeper", "aggressive", "middle-order", "match-winner"],
      bio: "Elegant wicketkeeper-captain who mixes touch with clean six-hitting.",
      achievements: ["RR captain", "India wicketkeeper"],
      introTag: "the stylish RR captain and wicketkeeper-batter",
      stats: {
        matches: 171,
        runs: 4562,
        wickets: 0,
        strikeRate: 139.7,
        battingAverage: 31.4,
        bestPerformance: "119 vs PBKS"
      }
    },
    {
      name: "Yashasvi Jaiswal",
      teamId: "rr",
      role: "Batsman",
      jerseyNumber: 64,
      country: "India",
      age: 24,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["left-hander", "aggressive", "youngster", "opener", "match-winner"],
      bio: "Fearless left-handed opener with elite bat speed and hunger.",
      achievements: ["India opener", "Record-breaking powerplay scorer"],
      introTag: "the fearless young left-handed opener",
      stats: {
        matches: 53,
        runs: 1685,
        wickets: 0,
        strikeRate: 149.8,
        battingAverage: 32.4,
        bestPerformance: "124 vs MI"
      }
    },
    {
      name: "Jos Buttler",
      teamId: "rr",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 63,
      country: "England",
      age: 36,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm medium",
      traits: ["foreign", "wicketkeeper", "aggressive", "opener", "match-winner"],
      bio: "World-class opener with brutal power and range against every pace.",
      achievements: ["Orange Cap winner", "Match-winning opener"],
      introTag: "the explosive opener who can take the game away in minutes",
      stats: {
        matches: 117,
        runs: 3957,
        wickets: 0,
        strikeRate: 149.9,
        battingAverage: 38.0,
        bestPerformance: "124 vs SRH"
      }
    },
    {
      name: "Riyan Parag",
      teamId: "rr",
      role: "All-Rounder",
      jerseyNumber: 3,
      country: "India",
      age: 25,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["youngster", "aggressive", "all-rounder", "middle-order"],
      bio: "Confident middle-order all-rounder growing into a genuine match-winner.",
      achievements: ["Breakout IPL season", "Flexible middle-order role"],
      introTag: "the confident all-rounder from the Royals engine room",
      stats: {
        matches: 70,
        runs: 1326,
        wickets: 4,
        strikeRate: 143.8,
        battingAverage: 28.2,
        bestPerformance: "84* vs DC"
      }
    },
    {
      name: "Trent Boult",
      teamId: "rr",
      role: "Bowler",
      jerseyNumber: 18,
      country: "New Zealand",
      age: 37,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Left-arm fast-medium",
      traits: ["foreign", "left-hander", "pace", "powerplay-specialist", "match-winner"],
      bio: "Left-arm swing bowler who loves striking in the first over.",
      achievements: ["New-ball specialist", "Multiple IPL finals appearances"],
      introTag: "the left-arm swing bowler who strikes early",
      stats: {
        matches: 105,
        runs: 76,
        wickets: 121,
        strikeRate: 47.3,
        battingAverage: 10.2,
        bestPerformance: "4/18 vs MI"
      }
    },
    {
      name: "Yuzvendra Chahal",
      teamId: "rr",
      role: "Bowler",
      jerseyNumber: 3,
      country: "India",
      age: 36,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["spin", "match-winner", "legend"],
      bio: "Wrist-spinner who keeps wicket-takers' instinct at the heart of his bowling.",
      achievements: ["Purple Cap winner", "Leading IPL wicket taker"],
      introTag: "the wrist-spinner who hunts wickets in the middle overs",
      stats: {
        matches: 160,
        runs: 37,
        wickets: 205,
        strikeRate: 41.6,
        battingAverage: 8.5,
        bestPerformance: "5/40 vs KKR"
      }
    }
  ]),
  ...playerList("pbks", [
    {
      name: "Shikhar Dhawan",
      teamId: "pbks",
      role: "Batsman",
      jerseyNumber: 42,
      country: "India",
      age: 40,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["captain", "left-hander", "anchor", "opener", "legend"],
      bio: "Smooth left-handed opener with a long history of dependable IPL runs.",
      achievements: ["IPL run machine", "Former PBKS captain"],
      introTag: "the graceful left-handed opener who makes chases look tidy",
      stats: {
        matches: 223,
        runs: 6769,
        wickets: 4,
        strikeRate: 128.0,
        battingAverage: 35.3,
        bestPerformance: "106* vs RR"
      }
    },
    {
      name: "Liam Livingstone",
      teamId: "pbks",
      role: "All-Rounder",
      jerseyNumber: 23,
      country: "England",
      age: 33,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["foreign", "aggressive", "all-rounder", "spin", "match-winner"],
      bio: "Power-packed all-rounder with range hitting and flexible spin.",
      achievements: ["Massive six-hitter", "White-ball match winner"],
      introTag: "the power-hitting all-rounder who can clear any boundary",
      stats: {
        matches: 39,
        runs: 939,
        wickets: 11,
        strikeRate: 167.4,
        battingAverage: 28.4,
        bestPerformance: "94 vs DC"
      }
    },
    {
      name: "Sam Curran",
      teamId: "pbks",
      role: "All-Rounder",
      jerseyNumber: 58,
      country: "England",
      age: 28,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Left-arm fast-medium",
      traits: ["foreign", "left-hander", "all-rounder", "pace", "match-winner"],
      bio: "Left-arm seam all-rounder who adds balance in both innings.",
      achievements: ["T20 World Cup player of the tournament", "Flexible all-round option"],
      introTag: "the left-arm seam all-rounder with big-match instincts",
      stats: {
        matches: 59,
        runs: 883,
        wickets: 58,
        strikeRate: 138.4,
        battingAverage: 24.5,
        bestPerformance: "4/31 vs RR"
      }
    },
    {
      name: "Arshdeep Singh",
      teamId: "pbks",
      role: "Bowler",
      jerseyNumber: 2,
      country: "India",
      age: 27,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Left-arm fast-medium",
      traits: ["left-hander", "pace", "death-bowler", "youngster", "match-winner"],
      bio: "Left-arm seamer known for clever angles and strong death overs.",
      achievements: ["India T20 bowler", "PBKS strike bowler"],
      introTag: "the left-arm seamer trusted in the toughest overs",
      stats: {
        matches: 65,
        runs: 29,
        wickets: 76,
        strikeRate: 49.1,
        battingAverage: 10.1,
        bestPerformance: "4/29 vs MI"
      }
    },
    {
      name: "Kagiso Rabada",
      teamId: "pbks",
      role: "Bowler",
      jerseyNumber: 25,
      country: "South Africa",
      age: 31,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm fast",
      traits: ["foreign", "pace", "death-bowler", "match-winner"],
      bio: "Fast bowler with high pace, bounce, and elite wicket-taking threat.",
      achievements: ["Purple Cap winner", "South Africa fast bowler"],
      introTag: "the express pacer who attacks stumps at high speed",
      stats: {
        matches: 80,
        runs: 205,
        wickets: 117,
        strikeRate: 40.1,
        battingAverage: 11.8,
        bestPerformance: "4/21 vs SRH"
      }
    },
    {
      name: "Jitesh Sharma",
      teamId: "pbks",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 99,
      country: "India",
      age: 32,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm medium",
      traits: ["wicketkeeper", "aggressive", "finisher", "middle-order"],
      bio: "Fearless wicketkeeper-finisher who looks to attack every short boundary.",
      achievements: ["India T20 call-up", "Power-hitting keeper"],
      introTag: "the wicketkeeper-finisher who swings hard at pressure",
      stats: {
        matches: 40,
        runs: 872,
        wickets: 0,
        strikeRate: 151.3,
        battingAverage: 25.6,
        bestPerformance: "49* vs MI"
      }
    }
  ]),
  ...playerList("lsg", [
    {
      name: "KL Rahul",
      teamId: "lsg",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 1,
      country: "India",
      age: 34,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm medium",
      traits: ["captain", "wicketkeeper", "anchor", "opener", "match-winner"],
      bio: "Technically complete opener with the range to pace an innings perfectly.",
      achievements: ["LSG captain", "Consistent IPL run-scorer"],
      introTag: "the composed opener who balances class with control",
      stats: {
        matches: 132,
        runs: 4837,
        wickets: 0,
        strikeRate: 134.5,
        battingAverage: 45.2,
        bestPerformance: "132* vs RCB"
      }
    },
    {
      name: "Nicholas Pooran",
      teamId: "lsg",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 29,
      country: "West Indies",
      age: 31,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["foreign", "wicketkeeper", "left-hander", "aggressive", "finisher", "match-winner"],
      bio: "Destructive left-handed wicketkeeper-finisher with outrageous bat speed.",
      achievements: ["T20 finisher", "Six-hitting specialist"],
      introTag: "the left-handed keeper who can launch the ball anywhere",
      stats: {
        matches: 79,
        runs: 1901,
        wickets: 0,
        strikeRate: 164.3,
        battingAverage: 28.8,
        bestPerformance: "87* vs KKR"
      }
    },
    {
      name: "Marcus Stoinis",
      teamId: "lsg",
      role: "All-Rounder",
      jerseyNumber: 17,
      country: "Australia",
      age: 37,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm medium-fast",
      traits: ["foreign", "aggressive", "all-rounder", "pace", "middle-order", "match-winner"],
      bio: "Strong all-rounder who can muscle chases and bowl heavy lengths.",
      achievements: ["Explosive middle-order hitter", "Utility seam bowler"],
      introTag: "the powerful all-rounder who brings muscle to both innings",
      stats: {
        matches: 108,
        runs: 2079,
        wickets: 43,
        strikeRate: 145.8,
        battingAverage: 28.1,
        bestPerformance: "124* vs CSK"
      }
    },
    {
      name: "Ravi Bishnoi",
      teamId: "lsg",
      role: "Bowler",
      jerseyNumber: 56,
      country: "India",
      age: 26,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["spin", "youngster", "match-winner"],
      bio: "Quick leg-spinner who attacks with pace through the air.",
      achievements: ["India leg-spinner", "Middle-over wicket taker"],
      introTag: "the attacking leg-spinner who loves wicket-taking pressure",
      stats: {
        matches: 66,
        runs: 17,
        wickets: 70,
        strikeRate: 48.8,
        battingAverage: 9.4,
        bestPerformance: "3/24 vs PBKS"
      }
    },
    {
      name: "Mayank Yadav",
      teamId: "lsg",
      role: "Bowler",
      jerseyNumber: 18,
      country: "India",
      age: 24,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm fast",
      traits: ["pace", "youngster", "match-winner"],
      bio: "Express fast bowler who grabbed attention instantly with raw speed.",
      achievements: ["Emerging pace sensation", "High-velocity strike bowler"],
      introTag: "the young fast bowler clocking serious pace",
      stats: {
        matches: 6,
        runs: 4,
        wickets: 9,
        strikeRate: 33.3,
        battingAverage: 4,
        bestPerformance: "3/14 vs RCB"
      }
    },
    {
      name: "Quinton de Kock",
      teamId: "lsg",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 12,
      country: "South Africa",
      age: 34,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm medium",
      traits: ["foreign", "wicketkeeper", "left-hander", "aggressive", "opener"],
      bio: "Fluent left-handed wicketkeeper-opener with strong powerplay instincts.",
      achievements: ["T20 hundred-maker", "Explosive opener"],
      introTag: "the left-handed keeper-opener who loves the powerplay",
      stats: {
        matches: 110,
        runs: 3259,
        wickets: 0,
        strikeRate: 136.9,
        battingAverage: 31.3,
        bestPerformance: "140* vs KKR"
      }
    }
  ]),
  ...playerList("dc", [
    {
      name: "Rishabh Pant",
      teamId: "dc",
      role: "Wicketkeeper-Batsman",
      jerseyNumber: 17,
      country: "India",
      age: 29,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm medium",
      traits: ["captain", "wicketkeeper", "left-hander", "aggressive", "middle-order", "match-winner"],
      bio: "Fearless left-handed wicketkeeper who can flip momentum instantly.",
      achievements: ["DC captain", "India match winner"],
      introTag: "the left-handed wicketkeeper who plays with fearless instinct",
      stats: {
        matches: 116,
        runs: 3463,
        wickets: 0,
        strikeRate: 148.2,
        battingAverage: 35.0,
        bestPerformance: "128* vs SRH"
      }
    },
    {
      name: "Axar Patel",
      teamId: "dc",
      role: "All-Rounder",
      jerseyNumber: 20,
      country: "India",
      age: 32,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Slow left-arm orthodox",
      traits: ["left-hander", "all-rounder", "spin", "match-winner"],
      bio: "Reliable left-arm spin all-rounder who adds calm to every phase.",
      achievements: ["India all-rounder", "Three-dimensional T20 player"],
      introTag: "the left-arm spin all-rounder with clutch value",
      stats: {
        matches: 150,
        runs: 1784,
        wickets: 123,
        strikeRate: 133.1,
        battingAverage: 22.8,
        bestPerformance: "66* and 2/13 vs RR"
      }
    },
    {
      name: "David Warner",
      teamId: "dc",
      role: "Batsman",
      jerseyNumber: 31,
      country: "Australia",
      age: 40,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Right-arm leg break",
      traits: ["foreign", "left-hander", "aggressive", "legend", "opener", "captain", "match-winner"],
      bio: "Prolific IPL opener with elite consistency and relentless intent.",
      achievements: ["Orange Cap winner", "IPL title-winning captain"],
      introTag: "the left-handed IPL giant who piles up runs at the top",
      stats: {
        matches: 184,
        runs: 6565,
        wickets: 0,
        strikeRate: 140.7,
        battingAverage: 40.1,
        bestPerformance: "126 vs KKR"
      }
    },
    {
      name: "Kuldeep Yadav",
      teamId: "dc",
      role: "Bowler",
      jerseyNumber: 23,
      country: "India",
      age: 31,
      battingStyle: "Left-hand bat",
      bowlingStyle: "Left-arm chinaman",
      traits: ["left-hander", "spin", "mystery-spinner", "match-winner"],
      bio: "Left-arm wrist-spinner who thrives by inviting big shots against him.",
      achievements: ["India wrist-spinner", "Middle-over wicket taker"],
      introTag: "the wrist-spinner who traps batters with drift and dip",
      stats: {
        matches: 84,
        runs: 103,
        wickets: 96,
        strikeRate: 44.5,
        battingAverage: 11.2,
        bestPerformance: "4/14 vs KKR"
      }
    },
    {
      name: "Mitchell Marsh",
      teamId: "dc",
      role: "All-Rounder",
      jerseyNumber: 8,
      country: "Australia",
      age: 35,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm fast-medium",
      traits: ["foreign", "aggressive", "all-rounder", "pace", "match-winner"],
      bio: "Powerful all-rounder who can dominate seam and hit heavy lengths.",
      achievements: ["World Cup winner", "Explosive all-round package"],
      introTag: "the powerful Australian all-rounder with match-winning bursts",
      stats: {
        matches: 45,
        runs: 853,
        wickets: 37,
        strikeRate: 136.8,
        battingAverage: 24.4,
        bestPerformance: "89 vs KKR"
      }
    },
    {
      name: "Prithvi Shaw",
      teamId: "dc",
      role: "Batsman",
      jerseyNumber: 100,
      country: "India",
      age: 27,
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm off break",
      traits: ["aggressive", "youngster", "opener"],
      bio: "Naturally attacking opener who likes to dominate hard lengths.",
      achievements: ["High-tempo opener", "India under-19 champion"],
      introTag: "the attacking opener who loves fast starts",
      stats: {
        matches: 79,
        runs: 1892,
        wickets: 0,
        strikeRate: 147.3,
        battingAverage: 24.6,
        bestPerformance: "99 vs KKR"
      }
    }
  ])
];

export const SEED_QUESTIONS: QuestionDefinition[] = [
  {
    id: "role-batsman",
    prompt: "Is your player mainly known as a batsman?",
    description: "Separates specialist batters from bowlers and all-rounders.",
    category: "role",
    priority: 5,
    rule: { field: "role", operator: "equals", value: "Batsman" }
  },
  {
    id: "role-bowler",
    prompt: "Is your player primarily a bowler?",
    description: "Checks if the player is first picked for bowling impact.",
    category: "role",
    priority: 5,
    rule: { field: "role", operator: "equals", value: "Bowler" }
  },
  {
    id: "role-keeper",
    prompt: "Does your player keep wickets?",
    description: "Helps isolate wicketkeeper-batters quickly.",
    category: "role",
    priority: 5,
    rule: { field: "traits", operator: "includes", value: "wicketkeeper" }
  },
  {
    id: "role-allrounder",
    prompt: "Is your player a genuine all-rounder?",
    description: "Useful for hybrid players who contribute in both innings.",
    category: "role",
    priority: 5,
    rule: { field: "traits", operator: "includes", value: "all-rounder" }
  },
  {
    id: "identity-foreign",
    prompt: "Is your player an overseas star?",
    description: "Splits Indian players from overseas players.",
    category: "identity",
    priority: 4,
    rule: { field: "traits", operator: "includes", value: "foreign" }
  },
  {
    id: "identity-lefty",
    prompt: "Is your player left-handed with the bat?",
    description: "A quick batting-style divider.",
    category: "style",
    priority: 4,
    rule: { field: "battingStyle", operator: "contains", value: "Left-hand" }
  },
  {
    id: "style-pace",
    prompt: "Is he known more for pace bowling than spin?",
    description: "Checks if the player is a pace option.",
    category: "style",
    priority: 4,
    rule: { field: "traits", operator: "includes", value: "pace" }
  },
  {
    id: "style-spin",
    prompt: "Is your player known for spin bowling?",
    description: "Checks for finger spin or wrist spin specialists.",
    category: "style",
    priority: 4,
    rule: { field: "traits", operator: "includes", value: "spin" }
  },
  {
    id: "style-opener",
    prompt: "Does your player usually bat in the top order?",
    description: "Separates openers from middle-order anchors and finishers.",
    category: "style",
    priority: 4,
    rule: { field: "traits", operator: "includes", value: "opener" }
  },
  {
    id: "style-finisher",
    prompt: "Is he famous for finishing chases or death-over hitting?",
    description: "Useful for late-order power hitters.",
    category: "career",
    priority: 4,
    rule: { field: "traits", operator: "includes", value: "finisher" }
  },
  {
    id: "style-aggressive",
    prompt: "Is your player known for aggressive batting intent?",
    description: "Helps detect explosive personalities.",
    category: "style",
    priority: 3,
    rule: { field: "traits", operator: "includes", value: "aggressive" }
  },
  {
    id: "style-anchor",
    prompt: "Would fans describe him as a calm anchor type batter?",
    description: "Useful for composed run accumulators.",
    category: "style",
    priority: 3,
    rule: { field: "traits", operator: "includes", value: "anchor" }
  },
  {
    id: "career-captain",
    prompt: "Has your player captained an IPL side?",
    description: "Isolates team leaders and former captains.",
    category: "career",
    priority: 4,
    rule: { field: "traits", operator: "includes", value: "captain" }
  },
  {
    id: "career-india-captain",
    prompt: "Has your player captained India?",
    description: "Highly selective legacy marker.",
    category: "career",
    priority: 5,
    rule: { field: "traits", operator: "includes", value: "india-captain" }
  },
  {
    id: "career-legend",
    prompt: "Is your player already considered an IPL legend?",
    description: "Pulls out iconic long-term stars.",
    category: "career",
    priority: 3,
    rule: { field: "traits", operator: "includes", value: "legend" }
  },
  {
    id: "bowling-death",
    prompt: "Would you associate him with bowling the death overs?",
    description: "Narrows fast bowlers who close out innings.",
    category: "style",
    priority: 4,
    rule: { field: "traits", operator: "includes", value: "death-bowler" }
  },
  {
    id: "bowling-powerplay",
    prompt: "Is he especially dangerous with the new ball?",
    description: "Identifies powerplay bowling specialists.",
    category: "style",
    priority: 3,
    rule: { field: "traits", operator: "includes", value: "powerplay-specialist" }
  },
  {
    id: "career-youngster",
    prompt: "Is your player still seen as a young rising star?",
    description: "Separates established veterans from younger names.",
    category: "identity",
    priority: 3,
    rule: { field: "traits", operator: "includes", value: "youngster" }
  },
  {
    id: "team-csk",
    prompt: "Does your player represent CSK?",
    description: "Direct team check for Chennai players.",
    category: "team",
    priority: 3,
    rule: { field: "teamId", operator: "equals", value: "csk" }
  },
  {
    id: "team-rcb",
    prompt: "Does your player play for RCB?",
    description: "Direct team check for Bengaluru players.",
    category: "team",
    priority: 3,
    rule: { field: "teamId", operator: "equals", value: "rcb" }
  },
  {
    id: "team-mi",
    prompt: "Is your player part of Mumbai Indians?",
    description: "Direct team check for Mumbai players.",
    category: "team",
    priority: 3,
    rule: { field: "teamId", operator: "equals", value: "mi" }
  },
  {
    id: "team-kkr",
    prompt: "Does he belong to KKR?",
    description: "Direct team check for Kolkata players.",
    category: "team",
    priority: 3,
    rule: { field: "teamId", operator: "equals", value: "kkr" }
  },
  {
    id: "team-srh",
    prompt: "Is your player from Sunrisers Hyderabad?",
    description: "Direct team check for Hyderabad players.",
    category: "team",
    priority: 3,
    rule: { field: "teamId", operator: "equals", value: "srh" }
  },
  {
    id: "team-rr",
    prompt: "Is your player with Rajasthan Royals?",
    description: "Direct team check for Jaipur's side.",
    category: "team",
    priority: 3,
    rule: { field: "teamId", operator: "equals", value: "rr" }
  },
  {
    id: "team-pbks",
    prompt: "Would you find him in the PBKS squad?",
    description: "Direct team check for Punjab players.",
    category: "team",
    priority: 3,
    rule: { field: "teamId", operator: "equals", value: "pbks" }
  },
  {
    id: "team-lsg",
    prompt: "Does your player play for LSG?",
    description: "Direct team check for Lucknow players.",
    category: "team",
    priority: 3,
    rule: { field: "teamId", operator: "equals", value: "lsg" }
  },
  {
    id: "team-dc",
    prompt: "Is your player from Delhi Capitals?",
    description: "Direct team check for Delhi players.",
    category: "team",
    priority: 3,
    rule: { field: "teamId", operator: "equals", value: "dc" }
  },
  {
    id: "team-gt",
    prompt: "Does your player represent Gujarat Titans?",
    description: "Direct team check for Gujarat players.",
    category: "team",
    priority: 3,
    rule: { field: "teamId", operator: "equals", value: "gt" }
  },
  {
    id: "style-mystery",
    prompt: "Is he famous for mystery spin or unusual variations?",
    description: "Targets deceptive spin bowlers.",
    category: "style",
    priority: 4,
    rule: { field: "traits", operator: "includes", value: "mystery-spinner" }
  },
  {
    id: "identity-under-30",
    prompt: "Is your player under 30 years old?",
    description: "A useful age-based split once style is known.",
    category: "identity",
    priority: 2,
    rule: { field: "age", operator: "lt", value: 30 }
  }
];
